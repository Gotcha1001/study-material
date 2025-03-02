"use client"
import React, { useState } from 'react';
import { ShareSocial } from 'react-share-social';

const ShareButton = ({ url, title, description }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);

    // Function to copy URL to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(url)
            .then(() => {
                alert('URL copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy URL: ', err);
            });
    };

    return (
        <div className="my-4">
            <div className="flex gap-2">
                <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                </button>

                <button
                    onClick={copyToClipboard}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Link
                </button>
            </div>

            {showShareOptions && (
                <div className="mt-4 p-4 border rounded-md">
                    <ShareSocial
                        url={url}
                        title={title}
                        socialTypes={['facebook', 'twitter', 'reddit', 'linkedin', 'whatsapp', 'telegram']}
                        style={{
                            root: {
                                background: 'transparent',
                                padding: '0',
                                border: 'none'
                            },
                            copyContainer: {
                                display: 'none' // Hide built-in copy button since we have our own
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ShareButton;