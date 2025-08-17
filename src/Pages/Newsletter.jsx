import React, { useState } from "react";
import useAxios from "../hoooks/useAxios";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const axios = useAxios();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(`newsletter/subscribe?email=${email}`)

            if (res.statusText==='OK') {
                setMessage("🎉 Subscription successful! Check your inbox.");
                setEmail("");
            } else {
                setMessage(`⚠️ ${"Subscription failed."}`);
            }
        } catch (err) {
            setMessage(`❌ ${err.response.data.error}`)
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-5 min-w-sm ">
            <h1 className="text-center text-4xl text-text font-extrabold mb-10">Newsletter</h1>
            <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-w-sm">
                {/* Left side - Image */}
                <div className="flex justify-center h-auto md:h-[350px] min-w-sm">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
                        alt="Newsletter illustration"
                        className="rounded-2xl shadow-lg w-full"
                    />
                </div>

                {/* Right side - Form */}
                <div className="bg-white rounded-2xl  shadow flex flex-col justify-center gap-8 p-8 h-auto md:h-[350px]">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                        Join the PlateShare Newsletter
                    </h2>
                    <p className="text-gray-600">
                        Subscribe to get the latest updates about food donations,
                        community impact stories, and new features directly in your inbox.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 rounded-xl font-semibold shadow transition ${loading
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-primary text-white hover:bg-primary/70"
                                }`}
                        >
                            {loading ? "Sending..." : "Subscribe"}
                        </button>
                    </form>

                    {message && <p className=" text-sm text-primary text-center">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
