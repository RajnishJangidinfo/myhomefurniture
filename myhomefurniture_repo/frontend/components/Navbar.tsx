'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMasterOpen, setIsMasterOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, []);

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        router.push('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="font-serif text-3xl font-bold text-[#c7b299]">Decor</span>
                            <span className="font-serif text-3xl font-bold text-gray-800 ml-1">Interior</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-[#c7b299] font-medium transition uppercase text-sm tracking-wider">Home</Link>
                        <Link href="/about" className="text-gray-600 hover:text-[#c7b299] font-medium transition uppercase text-sm tracking-wider">About</Link>
                        <Link href="/services" className="text-gray-600 hover:text-[#c7b299] font-medium transition uppercase text-sm tracking-wider">Services</Link>
                        <Link href="/gallery" className="text-gray-600 hover:text-[#c7b299] font-medium transition uppercase text-sm tracking-wider">Gallery</Link>

                        {isAuthenticated ? (
                            <>
                                {/* Master Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMasterOpen(!isMasterOpen)}
                                        className="text-gray-600 hover:text-[#c7b299] font-medium transition uppercase text-sm tracking-wider flex items-center focus:outline-none"
                                    >
                                        Master
                                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isMasterOpen && (
                                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                            <Link href="/campuses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMasterOpen(false)}>Campuses</Link>
                                            <Link href="/buildings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMasterOpen(false)}>Buildings</Link>
                                            <Link href="/floors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMasterOpen(false)}>Floors</Link>
                                            <Link href="/rooms" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMasterOpen(false)}>Rooms</Link>
                                        </div>
                                    )}
                                </div>

                                <Link href="/dashboard" className="text-gray-600 hover:text-[#c7b299] font-medium transition uppercase text-sm tracking-wider">Dashboard</Link>
                                <Link href="/profile" className="text-gray-600 hover:text-[#c7b299] font-medium transition uppercase text-sm tracking-wider">Profile</Link>
                                <Link href="/users" className="text-gray-600 hover:text-[#c7b299] font-medium transition uppercase text-sm tracking-wider">Users</Link>
                                <button onClick={handleLogout} className="text-white bg-[#c7b299] hover:bg-[#9e8a74] px-4 py-2 rounded transition uppercase text-sm tracking-wider">Logout</button>
                            </>
                        ) : (
                            <Link href="/login" className="text-white bg-[#c7b299] hover:bg-[#9e8a74] px-4 py-2 rounded transition uppercase text-sm tracking-wider">Login</Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm">Home</Link>
                        <Link href="/about" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm">About</Link>
                        <Link href="/services" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm">Services</Link>
                        <Link href="/gallery" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm">Gallery</Link>
                        {isAuthenticated ? (
                            <>
                                <div className="border-t border-gray-100 my-2 pt-2">
                                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Master Data</p>
                                    <Link href="/campuses" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm pl-6">Campuses</Link>
                                    <Link href="/buildings" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm pl-6">Buildings</Link>
                                    <Link href="/floors" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm pl-6">Floors</Link>
                                    <Link href="/rooms" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm pl-6">Rooms</Link>
                                </div>
                                <Link href="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm">Dashboard</Link>
                                <Link href="/profile" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm">Profile</Link>
                                <Link href="/users" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm">Users</Link>
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm">Logout</button>
                            </>
                        ) : (
                            <Link href="/login" className="block px-3 py-2 text-gray-600 hover:text-[#c7b299] font-medium uppercase text-sm">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
