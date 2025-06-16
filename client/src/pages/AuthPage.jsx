import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";
import { message } from "antd";
import { useCustomMessage } from '../utils/feedback';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);


function AuthPage() {
    const [inputs, setInput] = useState({});
    const [issignup, setissignup] = useState(true);
    const navigate = useNavigate();
    const { notify, contextHolder } = useCustomMessage();



    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput(values => ({ ...values, [name]: value }));
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, confirmPassword } = inputs;

        if (!isValidEmail(username)) {
            return notify.error("Invalid email format");
        }
        if (!(password == confirmPassword) && issignup) {
            return notify.error("Passwords don't match");
        }

        if (issignup) {
            const { data, error } = await supabase.auth.signUp({
                email: inputs.username,
                password: inputs.password,
            })

            if (error) {
                return notify.error(error.message)
            }
            notify.success("Check your email to confirm signup");
        }
        else if (!issignup) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: inputs.username,
                password: inputs.password,
            })
            if (error) {
                return notify.error(error.message)
            }
            notify.success("Login successful");
            navigate("/"); 
        }
    }

    return (
        <>
            {contextHolder}
            <div className="bg-black w-full">
                <div className="flex flex-row justify-between px-4 py-4">
                    <div className='hover:cursor-pointer' onClick={() => navigate("/")}>

                        <h1 className="text-white text-4xl font-semibold italic" >LostNFound</h1>
                    </div>
                    <div className="flex flex-row gap-4">
                        <button
                            className="bg-white text-black px-4 rounded hover:bg-gray-800 hover:text-white hover:cursor-pointer"
                            onClick={() => { navigate("/login"); setissignup(false) }}
                        >
                            Login
                        </button>
                        <button
                            className="bg-white text-black px-4 rounded hover:bg-gray-800 hover:text-white hover:cursor-pointer"
                            onClick={() => { navigate("/signup"); setissignup(true) }}
                        >
                            Signup
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center bg-gray-800 min-h-[88vh] text-white">
                <div className="w-full max-w-md bg-gray-900 p-6 rounded shadow-lg">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <label>
                            Email:
                            <input
                                type="text"
                                name="username"
                                value={inputs.username || ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-400 rounded text-white"
                            />
                        </label>

                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={inputs.password || ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-400 rounded text-white"
                            />
                        </label>

                        {issignup && (
                            <label>
                                Confirm Password:
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={inputs.confirmPassword || ""}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-400 rounded text-white"
                                />
                            </label>
                        )}

                        <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-800 hover:text-white hover:cursor-pointer mt-2">
                            {issignup ? "Signup" : "Login"}
                        </button>
                    </form>

                    <h2
                        className="text-blue-500 underline cursor-pointer mt-4 text-center "
                        onClick={() => setissignup(!issignup)}
                    >
                        {issignup ? "Login" : "Signup"} instead
                    </h2>
                </div>
            </div>
        </>
    );
}

export default AuthPage;
