import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../SupabaseClient";

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {    
    // undefined = loading initial auth state, null = signed out, object = signed in
    const [session, setSession] = useState(undefined);

    // Create auth user, then create/update profile row
    const signUpNewUser = async (email, password, username) => {
        const {data, error} = await supabase.auth.signUp({email, password});

        if(error) {
            console.error("Problem Signing up:", error);
            return { success: false, error: error.message};
        }
        
        const user = data?.user ?? data?.session?.user;

        // Save app-specific profile fields
        if (user) {
            const { error: profileError } = await supabase.from("profiles").upsert({
                id: user.id,
                email: user.email,
                username,
            });

            if (profileError) {
                console.error("Problem saving profile:", profileError);
                return { success: false, error: profileError.message };
            }
        }

        return {success: true, data};
    };

    // Sign in using email/password
    const signInUser = async (email, password) => {
        try{
            const {data, error} = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error("sign in error:", error)
                return {success: false, error: error.message };
            }
            return {success: true, data };
        } catch(error){
            console.error("there was an error:", error)
            return {success: false, error: "Unexpected sign in error."};
        }
    };

    // End current user session
    const signOutUser = async () => {
        const { error } = await supabase.auth.signOut();
        if(error) console.error("there was an error: ", error);
    };
    
    // Helper to fetch current signed-in user's profile
    const getCurrentProfile = async () => {
        const userId = session?.user?.id;
        if (!userId) return null;

        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
        if (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
        return data;
    };

    useEffect(() => {
        // Load current session once on app start
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

        // Keep session state in sync when auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        });

        return () => subscription.unsubscribe();
    },[]);

    return (
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOutUser, getCurrentProfile}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => useContext(AuthContext);