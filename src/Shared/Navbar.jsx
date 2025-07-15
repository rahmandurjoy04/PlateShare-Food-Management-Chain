import { Link, NavLink } from "react-router";
import PlateShareLogo from "./PlateShareLogo/PlateShareLogo";

const Navbar = () => {
  // const navLinks = (
  //   <>
  //     <li><NavLink to="/">Home</NavLink></li>
  //     <li><NavLink to="/donations">All Donations</NavLink></li>
  //     <li><NavLink to="/dashboard">Dashboard</NavLink></li>
  //     <li><NavLink to="/login">Login</NavLink></li>
  //   </>
  // );

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/donations"
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          All Donations
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/login"
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Login
        </NavLink>
      </li>
    </>
  );


  return (
    <div className="navbar shadow-sm px-4 py-0 bg-blue-900 min-w-sm">
      {/* Left (Logo + Mobile Menu) */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-blue-950 text-amber-50 rounded-box w-52"
          >
            {navLinks}
          </ul>

        </div>

        {/* Logo */}
        <Link to="/" >
          <PlateShareLogo></PlateShareLogo>
        </Link>
      </div>

      {/* Center (Links for lg+) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-amber-100">{navLinks}</ul>
      </div>

      {/* Right (CTA or Profile) */}
      <div className="navbar-end">
        {/* Example Button */}
        <Link to="/login" className="btn btn-outline bg-[#1e3a8a] text-white">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
