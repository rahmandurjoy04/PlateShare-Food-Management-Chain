import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import PlateShareLogo from "./PlateShareLogo/PlateShareLogo";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="bg-secondary text-text px-6 pt-10 pb-6 min-w-sm">
            <div className="max-w-11/12 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
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
                        <li><Link to="/" className="hover:text-primary">Home</Link></li>
                        <li><Link to="/donations" className="hover:text-primary">All Donations</Link></li>
                        <li><Link to="/about" className="hover:text-primary">About</Link></li>
                        <li><Link to="/login" className="hover:text-primary">Login</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold text-2xl mb-2">Contact</h3>
                    <ul className="text-sm space-y-1">
                        <li >Email: <span className="hover:text-primary">naimur.durjoy.dev@gmail.com</span></li>
                        <li >Phone: <span className="hover:text-primary">+8801609223632</span></li>
                        <li >Website: <span className="hover:text-primary"><a href="https://naimur-rahman-04.web.app/">Plateshare Dev</a></span> </li>
                        <li >Location: <span className="hover:text-primary"> Dhaka, Bangladesh</span></li>
                    </ul>
                </div>

                {/* Social Links */}
                <div className="flex flex-col items-baseline md:items-center">
                    <h3 className="font-bold text-2xl mb-2">Follow Us</h3>
                    <div className="flex space-x-4 text-xl ">
                        <a href="https://www.facebook.com/durjoy4004/" aria-label="Facebook" className="hover:text-primary"><FaFacebookF /></a>
                        <a href="https://github.com/rahmandurjoy04" aria-label="GitHub" className="hover:text-primary"><FaGithub /></a>
                        <a href="http://linkedin.com/in/durjoy4004/" aria-label="LinkedIn" className="hover:text-primary"><FaLinkedinIn /></a>
                    </div>
                </div>
            </div>

            <div className="border-t mt-10 pt-4 text-center text-sm">
                &copy; {new Date().getFullYear()} PlateShare. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
