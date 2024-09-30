import React, { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import { UserContext } from "./UserContext";

function UserPosts() {
    const [posts, setPosts] = useState([]);
    const {userInfo} = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:3500/post')
            .then(res => res.json())
            .then(posts => {
                setPosts(posts);
            });
    }, []);

    return (
        <>
            {posts.length > 0 && posts.map(post => {
                if(post.author.username === userInfo?.username){
                    return <Post key={post._id} {...post} />
                }
                return null;
            }
            )}
        </>
    );
}

export default UserPosts;