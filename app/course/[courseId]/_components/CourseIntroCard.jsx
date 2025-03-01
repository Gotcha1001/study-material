import MotionWrapperDelay from '@/app/_components/FramerMotion/MotionWrapperDelay'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function CourseIntroCard({ course }) {
    const [materialStatus, setMaterialStatus] = useState({
        notes: false,
        quiz: false,
        qa: false,
        flashcard: false
    });

    const [readingProgress, setReadingProgress] = useState(0);
    const [statusData, setStatusData] = useState({});
    const [isNewCourse, setIsNewCourse] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (course?.courseId) {
            checkMaterialStatus();
            checkReadingProgress();
        }
    }, [course]);

    const checkMaterialStatus = async () => {
        try {
            setIsLoading(true);
            const result = await axios.post('/api/check-progress', {
                courseId: course?.courseId
            });

            // Log the response to debug
            console.log("API response:", result.data);

            const status = result.data.status || {};
            setStatusData(status);
            setIsNewCourse(result.data.isNewCourse || false);

            setMaterialStatus({
                notes: status.notes === 'Ready',
                quiz: status.quiz === 'Ready',
                qa: status.qa === 'Ready',
                flashcard: status.flashcard === 'Ready'
            });

            setIsLoading(false);
        } catch (error) {
            console.error("Error checking material status:", error);
            setIsLoading(false);
        }
    };

    const checkReadingProgress = async () => {
        try {
            // Get the current reading progress from localStorage
            const savedProgress = localStorage.getItem(`reading-progress-${course?.courseId}`)

            if (savedProgress) {
                const { currentStep, totalSteps } = JSON.parse(savedProgress)
                const progressPercentage = (currentStep / totalSteps) * 100
                setReadingProgress(progressPercentage)
            } else {
                setReadingProgress(0)
            }
        } catch (error) {
            console.error("Error checking reading progress:", error)
        }
    }

    // Force 25% for new courses, otherwise calculate normally
    let overallProgress;

    if (isNewCourse) {
        // For new courses, fix at 25%
        overallProgress = 25;
    } else {
        // Calculate the normal way for existing courses
        const completedCount = Object.values(statusData)
            .filter(status => status === 'Ready').length;

        const totalItems = Object.keys(statusData).length || 4;

        overallProgress = isLoading ? 0 : (completedCount / totalItems) * 100;
    }

    // Debug information
    console.log("Material status:", materialStatus);
    console.log("Status data:", statusData);
    console.log("Is new course:", isNewCourse);
    console.log("Overall progress:", overallProgress);

    return (
        <div className='flex flex-col md:flex-row gap-5 p-4 border border-teal-500 rounded-lg'>
            <div className="flex justify-center">
                <Image
                    className='rounded-lg object-cover md:w-48 md:h-44'
                    src={'/knowledge.jpg'}
                    alt='Study'
                    width={192}
                    height={192}
                    sizes="(max-width: 768px) 120px, 192px"
                    priority
                />
            </div>
            <div className="w-full">
                <MotionWrapperDelay
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    variants={{
                        hidden: { opacity: 0, x: -100 },
                        visible: { opacity: 1, x: 0 },
                    }}
                >
                    <h2 className='text-3xl md:text-4xl gradient-title text-center mb-3 md:mb-0'>{course?.courseLayout.courseTitle}</h2>
                </MotionWrapperDelay>
                <MotionWrapperDelay
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    variants={{
                        hidden: { opacity: 0, y: -100 },
                        visible: { opacity: 1, y: 0 },
                    }}
                >
                    <p className='text-indigo-200 mt-3 md:mt-5'>{course?.courseLayout?.courseSummary}</p>
                </MotionWrapperDelay>
                <div className="mt-5">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-indigo-300">Course Progress</span>
                        <span className="text-indigo-300">{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs ${materialStatus.notes ? 'bg-green-500/20 text-green-300' : 'bg-gray-700/20 text-gray-400'}`}>
                        Notes {materialStatus.notes ? '✓' : ''}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${materialStatus.quiz ? 'bg-green-500/20 text-green-300' : 'bg-gray-700/20 text-gray-400'}`}>
                        Quiz {materialStatus.quiz ? '✓' : ''}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${materialStatus.qa ? 'bg-green-500/20 text-green-300' : 'bg-gray-700/20 text-gray-400'}`}>
                        Q&A {materialStatus.qa ? '✓' : ''}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${materialStatus.flashcard ? 'bg-green-500/20 text-green-300' : 'bg-gray-700/20 text-gray-400'}`}>
                        Flashcards {materialStatus.flashcard ? '✓' : ''}
                    </div>
                </div>
                <h2 className='text-purple-500 mt-3 text-lg'>Total Chapters: {course?.courseLayout?.chapters?.length}</h2>
            </div>
        </div>
    )
}

export default CourseIntroCard