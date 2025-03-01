"use client"
import React, { useState } from 'react'
import MotionWrapperDelay from '../_components/FramerMotion/MotionWrapperDelay'
import SelectOption from './_components/SelectOption'
import { Button } from '@/components/ui/button'

import TopicInput from './_components/TopicInput'
import axios from 'axios'
import uuidv4 from "uuid4";
import { useUser } from '@clerk/nextjs'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function Create() {

    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [FormData, setFormData] = useState({
        courseType: "",
        topic: "",
        difficultyLevel: "",
    })

    const router = useRouter()

    const { user } = useUser()

    const handleUserInput = (fieldName, fieldValue) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: fieldValue
        }))
        console.log("FORMDATA🏡⭐🤭:", FormData)
    }

    // USED TO SAVE USER INPUT AND GENERATE AI COURSE LAYOUT WITH BODY
    const GenerateCourseOutline = async () => {
        const courseId = uuidv4()
        setLoading(true)

        try {
            // First, deduct credits
            const deductResult = await axios.post('/api/deduct-credit', {
                email: user?.primaryEmailAddress?.emailAddress
            });

            // Check if credit deduction was successful
            if (deductResult.data.error) {
                setLoading(false);
                toast.error("Insufficient credits to create a course");
                return;
            }

            // Proceed with course generation
            const result = await axios.post('/api/generate-course-outline', {
                courseId: courseId,
                ...FormData,
                createdBy: user?.primaryEmailAddress?.emailAddress
            });

            // Update remaining credits in the context (optional)
            // This assumes you've imported the CourseCountContext
            // const { setRemainingCredits } = useContext(CourseCountContext);
            // setRemainingCredits(deductResult.data.remainingCredits);

            setLoading(false);
            router.replace('/dashboard');

            // TOAST Notification
            toast.success("Your Course Content Is Generating, Click Refresh Button...");
            console.log("RESULT🤭:", result.data.result.resp);
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong. Please try again.");
            console.error("Error generating course:", error);
        }
    }

    return (
        <div className='flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20'>
            <MotionWrapperDelay
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                variants={{
                    hidden: { opacity: 0, x: -100 },
                    visible: { opacity: 1, x: 0 },
                }}
            >  <h2 className='font-bold text-5xl gradient-title text-center '>Start Generating Your Personal Study Material</h2></MotionWrapperDelay>

            <p className='text-indigo-500 text-center text-lg'>Fill In All The Details In Order To Generate Your Study Matieral For Your Next Project </p>
            <div className='mt-10'>
                {step == 0 ? <SelectOption selectedStudyType={(value) => handleUserInput('courseType', value)}
                    defaultSelected={FormData.courseType}
                />
                    : <TopicInput setTopic={(value) => handleUserInput('topic', value)}
                        defaultTopic={FormData.topic}
                        defaultDifficulty={FormData.difficultyLevel}
                        setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)} />
                }

            </div>
            <div className={`flex w-full mt-32 ${step === 0 ? 'justify-end' : 'justify-between'}`}>
                {step !== 0 && (
                    <Button onClick={() => setStep(step - 1)} variant="sex1">
                        Previous
                    </Button>
                )}

                {step === 0 ? (
                    <Button onClick={() => setStep(step + 1)} variant="sex1">
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={GenerateCourseOutline}
                        disabled={loading}
                    >
                        {loading ? <Loader className='animate-spin' /> : 'Generate'}</Button>
                )}
            </div>

        </div>
    )
}

export default Create