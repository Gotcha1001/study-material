import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
import React from 'react'

function ChapterList({ course }) {

    const CHAPTERS = course?.courseLayout?.chapters

    return (
        <div className='mt-5'>
            <h2 className='font-medium text-3xl text-center gradient-title mb-5 '>Chapters</h2>
            <div className='mt-3'>
                {CHAPTERS?.map((chapter, index) => (
                    <FeatureMotionWrapper key={index} index={index}>
                        <div className='flex gap-5 items-center p-4 border border-teal-500 cursor-pointer  rounded-lg mb-2 '>
                            <h2 className='text-2xl'>{chapter?.emoji}</h2>
                            <div>
                                <h2 className='text-purple-400 font-bold text-xl'>{chapter?.chapterTitle}</h2>
                                <p className='text-white text-sm'>{chapter?.chapterSummary}</p>
                            </div>
                        </div>
                    </FeatureMotionWrapper>
                ))}
            </div>
        </div>
    )
}

export default ChapterList