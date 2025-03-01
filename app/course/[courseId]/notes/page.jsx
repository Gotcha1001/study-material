"use client"

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { Volume2, Square } from 'lucide-react'

function ViewNotes() {
    const { courseId } = useParams()
    const [notes, setNotes] = useState()
    const [stepCount, setStepCount] = useState(0)
    const [isReading, setIsReading] = useState(false)
    const speechSynthesisRef = useRef(null)

    const router = useRouter()

    useEffect(() => {
        GetNotes()

        // Clean up any speech synthesis when component unmounts
        return () => {
            stopReading()
        }
    }, [])

    // Stop reading when switching notes
    useEffect(() => {
        stopReading()
    }, [stepCount])

    const GetNotes = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: 'notes'
        })

        console.log("NOTES:", result?.data)
        setNotes(result?.data)
    }

    const startReading = () => {
        if (!notes || !notes[stepCount]) return

        // First stop any ongoing speech
        stopReading()

        // Get clean text from HTML (removing HTML tags)
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = notes[stepCount]?.notes || ''
        const cleanText = tempDiv.textContent || tempDiv.innerText || ''

        // Initialize speech synthesis
        const utterance = new SpeechSynthesisUtterance(cleanText)

        // Store the utterance in ref for later cancellation
        speechSynthesisRef.current = utterance

        // Set up speech properties
        utterance.rate = 1.0
        utterance.pitch = 1.0

        // Event handlers
        utterance.onstart = () => setIsReading(true)
        utterance.onend = () => setIsReading(false)
        utterance.onerror = () => setIsReading(false)

        // Start speaking
        window.speechSynthesis.speak(utterance)
    }

    const stopReading = () => {
        window.speechSynthesis.cancel()
        setIsReading(false)
    }


    return notes && (
        <div>
            <div className='flex gap-5 items-center'>
                {stepCount != 0 && <Button
                    onClick={() => setStepCount(stepCount - 1)}
                    variant="sex" size="sm">Previous</Button>}
                {notes?.map((item, index) => (
                    <div key={index} className={`w-full h-2 rounded-full
                            ${index < stepCount ? 'bg-primary' : 'bg-gray-200'}
                            `}>
                    </div>
                ))}
                <Button
                    onClick={() => setStepCount(stepCount + 1)}
                    variant="sex" size="sm">Next</Button>
            </div>

            <div className='mt-5 flex justify-end'>
                {isReading ? (
                    <Button
                        onClick={stopReading}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Square size={16} />
                        Stop Reading
                    </Button>
                ) : (
                    <Button
                        onClick={startReading}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Volume2 size={16} />
                        Read Aloud
                    </Button>
                )}
            </div>

            <div className='mt-5 bg-gradient-to-r from-white via-indigo-700 to-teal-300 rounded-lg p-2'>
                <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: (notes[stepCount]?.notes)?.replace('```html', ' ').replace('```', ' ') }} />
                {notes?.length == stepCount &&
                    <div className='flex items-center flex-col justify-center gap-4 p-4'>
                        <h2 className='text-purple-900 font-bold text-3xl'>END OF NOTES</h2>
                        <Button
                            onClick={() => router.back()}
                            variant="sex1">Go To Course Page</Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default ViewNotes