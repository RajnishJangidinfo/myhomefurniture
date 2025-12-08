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
    buildingId: number;
}

interface Room {
    id: number;
    name: string;
    description: string;
    floorId: number;
    floor?: Floor;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [floors, setFloors] = useState<Floor[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "", floorId: 0 });

    const [selectedCampusId, setSelectedCampusId] = useState<number>(0);
    const [selectedBuildingId, setSelectedBuildingId] = useState<number>(0);

    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomsRes, floorsRes, buildingsRes, campusesRes] = await Promise.all([
                fetch("http://localhost:5258/api/rooms"),
                fetch("http://localhost:5258/api/floors"),
                fetch("http://localhost:5258/api/buildings"),
                fetch("http://localhost:5258/api/campuses")
            ]);

            if (roomsRes.ok && floorsRes.ok && buildingsRes.ok && campusesRes.ok) {
                const roomsRaw = await roomsRes.json();
                const floorsRaw = await floorsRes.json();
                const buildingsRaw = await buildingsRes.json();
                const campusesRaw = await campusesRes.json();

                const roomsData = roomsRaw.value ?? roomsRaw;
                const floorsData = floorsRaw.value ?? floorsRaw;
                const buildingsData = buildingsRaw.value ?? buildingsRaw;
                const campusesData = campusesRaw.value ?? campusesRaw;

                setRooms(roomsData);
                console.log('Rooms loaded', roomsData.length);
                setFloors(floorsData);
                console.log('Floors loaded', floorsData.length);
                setBuildings(buildingsData);
                console.log('Buildings loaded', buildingsData.length);
                setCampuses(campusesData);
                console.log('Campuses loaded', campusesData.length);
                console.log('Fetched data summary:', { campusesData, buildingsData, floorsData, roomsData });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (room?: Room) => {
        if (room) {
            setEditingRoom(room);

            // Pre-select dropdowns
            const floor = floors.find(f => f.id === room.floorId);
            const building = floor ? buildings.find(b => b.id === floor.buildingId) : null;
            const campusId = building ? building.campusId : 0;
            const buildingId = building ? building.id : 0;

            setSelectedCampusId(campusId);
            setSelectedBuildingId(buildingId);
            setFormData({ name: room.name, description: room.description, floorId: room.floorId });
        } else {
            setEditingRoom(null);
            setSelectedCampusId(0);
            setSelectedBuildingId(0);
            setFormData({ name: "", description: "", floorId: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
        setFormData({ name: "", description: "", floorId: 0 });
        setSelectedCampusId(0);
        setSelectedBuildingId(0);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const trimmedName = formData.name.trim();
        const payload = { ...formData, name: trimmedName };

        try {
            if (editingRoom) {
                // Update
                const response = await fetch(`http://localhost:5258/api/rooms/${editingRoom.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingRoom.id, ...payload }),
                });
                if (response.ok) {
                    fetchData();
                    handleCloseModal();
                } else if (response.status === 409) {
                    const data = await response.json();
                    setError(data.message || "Room name already exists on this floor.");
                } else {
                    setError("Failed to update room.");
                }
            } else {
                // Create
                const response = await fetch("http://localhost:5258/api/rooms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (response.ok) {
                    fetchData();
                    handleCloseModal();
                } else if (response.status === 409) {
                    const data = await response.json();
                    setError(data.message || "Room name already exists on this floor.");
                } else {
                    setError("Failed to create room.");
                }
            }
        } catch (error) {
            console.error("Error saving room:", error);
            setError("An unexpected error occurred.");
        }
    };

    const handleDelete = async (id: number) => {
        console.log('Attempting to delete room with id', id);
        if (confirm('Are you sure you want to delete this room?')) {
            try {
                const response = await fetch(`http://localhost:5258/api/rooms/${id}`, {
                    method: 'DELETE',
                });
                console.log('Delete response status', response.status);
                if (response.ok) {
                    await fetchData();
                } else {
                    const errorText = await response.text();
                    console.error('Failed to delete room:', response.status, errorText);
                    setError(`Failed to delete room (status ${response.status})`);
                }
            } catch (error) {
                console.error('Error deleting room:', error);
                setError('Error deleting room.');
            }
        }
    };

    // Filter buildings based on selected campus
    const filteredBuildings = selectedCampusId
        ? buildings.filter(b => b.campusId === selectedCampusId)
        : [];

    // Filter floors based on selected building
    const filteredFloors = selectedBuildingId
        ? floors.filter(f => f.buildingId === selectedBuildingId)
        : [];

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-serif">Room Management</h1>
                        <p className="mt-1 text-gray-500">Manage rooms within your floors.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                        + Add New Room
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rooms.map((room) => (
                                <tr key={room.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                            {room.floor?.name || "Unknown Floor"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleOpenModal(room)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {rooms.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No rooms found. Create one to get started.
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
                            {editingRoom ? "Edit Room" : "Add New Room"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-2 border text-gray-900"
                                    placeholder="e.g. Living Room"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                                <select
                                    required
                                    value={selectedCampusId}
                                    onChange={(e) => {
                                        setSelectedCampusId(parseInt(e.target.value));
                                        setSelectedBuildingId(0);
                                        setFormData({ ...formData, floorId: 0 });
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
                                    value={selectedBuildingId}
                                    onChange={(e) => {
                                        setSelectedBuildingId(parseInt(e.target.value));
                                        setFormData({ ...formData, floorId: 0 });
                                    }}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                                <select
                                    required
                                    value={formData.floorId}
                                    onChange={(e) => setFormData({ ...formData, floorId: parseInt(e.target.value) })}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-2 border text-gray-900"
                                    disabled={!selectedBuildingId}
                                >
                                    <option value={0} disabled>Select a Floor</option>
                                    {filteredFloors.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
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
                                    {editingRoom ? "Save Changes" : "Create Room"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
