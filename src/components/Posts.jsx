import React, {useEffect, useState} from "react";
import { supabase } from "../SupabaseClient";
import NavigationBar from "./NavigationBar";
import { UserAuth } from "../context/AuthContext";

const Posts = () => {
    const { session } = UserAuth();

    const [posts, setPosts] = useState([]);
    const [commentInput, setCommentInput] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAvatarPublicUrl = (path) => {
        if (!path) return "";
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        return data.publicUrl;
    };

    const fetchPosts = async () => {

        setLoading(true);
        setError(null);
        const {data, error } = await supabase.from("posts")
            .select(`*,likes (id),comments (id,content,created_at,user_id,profiles (username,avatar_url))`).order("created_at", { ascending: false });
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

    const hasLikedPost = (post) => {
    return post.likes?.some((like) => like.user_id === session?.user?.id);
  };

  const handleToggleLike = async (post) => {
    if (!session?.user) {
      setError("You must be logged in to like a post.");
      return;
    }

    const alreadyLiked = post.likes?.some(
      (like) => like.user_id === session.user.id
    );

    if (alreadyLiked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", session.user.id);

      if (error) {
        setError("Error removing like: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert([
          {
            post_id: post.id,
            user_id: session.user.id,
          },
        ]);

      if (error) {
        setError("Error liking post: " + error.message);
        return;
      }
    }

    fetchPosts();
  };

  const handleAddComment = async (post) => {
    if (!session?.user) {
      setError("You must be logged in to comment.");
      return;
    }

    const content = (commentInput[post.id] || "").trim();

    if (!content) {
      setError("Comment cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("comments")
      .insert([
        {
          post_id: post.id,
          user_id: session.user.id,
          content,
        },
      ]);

    if (error) {
      setError("Error adding comment: " + error.message);
      return;
    }

    setCommentInput((prev) => ({
      ...prev,
      [post.id]: "",
    }));

    fetchPosts();
  };

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
                            <div className="flex items-center gap-3 mb-3"> 
                                {post.avatar_url ? 
                                (
                                    <img src={getAvatarPublicUrl(post.avatar_url)} alt="avatar" className="w-10 h-10 rounded-full object-cover"/>
                                ) : 
                                (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        No Avatar
                                    </div>
                                )} 
                            </div>
                            <h2 className="text-black text-2xl font-bold mb-2">{post.title}</h2>
                            <p className="text-gray-700 mb-4">{post.content}</p>
                            <p className="text-sm text-gray-500">By: {post.username || post.email} on {new Date(post.created_at).toLocaleString()}</p>
                            <div className="flex items-center gap-4 mb-4">
                                <button onClick={() => handleToggleLike(post)} className="px-3 py-2 border rounded text-gray-500"> Like </button>
                                <span className="text-gray-500">{post.likes?.length || 0} ❤️</span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <h3 className="font-semibold text-gray-500">Comments</h3>

                                {post.comments?.length > 0 ? (post.comments.map((comment) => {
                                    const avatarPath = comment.profiles?.avatar_url;
                                    const avatarUrl = avatarPath ? getAvatarPublicUrl(avatarPath) : "";
                                    return (
                                        <div key={comment.id} className="bg-gray-100 p-3 rounded flex gap-3">
                                         {avatarUrl ? (<img src={avatarUrl} alt="comment avatar" className="w-10 h-10 rounded-full object-cover"/>) : 
                                         ( <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs"> No Avatar  </div> )}
                                        <div>
                                            <p className="font-semibold text-gray-500"> {comment.profiles?.username || "User"} </p>
                                            <p className="text-gray-500">{comment.content}</p>
                                            <p className="text-xs text-gray-500"> {new Date(comment.created_at).toLocaleString()} </p>
                                            </div>
                                        </div>
                                    );})) : ( <p className="text-sm text-gray-500">No comments yet.</p>)}
                            </div>

                            <div className="flex gap-2">
                            <input type="text" placeholder="Write a comment..." value={commentInput[post.id] || ""} onChange={(e) => setCommentInput((prev) => ({...prev,[post.id]: e.target.value,}))}className="flex-1 border p-2 rounded text-gray-500" />
                            <button onClick={() => handleAddComment(post)} className="px-3 py-2 border rounded"> Post </button>
                            </div>
                        </div> ))}
                        {!loading && posts.length === 0 && (<p className="text-center">No posts found.</p>)}
            </div>
        </div>
    </>
);
};

export default Posts;