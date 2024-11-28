import React from 'react';
import { Link } from 'react-router-dom';

const Home= () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-8">Welcome to the System</h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="module">
                        <Link to="/student-login">
                            <button className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                                Student Login
                            </button>
                        </Link>
                    </div>
                    <div className="module">
                        <Link to="/parent-login">
                            <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                                Parent Login
                            </button>
                        </Link>
                    </div>
                    <div className="module">
                        <Link to="/teacher-login">
                            <button className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
                                Teacher Login
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
