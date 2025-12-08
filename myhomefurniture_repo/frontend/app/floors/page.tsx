"use client";

import { useState, useEffect } from "react";

interface Campus {
    id: number;
    name: string;
}

interface Building {
    id: number;
    name: string;
    campusId: number;
}

interface Floor {
    id: number;
    name: string;
    description: string;
    buildingId: number;
    building?: Building;
}

export default function FloorsPage() {
    const [floors, setFloors] = useState<Floor[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "", buildingId: 0 });
    const [selectedCampusId, setSelectedCampusId] = useState<number>(0);

    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [floorsRes, buildingsRes, campusesRes] = await Promise.all([
                fetch("http://localhost:5258/api/floors"),
                fetch("http://localhost:5258/api/buildings"),
                fetch("http://localhost:5258/api/campuses")
            ]);

            if (floorsRes.ok && buildingsRes.ok && campusesRes.ok) {
                const floorsData = await floorsRes.json();
                const buildingsData = await buildingsRes.json();
                const campusesData = await campusesRes.json();

                const floorsWithBuilding = floorsData.map((f: Floor) => ({
                    ...f,
                    building: buildingsData.find((b: Building) => b.id === f.buildingId)
                }));

                setFloors(floorsWithBuilding);
                setBuildings(buildingsData);
                setCampuses(campusesData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (floor?: Floor) => {
        if (floor) {
            setEditingFloor(floor);
            const building = buildings.find(b => b.id === floor.buildingId);
            const campusId = building ? building.campusId : 0;
            setSelectedCampusId(campusId);
            setFormData({ name: floor.name, description: floor.description, buildingId: floor.buildingId });
        } else {
            setEditingFloor(null);
            setSelectedCampusId(0);
            setFormData({ name: "", description: "", buildingId: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFloor(null);
        setFormData({ name: "", description: "", buildingId: 0 });
        setSelectedCampusId(0);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const trimmedName = formData.name.trim();
        const payload = { ...formData, name: trimmedName };

        try {
            if (editingFloor) {
                // Update
                const response = await fetch(`http://localhost:5258/api/floors/${editingFloor.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingFloor.id, ...payload }),
                });
                if (response.ok) {
                    fetchData();
                    handleCloseModal();
                } else if (response.status === 409) {
                    const data = await response.json();
                    setError(data.message || "Floor name already exists in this building.");
                } else {
                    setError("Failed to update floor.");
                }
            } else {
                // Create
                const response = await fetch("http://localhost:5258/api/floors", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (response.ok) {
                    fetchData();
                    handleCloseModal();
                } else if (response.status === 409) {
                    const data = await response.json();
                    setError(data.message || "Floor name already exists in this building.");
                } else {
                    setError("Failed to create floor.");
                }
            }
        } catch (error) {
            console.error("Error saving floor:", error);
            setError("An unexpected error occurred.");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this floor?")) {
            try {
                const response = await fetch(`http://localhost:5258/api/floors/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    fetchData();
                }
            } catch (error) {
                console.error("Error deleting floor:", error);
            }
        }
    };

    // Filter buildings based on selected campus
    const filteredBuildings = selectedCampusId
        ? buildings.filter(b => b.campusId === selectedCampusId)
        : [];

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-serif">Floor Management</h1>
                        <p className="mt-1 text-gray-500">Manage floors within your buildings.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                        + Add New Floor
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {floors.map((floor) => (
                                <tr key={floor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{floor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            {floor.building?.name || "Unknown Building"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{floor.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleOpenModal(floor)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(floor.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {floors.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No floors found. Create one to get started.
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
                            {editingFloor ? "Edit Floor" : "Add New Floor"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Floor Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-2 border text-gray-900"
                                    placeholder="e.g. Ground Floor"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                                <select
                                    required
                                    value={selectedCampusId}
                                    onChange={(e) => {
                                        setSelectedCampusId(parseInt(e.target.value));
                                        setFormData({ ...formData, buildingId: 0 }); // Reset building when campus changes
                                    }}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-2 border text-gray-900"
                                >
                                    <option value={0} disabled>Select a Campus</option>
                                    {campuses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                                <select
                                    required
                                    value={formData.buildingId}
                                    onChange={(e) => setFormData({ ...formData, buildingId: parseInt(e.target.value) })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-2 border text-gray-900"
                                    disabled={!selectedCampusId}
                                >
                                    <option value={0} disabled>Select a Building</option>
                                    {filteredBuildings.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
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
                                    {editingFloor ? "Save Changes" : "Create Floor"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
