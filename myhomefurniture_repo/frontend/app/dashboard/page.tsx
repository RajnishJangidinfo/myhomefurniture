'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !authService.isAuthenticated()) {
            router.push('/login');
        }
    }, [mounted, router]);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f5f5] min-h-full py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-none shadow-lg p-8 border-t-4 border-[#c7b299]">
                    <h2 className="text-3xl font-serif font-bold text-[#212121] mb-6 border-b pb-4">
                        My Dashboard
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-[#c7b299] text-white p-6 shadow-md hover:bg-[#9e8a74] transition cursor-pointer">
                            <div className="text-4xl mb-2">📦</div>
                            <h3 className="text-xl font-bold uppercase tracking-wider mb-1">Total Orders</h3>
                            <p className="text-3xl font-serif">12</p>
                        </div>

                        <div className="bg-[#212121] text-white p-6 shadow-md hover:bg-black transition cursor-pointer">
                            <div className="text-4xl mb-2">❤️</div>
                            <h3 className="text-xl font-bold uppercase tracking-wider mb-1">Wishlist</h3>
                            <p className="text-3xl font-serif">5</p>
                        </div>

                        <div className="bg-white border-2 border-[#c7b299] text-[#212121] p-6 shadow-md hover:bg-[#f9f9f9] transition cursor-pointer">
                            <div className="text-4xl mb-2">👤</div>
                            <h3 className="text-xl font-bold uppercase tracking-wider mb-1">Profile</h3>
                            <p className="text-sm text-gray-600">Update details</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 border border-gray-200">
                        <h3 className="text-xl font-bold text-[#212121] mb-4 uppercase tracking-wider">
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-bold text-[#212121]">Order #12345</p>
                                    <p className="text-sm text-gray-500">Placed on Oct 24, 2023</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase">Delivered</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-bold text-[#212121]">Order #12346</p>
                                    <p className="text-sm text-gray-500">Placed on Nov 12, 2023</p>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded uppercase">Processing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
