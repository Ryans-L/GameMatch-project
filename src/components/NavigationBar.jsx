import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
    return (
        <div className="mb-8  p-4 w-full bg-gray-700 flex items-center justify-between gap-6">
            <Link to ="/feed" className="text-white text-3xl font-bold">
                GameMatch
            </Link>

            <Link to="/posts" className="text-white">
                 Posts
            </Link>

            <Link to="/create-post" className="text-white">
                Create Post
            </Link>

            <Link to="/profile" className="text-white">
                Profile
            </Link>
        </div>
    );
};

export default NavigationBar;