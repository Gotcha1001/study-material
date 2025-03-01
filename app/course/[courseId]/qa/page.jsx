"use client"

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import MotionWrapperDelay from '@/app/_components/FramerMotion/MotionWrapperDelay'
import StepProgress from '../_components/StepProgress'

function QuestionsAnswers() {
    const { courseId } = useParams()
    const router = useRouter()
    const [qaData, setQaData] = useState()
    const [questionsAnswers, setQuestionsAnswers] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showAnswers, setShowAnswers] = useState({})
    const [api, setApi] = useState(null)
    const [isComplete, setIsComplete] = useState(false)

    // This effect handles synchronizing the carousel with the current index
    useEffect(() => {
        if (!api) return
        api.scrollTo(currentIndex)
    }, [api, currentIndex])

    useEffect(() => {
        getQuestionsAnswers()
    }, [])

    const getQuestionsAnswers = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: 'Question/Answer'
        });

        console.log("Q&A Data:", result.data);
        setQaData(result.data);

        // Extract all questions from different categories into a flat array
        if (result.data && result.data.content) {
            const allQuestions = [];

            // Iterate through each category in content
            Object.keys(result.data.content).forEach(category => {
                // Check if the value is an array
                if (Array.isArray(result.data.content[category])) {
                    // Add each question to the flat array
                    result.data.content[category].forEach(item => {
                        allQuestions.push({
                            question: item.question,
                            answer: item.answer,
                            category: category // Optional: keep track of the category
                        });
                    });
                }
            });

            setQuestionsAnswers(allQuestions);

            // Initialize showAnswers state with all false values
            const initialShowAnswers = {};
            allQuestions.forEach((_, index) => {
                initialShowAnswers[index] = false;
            });
            setShowAnswers(initialShowAnswers);
        } else {
            setQuestionsAnswers([]);
        }
    }

    const handleShowAnswer = (index) => {
        setShowAnswers(prev => ({
            ...prev,
            [index]: true
        }));
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsComplete(false);
        }
    }

    const handleNext = () => {
        if (currentIndex < questionsAnswers.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // User has reached the end of questions
            setIsComplete(true);
        }
    }

    return (
        <div className="w-full px-4 md:px-8 py-6">
            <h2 className='text-4xl gradient-title font-bold text-center mb-2'>Questions & Answers</h2>
            <p className='text-primary text-center mb-4'>Test your understanding with these practice questions!</p>

            {questionsAnswers.length > 0 ? (
                <>
                    {/* Stepper component */}
                    <div className="mb-6">
                        <StepProgress
                            data={questionsAnswers}
                            stepCount={currentIndex}
                            setStepCount={(value) => {
                                setCurrentIndex(value);
                                setIsComplete(false);
                            }}
                        />
                    </div>

                    {isComplete ? (
                        <MotionWrapperDelay
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <div className='flex items-center flex-col justify-center gap-4 p-8'>
                                <h2 className='text-primary font-bold text-3xl'>END OF Q&A</h2>
                                <p className="text-white text-lg mb-4">You've completed all questions for this course!</p>
                                <div className="flex gap-4">
                                    <Button
                                        onClick={handlePrevious}
                                        variant="sex"
                                        className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary"
                                    >
                                        Review Questions
                                    </Button>
                                    <Button
                                        onClick={() => router.back()}
                                        variant="sex1"
                                        className="hover:scale-105 transition-all"
                                    >
                                        Go To Course Page
                                    </Button>
                                </div>
                            </div>
                        </MotionWrapperDelay>
                    ) : (
                        <Carousel
                            className="w-full max-w-3xl mx-auto"
                            setApi={setApi}
                            opts={{
                                align: "start",
                                loop: false
                            }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-primary">
                                    Question {currentIndex + 1} of {questionsAnswers.length}
                                </p>
                                {questionsAnswers[currentIndex]?.category && (
                                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                                        {questionsAnswers[currentIndex]?.category}
                                    </span>
                                )}
                            </div>

                            <CarouselContent>
                                {questionsAnswers.map((qa, index) => (
                                    <CarouselItem key={index} className="flex-[0_0_100%]">
                                        <Card className="border border-primary bg-gradient-to-r from-indigo-900/30 via-black/50 to-purple-900/30">
                                            <CardHeader>
                                                <CardTitle className="text-xl font-bold text-primary">Question:</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-white text-lg">{qa.question}</p>
                                            </CardContent>
                                            <CardFooter className="flex flex-col items-start">
                                                {!showAnswers[index] ? (
                                                    <div className="w-full flex justify-center mt-2 mb-4">
                                                        <Button
                                                            onClick={() => handleShowAnswer(index)}
                                                            variant="sex1"
                                                            className="hover:scale-105 transition-all"
                                                        >
                                                            Show Answer
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <MotionWrapperDelay
                                                        initial="hidden"
                                                        whileInView="visible"
                                                        viewport={{ once: true, amount: 0.5 }}
                                                        transition={{ duration: 0.9, delay: 0.3 }}
                                                        variants={{
                                                            hidden: { opacity: 0, y: 50 },
                                                            visible: { opacity: 1, y: 0 },
                                                        }}
                                                    >
                                                        <div className="w-full mt-4 border-t border-primary pt-4">
                                                            <h3 className="text-xl font-bold text-green-400 mb-2">Answer:</h3>
                                                            <p className="text-white text-lg">{qa.answer}</p>
                                                        </div>
                                                    </MotionWrapperDelay>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <div className="flex justify-center mt-8 gap-4">
                                <Button
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    variant="sex"
                                    className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary"
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    disabled={currentIndex === questionsAnswers.length - 1 && isComplete}
                                    variant="sex"
                                    className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary"
                                >
                                    {currentIndex === questionsAnswers.length - 1 ? "Complete" : "Next"}
                                </Button>
                            </div>
                        </Carousel>
                    )}
                </>
            ) : (
                <div className="text-center py-8">
                    <p className="text-primary">Loading questions or no questions available...</p>
                </div>
            )}
        </div>
    )
}

export default QuestionsAnswers