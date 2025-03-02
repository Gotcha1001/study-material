"use client"
import { useEffect, useState, useContext } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import FeatureMotionWrapper from '@/app/_components/FramerMotion/FeatureMotionWrapperMap';
import CourseCardItem from './CourseCardItem';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { CourseCountContext } from '@/app/_context/CourseCountContext';

function CourseList() {
    const { setTotalCourses, refreshCredits } = useContext(CourseCountContext);
    const { user } = useUser();
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 9;

    useEffect(() => {
        user && GetCourseList();
    }, [user]);

    const GetCourseList = async () => {
        setLoading(true);

        const result = await axios.post('/api/courses', {
            createdBy: user?.primaryEmailAddress.emailAddress
        });

        console.log("☘️:", result);
        setCourseList(result.data.result);
        setTotalCourses(result.data.result.length);
        refreshCredits();
        setLoading(false);
    };

    const getPaginatedCourses = (courses, pageIndex) => {
        const start = pageIndex * pageSize;
        return courses.slice(start, start + pageSize);
    };

    const handlePageChange = (newIndex) => {
        setPageIndex(newIndex);
        window.scrollTo(0, 0); // Scroll to the top of the page when page changes
    };

    const paginatedCourses = getPaginatedCourses(courseList, pageIndex);

    return (
        <div className='mt-10'>
            <h2 className='font-bold gradient-title text-3xl mb-5 flex items-center'>
                <div className="flex-grow text-center">Your Study Material</div>
                <Button
                    onClick={GetCourseList}
                    variant="sex1"
                    className="border-primary text-primary"
                >
                    <RefreshCcw size={16} />
                </Button>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2'>
                {loading == false ? paginatedCourses?.map((course, index) => (
                    <FeatureMotionWrapper key={index} index={index}>
                        <div>
                            <CourseCardItem course={course} />
                        </div>
                    </FeatureMotionWrapper>
                ))
                    : [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <FeatureMotionWrapper key={index} index={index}>
                            <div className='h-56 w-full bg-slate-200 rounded-lg animate-pulse'></div>
                        </FeatureMotionWrapper>
                    ))
                }
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-5">
                <Button variant="sex1"
                    disabled={pageIndex === 0}
                    onClick={() => handlePageChange(pageIndex - 1)}
                >
                    Previous
                </Button>
                <Button variant="sex1"
                    disabled={(pageIndex + 1) * pageSize >= courseList.length}
                    onClick={() => handlePageChange(pageIndex + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default CourseList;
