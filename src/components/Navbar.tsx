"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import { supabase } from '@/libs/supabase/client';
import SupabaseService from '@/services/supabase';

import LanguageSelector from "./LanguageSelector";
import Spinner from "./Spinner";


export default function Navbar() {
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const getUserSession = async () => {
            const SupabaseServiceInstance = new SupabaseService(supabase);
            const user = await SupabaseServiceInstance.getUserId();
            if (!!user) {
                setIsLogged(true);
            } else {
                setIsLogged(false);
            }
            setIsLoading(false);
        };
        getUserSession();
    }, []);

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto relative flex items-center justify-between py-4 px-6">
                <a href="./" className="flex items-center space-x-4 cursor-pointer">
                    <Image
                        src="/logo.ico"
                        alt="Micro-SaaS Illustration"
                        className="rounded-lg"
                        layout="intrinsic"
                        width={32}
                        height={0}
                    />
                </a>

                <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-6">
                    <a href="#pricing" className="text-gray-600 hover:text-indigo-600">
                        Pricing
                    </a>
                    <a href="#features" className="text-gray-600 hover:text-indigo-600">
                        Features
                    </a>
                    <a href="#faq" className="text-gray-600 hover:text-indigo-600">
                        FAQ
                    </a>
                </nav>

                <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
                    {
                        isLoading
                            ? <div className="mr-12"><Spinner /></div>
                            : !isLogged ? (
                                <>
                                    <a href="/signin" className="py-2 px-4 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-100" >
                                        Sign In
                                    </a>
                                    <a href="/signup" className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                        Try For Free
                                    </a>
                                </>
                            ) :
                                <a href="/dashboard" className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                    Dashboard
                                </a>
                    }
                    <LanguageSelector />
                </div>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <nav className="flex flex-col items-start space-y-4 p-4">
                        <a href="#features" className="text-gray-600 hover:text-indigo-600">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-600 hover:text-indigo-600">
                            Pricing
                        </a>
                        <a href="#faq" className="text-gray-600 hover:text-indigo-600">
                            FAQ
                        </a>
                    </nav>
                    <div className="flex flex-col space-y-4 p-4">
                        <LanguageSelector />

                        {isLoading
                            ? <Spinner />
                            : !isLogged ? (
                                <>
                                    <a
                                        href="/signin"
                                        className="py-2 px-4 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-100"
                                    >
                                        Sign In
                                    </a>
                                    <a
                                        href="/signup"
                                        className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                    >
                                        Try For Free
                                    </a>
                                </>
                            ) : (
                                <a
                                    href="/dashboard"
                                    className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Dashboard
                                </a>
                            )}
                    </div>
                </div>
            )}
        </header>

    );
}
