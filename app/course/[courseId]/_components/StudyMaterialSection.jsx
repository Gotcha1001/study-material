import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap'
import React, { useEffect, useState } from 'react'
import MaterialCardItem from './MaterialCardItem'
import axios from 'axios'
import Link from 'next/link'

function StudyMaterialSection({ courseId, course }) {

    const [studyTypeContent, setStudyTypeContent] = useState()

    const MaterialList = [
        {
            name: 'Notes/Chapters',
            desc: 'Read Notes To Prepare For It',
            icon: '/notes1.png',
            path: '/notes',
            type: 'notes'
        },
        {
            name: 'Flashcard',
            desc: 'Flashcard Helps To Remember The Concepts',
            icon: '/flashcards.png',
            path: '/flashcards',
            type: 'flashcard'
        },
        {
            name: 'Quiz',
            desc: 'Great Way To Test Your Knowledge',
            icon: '/quiz1.png',
            path: '/quiz',
            type: 'quiz'
        },
        {
            name: 'Question/Answer',
            desc: 'Help To Practice Your Learning',
            icon: '/qa1.png',
            path: '/qa',
            type: 'QuestionsAnswers'
        }
    ]

    useEffect(() => {
        GetStudyMaterial()
    }, [])

    const GetStudyMaterial = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: 'ALL'
        })
        console.log("STUDY:", result?.data)
        setStudyTypeContent(result.data)
    }

    return (
        <div className='mt-5'>
            <h2 className='font-medium text-3xl text-center gradient-title mb-5'>Study Material</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4'>
                {MaterialList.map((item, index) => (
                    <FeatureMotionWrapper key={index} index={index}>
                        <div>
                            {/* <Link href={'/course/' + courseId + item.path}> */}
                            <MaterialCardItem
                                item={item}
                                studyTypeContent={studyTypeContent}
                                course={course}
                                refreshData={GetStudyMaterial}
                            />
                            {/* </Link> */}

                        </div>
                    </FeatureMotionWrapper>
                ))}
            </div>
        </div>
    )
}

export default StudyMaterialSection