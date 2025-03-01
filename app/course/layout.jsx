import React from 'react'
import DashboardHeader from '../dashboard/_components/DashboardHeader'

function CourseViewLayout({ children }) {
    return (
        <div>
            <DashboardHeader />
            <div className='mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-24 2xl:mx-32 mt-10'>
                {children}
            </div>
        </div>
    )
}

export default CourseViewLayout