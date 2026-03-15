import React, {useEffect, useState} from "react";
import { supabase } from "../SupabaseClient";
import NavigationBar from "./NavigationBar";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {

        setLoading(true);
        const {data, error } = await supabase.from("posts").select("*").order("created_at", {ascending: false});

        if (error) {
            setError("Error fetching posts: " + error.message);
        } 
        else {
            setPosts(data);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <>
        <NavigationBar />
        <div className="p-8">
            <h1 className="text- center text-4xl mb-8">Posts</h1>
            {loading && <p className="text-center"> Loading posts...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="max-w-2xl mx-auto space-y-4">
                {posts.map((post) => (
                        <div key={post.id} className="bg-white p-4 rounded shadow">
                            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                            <p className="text-gray-700 mb-4">{post.content}</p>
                            <p className="text-sm text-gray-500">By: {post.email} on {new Date(post.created_at).toLocaleString()}</p>
                        </div>
                ))}
                {!loading && posts.length === 0 && (<p className="text-center">No posts found.</p>)}
            </div>
        </div>
        </>
    );
};

export default Posts;