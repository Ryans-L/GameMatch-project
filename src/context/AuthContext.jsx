import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../SupabaseClient";

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {    
    const [session, setSession] = useState(undefined)

    const signUpNewUser = async (email, password) => {
        const {data, error} = await supabase.auth.signUp({email: email, password: password, });

        if(error) {
        console.error("Problem Signing up:", error);
        return { success: false, error};
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
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {setSession(session)});

        supabase.auth.onAuthStateChange((_event, session) => {setSession(session)});
    },[]);

    const signOutUser = () => {
        const { error } = supabase.auth.signOut();
        if(error) {
            console.error("there was an error: ", error);
        }
    };

    return (
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOutUser}}>
            {children}
        </AuthContext.Provider>

    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
};