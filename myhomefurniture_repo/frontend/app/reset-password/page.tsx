'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({
                type: 'error',
                text: 'Passwords do not match'
            });
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage({
                type: 'error',
                text: 'Password must be at least 6 characters long'
            });
            setLoading(false);
            return;
        }

        try {
            const result = await authService.resetPassword(token, newPassword);
            setMessage({
                type: 'success',
                text: result.message
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to reset password'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white shadow-lg p-8 border-t-4 border-[#c7b299]">
                <h2 className="text-3xl font-serif font-bold text-[#212121] mb-2">Reset Password</h2>
                <p className="text-gray-600 mb-6">Enter your reset token and new password.</p>

                {message && (
                    <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                        {message.type === 'success' && (
                            <p className="mt-2 text-sm">Redirecting to login...</p>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reset Token
                        </label>
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c7b299] focus:border-transparent font-mono text-sm"
                            placeholder="Enter your reset token"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c7b299] focus:border-transparent"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c7b299] focus:border-transparent"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#c7b299] text-white py-2 px-4 rounded-md hover:bg-[#9e8a74] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-[#c7b299] hover:text-[#9e8a74] font-medium">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
