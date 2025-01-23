import React from "react";
import { Link } from "react-router-dom";

function NoMatch() {
  return (
    <div className="flex h-screen bg-gray-800">
      <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">
        <header>
          <h3 className="mb-5 text-blue-500 text-center text-4xl">App</h3>
        </header>
        <div className="text-center mb-5">
          <p className="text-blue-500">Sorry, the page you're looking for doesn't exist.</p>
        </div>
        <div className="text-center mb-5">
          <Link className="text-blue-700 hover:text-orange-500 text-md" to="/">Return to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default NoMatch;
