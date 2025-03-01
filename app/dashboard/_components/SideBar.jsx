"use client"
import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Shield, UserCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { Progress } from "@/components/ui/progress"
import { CourseCountContext } from '@/app/_context/CourseCountContext'



function SideBar() {

    const path = usePathname()
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
    ]

    return (
        <div className='h-screen gradient-background2 shadow-neon p-3'>
            <div className="p-4 border border-indigo-500 rounded-lg gradient-background2">
                <Link href={'/'} >
                    <Image className=' hover:scale-105 transition-all p-1 rounded-lg bg-indigo-800' src={'/logo.jpg'} alt='logo' height={250} width={250} />
                    <h2 className="font-bold text-2xl gradient-title text-center">Easy Study</h2>
                </Link>
            </div>
            <div className='mt-2'>
                <Link href={'/create'}>
                    <Button className="w-full" variant="sex2">+Create New</Button>
                </Link>

                <div className='mt-5'>
                    {MenuList.map((menu, index) => (
                        <FeatureMotionWrapper key={index} index={index}>
                            <Link href={menu.path}>
                                <div className={`flex gap-5 items-center text-indigo-500 p-3 hover:bg-gradient-to-r from-black via-indigo-900 to-white hover:text-white rounded-lg cursor-pointer mt-3 ${path == menu.path && 'bg-gradient-to-r from-indigo-500 via-purple-900 to-teal-500 text-white'}`}>
                                    <menu.icon />
                                    <h2>{menu.name}</h2>
                                </div>
                            </Link>
                        </FeatureMotionWrapper>
                    ))}
                </div>
            </div>
            <Link
                href={'/dashboard/upgrade'}>
                <div className='text-teal-100 text-center border border-indigo-500 rounded-lg p-1 mt-10 bg-gradient-to-r from-purple-900 via-indigo-800 to-black absolute bottom-10 w-[90%]'>
                    <h2 className='text-lg mb-2'>Available Credits:</h2>
                    <Progress value={remainingCredits * 10} />
                    <h2 className='text-sm text-center mt-1'>{remainingCredits} Credits Left</h2>
                    <h2 className='text-indigo-100 text-xs mt-3'>Upgrade To Create More</h2>
                </div>
            </Link>
        </div >
    )
}

export default SideBar