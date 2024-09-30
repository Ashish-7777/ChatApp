import React, { useEffect, useState } from "react";
import Post from "../components/Post";

function Posts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3500/post')
            .then(res => res.json())
            .then(posts => {
                setPosts(posts);
            });
    }, []);


    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post key={post._id} {...post} />
            ))}
        </>
    );
}

export default Posts;

