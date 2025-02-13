import React from "react";

const MainContent = () => {
    return (
        <main className="flex-grow w-full">
            <div className="flex flex-col items-center justify-center min-h-screen w-full relative bg-cover bg-center bg-no-repeat -mt-16"
                style={{
                    backgroundImage: `
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),
                        url('/images/background.jpg')
                    `
                }}>
                <h1 className="text-4xl font-bold text-white mb-4">
                    Connect With Anyone, Anywhere
                </h1>
                <p className="text-xl text-white text-center max-w-2xl mb-8 px-6">
                    High quality video calls made simple. Join meetings, host virtual events,
                    and stay connected with crystal-clear video and audio.
                </p>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg">
                    Start Video Call
                </button>
            </div>
        </main>
    );
};

export default MainContent;