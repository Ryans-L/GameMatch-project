import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
    return (
        <div className="mb-8  p-4 w-full bg-gray-700">
            <Link to ="/feed" className="text-white text-3xl font-bold">
                GameMatch
            </Link>
        </div>
    );
};

export default NavigationBar;