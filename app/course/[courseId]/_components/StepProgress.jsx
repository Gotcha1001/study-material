import { Button } from '@/components/ui/button';
import React from 'react';

function StepProgress({ stepCount, setStepCount, data }) {
    return (
        <div className='flex gap-5 items-center'>
            {stepCount > 0 && (
                <Button variant="sex1" size="sm" onClick={() => setStepCount(stepCount - 1)}>
                    Previous
                </Button>
            )}

            <div className="flex-1 flex gap-1">
                {data?.map((_, index) => (
                    <div
                        key={index}
                        className={`flex-1 h-2 rounded-full
                            ${index <= stepCount ? 'bg-primary' : 'bg-gray-200'}`}
                    />
                ))}
            </div>

            {stepCount < data?.length - 1 && (
                <Button variant="sex1" size="sm" onClick={() => setStepCount(stepCount + 1)}>
                    Next
                </Button>
            )}
        </div>
    );
}

export default StepProgress;
