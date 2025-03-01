"use client"

import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import StepProgress from '../_components/StepProgress'
import QuizCardItem from './_components/QuizCardItem'
import MotionWrapperDelay from '@/app/_components/FramerMotion/MotionWrapperDelay'
import { Button } from '@/components/ui/button'

function Quiz() {
    const { courseId } = useParams()





    const router = useRouter()
    const [quizData, setQuizData] = useState()
    const [quiz, setQuiz] = useState([])
    const [stepCount, setStepCount] = useState(0)
    const [correctAnswer, setCorrectAnswer] = useState(null)
    const [currentAnswer, setCurrentAnswer] = useState()
    const [isComplete, setIsComplete] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        console.log("Course ID:", courseId); // Check if the courseId is correct
        GetQuiz();
    }, [courseId]);



    const GetQuiz = async () => {
        try {
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: 'Quiz'
            });
            console.log("Quiz Data from API:", result.data);

            if (result.data && result.data.content && result.data.content.questions) {
                setQuizData(result.data);
                setQuiz(result.data.content.questions);
            } else {
                console.error("Quiz data is not structured as expected");
            }
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        }
    };

    const checkAnswer = (userAnswer, currentQuestion) => {
        console.log("Correct Answer:", currentQuestion?.answer);
        setCurrentAnswer(currentQuestion?.answer); // Always update this

        if (userAnswer == currentQuestion?.answer) {
            setCorrectAnswer(true);
            setScore(prevScore => prevScore + 1);
        } else {
            setCorrectAnswer(false);
        }
    };


    useEffect(() => {
        setCorrectAnswer(null)
    }, [stepCount])

    const handleNextQuestion = () => {
        if (stepCount < quiz.length - 1) {
            setStepCount(stepCount + 1)
        } else {
            // Mark quiz as complete
            setIsComplete(true)
        }
    }

    const restartQuiz = () => {
        setStepCount(0)
        setCorrectAnswer(null)
        setCurrentAnswer(null)
        setIsComplete(false)
        setScore(0)
    }

    return (
        <div className="w-full px-4 md:px-8 py-6">
            <h2 className='text-4xl gradient-title font-bold text-center mb-4'>Quiz</h2>

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
                        <h2 className='text-primary font-bold text-3xl'>QUIZ COMPLETED</h2>
                        <div className='border p-4 zoom border-purple-800 bg-gradient-to-r from-indigo-900/30 via-black/50 to-purple-900/30 rounded-lg w-full max-w-md'>
                            <p className="text-white text-xl mb-2 text-center">Your Score:</p>
                            <h3 className='text-center font-bold gradient-title text-4xl mb-4'>
                                {score} / {quiz.length}
                            </h3>
                            <p className="text-white text-center mb-4">
                                {score === quiz.length ? "Perfect score! Excellent work!" :
                                    score >= Math.floor(quiz.length * 0.7) ? "Great job!" :
                                        score >= Math.floor(quiz.length * 0.5) ? "Good effort!" :
                                            "Keep practicing!"}
                            </p>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Button
                                onClick={restartQuiz}
                                variant="sex"
                                className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary"
                            >
                                Restart Quiz
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
                <>
                    <StepProgress data={quiz} stepCount={stepCount} setStepCount={(value) => setStepCount(value)} />
                    <div>
                        <QuizCardItem
                            userSelectedOption={(v) => checkAnswer(v, quiz[stepCount])}
                            quiz={quiz[stepCount]} />
                    </div>

                    {correctAnswer === false &&
                        <MotionWrapperDelay
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.9, delay: 0.8 }}
                            variants={{
                                hidden: { opacity: 0, y: -100 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <div>
                                <div className='border zoom p-3 border-purple-950 bg-gradient-to-r from-rose-500 via-black to-purple-900 rounded-lg'>
                                    <h2 className='text-center font-bold gradient-title1 text-5xl'>
                                        Incorrect</h2>
                                    <p className='text-center text-white font-bold text-lg'>The Correct Answer Is : <br /> <span className='text-xl text-red-500'>{currentAnswer}</span> </p>

                                    <div className="flex justify-center mt-4">
                                        <Button
                                            onClick={handleNextQuestion}
                                            variant="sex1"
                                            className="hover:scale-105 transition-all"
                                        >
                                            {stepCount === quiz.length - 1 ? "Finish Quiz" : "Next Question"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </MotionWrapperDelay>
                    }

                    {correctAnswer === true &&
                        <MotionWrapperDelay
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.9, delay: 0.8 }}
                            variants={{
                                hidden: { opacity: 0, y: -100 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <div>
                                <div className='border p-3 zoom border-green-700 bg-gradient-to-r from-green-400 via-sky-400 to-green-900 rounded-lg'>
                                    <h2 className='text-center font-bold gradient-title1 text-5xl'>Correct</h2>
                                    <p className='text-center text-white font-bold text-lg'>Well Done Your Answer Is Correct</p>

                                    <div className="flex justify-center mt-4">
                                        <Button
                                            onClick={handleNextQuestion}
                                            variant="sex1"
                                            className="hover:scale-105 transition-all"
                                        >
                                            {stepCount === quiz.length - 1 ? "Finish Quiz" : "Next Question"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </MotionWrapperDelay>
                    }
                </>
            )}
        </div>
    )
}

export default Quiz