import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient";
import { UserAuth } from "../context/AuthContext";
import NavigationBar from "./NavigationBar";

const CreatePost = () => {
    const { session } = UserAuth();
    const navigate = useNavigate();

    // Local form + request state
    const [consoleType, setConsoleType] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const uploadPostImage = async () => {
        if (!imageFile || !session?.user) return null;

        const fileExt = imageFile.name.split(".").pop();
        const filePath = `${session.user.id}/post-${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage.from("post-images").upload(filePath, imageFile);

        if (error) throw error;

        return filePath;
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            // only signed-in users can create posts
            if (!session?.user) {
                setError("You must be logged in to create a post.");
                setLoading(false);
                return;
            }

            // Pull username/avatar from profiles table for denormalized post display
            const { data: profile } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("id", session.user.id)
                .single();

            // Insert new post row
            const imagePath = await uploadPostImage();
            const { error } = await supabase.from("posts").insert([
                {
                    user_id: session.user.id,
                    email: session.user.email,
                    username: profile?.username || null,
                    avatar_url: profile?.avatar_url || null,
                    title,
                    content,
                    console: consoleType || null,
                    image_url: imagePath || null,
                },
            ]);

            if (error) {
                setError("Error creating post: " + error.message);
            } else {
                // Navigate to feed of posts after successful creation
                navigate("/posts");
            }
        } catch (error) {
            setError("An error occurred: " + error.message);
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
                <select value={consoleType} onChange={(e) => setConsoleType(e.target.value)} className=" text-gray-500 w-full p-2 mb-4 border rounded">
                    <option value="">Select Console Type</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Nintendo">Nintendo</option>
                    <option value="PC">PC</option>
                    <option value="Other">Other</option>
                </select>
                <input type = "text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 mb-4 border rounded"/>
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 mb-4 border rounded h-40"/>
                {/* Optional image upload for post */}
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
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

