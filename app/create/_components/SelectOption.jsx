import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function SelectOption({ selectedStudyType, defaultSelected }) {


    const Options = [
        {
            name: 'Exam',
            icon: '/exam_1.png'
        },
        {
            name: 'Job Interview',
            icon: '/job.png'
        },
        {
            name: 'Practice',
            icon: '/practice.png'
        },
        {
            name: 'Coding Prep',
            icon: '/code.png'
        },
        {
            name: 'Other',
            icon: '/knowledge.jpg'
        },

    ]

    const [selectedOption, setSelectedOption] = useState(defaultSelected || '')

    useEffect(() => {
        setSelectedOption(defaultSelected)
    }, [defaultSelected])

    return (
        <div className='text-center mb-2 text-lg text-purple-700'>
            <h2>For Your Personal Choice, Create Your Study Material</h2>
            <div className='grid grid-cols-1 mt-5 md:grid-cols-3 lg:grid-cols-5 gap-5'>
                {Options.map((option, index) => (
                    <FeatureMotionWrapper key={index} index={index}>
                        <div
                            onClick={() => { setSelectedOption(option.name); selectedStudyType(option.name) }}
                            className={`p-4 flex flex-col items-center justify-center border rounded-xl mt-3 cursor-pointer hover:scale-105 transition-all 
                            hover:border-purple-900 
                            ${option.name === selectedOption
                                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 via-purple-900 to-black text-white'
                                    : 'border-teal-500 gradient-background2'
                                }`}
                        >
                            <Image src={option.icon} alt='Icon' height={50} width={50} />
                            <h2 className='text-sm'>{option.name}</h2>
                        </div>


                    </FeatureMotionWrapper>
                ))}
            </div>
        </div>
    )
}

export default SelectOption