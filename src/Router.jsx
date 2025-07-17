import { createBrowserRouter } from "react-router";
import RootLayout from "./Layouts/RootLayout";
import HomePage from "./Pages/HomePage/HomePage";
import AllDonations from "./Pages/AllDonations/AllDonations";
import DashBoardHome from "./Pages/DashBoard/DashBoardHome/DashBoardHome";
import DashboardLayout from "./Layouts/DashBoardLayout";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";


export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: HomePage
            },
            {
                path: '/donations',
                element: <AllDonations></AllDonations>
            }
        ]
    },
    //    Another Parent route for dashboard
    {
        path: '/dashboard',
        element: <DashboardLayout></DashboardLayout>,
        children: [
            {
                index: true,
                element: <DashBoardHome></DashBoardHome>
            }
        ]
    },
    // Parent Layout for Authentication
    {
        path: '/',
        element: <AuthLayout></AuthLayout>,
        children: [
            {
                path: '/login',
                Component: Login
            },
            {
                path: '/register',
                Component: Register
            }
        ]
    }
])
