"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";

export default function UploadPage() {
    const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock user profile
    const user = {
        name: "Rajnish Jangid",
        role: "Interior Designer",
        avatar: "RJ" // Initials for avatar
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const validFiles = newFiles.filter(file => file.type.startsWith("image/"));

        const newFileObjects = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setFiles(prev => [...prev, ...newFileObjects]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (files.length === 0) {
            alert("Please select at least one image.");
            return;
        }

        const formData = new FormData();
        formData.append("Location", location);
        formData.append("Description", description);

        files.forEach((fileObj) => {
            formData.append("Images", fileObj.file);
        });

        try {
            const response = await fetch("http://localhost:5258/api/designs", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Designs uploaded successfully!");
                // Reset form
                setFiles([]);
                setLocation("");
                setDescription("");
            } else {
                alert("Failed to upload designs.");
                console.error("Upload failed", await response.text());
            }
        } catch (error) {
            console.error("Error uploading designs:", error);
            alert("An error occurred during upload.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Header & Profile Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-serif">Upload Designs</h1>
                        <p className="mt-1 text-gray-500">Share your latest interior concepts.</p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center bg-white p-3 rounded-full shadow-sm border border-gray-100">
                        <div className="h-10 w-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                            {user.avatar}
                        </div>
                        <div className="ml-3 pr-4">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Upload Section */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Drag & Drop Zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ease-in-out
                ${isDragging
                                    ? "border-slate-500 bg-slate-50 scale-[1.01]"
                                    : "border-gray-300 hover:border-slate-400 hover:bg-white bg-white/50"
                                }
              `}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInput}
                                className="hidden"
                                multiple
                                accept="image/*"
                            />

                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-slate-50 rounded-full text-slate-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-gray-900">
                                        Click or drag images here
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Support for JPG, PNG, WEBP (Max 10MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image Previews */}
                        {files.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-4">Uploaded Images ({files.length})</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {files.map((fileObj, index) => (
                                        <div key={index} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                            <Image
                                                src={fileObj.preview}
                                                alt="Preview"
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 font-serif">Project Details</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Location Input */}
                                <div className="space-y-2">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                        Location / Room
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:border-slate-500 focus:ring-slate-500 transition-colors appearance-none"
                                        >
                                            <option value="" disabled>Select a location</option>
                                            <option value="Living Room">Living Room</option>
                                            <option value="Bedroom">Bedroom</option>
                                            <option value="Kitchen">Kitchen</option>
                                            <option value="Dining Room">Dining Room</option>
                                            <option value="Office">Home Office</option>
                                            <option value="Outdoor">Outdoor / Garden</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Input */}
                                <div className="space-y-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description <span className="text-gray-400 font-normal">(Optional)</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Add notes about style, materials, or requirements..."
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:border-slate-500 focus:ring-slate-500 transition-colors resize-none"
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="pt-4 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={files.length === 0}
                                        className="w-full flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        </svg>
                                        Save Project
                                    </button>

                                    <button
                                        type="button"
                                        className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
