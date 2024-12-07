import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "./Editor";

function EditPost() {
    const { id } = useParams();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('This is a title with exactly eight words');
    const [summary, setSummary] = useState('This summary consists of twenty-five words and provides a concise overview of the content within the post.');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:3500/post/' + id)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(postInfo => {
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
                setImagePreview('http://localhost:3500/' + postInfo.cover);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

    useEffect(() => {
        if (error) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [error]);

    async function updatePost(ev) {
        ev.preventDefault();
        setError('');

        if (title.split(' ').length > 10 || title.length > 70) {
            setError('Title must be 10 words or less and less than 70 characters.');
            return;
        }
        if (summary.split(' ').length > 25 || summary.length > 250) {
            setError('Summary must be 25 words or less and less than 250 characters.');
            return;
        }

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files[0]);
        }
        const res = await fetch('http://localhost:3500/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (res.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/posts'} />;
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFiles(e.target.files);
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md" onSubmit={updatePost}>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <input
                    type="text"
                    placeholder="Title (max 10 words)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Summary (max 25 words)"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative group">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Selected"
                                className="w-full h-48 object-cover rounded-md border border-gray-300 transition duration-200 ease-in-out group-hover:blur-sm"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                                Choose Image
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-48 flex items-center justify-center border border-gray-300 rounded-md">
                            <span className="text-gray-500">Click to select an image</span>
                        </div>
                    )}
                </div>
                <div className="border border-gray-300 rounded-md">
                    <Editor onChange={setContent} value={content} />
                </div>
                <button className="w-full px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Update Post
                </button>
            </form>
        </div>
    );
}

export default EditPost;
