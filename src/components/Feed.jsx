import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

const Feed = () => {
    // Read current auth session + sign-out action from context
    const { session, signOutUser } = UserAuth();
    const navigate = useNavigate();

    // Sign user out, then return to landing page
    const handleSignOut = async (e) => {
        e.preventDefault()
        try {
            await signOutUser()
            navigate("/")
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <>
            {/* Shared top navigation */}
            <NavigationBar />
            
            <div className="text-center pt-100">
                {/* Main dashboard heading */}
                <h1 className="text-9xl flex gap-4 justify-center flex-wrap"> HOME PAGE </h1>

                {/* Show signed-in user's email if available */}
                <h2 className="mb-8"> Welcome, {session?.user?.email}!</h2>

                {/* Quick actions */}
                <div className="flex gap-4 justify-center flex-wrap">
                    <button
                        onClick={() => navigate("/create-post")}
                        className="m-2 p-3 border rounded-full cursor-pointer"
                    >
                        Create Post
                    </button>

                    <button
                        onClick={() => navigate("/posts")}
                        className="m-2 p-3 border rounded-full cursor-pointer"
                    >
                        View Posts
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                        className="m-2 p-3 border rounded-full cursor-pointer"
                    >
                        My Profile
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="m-2 p-3 border rounded-full cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    )
}

export default Feed;