"use client";
import MotionWrapperDelay from "@/app/_components/FramerMotion/MotionWrapperDelay";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import { GiSpellBook } from "react-icons/gi";

function WelcomeBanner() {
    const { user } = useUser();

    return (

        <MotionWrapperDelay
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            variants={{
                hidden: { opacity: 0, y: -100 },
                visible: { opacity: 1, y: 0 },
            }}
        >
            <div className="p-5 gradient-background2 w-full text-indigo-500 rounded-lg flex flex-col items-center text-center md:flex-row md:items-center md:justify-between">
                {/* Left: Image */}
                <div className="flex-shrink-0">
                    <Image
                        src={"/laptop.png"}
                        alt="laptop"
                        height={200}
                        width={200}
                        className="w-40 h-32 md:w-[300px] md:h-[200px]"
                    />
                </div>

                {/* Center: Text (Always Centered) */}
                <div className="flex-1 text-center">
                    <h2 className="font-bold text-3xl md:text-5xl gradient-title">
                        Welcome {user?.fullName}
                    </h2>
                    <p className="mt-2 md:mt-2">
                        Welcome back, it's time to start learning new courses!
                    </p>
                </div>

                {/* Right: Icon */}
                <div className="flex-shrink-0 mt-4 md:mt-0">
                    <GiSpellBook className="text-6xl md:text-9xl text-indigo-800" />
                </div>
            </div>
        </MotionWrapperDelay>
    );
}

export default WelcomeBanner;
