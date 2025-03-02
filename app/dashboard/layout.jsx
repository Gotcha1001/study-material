"use client"
import React, { useState } from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'
import MotionWrapperDelay from '../_components/FramerMotion/MotionWrapperDelay'
import { CourseCountContext } from '../_context/CourseCountContext'

function DashboardLayout({ children }) {

    // const [totalCourse, setTotalCourse] = useState(0)
    return (
        // <CourseCountContext.Provider value={{ totalCourse, setTotalCourse }}>
        <div>
            <div className='md:w-64 hidden md:block fixed'>
                <MotionWrapperDelay
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0 },
                    }}
                > <SideBar /></MotionWrapperDelay>

            </div>
            <div className='md:ml-64'>
                <MotionWrapperDelay
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    variants={{
                        hidden: { opacity: 0, x: -100 },
                        visible: { opacity: 1, x: 0 },
                    }}
                ><DashboardHeader />
                </MotionWrapperDelay>

                <div className='p-10'>
                    {children}
                </div>

            </div>

        </div>
        // </CourseCountContext.Provider>
    )
}

export default DashboardLayout