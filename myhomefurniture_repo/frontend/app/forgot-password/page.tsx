'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; token?: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const result = await authService.requestPasswordReset(email);
            setMessage({
                type: 'success',
                text: result.message,
                token: result.token
            });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to request password reset'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white shadow-lg p-8 border-t-4 border-[#c7b299]">
                <h2 className="text-3xl font-serif font-bold text-[#212121] mb-2">Forgot Password</h2>
                <p className="text-gray-600 mb-6">Enter your email address and we'll send you a reset token.</p>

                {message && (
                    <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <p className="font-medium">{message.text}</p>
                        {message.token && (
                            <div className="mt-3 p-3 bg-white rounded border border-green-300">
                                <p className="text-sm font-medium text-gray-700 mb-1">Your Reset Token:</p>
                                <p className="font-mono text-xs break-all">{message.token}</p>
                                <Link
                                    href={`/reset-password?token=${message.token}`}
                                    className="inline-block mt-3 text-[#c7b299] hover:text-[#9e8a74] font-medium"
                                >
                                    → Reset Password Now
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c7b299] focus:border-transparent"
                            placeholder="your@email.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#c7b299] text-white py-2 px-4 rounded-md hover:bg-[#9e8a74] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Token'}
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
