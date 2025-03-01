"use client"
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FlashCardItem from './_components/FlashcardItem'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button'
import { useCallback } from 'react'

export default function Flashcards() {
    const { courseId } = useParams();
    const [flashCards, setFlashCards] = useState([]);
    const [flippedStates, setFlippedStates] = useState({});
    const [stepCount, setStepCount] = useState(0);
    const router = useRouter();
    const [api, setApi] = useState(null);

    useEffect(() => {
        if (courseId) {
            GetFlashCards();
        }
    }, [courseId]);


    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            const selectedIndex = api.selectedScrollSnap();
            setStepCount(selectedIndex);
        };

        api.on("select", onSelect);

        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    useEffect(() => {
        if (!api) return;
        api.scrollTo(stepCount);
    }, [stepCount, api]);

    const GetFlashCards = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: 'Flashcard'
        });
        console.log("FLASH:", result.data);
        setFlashCards(result?.data);

        if (result?.data?.content) {
            const initialFlipStates = {};
            result.data.content.forEach((_, index) => {
                initialFlipStates[index] = false;
            });
            setFlippedStates(initialFlipStates);
        }
    };

    const handleFlip = (index) => {
        setFlippedStates(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handlePrevious = useCallback(() => {
        if (stepCount > 0) {
            setStepCount(stepCount - 1);
        }
    }, [stepCount]);

    const handleNext = useCallback(() => {
        if (flashCards?.content && stepCount < flashCards.content.length - 1) {
            setStepCount(stepCount + 1);
        } else if (flashCards?.content && stepCount === flashCards.content.length - 1) {
            setStepCount(flashCards.content.length);
        }
    }, [stepCount, flashCards]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden rounded-lg">
            {/* Video Background */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="https://videos.pexels.com/video-files/856953/856953-sd_960_506_25fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Content overlay with semi-transparent background */}
            <div className="relative z-10 min-h-screen w-full bg-black bg-opacity-50 py-8 px-4 flex flex-col">
                <div className="container mx-auto flex-1 flex flex-col">
                    <h2 className='font-bold text-4xl text-center gradient-title text-white'>FlashCards</h2>
                    <p className='text-primary font-bold text-center mt-4 mb-5'>Flashcards: The Ultimate Tool To Lock Concepts With In Your Memory!</p>

                    {/* Progress Bar */}
                    {flashCards?.content && (
                        <div className='flex gap-5 items-center mb-6 px-4 max-w-2xl mx-auto w-full'>
                            {stepCount !== 0 && (
                                <Button onClick={handlePrevious} variant="sex" size="sm">
                                    Previous
                                </Button>
                            )}
                            <div className="flex-1 flex gap-1">
                                {flashCards.content.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`flex-1 h-2 rounded-full
                                            ${index <= stepCount ? 'bg-primary' : 'bg-gray-200'}`} />
                                ))}
                            </div>
                            {stepCount < flashCards.content.length && (
                                <Button onClick={handleNext} variant="sex" size="sm">
                                    Next
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Flashcard Content - Carousel or End Screen */}
                    {flashCards?.content && flashCards.content.length > 0 && (
                        <div className="flex-1 flex items-center justify-center">
                            {stepCount < flashCards.content.length ? (
                                <div className='relative w-full flex items-center justify-center'>
                                    <div className="w-full max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] relative">
                                        <Carousel className="w-full flex items-center justify-center" setApi={setApi}>
                                            <CarouselContent className="items-center">
                                                {flashCards.content.map((flashcard, index) => (
                                                    <CarouselItem key={index} className="flex items-center justify-center py-6">
                                                        <FlashCardItem
                                                            handleClick={() => handleFlip(index)}
                                                            isFlipped={flippedStates[index] || false}
                                                            front={flashcard.front}
                                                            back={flashcard.back}
                                                        />
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                        </Carousel>

                                        {/* Navigation Buttons - Positioned relative to the container */}

                                        <div className="relative flex flex-col items-center">
                                            {/* Flashcard Container */}


                                            {/* Buttons Directly Below */}
                                            <div className="flex gap-16 mt-4">
                                                <Button
                                                    onClick={handlePrevious}
                                                    disabled={stepCount === 0}
                                                    className="bg-primary hover:bg-primary/90 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="m15 18-6-6 6-6" />
                                                    </svg>
                                                </Button>
                                                <Button
                                                    onClick={handleNext}
                                                    disabled={stepCount >= flashCards.content.length - 1}
                                                    className="bg-primary hover:bg-primary/90 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="m9 18 6-6-6-6" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </div>




                                    </div>
                                </div>
                            ) : (
                                <div className='flex items-center flex-col justify-center gap-4 p-6 w-full max-w-md mx-auto bg-white bg-opacity-80 rounded-lg'>
                                    <h2 className='text-purple-900 font-bold text-3xl'>END OF FLASHCARDS</h2>
                                    <Button onClick={() => router.back()} variant="sex1">
                                        Go To Course Page
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}