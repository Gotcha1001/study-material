import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FlashCardItem({ isFlipped, handleClick, front, back }) {
    // Card flip animation variants with slower timing
    const cardVariants = {
        front: {
            rotateY: 0,
            transition: {
                duration: 1.2,
                ease: [0.4, 0.0, 0.2, 1]
            }
        },
        back: {
            rotateY: 180,
            transition: {
                duration: 1.2,
                ease: [0.4, 0.0, 0.2, 1]
            }
        }
    };

    // Content fade animation variants
    const contentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.4,
                duration: 0.8
            }
        }
    };

    // Hover animation
    const hoverAnimation = {
        scale: 1.02,
        boxShadow: "0px 0px 15px rgba(0, 255, 255, 0.7)",
        rotateY: isFlipped ? 175 : 5,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20
        }
    };

    return (
        <div className="perspective-1000 w-[90vw] max-w-[500px] h-[60vh] max-h-[600px] cursor-pointer">
            {/* This wrapper div hides overflow */}
            <div className="w-full h-full rounded-xl overflow-hidden">
                <motion.div
                    className="relative w-full h-full preserve-3d"
                    animate={isFlipped ? "back" : "front"}
                    variants={cardVariants}
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={handleClick}
                    whileHover={hoverAnimation}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Front side */}
                    <motion.div
                        className="absolute w-full h-full backface-hidden rounded-xl gradient-background2 flex flex-col items-center justify-center p-8 shadow-neon"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <AnimatePresence>
                            {!isFlipped && (
                                <motion.div
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="text-white text-center w-full"
                                >
                                    <motion.h2
                                        className="text-2xl sm:text-3xl font-bold mb-6"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        {front || "Question Front Side"}
                                    </motion.h2>

                                    <motion.div
                                        className="text-sm sm:text-base opacity-80 mt-12"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.8 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Tap to reveal answer
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Back side */}
                    <motion.div
                        className="absolute w-full h-full backface-hidden rounded-xl gradient-background6 flex flex-col items-center justify-center p-8 shadow-teal"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)"
                        }}
                    >
                        <AnimatePresence>
                            {isFlipped && (
                                <motion.div
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="text-white text-center w-full"
                                >
                                    <motion.h2
                                        className="text-2xl sm:text-3xl font-bold mb-6"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        {back || "Answer Back Side"}
                                    </motion.h2>

                                    <motion.div
                                        className="text-sm sm:text-base opacity-80 mt-12"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.8 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Tap to see question
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default FlashCardItem;