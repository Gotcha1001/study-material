"use client"
import dynamic from "next/dynamic";

const UserButton = dynamic(() => import("@clerk/nextjs").then(mod => mod.UserButton), { ssr: false });

import React, { useContext, useState } from 'react';
import { Menu, X, LayoutDashboard, Shield, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import { CourseCountContext } from "@/app/_context/CourseCountContext";

export default function DashboardHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const path = usePathname();

    const { totalCourses, remainingCredits } = useContext(CourseCountContext);

    const MenuList = [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard'
        },
        {
            name: 'Upgrade',
            icon: Shield,
            path: '/dashboard/upgrade'
        },
        {
            name: 'Profile',
            icon: UserCircle,
            path: '/dashboard/profile'
        }
    ];

    return (
        <header className="relative w-full h-40 overflow-hidden">
            <div className="dynamic-bg" />
            <div className="relative z-10 h-full flex items-center justify-between px-6">
                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-white p-2"
                    >
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </Button>
                </div>




                <Image src={'/logo.png'} alt="logo" height={200} width={200} className="horizontal-rotate mt-9" />
                {/* Desktop Dashboard Link (Hidden on Mobile) */}
                <div className="hidden md:block">
                    <Link
                        href="/dashboard"
                        className="text-white gradient-background2 border border-teal-500 px-4 py-2 rounded-lg hover:text-teal-500 transition-all "
                    >
                        Dashboard
                    </Link>
                </div>
                <UserButton appearance={{ elements: { avatarBox: "w-16 h-16" } }} />

            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="fixed inset-0 bg-black/10"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-black/90 p-6 backdrop-blur-sm">
                        <div className="mb-8">
                            <Link href={'/'} onClick={() => setIsMenuOpen(false)}>
                                <Image
                                    className="hover:scale-105 transition-all p-1 rounded-lg bg-indigo-800"
                                    src={'/logo.jpg'}
                                    alt='logo'
                                    height={350}
                                    width={350}
                                />
                                <h2 className="font-bold text-xl gradient-title text-center text-white mt-4">
                                    Easy Study
                                </h2>
                            </Link>
                        </div>

                        <Link href={'/create'}>
                            <Button className="w-full" variant="sex2">+Create New</Button>
                        </Link>

                        <nav className="flex flex-col gap-2">
                            {MenuList.map((menu, index) => (
                                <Link
                                    key={index}
                                    href={menu.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2"
                                >
                                    <div className={`flex gap-5 items-center p-3 rounded-lg cursor-pointer
                                        ${path === menu.path
                                            ? 'bg-gradient-to-r from-indigo-500 via-purple-900 to-teal-500 text-white'
                                            : 'text-indigo-500 hover:bg-gradient-to-r from-indigo-500 via-purple-900 to-teal-500 hover:text-white'
                                        }`}
                                    >
                                        <menu.icon />
                                        <h2>{menu.name}</h2>
                                    </div>
                                </Link>
                            ))}
                        </nav>

                        <div className='text-teal-100 text-center border border-indigo-500 rounded-lg p-1 mt-10'>
                            <h2 className='text-lg mb-2'>Available Credits:</h2>
                            <Progress value={remainingCredits * 10} />
                            <h2 className='text-sm text-center mt-1'>{remainingCredits} Credits Left</h2>
                            <h2 className='text-indigo-100 text-xs mt-3'>Upgrade To Create More</h2>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}