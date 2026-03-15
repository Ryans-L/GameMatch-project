import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";


const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const navigate = useNavigate();
    const { session, signInUser } = UserAuth();
    
  
    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const result = await signInUser(email, password)

            if(result.success){
                navigate("/feed")
            } 
        } catch(err){
            setError("an error occured")
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="bg-purple-100 m-8">
            <form name="SignIn" id="SignIn" onSubmit={handleSignIn} className="max-w-md m-auto pt-8">
                <h2 className="text-black text-center">
                    Log In
                </h2>
                <div>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="text-black bg-white p-2 mt-6 w-full"/>
                    <input onChange={(e) => setPassword(e.target.value)}  type="password" placeholder="Password" className="text-black bg-white p-2 mt-6 w-full"/>
                </div>
                <button type="submit" disabled={loading} className="border-2 rounded-full m-4 p-3 hover:bg-purple-600 hover:cursor-pointer w-full bg-white text-black">Sign In</button>
                {error && <p className="text-red-600 text-center pt-4">{error}</p>}
            </form>
            <p className="text-black text-center">
                    Don't Have an Account? <Link to="/signup" className="text-blue-800">Create Account</Link>
            </p>
        </div>
    )
}

export default SignIn;
