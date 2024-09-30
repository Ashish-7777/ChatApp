import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";

function Home(){

    const {userInfo} = useContext(UserContext);

    return(
        <div class="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto m-4">
            <h1 class="font-bold text-3xl lg:text-6xl">Welcome to my Blog</h1>
            <div class="text-gray-500 text-xs sm:text-sm">Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.</div>
            {userInfo?.username ?
            (<Link to={'/posts'} class="text-xs sm:text-sm text-red-400 font-bold hover:underline">View all posts</Link>):
            <Link to={'/signUp'} class="text-xs sm:text-sm text-red-400 font-bold hover:underline">View all posts</Link>}
            
        </div>
    );
};

export default Home;