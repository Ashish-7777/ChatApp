import { formatISO9075 } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "./UserContext";

function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:3500/post/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(postInfo => {
                setPostInfo(postInfo);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

    if (!postInfo) return null;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h1 className="text-3xl font-bold mb-4 text-center">{postInfo.title}</h1>
            <time className="text-gray-500 text-sm text-center block">{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="text-gray-600 text-sm text-center mb-4">by @{postInfo.author.username}</div>
            {userInfo.id === postInfo.author._id && (
                <div className="mb-4 text-center">
                    <Link 
                        to={`/edit/${postInfo._id}`} 
                        className="flex items-center justify-center text-blue-600 rounded-md px-1 py-1 transition duration-200 hover:bg-blue-600 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit Post
                    </Link>
                </div>
            )}
            <div className="mb-4">
                <img src={`http://localhost:3500/${postInfo.cover}`} alt={postInfo.title} className="w-full h-60 object-cover rounded-md shadow-md" />
            </div>
            <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
    );
}

export default PostPage;
