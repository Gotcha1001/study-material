import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RefreshCcw, RefreshCwIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function CourseCardItem({ course }) {
    const [progress, setProgress] = useState(0);
    const [materialStatus, setMaterialStatus] = useState({
        notes: false,
        quiz: false,
        qa: false,
        flashcard: false
    });
    const [availableItems, setAvailableItems] = useState(1); // Default to 1 (for notes)

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

            const status = result.data.status || {};

            setMaterialStatus({
                notes: status.notes === 'Ready',
                quiz: status.quiz === 'Ready',
                qa: status.qa === 'Ready',
                flashcard: status.flashcard === 'Ready'
            });

            // Count items that are either Ready, Generating, or Pending (but not NotCreated)
            const availableCount = Object.values(status)
                .filter(itemStatus => itemStatus !== "NotCreated").length;

            setAvailableItems(availableCount > 0 ? availableCount : 1);

            // Calculate progress percentage based on available items
            const completedCount = Object.values(status)
                .filter(itemStatus => itemStatus === 'Ready').length;

            // If nothing is available yet, default to notes only (25% if notes are ready)
            const progressPercentage = availableCount > 0
                ? (completedCount / availableCount) * 100
                : (status.notes === 'Ready' ? 25 : 0);

            setProgress(progressPercentage);
        } catch (error) {
            console.error("Error checking material status:", error);
        }
    };

    return (
        <div className='border border-teal-500 rounded-lg p-5 shadow-lg'>
            <div>
                <div className='flex justify-between items-center'>
                    <Image src={'/knowledge.jpg'} alt='Icon' height={70} width={70} className='rounded-xl' />
                    <h2 className='text-[10px] p-1 text-xs px-2 rounded-full text-white bg-primary'>20 Dec 2025</h2>
                </div>
                <h2 className='mt-3 text-indigo-400 font-medium text-lg'>{course?.courseLayout?.courseTitle}</h2>
                <p className='text-sm line-clamp-2 text-primary mt-2'>{course?.courseLayout?.courseSummary}</p>

                <div className='mt-3'>
                    <Progress value={progress} />
                    <div className='mt-1 flex justify-between text-xs text-primary'>
                        <span>{Math.round(progress)}% Complete</span>
                        <span>{Object.values(materialStatus).filter(Boolean).length}/{availableItems} Materials</span>
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

export default CourseCardItem