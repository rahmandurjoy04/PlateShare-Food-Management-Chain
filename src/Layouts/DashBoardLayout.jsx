import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { FaHome, FaBoxOpen, FaMoneyCheckAlt, FaUserEdit, FaUserCheck, FaUserShield, FaTasks, FaStar, FaUsersCog, FaClipboardCheck, FaClipboardList, FaTruck, FaUserCog, FaChartBar, FaListAlt, FaUtensils } from 'react-icons/fa';
import PlateShareLogo from '../Shared/PlateShareLogo/PlateShareLogo';
import useGetUserRole from '../hoooks/useGetUserRole';

const DashboardLayout = () => {

    const { role, roleLoading } = useGetUserRole();


    return (
        <div className="drawer lg:drawer-open min-w-sm">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                {/* Navbar */}
                <div className="navbar bg-blue-900 w-full min-w-sm lg:hidden">
                    <div className="flex-none ">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 min-w-sm flex-1 px-2 lg:hidden text-white text-xl">Dashboard</div>

                </div>
                {/* Page content here */}
                <Outlet></Outlet>
                {/* Page content here */}

            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu min-h-full w-80 p-4 bg-blue-900 text-white">
                    {/* Sidebar content here */}
                    <Link to={'/'}>
                        <PlateShareLogo></PlateShareLogo>
                    </Link>
                    <li>
                        <Link to="/dashboard">
                            <FaHome className="inline-block mr-2" />
                            Home
                        </Link>
                    </li>

                    {
                        roleLoading && <>
                            <div className=' my-5 flex justify-center items-center'>
                                <span className="loading loading-bars loading-xl"></span>

                            </div>
                        </>
                    }

                    {/* User Links */}
                    {!roleLoading && role === 'user' && (
                        <>
                            <li className="menu-title text-sm text-white/60 mt-4 mb-1">User Dashboard</li>

                            <li>
                                <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaUserEdit className="inline-block mr-2" />
                                    My Profile
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/request-charity-role" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaUserShield className="inline-block mr-2" />
                                    Request Charity Role
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/favorites" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaStar className="inline-block mr-2" />
                                    Favorites
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/my-reviews" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaClipboardList className="inline-block mr-2" />
                                    My Reviews
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/user-transactions" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaMoneyCheckAlt className="inline-block mr-2" />
                                    Transaction History
                                </NavLink>
                            </li>
                        </>
                    )}



                    {/* admin links */}
                    {!roleLoading && role === 'admin' && (
                        <>
                            <li className="menu-title text-sm text-white/60 mt-2 mb-1">Admin Controls</li>

                            <li>
                                <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaUserEdit className="inline-block mr-2" />
                                    My Profile
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/manage-donations" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaClipboardCheck className="inline-block mr-2" />
                                    Manage Donations
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/manage-users" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaUsersCog className="inline-block mr-2" />
                                    Manage Users
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/manage-role-requests" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaUserCheck className="inline-block mr-2" />
                                    Manage Role Requests
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/manage-requests" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaTasks className="inline-block mr-2" />
                                    Manage Requests
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/feature-donations" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaStar className="inline-block mr-2" />
                                    Feature Donations
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Resturant Links */}
                    {!roleLoading && role === 'restaurant' && (
                        <>
                            <li className="menu-title text-sm text-white/60 mt-2 mb-1">Resturant Controls</li>
                            <li>
                                <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaUserEdit className="inline-block mr-2" />
                                    My Profile
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/restaurant/donation-stats"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <FaChartBar className="mr-2" /> Donation Stats
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/restaurant/add-donation"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <FaUtensils className="mr-2" /> Add Donation
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/dashboard/restaurant/my-donations"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <FaListAlt className="mr-2" /> My Donations
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/restaurant/requested-donations"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <FaListAlt className="mr-2" /> Requested Donations
                                </NavLink>
                            </li>

                        </>
                    )}
                    {/* Charity Links */}
                    {!roleLoading && role === 'charity' && (
                        <>
                            <li className="menu-title text-sm text-white/60 mt-2 mb-1">Charity Dashboard</li>

                            <li>
                                <NavLink to="/dashboard/profile">
                                    <FaUserShield className="inline-block mr-2" />
                                    My Profile
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/charity/my-requests" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaClipboardList className="inline-block mr-2" />
                                    My Requests
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/charity/my-pickups" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaTruck className="inline-block mr-2" />
                                    My Pickups
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/charity/received-donations" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaBoxOpen className="inline-block mr-2" />
                                    Received Donations
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/user-transactions" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <FaMoneyCheckAlt className="inline-block mr-2" />
                                    Transaction History
                                </NavLink>
                            </li>
                        </>
                    )}


                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;