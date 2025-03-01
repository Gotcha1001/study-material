import React from 'react'
import { Button } from '@/components/ui/button'

import MotionWrapperDelay from '@/app/_components/FramerMotion/MotionWrapperDelay'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

function QuestionAnswerCard({ question, answer, category, showAnswer, onShowAnswer }) {
    return (
        <Card className="border border-primary bg-gradient-to-r from-indigo-900/30 via-black/50 to-purple-900/30">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-primary">Question:</CardTitle>
                    {category && (
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                            {category}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-white text-lg">{question}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
                {!showAnswer ? (
                    <div className="w-full flex justify-center mt-2">
                        <Button
                            onClick={onShowAnswer}
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
                            <p className="text-white text-lg">{answer}</p>
                        </div>
                    </MotionWrapperDelay>
                )}
            </CardFooter>
        </Card>
    )
}

export default QuestionAnswerCard