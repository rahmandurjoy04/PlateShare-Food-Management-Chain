import { createBrowserRouter } from "react-router";
import RootLayout from "./Layouts/RootLayout";
import HomePage from "./Pages/HomePage/HomePage";
import AllDonations from "./Pages/AllDonations/AllDonations";
import DashBoardHome from "./Pages/DashBoard/DashBoardHome/DashBoardHome";
import DashboardLayout from "./Layouts/DashBoardLayout";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";
import PrivateRoute from "./Routes/PrivateRoute";
import MyProfile from "./Pages/DashBoard/MyProfile/MyProfile";
import RequestCharityRole from "./Pages/DashBoard/UserDashBoard/RequestCharityRole/RequestCharityRole";
import ManageUsers from "./Pages/DashBoard/AdminDashBoard/ManageUsers";
import CharityRolePayment from "./Pages/DashBoard/UserDashBoard/CharityRolePayment/CharityRolePayment";
import ManageRoleRequests from "./Pages/DashBoard/AdminDashBoard/ManageRoleRequests/ManageRoleRequests";
import AddDonationForm from "./Pages/DashBoard/ResturantDashboard/AddDonationForm";


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
                element: <PrivateRoute>
                    <AllDonations></AllDonations>
                </PrivateRoute>
            }
        ]
    },
    //    Another Parent route for dashboard
    {
        path: '/dashboard',
        element:
            <PrivateRoute>
                <DashboardLayout></DashboardLayout>
            </PrivateRoute>,
        children: [
            {
                index: true,
                element: <DashBoardHome></DashBoardHome>
            },
            {
                path:'/dashboard/profile',
                element:<MyProfile></MyProfile>
            }
            ,
            {
                path:'/dashboard/request-charity-role',
                element:<RequestCharityRole></RequestCharityRole>
            },
            {
                path:'/dashboard/payment/charity',
                element:<CharityRolePayment></CharityRolePayment>
            },
            {
                path:"/dashboard/manage-users",
                element:<ManageUsers></ManageUsers>
            }
            ,
            {
                path:"/dashboard/manage-role-requests",
                element:<ManageRoleRequests></ManageRoleRequests>
            }
            ,
            {
                path:"/dashboard/restaurant/add-donation",
                element:<AddDonationForm></AddDonationForm>
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
