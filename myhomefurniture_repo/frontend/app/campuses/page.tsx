"use client";

import { useState, useEffect } from "react";

interface Campus {
    id: number;
    name: string;
    description: string;
}

export default function CampusesPage() {
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCampuses();
    }, []);

    const fetchCampuses = async () => {
        try {
            const response = await fetch("http://localhost:5258/api/campuses");
            if (response.ok) {
                const data = await response.json();
                setCampuses(data);
            }
        } catch (error) {
            console.error("Error fetching campuses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (campus?: Campus) => {
        if (campus) {
            setEditingCampus(campus);
            setFormData({ name: campus.name, description: campus.description });
        } else {
            setEditingCampus(null);
            setFormData({ name: "", description: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCampus(null);
        setFormData({ name: "", description: "" });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const trimmedName = formData.name.trim();
        const payload = { ...formData, name: trimmedName };

        try {
            if (editingCampus) {
                // Update
                const response = await fetch(`http://localhost:5258/api/campuses/${editingCampus.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingCampus.id, ...payload }),
                });
                if (response.ok) {
                    fetchCampuses();
                    handleCloseModal();
                } else if (response.status === 409) {
                    const data = await response.json();
                    setError(data.message || "Campus name already exists.");
                } else {
                    setError("Failed to update campus.");
                }
            } else {
                // Create
                const response = await fetch("http://localhost:5258/api/campuses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (response.ok) {
                    fetchCampuses();
                    handleCloseModal();
                } else if (response.status === 409) {
                    const data = await response.json();
                    setError(data.message || "Campus name already exists.");
                } else {
                    setError("Failed to create campus.");
                }
            }
        } catch (err) {
            console.error("Error saving campus:", err);
            setError("An unexpected error occurred.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            console.log(`Attempting to delete campus with ID: ${id}`);
            const response = await fetch(`http://localhost:5258/api/campuses/${id}`, {
                method: "DELETE",
            });

            console.log(`Delete response status: ${response.status}`);

            if (response.ok) {
                console.log("Delete successful, refreshing list...");
                await fetchCampuses();
            } else {
                const errorText = await response.text();
                console.error(`Delete failed with status ${response.status}:`, errorText);
                alert(`Failed to delete campus: ${errorText || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error deleting campus:", error);
            alert(`Error deleting campus: ${error}`);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-serif">Campus Management</h1>
                        <p className="mt-1 text-gray-500">Manage your campuses.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                        + Add New Campus
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {campuses.map((campus) => (
                                <tr key={campus.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campus.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campus.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenModal(campus)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (confirm("Are you sure you want to delete this campus?")) {
                                                    handleDelete(campus.id);
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {campuses.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        No campuses found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            {editingCampus ? "Edit Campus" : "Add New Campus"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Campus Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-2 border text-gray-900"
                                    placeholder="e.g. Main Campus"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-2 border text-gray-900"
                                    rows={3}
                                    placeholder="Optional description..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                                >
                                    {editingCampus ? "Save Changes" : "Create Campus"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
