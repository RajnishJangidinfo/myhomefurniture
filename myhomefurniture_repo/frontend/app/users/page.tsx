'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string | null;
    address: string;
}

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }
        loadUsers();
    }, [router]);

    // Load users from backend and map PascalCase to camelCase
    const loadUsers = async () => {
        try {
            const data = await authService.getAllUsers();
            const mapped = data.map((u: any) => ({
                id: u.id ?? u.Id,
                username: u.username ?? u.Username,
                firstName: u.firstName ?? u.FirstName,
                lastName: u.lastName ?? u.LastName,
                email: u.email ?? u.Email,
                dateOfBirth: u.dateOfBirth ?? u.DateOfBirth,
                address: u.address ?? u.Address,
            }));
            setUsers(mapped);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await authService.deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
            setMessage({ type: 'success', text: 'User deleted successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete user' });
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            const payload = {
                ...editingUser,
                dateOfBirth: editingUser.dateOfBirth ? editingUser.dateOfBirth.split('T')[0] : null,
            };
            await authService.updateUserById(editingUser.id, payload);
            setMessage({ type: 'success', text: 'User updated successfully' });
            setEditingUser(null);
            loadUsers();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update user' });
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="bg-[#f5f5f5] min-h-full py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg p-8 border-t-4 border-[#c7b299]">
                    <h2 className="text-3xl font-serif font-bold text-[#212121] mb-6 border-b pb-4">User Management</h2>

                    {message.text && (
                        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.firstName} {user.lastName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                            <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Edit User</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    value={editingUser.firstName || ''}
                                    onChange={e => setEditingUser({ ...editingUser, firstName: e.target.value })}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    value={editingUser.lastName || ''}
                                    onChange={e => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email || ''}
                                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    value={editingUser.dateOfBirth ? editingUser.dateOfBirth.split('T')[0] : ''}
                                    onChange={e => setEditingUser({ ...editingUser, dateOfBirth: e.target.value })}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    value={editingUser.address || ''}
                                    onChange={e => setEditingUser({ ...editingUser, address: e.target.value })}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#c7b299] text-white rounded hover:bg-[#9e8a74]">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
