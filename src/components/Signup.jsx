import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import NavigationBar from "./NavigationBar";

const Signup = () => {
    // Controlled inputs + UI state
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // Use auth context sign-up function
    const { signUpNewUser } = UserAuth();
  
    // Submit sign-up form
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signUpNewUser(email, password, username);

            if (result.success) {
                // Successful signup -> go to feed
                navigate("/feed")
            } else {
                // Display API/auth error
                setError(result.error || "An error occurred during sign up.");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            setError("An unexpected error occurred during sign up.");
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <NavigationBar />

            <div className="bg-purple-100 m-8">
                <form name="signup" id="signup" onSubmit={handleSignUp} className="max-w-md m-auto pt-8">
                    <h2 className="text-black text-center">Sign up!</h2>

                    <div>
                        {/* Username input */}
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Username"
                            className="text-black bg-white p-2 mt-6 w-full"
                        />

                        {/* Email input */}
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="text-black bg-white p-2 mt-6 w-full"
                        />

                        {/* Password input */}
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            className="text-black bg-white p-2 mt-6 w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="border-2 rounded-full m-4 p-3 hover:bg-purple-600 hover:cursor-pointer w-full bg-white text-black"
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>

                    {/* Inline form error */}
                    {error && <p className="text-red-600 text-center pt-4">{error}</p>}
                </form>

                <p className="text-black text-center">
                    Already Have an account? <Link to="/signin" className="text-blue-800">Sign in</Link>
                </p>
            </div>
        </>
    )
}

export default Signup;
