import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";


const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const navigate = useNavigate();
    const { session, signUpNewUser } = UserAuth();
  
  
    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const result = await signUpNewUser(email, password)

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
            <form name="signup" id="signup" onSubmit={handleSignUp} className="max-w-md m-auto pt-8">
                <h2 className="text-black text-center">
                    Sign up!
                </h2>
                <div>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="text-black bg-white p-2 mt-6 w-full"/>
                    <input onChange={(e) => setPassword(e.target.value)}  type="password" placeholder="Password" className="text-black bg-white p-2 mt-6 w-full"/>
                </div>
                <button type="submit" disabled={loading} className="border-2 rounded-full m-4 p-3 hover:bg-purple-600 hover:cursor-pointer w-full bg-white text-black">Sign Up</button>
                {error && <p className="text-red-600 text-center pt-4">{error}</p>}
            </form>
            <p className="text-black text-center">
                    Already Have an account? <Link to="/signin" className="text-blue-800">Sign in</Link>
            </p>
        </div>
    )
}

export default Signup;
