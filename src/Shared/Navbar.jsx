import { Link, NavLink } from "react-router";
import PlateShareLogo from "./PlateShareLogo/PlateShareLogo";
import useAuth from "../hoooks/useAuth";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logoutUser, authLoading } = useAuth();

  const signOut = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser();
        Swal.fire(
          'Logged out!',
          'You have been logged out successfully.',
          'success'
        );
      }
    });
  };

  console.log(user);

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
        <Link to="/">
          <PlateShareLogo />
        </Link>
      </div>

      {/* Center (Links for lg+) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-white">{navLinks}</ul>
      </div>

      {/* Right (User Info or Login Button) */}
      <div className="navbar-end  gap-2">
        {
          authLoading ?
            (<span className="loading loading-dots text-white loading-xl"></span>)
             :
            user ?
              (
                <>
                  <div className="text-white hidden md:flex items-center gap-2">
                    <span>{user.displayName || user.email}</span>
                    {user.photoURL && (
                      <img
                        src={user?.photoURL}
                        alt="User"
                        className="w-9 h-9 rounded-full border border-white"
                      />
                    )}
                  </div>
                  <button onClick={signOut} className="btn btn-outline text-white bg-[#1e3a8a]">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-outline bg-[#1e3a8a] text-white">
                  Login
                </Link>
              )}

      </div>
    </div>
  );
};

export default Navbar;
