"use client"

import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseIntroCard from './_components/CourseIntroCard'
import StudyMaterialSection from './_components/StudyMaterialSection'
import ChapterList from './_components/ChapterList'
import ShareButton from './quiz/_components/ShareButton'


function Course() {
    const { courseId } = useParams()
    const [course, setCourse] = useState()

    useEffect(() => {
        GetCourse()
    }, [])

    const GetCourse = async () => {
        const result = await axios.get('/api/courses?courseId=' + courseId)
        console.log(result)
        setCourse(result.data.result)
    }

    // Get the current URL to share
    const getShareUrl = () => {
        // When deployed, this will use the actual domain instead of localhost
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return '';
    }

    return (
        <div>
            <div className=''>
                {/* Course Intro */}
                <CourseIntroCard course={course} />

                {/* Share Button */}
                {course && (
                    <ShareButton
                        url={getShareUrl()}
                        title={course.name || 'Check out this course'}
                        description={course.description || 'I found this interesting course. Check it out!'}
                    />
                )}

                {/* Study Materials Options */}
                <StudyMaterialSection courseId={courseId} course={course} />

                {/* Chapter List */}
                <ChapterList course={course} />
            </div>
        </div>
    )
}

export default Course