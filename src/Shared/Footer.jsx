import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import PlateShareLogo from "./PlateShareLogo/PlateShareLogo";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="bg-blue-900 text-white px-6 pt-10 pb-6 min-w-sm">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Logo & Mission */}
                <div className="space-y-2">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <PlateShareLogo />
                    </Link>
                    <p className="text-xl mb-3">
                            From Surplus to Service.
                        </p>
                    <p className="text-sm leading-relaxed">
                        PlateShare connects restaurants and charities to fight food waste and hunger.
                    </p>
                </div>

                {/* Navigation */}
                <div className="ml-0 md:ml-6">
                    <h3 className="font-bold text-2xl mb-2">Navigation</h3>
                    <ul className="space-y-1">
                        <li><Link to="/" className="hover:text-yellow-300">Home</Link></li>
                        <li><Link to="/donations" className="hover:text-yellow-300">All Donations</Link></li>
                        <li><Link to="/dashboard" className="hover:text-yellow-300">Dashboard</Link></li>
                        <li><Link to="/login" className="hover:text-yellow-300">Login</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold text-2xl mb-2">Contact</h3>
                    <ul className="text-sm space-y-1">
                        <li>Email: nainurrahman70@gmail.com</li>
                        <li>Phone: +8801609223632</li>
                        <li>Location: Dhaka, Bangladesh</li>
                    </ul>
                </div>

                {/* Social Links */}
                <div >
                    <h3 className="font-bold text-2xl mb-2">Follow Us</h3>
                    <div className="flex space-x-4 text-xl ">
                        <a href="https://www.facebook.com/durjoy4004/" aria-label="Facebook" className="hover:text-yellow-300"><FaFacebookF /></a>
                        <a href="https://github.com/rahmandurjoy04" aria-label="GitHub" className="hover:text-yellow-300"><FaGithub /></a>
                        <a href="http://linkedin.com/in/durjoy4004/" aria-label="LinkedIn" className="hover:text-yellow-300"><FaLinkedinIn /></a>
                    </div>
                </div>
            </div>

            <div className="border-t border-blue-700 mt-10 pt-4 text-center text-sm">
                &copy; {new Date().getFullYear()} PlateShare. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
