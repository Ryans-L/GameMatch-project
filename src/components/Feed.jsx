import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Feed = () => {
    const { session, signOutUser } = UserAuth();
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
        e.preventDefault()
        try {
            await signOutUser()
            navigate("/")
        } catch(error)
        {
            console.error(error);
        }
    }
    return (
        <div>
            <h1 className="pt-10 text-center text-[100px]">Feed</h1>
            <h2>
                Welcome, {session?.user?.email}
            </h2>
            <div>
                <button onClick={handleSignOut} className="m-6 p-3 hover:cursor-pointer border rounded-full ">
                    Sign Out
                </button>
            </div>
        </div>
    )
}

export default Feed;