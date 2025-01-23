import React from "react";

const Loading = () => {
  return (
    <div className="flex h-screen bg-gray-800 justify-center items-center">
      <div className="loader"></div>
      <style>{`
        .loader {
          border: 8px solid rgba(255, 255, 255, 0.3);
          border-top: 8px solid white;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
