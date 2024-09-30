import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function Post({ _id, title, summary, cover, createdAt, author }) {
    return (
        <div className="flex border rounded-lg shadow-md overflow-hidden m-4 bg-white max-w-2xl mx-auto"> 
            <Link to={`/post/${_id}`} className="flex w-full h-full">
                <div className="flex-shrink-0 w-1/3">
                    <img
                        src={'http://localhost:3500/' + cover}
                        alt={title}
                        className="w-full h-full object-cover" 
                        style={{ maxHeight: '192px' }}
                    />
                </div>
                <div className="w-2/3 p-6 flex flex-col justify-between"> 
                    <div>
                        <h2 className="text-2xl font-semibold hover:underline">{title}</h2> 
                        <p className="text-gray-600 text-sm mt-1"> 
                            <span className="font-medium">{author.username}</span>
                            <time className="ml-2 text-gray-500">{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
                        </p>
                        <p className="text-gray-700 mt-2 text-base">{summary}</p> 
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default Post;
