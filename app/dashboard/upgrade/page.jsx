"use client";


import { CourseCountContext } from "@/app/_context/CourseCountContext";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";



function BuyCredits() {
    const creditsOption = [
        {
            credits: 10,
            amount: 29.99,
        },
        {
            credits: 25,
            amount: 44.99,
        },
        {
            credits: 50,
            amount: 89.99,
        },
        {
            credits: 100,
            amount: 149.99,
        },
    ];

    const [selectedOption, setSelectedOption] = useState(null);
    const { remainingCredits, refreshCredits } = useContext(CourseCountContext);
    const router = useRouter();
    const { user } = useUser()

    const initiatePayment = async () => {
        if (!selectedOption) {
            toast.error("Please select a credit package");
            return;
        }

        try {
            // Get the user's email from Clerk auth context
            const userEmail = user?.primaryEmailAddress?.emailAddress;

            if (!userEmail) {
                toast.error("Could not determine user email. Please try again.");
                return;
            }

            const response = await fetch("/api/create-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: selectedOption.amount,
                    credits: selectedOption.credits,
                    userEmail: userEmail,  // Use the email directly from Clerk
                    itemName: `${selectedOption.credits} AI Course Credits`,
                }),
            });

            if (!response.ok) {
                toast.error("Failed to initiate payment");
                return;
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Failed to initiate payment");
            }
        } catch (error) {
            toast.error("Error initiating payment");
            console.error(error);
        }
    };

    return (
        <div className="relative">
            <h2 className="font-bold text-4xl gradient-title text-center">
                Buy More Credits
            </h2>
            <p className="text-center mt-5 font-medium text-white text-s border border-indigo-500 gradient-background2 p-2 rounded-lg">
                Unlock Endless Possibilities: <br /> 1 Credit = 1 Course.<br /> Buy More
                Credits And Create Amazing AI Courses Today!
            </p>

            <div className="mt-5 text-center">
                <h3 className="font-medium text-xl text-teal-500">
                    Current Credits: <span className="font-bold text-green-500">{remainingCredits}</span>
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 mt-10">
                {creditsOption.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`flex flex-col gap-2 justify-center items-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-all ${selectedOption?.credits === item.credits
                                ? "border-indigo-600 bg-indigo-50"
                                : "border-gray-200"
                                }`}
                        >
                            <h2 className="font-bold text-3xl text-indigo-600">
                                {item.credits}
                            </h2>
                            <h2 className="font-medium text-xl">Credits</h2>
                            <Button
                                className="w-full mt-2"
                                onClick={() => setSelectedOption(item)}
                                variant={selectedOption?.credits === item.credits ? "default" : "outline"}
                            >
                                Select
                            </Button>
                            <h2 className="font-bold text-indigo-600 mt-2">R{item.amount}</h2>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 flex justify-center">
                {selectedOption?.amount && (
                    <Button
                        className="w-full md:w-1/2 lg:w-1/3 p-6 bg-green-600 hover:bg-green-700 text-white font-bold"
                        onClick={initiatePayment}
                    >
                        Pay with PayFast
                    </Button>
                )}
            </div>
        </div>
    );
}

export default BuyCredits;