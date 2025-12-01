'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        address: ''
    });

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }
        loadProfile();
    }, [router]);

    const loadProfile = async () => {
        try {
            const data = await authService.getProfile();
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                address: data.address || ''
            });
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                ...formData,
                dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : null
            };
            await authService.updateProfile(payload);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-[#f5f5f5] min-h-full py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg p-8 border-t-4 border-[#c7b299]">
                    <h2 className="text-3xl font-serif font-bold text-[#212121] mb-6 border-b pb-4">
                        My Profile
                    </h2>

                    {message.text && (
                        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-[#c7b299] focus:border-[#c7b299] outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-[#c7b299] focus:border-[#c7b299] outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 focus:ring-[#c7b299] focus:border-[#c7b299] outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 focus:ring-[#c7b299] focus:border-[#c7b299] outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 focus:ring-[#c7b299] focus:border-[#c7b299] outline-none transition"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-[#c7b299] text-white font-bold py-3 px-4 hover:bg-[#9e8a74] transition uppercase tracking-wider disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
