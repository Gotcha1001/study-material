import React, { useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



function TopicInput({ setTopic, setDifficultyLevel, defaultTopic, defaultDifficulty }) {

    const [topic, setLocalTopic] = useState(defaultTopic || "")
    const [difficult, setLocalDifficulty] = useState(defaultDifficulty || "")

    useEffect(() => {
        setLocalTopic(defaultTopic)
        setDifficultyLevel(defaultDifficulty)
    }, [defaultTopic, defaultDifficulty])



    return (
        <div className='mt-10 w-full flex flex-col'>
            <h2 className='text-purple-500'>Enter The Topic Or Paste The Content For Which You Want To Generate Study Material </h2>
            <Textarea
                value={topic}

                onChange={(event) => {
                    setTopic(event.target.value)
                    setLocalTopic(event.target.value)
                }}
                placeholder="Start Writing Here..." className="mt-3" />
            <h2 className='mt-5 mb-3 text-purple-500'>Select The Difficulty Level</h2>
            <Select
                value={difficult}
                onValueChange={(value) => {
                    setDifficultyLevel(value)
                    setLocalDifficulty(value)
                }}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
            </Select>

        </div>
    )
}

export default TopicInput