import { useState } from 'react'
import { Link } from "react-router-dom";
import NavigationBar from './components/NavigationBar';


function App() {
  return (
    <>
      {/* Top navigation visible on landing page */}
      <NavigationBar />

      <div className="text-center pt-10">
        {/* App branding */}
        <h1 className="text-white text-5xl mb-6 text-center"> GameMatch </h1>
        <p className="text-white mb-8 text-center"> Welcome to the app! </p>

        {/* Entry actions for unauthenticated users */}
        <div className="flex gap-4 justify-center">
          <Link to="/signup" className="m-2 p-3 border rounded-full text-white">
            Sign Up
          </Link>
          <Link to="/signin" className="m-2 p-3 border rounded-full text-white">
            Sign In
          </Link>
        </div>
      </div>
    </>
  )
}

export default App
