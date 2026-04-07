import React, { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { UserAuth } from "../context/AuthContext";
import NavigationBar from "./NavigationBar";

const Profile = () => {
    const { session } = UserAuth();
    
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [currentAvatarPath, setCurrentAvatarPath] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const getAvatarPublicUrl = (path) => {
        if (!path) return "";
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        return data.publicUrl;
    };

    useEffect (() => {
        const loadProfile = async () => {
            if (!session?.user) return;
        
            const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();

            if (!error && data) {
            setUsername(data.username || "");
            setBio(data.bio || "");
            setCurrentAvatarPath(data.avatar_url || "");

                if (data.avatar_url) {
                    setAvatarUrl(getAvatarPublicUrl(data.avatar_url));
                }
            }

            setLoading(false);
        };
        loadProfile();
        }, [session]);

    const uploadAvatar = async () => {
        if (!avatarFile || !session?.user?.id) return currentAvatarPath;

        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `${session.user.id}/avatar-${Date.now()}.${fileExt}`;
        const {error} = await supabase.storage.from("avatars").upload(filePath, avatarFile, {upsert: true});

        if (error) {
            throw error;
        }
        return filePath;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const avatarPath = await uploadAvatar();

            const { error } = await supabase.from("profiles").update({
               email: session.user.email,
               username,
               bio,
                avatar_url: avatarPath
            }).eq("id", session.user.id);

            if (error) {
                throw error;
            }

            setCurrentAvatarPath(avatarPath);
            if (avatarPath) {
                setAvatarUrl(getAvatarPublicUrl(avatarPath));
            }
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Error updating profile: " + error.message || "Could not update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-center p-6">Loading...</p>;

    return (
        <>
        <NavigationBar />
        <div className="max-w-xl m-auto p-6 bg-white text-black rounded-xl">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>

            <div className="mb-4">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover mb-4"/>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                        No Avatar
                    </div>
                )}
                <form onSubmit={handleSave} className="space-y-4">
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full p-2 border rounded"/>

                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" className="w-full p-2 border rounded h-24"/>

                    <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0] || null)} className="w-full flex cursor-pointer"/>

                    <button type="submit" disabled={saving} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
                        {saving ? "Saving..." : "Save Profile"}
                    </button>

                    {message && <p className="text-green-500 mt-4">{message}</p>}
                </form>
            </div>
        </div>
        </>
    );
}

export default Profile;

