"use client"

import { CourseCountContext } from '@/app/_context/CourseCountContext';
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { toast } from 'sonner';

function MaterialCardItem({ item, studyTypeContent, course, refreshData }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { setTotalCourses, refreshCredits } = useContext(CourseCountContext);

    // Check if content exists for this study type
    const contentExists = studyTypeContent?.[item.type] && studyTypeContent?.[item.type].length !== 0

    const GenerateContent = async () => {
        toast.custom((t) => (
            <div
                className={`bg-purple-700 text-white p-4 rounded-lg shadow-lg flex items-center justify-between w-[300px]`}
                style={{ animation: t.visible ? 'fadeIn 0.3s ease-in-out' : 'fadeOut 0.3s ease-in-out' }}
            >
                <span>✨ Generating Your Content...</span>
            </div>
        ));

        setLoading(true);

        let chapters = '';
        course?.courseLayout.chapters.forEach((chapter) => {
            chapters = (chapter.chapterTitle || chapter?.chapter_title) + ',' + chapters;
        });

        const result = await axios.post('/api/study-type-content', {
            courseId: course.courseId,
            type: item.name,  // "QA" for Questions & Answers
            chapters: chapters
        });

        setLoading(false);
        refreshData();
        refreshCredits();

        toast.custom((t) => (
            <div
                className={`bg-indigo-700 text-white p-4 rounded-lg shadow-lg flex items-center justify-between w-[300px]`}
                style={{ animation: t.visible ? 'fadeIn 0.3s ease-in-out' : 'fadeOut 0.3s ease-in-out' }}
            >
                <span>🎉 Your Content Is Ready!</span>
            </div>
        ));
    };

    const handleButtonClick = (e) => {
        e.preventDefault(); // Prevent any default navigation

        if (!contentExists) {
            // Generate content if it doesn't exist
            GenerateContent();
        } else {
            // Navigate to the page if content exists
            router.push('/course/' + course?.courseId + item.path);
        }
    }

    return (
        <div className={`border border-teal-500 hover:bg-gradient-to-r from-red-500 via-yellow-300 t0-white p-5 rounded-lg flex flex-col items-center ${!contentExists ? 'grayscale' : ''}`}>
            {!contentExists
                ? <h2 className='text-white bg-gray-500 rounded-lg p-1 px-2 mb-2 bg-gradient-to-r text-[10px] from-indigo-600 via-teal-500 to-black'>GENERATE</h2>
                : <h2 className='text-white rounded-lg p-1 px-2 mb-2 bg-gradient-to-r text-[10px] from-indigo-600 via-teal-500 to-black'>READY</h2>}

            <Image src={item.icon} alt={item.name} height={100} width={100} className='aspect-video w-[120px] h-[150px] hover:scale-105 transition-all' />
            <h2 className='text-primary font-medium text-center mt-3'>{item.name}</h2>
            <p className='text-white text-center'>{item.desc}</p>

            <Button
                onClick={handleButtonClick}
                className="mt-3 w-full hover:scale-105 transition-all"
                variant="sex1"
            >
                {loading ? <RefreshCcw className='animate-spin' /> : (!contentExists ? 'Generate' : 'View')}
            </Button>
        </div>
    )
}

export default MaterialCardItem