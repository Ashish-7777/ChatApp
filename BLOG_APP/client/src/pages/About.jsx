import React from "react";

function About(){
    return(
        <div class="min-h-screen flex items-center justify-center m-4">
            <div class="max-w-2xl mx-auto p-3 text-center">
                <div>
                    <h1 class="text-3xl font-semibold  text-center my-7">About My Blog</h1>
                    <div class="text-md text-gray-500 flex flex-col gap-6">
                        <p>Welcome to My Blog!</p>
                        <p>On this blog, you'll find weekly articles and tutorials on topics such as web development, software engineering, and programming languages. Sahand is always learning and exploring new technologies, so be sure to check back often for new content!</p>
                        <p>We encourage you to leave comments on our posts and engage with other readers. You can like other people's comments and reply to them as well. We believe that a community of learners can help each other grow and improve.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;