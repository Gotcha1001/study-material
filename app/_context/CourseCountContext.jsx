import { createContext } from "react";

export const CourseCountContext = createContext({
    totalCourses: 0,
    setTotalCourses: () => { },
    remainingCredits: 10,
    setRemainingCredits: () => { },
    refreshCredits: () => { }
});