import React from 'react';
import logo from "../../assets/ps-logo.png";

const PlateShareLogo = () => {
    return (
        <div className="flex items-center gap-2  text-xl">
            <img src={logo} alt="PlateShare Logo" className="h-13 w-14" />
            <span className="font-bold text-3xl text-text">PlateShare</span>
        </div>
    );
};

export default PlateShareLogo;