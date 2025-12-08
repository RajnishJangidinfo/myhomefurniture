"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface DesignImage {
    id: number;
    filePath: string;
}

interface DesignProject {
    id: number;
    location: string;
    description: string;
    createdAt: string;
    images: DesignImage[];
}

export default function DesignsPage() {
    const [designs, setDesigns] = useState<DesignProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const response = await fetch("http://localhost:5258/api/designs");
                if (response.ok) {
                    const data = await response.json();
                    setDesigns(data);
                } else {
                    console.error("Failed to fetch designs");
                }
            } catch (error) {
                console.error("Error fetching designs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDesigns();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-serif">Design Gallery</h1>
                        <p className="mt-2 text-gray-500">Explore the latest interior concepts.</p>
                    </div>
                    <a
                        href="/upload"
                        className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Upload New
                    </a>
                </div>

                {designs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No designs yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by uploading your first design.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {designs.map((project) => (
                            <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                {/* Image Carousel / Grid Preview */}
                                <div className="relative aspect-[4/3] bg-gray-100">
                                    {project.images.length > 0 ? (
                                        <Image
                                            src={`http://localhost:5258${project.images[0].filePath}`}
                                            alt={project.location}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                                        {project.images.length} Photos
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{project.location}</h3>
                                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                        {project.description || "No description provided."}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-6 w-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">RJ</div>
                                            <span className="text-xs text-gray-500">Rajnish Jangid</span>
                                        </div>
                                        <button className="text-sm font-medium text-slate-900 hover:text-slate-700">
                                            View Details &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
