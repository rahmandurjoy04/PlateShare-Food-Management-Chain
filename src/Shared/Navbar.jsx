import { Link, NavLink, useNavigate } from "react-router";
import PlateShareLogo from "./PlateShareLogo/PlateShareLogo";
import useAuth from "../hoooks/useAuth";
import Swal from "sweetalert2";
import ThemeToggle from "../ThemeToggle";

const Navbar = () => {
  const { user, logoutUser, authLoading } = useAuth();
  const navigate = useNavigate()
  const handleNavigate=() =>{
    navigate('/dashboard/profile')
  }

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
      {
        user && <>
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
              to="/partners"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Partners
            </NavLink>
          </li>
        </>
      }
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          About
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="bg-secondary  sticky top-0 z-50 min-w-sm">
      <div className="navbar max-w-11/12 mx-auto px-0 ">
        {/* Left (Logo + Mobile Menu) */}
        <div className="navbar-start">
          {/* Mobile Menu */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost p-0 lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-text"
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
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-secondary text-text rounded-box w-52"
            >
              {navLinks}
            </ul>
          </div>

          {/* Logo */}
          <Link to="/">
            <PlateShareLogo />
          </Link>
          <div className="ml-3">
          <ThemeToggle></ThemeToggle>
          </div>
        </div>

        {/* Center (Links for lg+) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-text text-lg">{navLinks}</ul>
        </div>

        {/* Right (User Info or Login Button) */}
        <div className="navbar-end  gap-2">
          {
            authLoading ?
              (<span className="loading loading-dots text-text loading-xl"></span>)
              :
              user ?
                (
                  <>
                    <div className="text-text hidden md:flex items-center gap-2">
                      <span>{user.displayName || user.email}</span>
                      {user.photoURL && (
                        <img
                          src={user?.photoURL}
                          alt="User"
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full border border-white"
                          onClick={()=>handleNavigate()}
                          
                        />
                      )}
                    </div>
                    <button onClick={signOut} className="btn text-white shadow-none font-bold border-none hover:bg-primary/80 hover:shadow-sm btn-primary">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="btn border-none bg-primary hover:bg-primary/70 text-white">
                    Login
                  </Link>
                )}

        </div>
      </div>
    </div>
  );
};

export default Navbar;
