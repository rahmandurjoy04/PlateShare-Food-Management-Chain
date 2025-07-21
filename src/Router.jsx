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
import MyDonations from "./Pages/DashBoard/ResturantDashboard/MyDonations";
import UpdateDonation from "./Pages/DashBoard/ResturantDashboard/UpdateDonations";
import ManageDonations from "./Pages/DashBoard/AdminDashBoard/ManageDonations";
import DonationDetails from "./Pages/AllDonations/DonationDetails";
import ManageRequests from "./Pages/DashBoard/AdminDashBoard/ManageRequests";
import FeatureDonations from "./Pages/DashBoard/AdminDashBoard/FeatureDonations";
import RequestedDonations from "./Pages/DashBoard/ResturantDashboard/RequestedDonations";
import MyRequests from "./Pages/DashBoard/CharityDashboard/MyRequests";
import MyPickups from "./Pages/DashBoard/CharityDashboard/MyPickups";
import ReceivedDonations from "./Pages/DashBoard/CharityDashboard/ReceivedDonations";
import TransactionHistory from "./Pages/DashBoard/CharityDashboard/TransactionHistory";
import MyReviews from "./Pages/DashBoard/UserDashBoard/MyReviews";
import MyFavorites from "./MyFavorites";


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
            ,
            {
                path: '/donation/:id',
                element: <PrivateRoute>
                    <DonationDetails></DonationDetails>
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
            ,
            {
                path:"/dashboard/restaurant/my-donations",
                element:<MyDonations></MyDonations>
            }
            ,
            {
                path:"/dashboard/restaurant/update-donation/:id",
                element:<UpdateDonation></UpdateDonation>
            }
            ,
            {
                path:"/dashboard/manage-donations",
                element:<ManageDonations></ManageDonations>
            }
            ,
            {
                path:"/dashboard/manage-requests",
                element:<ManageRequests></ManageRequests>
            }
            ,
            {
                path:"/dashboard/feature-donations",
                element:<FeatureDonations></FeatureDonations>
            }
            ,
            {
                path:"/dashboard/restaurant/requested-donations",
                element:<RequestedDonations></RequestedDonations>
            }
            ,
            {
                path:"/dashboard/charity/my-requests",
                element:<MyRequests></MyRequests>
            }
            ,
            {
                path:"/dashboard/charity/my-pickups",
                element:<MyPickups></MyPickups>
            }
            ,
            {
                path:"/dashboard/charity/received-donations",
                element:<ReceivedDonations></ReceivedDonations>
            }
            ,
            {
                path:"/dashboard/user-transactions",
                element:<TransactionHistory></TransactionHistory>
            }
            ,
            {
                path:"/dashboard/my-reviews",
                element:<MyReviews></MyReviews>
            }
            ,
            {
                path:"/dashboard/favorites",
                element:<MyFavorites></MyFavorites>
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
