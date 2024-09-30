import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Editor from "./Editor";

function CreatePost() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); 
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);

  async function createNewPost(ev) {
    ev.preventDefault();

    if (title.split(' ').length > 10 || title.length > 70) {
      setError('Title must be 10 words or less and less than 70 characters.');
      return;
    }
    if (summary.split(' ').length > 25 || summary.length > 250) {
      setError('Summary must be 25 words or less and less than 250 characters.');
      return;
    }

    setError(''); 
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    if (files[0]) {
      data.set('file', files[0]);
    }
    const res = await fetch('http://localhost:3500/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (res.ok) {
      setRedirect(true);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setFiles(e.target.files);

    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }

  if (redirect) {
    return <Navigate to={'/posts'} />;
  }

  return (
    <form className="m-4 space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto" onSubmit={createNewPost}>
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
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col items-center">
        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-center text-gray-700 bg-blue-100 hover:bg-blue-200">
            Choose Image
          </span>
        </label>
      </div>

      {imagePreview && (
        <div className="mt-4 flex justify-center">
          <img src={imagePreview} alt="Preview" className="w-full max-w-xs h-auto object-cover rounded-md shadow-md" />
        </div>
      )}

      <div className="border border-gray-300 rounded-md">
        <Editor onChange={setContent} value={content} />
      </div>
      <div className="flex justify-end">
        <button className="w-full px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Create Post
        </button>
      </div>
    </form>
  );
}

export default CreatePost;
