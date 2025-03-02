import MotionWrapperDelay from '@/app/_components/FramerMotion/MotionWrapperDelay'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function CourseIntroCard({ course }) {
    // Declare all state variables at the top of the component
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
    const [existingItemsCount, setExistingItemsCount] = useState(0); // Track items that exist
    const [completedCount, setCompletedCount] = useState(0);
    const [totalPossibleItems, setTotalPossibleItems] = useState(4); // Total possible items (notes, quiz, qa, flashcard)

    const logProgressDetails = (status, isNewCourseFlag) => {
        // Log raw status values from API
        console.log("CourseIntroCard - RAW STATUS VALUES:", {
            notes: status.notes,
            quiz: status.quiz,
            qa: status.qa,
            flashcard: status.flashcard
        });

        // Calculate how many are "Ready"
        const readyItems = Object.entries(status).filter(([key, value]) => {
            console.log(`CourseIntroCard - Status of ${key}:`, value);
            return value === 'Ready';
        });

        // Calculate how many are in progress (not "NotCreated")
        const inProgressItems = Object.entries(status).filter(([key, value]) => {
            return value !== "NotCreated";
        });

        console.log("CourseIntroCard - Items marked as Ready:", readyItems.map(([key]) => key));
        console.log("CourseIntroCard - In-progress items:", inProgressItems.map(([key]) => key));
    };

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

            // Log the raw API response
            console.log("CourseIntroCard - API response:", result.data);

            const status = result.data.status || {};
            setStatusData(status);
            setIsNewCourse(result.data.isNewCourse || false);

            // Run detailed debug logging
            logProgressDetails(status, result.data.isNewCourse);

            // Set material status based on API response
            setMaterialStatus({
                notes: status.notes === 'Ready',
                quiz: status.quiz === 'Ready',
                qa: status.qa === 'Ready',
                flashcard: status.flashcard === 'Ready'
            });

            // Count items that are either Ready or in progress (Generating/Pending) - but not NotCreated
            const inProgressCount = Object.values(status)
                .filter(itemStatus => itemStatus !== "NotCreated").length;

            const readyCount = Object.values(status)
                .filter(itemStatus => itemStatus === 'Ready').length;

            // Use the existingItemsCount from API if available
            setExistingItemsCount(result.data.existingItemsCount || inProgressCount);
            setCompletedCount(readyCount);

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

    // Calculate progress
    let overallProgress;
    if (isNewCourse) {
        // For new courses, fix at 25%
        overallProgress = 25;
        console.log("CourseIntroCard - New course: setting progress to 25%");
    } else if (existingItemsCount === 0) {
        // No items in progress
        overallProgress = 0;
    } else {
        // Calculate based on ready items versus TOTAL POSSIBLE items (always 4)
        overallProgress = isLoading ? 0 : (completedCount / totalPossibleItems) * 100;
        console.log(`CourseIntroCard - Fixed progress calculation: ${completedCount} completed / ${totalPossibleItems} total possible = ${overallProgress}%`);
    }

    return (
        <div className='flex flex-col md:flex-row gap-5 p-4 border gradient-background2 border-teal-500 rounded-lg'>
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
                    <div className="mt-1 flex justify-between text-xs text-indigo-300">
                        <span>{completedCount} of {totalPossibleItems} materials complete</span>
                    </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs ${materialStatus.notes ? 'bg-green-500/20 text-green-300' : 'bg-gray-700/20 text-gray-400'}`}>
                        Notes {materialStatus.notes ? '✓' : ''}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${materialStatus.quiz ? 'bg-green-500/20 text-green-300' : statusData.quiz !== 'NotCreated' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-700/20 text-gray-400'}`}>
                        Quiz {materialStatus.quiz ? '✓' : statusData.quiz === 'Generating' ? '...' : ''}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${materialStatus.qa ? 'bg-green-500/20 text-green-300' : statusData.qa !== 'NotCreated' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-700/20 text-gray-400'}`}>
                        Q&A {materialStatus.qa ? '✓' : statusData.qa === 'Generating' ? '...' : ''}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${materialStatus.flashcard ? 'bg-green-500/20 text-green-300' : statusData.flashcard !== 'NotCreated' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-700/20 text-gray-400'}`}>
                        Flashcards {materialStatus.flashcard ? '✓' : statusData.flashcard === 'Generating' ? '...' : ''}
                    </div>
                </div>
                <h2 className='text-purple-500 mt-3 text-lg'>Total Chapters: {course?.courseLayout?.chapters?.length}</h2>
            </div>
        </div>
    )
}