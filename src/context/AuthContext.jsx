import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../SupabaseClient";

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {    
    const [session, setSession] = useState(undefined);

    const signUpNewUser = async (email, password, username) => {
        const {data, error} = await supabase.auth.signUp({email: email, password: password, });

        if(error) {
        console.error("Problem Signing up:", error);
        return { success: false, error: error.message};
        }
        
        const user = data?.user ?? data?.session?.user;

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

    const signInUser = async (email, password) => {
        try{
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                console.error("sign in error:", error)
                return {success: false, error: error.message };
            }
            console.log("Sign in success:", data)
            return {success: true, data };
        } catch(error){
                console.error("there was an error:", error)
        }
    };

    const signOutUser = async () => {
        const { error } = await supabase.auth.signOut();
        if(error) {
            console.error("there was an error: ", error);
        }
    };
    
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
        supabase.auth.getSession().then(({ data: { session } }) => {setSession(session)});

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {setSession(session)});
        return () => subscription.unsubscribe();
    },[]);

   

    return (
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOutUser, getCurrentProfile,}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};