import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient";
import { UserAuth } from "../context/AuthContext";
import NavigationBar from "./NavigationBar";

const CreatePost = () => {
    const { session } = UserAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [ error, setError] = useState(null);
    const [ loading, setLoading] = useState(false);
    
    const handleSubmitPost = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            if (!session?.user)
            {
                setError("You must be logged in to create a post.");
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase.from("profiles").select("username, avatar_url").eq("id", session.user.id).single();

            const { error } = await supabase.from("posts").insert([
                {
                    user_id: session.user.id,
                    email: session.user.email,
                    username: profile?.username || null,
                    avatar_url: profile?.avatar_url || null,
                    title,
                    content,
                },
            ]);

            if (error) {
                setError("Error creating post: " + error.message);
                console.error("Error inserting post:", error);
            } 
            else {
                navigate("/posts");
            }
            } catch (error) {
                setError("An error occurred: " + error.message);
                console.error("error:", error);
            } finally {
                setLoading(false);
            }
};

    return (
        <>
        <NavigationBar />
        <div className="bg-purple-180 m-8 p-6 rounded-xl">
            <form onSubmit={handleSubmitPost} className="max-w-xl m-auto">
                <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
                <input type = "text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 mb-4 border rounded"/>
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 mb-4 border rounded h-40"/>
                <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
                    {loading ? "Creating..." : "Create Post"}
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
        </>
    );
};

export default CreatePost;

