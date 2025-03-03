import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RefreshCcw, RefreshCwIcon, MoreVertical, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

export default function CourseCardItem({ course, onDelete }) {
    const [progress, setProgress] = useState(0);
    const [materialStatus, setMaterialStatus] = useState({
        notes: false,
        quiz: false,
        qa: false,
        flashcard: false
    });
    const [statusData, setStatusData] = useState({});
    const [isNewCourse, setIsNewCourse] = useState(false);
    const [existingItemsCount, setExistingItemsCount] = useState(0); // Track items that exist
    const [completedCount, setCompletedCount] = useState(0);
    const [totalPossibleItems, setTotalPossibleItems] = useState(4); // Total possible items (notes, quiz, qa, flashcard)

    const logProgressDetails = (status, isNewCourseFlag) => {
        // Log raw status values from API
        console.log("CourseCardItem - RAW STATUS VALUES:", {
            notes: status.notes,
            quiz: status.quiz,
            qa: status.qa,
            flashcard: status.flashcard
        });

        // Calculate how many are "Ready"
        const readyItems = Object.entries(status).filter(([key, value]) => {
            console.log(`CourseCardItem - Status of ${key}:`, value);
            return value === 'Ready';
        });

        // Calculate how many are in progress (not "NotCreated")
        const inProgressItems = Object.entries(status).filter(([key, value]) => {
            return value !== "NotCreated";
        });

        console.log("CourseCardItem - Items marked as Ready:", readyItems.map(([key]) => key));
        console.log("CourseCardItem - In-progress items:", inProgressItems.map(([key]) => key));
    };

    useEffect(() => {
        if (course?.courseId) {
            checkMaterialStatus();
        }
    }, [course]);

    // Function to check the status of each study material
    const checkMaterialStatus = async () => {
        try {
            const result = await axios.post('/api/check-progress', {
                courseId: course?.courseId
            });

            // Log the raw API response
            console.log("CourseCardItem - API response:", result.data);

            const status = result.data.status || {};
            setStatusData(status);
            setIsNewCourse(result.data.isNewCourse || false);

            // Run detailed debug logging
            logProgressDetails(status, result.data.isNewCourse);

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

            // Calculate progress
            let progressValue;
            if (result.data.isNewCourse) {
                // For new courses, fix at 25%
                progressValue = 25;
                console.log("CourseCardItem - New course: setting progress to 25%");
            } else if (inProgressCount === 0) {
                // No items in progress
                progressValue = 0;
            } else {
                // Calculate based on ready items versus TOTAL POSSIBLE items (always 4)
                progressValue = (readyCount / totalPossibleItems) * 100;
                console.log(`CourseCardItem - Fixed progress calculation: ${readyCount} completed / ${totalPossibleItems} total possible = ${progressValue}%`);
            }

            setProgress(progressValue);
        } catch (error) {
            console.error("Error checking material status:", error);
        }
    };

    const handleDeleteCourse = async () => {
        try {
            if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
                const response = await axios.delete(`/api/courses-delete?courseId=${course.courseId}`);

                if (response.data.success) {
                    toast.success("Course deleted successfully");
                    // Call the parent's onDelete function to refresh the course list
                    if (onDelete) onDelete();
                }
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            toast.error("Failed to delete course");
        }
    };

    return (
        <div className='border border-teal-500 gradient-background2 rounded-lg p-5 shadow-lg hover:scale-105 transition-all hover:bg-gradient-to-r from-red-500 via-yellow-300 t0-white relative'>
            {/* 3-dot menu in top-right corner */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" size="icon">
                            <MoreVertical className="h-4 w-4 text-primary" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="text-red-500 focus:text-red-500 cursor-pointer flex items-center"
                            onClick={handleDeleteCourse}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                <div className='flex justify-between items-center'>
                    <Image src={'/knowledge.jpg'} alt='Icon' height={90} width={90} className='rounded-xl' />
                    <h2 className='text-[10px] p-1 text-xs px-2 rounded-full text-white bg-primary'>
                        {course?.createdAt
                            ? new Date(course.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })
                            : 'New Course'}
                    </h2>
                </div>
                <h2 className='mt-3 text-indigo-400 font-medium text-lg'>{course?.courseLayout?.courseTitle}</h2>
                <p className='text-sm line-clamp-2 text-primary mt-2'>{course?.courseLayout?.courseSummary}</p>
                <div className='mt-3'>
                    <Progress value={progress} />
                    <div className='mt-1 flex justify-between text-xs text-primary'>
                        <span>{Math.round(progress)}% Complete</span>
                        <span>{completedCount}/{totalPossibleItems} Materials</span>
                    </div>
                </div>
                <div className='mt-3 flex justify-between items-center'>
                    <div className='flex gap-1'>
                        <span className={`w-2 h-2 rounded-full ${materialStatus.notes ? 'bg-green-500' : 'bg-gray-300'}`} title="Notes"></span>
                        <span className={`w-2 h-2 rounded-full ${materialStatus.quiz ? 'bg-green-500' : 'bg-gray-300'}`} title="Quiz"></span>
                        <span className={`w-2 h-2 rounded-full ${materialStatus.qa ? 'bg-green-500' : 'bg-gray-300'}`} title="Q&A"></span>
                        <span className={`w-2 h-2 rounded-full ${materialStatus.flashcard ? 'bg-green-500' : 'bg-gray-300'}`} title="Flashcards"></span>
                    </div>
                    {course?.status == 'Generating' ?
                        <h2 className='text-primary text-sm p-1 px-2 rounded-full bg-gradient-to-r zoom from-indigo-500 via-white to-black flex justify-between items-center gap-2'>
                            <RefreshCwIcon className='animate-spin h-5 w-5' />
                            Generating...</h2>
                        :
                        <Link href={'/course/' + course?.courseId}>
                            <Button variant="sex1">View</Button>
                        </Link>
                    }
                </div>
            </div>
        </div>
    )
}