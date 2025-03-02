"use client"
import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import CourseCardItem from './CourseCardItem'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import { CourseCountContext } from '@/app/_context/CourseCountContext'


function CourseList() {

    const { setTotalCourses, refreshCredits } = useContext(CourseCountContext);

    const { user } = useUser()
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        user && GetCourseList()
    }, [user])

    const GetCourseList = async () => {
        setLoading(true);

        const result = await axios.post('/api/courses', {
            createdBy: user?.primaryEmailAddress.emailAddress
        });

        console.log("☘️:", result);
        setCourseList(result.data.result);

        // Update the context with the correct count of courses
        setTotalCourses(result.data.result.length);

        // Refresh the credit calculation 
        refreshCredits();

        setLoading(false);
    };

    return (
        <div className='mt-10'>
            <h2 className='font-bold gradient-title text-3xl mb-5 flex items-center'>
                <div className="flex-grow text-center">Your Study Material</div>
                <Button
                    onClick={GetCourseList}
                    variant="sex1"
                    className="border-primary text-primary"
                >
                    <RefreshCcw size={16} />
                </Button>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2'>
                {loading == false ? courseList?.map((course, index) => (
                    <FeatureMotionWrapper key={index} index={index}>
                        <div>
                            <CourseCardItem course={course} />
                        </div>
                    </FeatureMotionWrapper>
                ))
                    : [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <FeatureMotionWrapper key={index} index={index}>
                            <div className='h-56 w-full bg-slate-200 rounded-lg animate-pulse'>

                            </div>
                        </FeatureMotionWrapper>

                    ))
                }
            </div>
        </div>
    )
}

export default CourseList