import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import NavigationBar from "./NavigationBar";

const SignIn = () => {
    // Controlled inputs + UI state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // Use auth context sign-in function
    const { signInUser } = UserAuth();
    
    // Submit sign-in form
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signInUser(email, password)

            if (result?.success) {
                // Successful login -> go to feed
                navigate("/feed")
            } else {
                // Display API/auth error
                setError(result?.error || "Failed to sign in")
            }
        } catch (error) {
            console.error("Sign in error:", error);
            setError("An unexpected error occurred during sign in.");
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <NavigationBar/>
            <div className="bg-purple-100 m-8">
                <form name="SignIn" id="SignIn" onSubmit={handleSignIn} className="max-w-md m-auto pt-8">
                    <h2 className="text-black text-center">Log In</h2>

                    <div>
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
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                    {/* Inline form error */}
                    {error && <p className="text-red-600 text-center pt-4">{error}</p>}
                </form>

                <p className="text-black text-center">
                    Don't Have an Account? <Link to="/signup" className="text-blue-800">Create Account</Link>
                </p>
            </div>
        </>
    )
}

export default SignIn;
