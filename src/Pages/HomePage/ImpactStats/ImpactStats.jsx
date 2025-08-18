import React, { useState, useEffect } from 'react';
import { FaUtensils, FaLeaf, FaRecycle, FaHandsHelping } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';

const ImpactStats = () => {
    const [stats, setStats] = useState({
        mealsDonated: 0,
        foodSaved: 0,
        co2Prevented: 0,
    });

    useEffect(() => {
        const targetStats = {
            mealsDonated: 18200,
            foodSaved: 6450,
            co2Prevented: 10200,
        };

        const increment = {
            mealsDonated: Math.ceil(targetStats.mealsDonated / 100),
            foodSaved: Math.ceil(targetStats.foodSaved / 100),
            co2Prevented: Math.ceil(targetStats.co2Prevented / 100),
        };

        const timer = setInterval(() => {
            setStats((prev) => {
                const newStats = {
                    mealsDonated: Math.min(prev.mealsDonated + increment.mealsDonated, targetStats.mealsDonated),
                    foodSaved: Math.min(prev.foodSaved + increment.foodSaved, targetStats.foodSaved),
                    co2Prevented: Math.min(prev.co2Prevented + increment.co2Prevented, targetStats.co2Prevented),
                };

                if (
                    newStats.mealsDonated === targetStats.mealsDonated &&
                    newStats.foodSaved === targetStats.foodSaved &&
                    newStats.co2Prevented === targetStats.co2Prevented
                ) {
                    clearInterval(timer);
                }

                return newStats;
            });
        }, 20);

        return () => clearInterval(timer);
    }, []);

    return (
            <div className="min-w-sm">
                <h2 className="text-3xl text-center md:text-4xl font-extrabold text-text mb-5">
                    Our Impact So Far
                </h2>
                <p className="text-text mb-10 max-w-xl mx-auto text-sm md:text-base">
                    <Typewriter
                        words={["PlateShare connects restaurants with charities to reduce food waste and fight hunger. See the difference we're making together."]}
                        loop={0}
                        cursor
                        cursorStyle="|"
                        typeSpeed={80}
                        deleteSpeed={50}
                        delaySpeed={10000}
                    />
                </p>

                <div className="grid grid-cols-1 min-w-sm sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Meals Donated */}
                    <div className="group card bg-white shadow-lg p-6 rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-secondary">
                        <FaUtensils className="text-4xl text-amber-600 mb-4 transition-colors duration-300 group-hover:text-yellow-700" />
                        <h3 className="text-3xl font-extrabold text-blue-900">
                            {stats.mealsDonated.toLocaleString()}+
                        </h3>
                        <p className="text-primary font-semibold my-2">Meals Donated</p>
                        <p className="text-secondary text-sm text-center">
                            Providing nutritious meals to communities in need.
                        </p>
                    </div>

                    {/* Food Saved */}
                    <div className="group card bg-white shadow-lg p-6 rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-secondary">
                        <FaLeaf className="text-4xl text-green-600 mb-4 transition-colors duration-300 group-hover:text-green-800" />
                        <h3 className="text-3xl font-extrabold text-blue-900">
                            {stats.foodSaved.toLocaleString()} kg
                        </h3>
                        <p className="text-primary font-semibold my-2">Food Saved</p>
                        <p className="text-secondary text-sm  text-center">
                            Rescuing surplus food from restaurants for redistribution.
                        </p>
                    </div>

                    {/* CO2 Prevented */}
                    <div className="group card bg-white shadow-lg p-6 rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-secondary">
                        <FaRecycle className="text-4xl text-cyan-600 mb-4 transition-colors duration-300 group-hover:text-teal-700" />
                        <h3 className="text-3xl font-extrabold text-blue-900">
                            {(stats.co2Prevented / 1000).toFixed(1)} tons
                        </h3>
                        <p className="text-primary font-semibold my-2">CO₂ Prevented</p>
                        <p className="text-secondary text-sm text-center">
                            Reducing carbon emissions through sustainable practices.
                        </p>
                    </div>

                    {/* Volunteers Engaged */}
                    <div className="group card bg-white shadow-lg p-6 rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-secondary">
                        <FaHandsHelping className="text-4xl text-purple-600 mb-4 transition-colors duration-300 group-hover:text-purple-800" />
                        <h3 className="text-3xl font-extrabold text-blue-900">
                            1,200+
                        </h3>
                        <p className="text-primary font-semibold my-2">Volunteers Engaged</p>
                        <p className="text-secondary text-sm text-center">
                            Dedicated individuals helping distribute food and support communities.
                        </p>
                    </div>

                </div>
            </div>
    );
};

export default ImpactStats;
