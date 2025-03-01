import FeatureMotionWrapper from "@/app/_components/FramerMotion/FeatureMotionWrapperMap";
import { Button } from "@/components/ui/button";
import { BiAtom } from "react-icons/bi";
import React, { useState } from "react";


function QuizCardItem({ quiz, userSelectedOption }) {
    const [selectedOption, setSelectedOption] = useState();

    // Early return if quiz is undefined
    if (!quiz) {
        return <div className="mt-10 p-5 flex justify-center text-center gap-5 items-center"><BiAtom className="animate-spin h-10 w-10 text-indigo-500" />Loading quiz...</div>;
    }

    return (
        <div className="mt-10 p-5">
            <h2 className="font-medium text-3xl gradient-title text-center">
                {quiz?.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols4 gap-4 mt-5">
                {quiz?.options && quiz.options.length > 0 ? (
                    quiz.options.map((option, index) => (
                        <FeatureMotionWrapper key={index} index={index}>
                            <h2
                                onClick={() => {
                                    setSelectedOption(option)
                                    userSelectedOption(option)
                                }}
                                className={`
                                    text-lg w-full border p-3 rounded-lg cursor-pointer 
                                    hover:text-indigo-700 hover:scale-105 transition-all text-center
                                    ${selectedOption === option
                                        ? "border-indigo-800 bg-gradient-to-r from-indigo-500 via-purple-600 to-black text-white"
                                        : "gradient-background2 text-white border-indigo-700"}`}>
                                {option}
                            </h2>
                        </FeatureMotionWrapper>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">No options available</div>
                )}
            </div>
        </div>
    );
}

export default QuizCardItem;