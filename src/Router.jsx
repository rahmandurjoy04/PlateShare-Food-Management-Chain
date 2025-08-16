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
import DonationStats from "./Pages/DashBoard/ResturantDashboard/DonationStats";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import AdminRoute from "./Routes/AdminRoute";
import ResturantRoute from "./Routes/ResturantRoute";
import CharityRoute from "./Routes/CharityRoute";
import TransactionRoute from "./Routes/TransactionRoute";
import UserRoute from "./Routes/UserRoute";
import About from "./Pages/About";


export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        errorElement: <ErrorPage />,

        children: [
            {
                index: true,
                Component: HomePage
            },
            {
                path: '/donations',
                element:
                    <AllDonations></AllDonations>
               
            }
            ,
            {
                path: '/about',
                element:
                    <About></About>
               
            }
            ,
            {
                path: '/donation/:id',
                element:
                    <DonationDetails></DonationDetails>
            
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
        errorElement: <ErrorPage />,

        children: [
            {
                index: true,
                element: <DashBoardHome></DashBoardHome>
            }
            ,
            {
                path: '/dashboard/profile',
                element: <MyProfile></MyProfile>
            }
            ,
            
            {
                path: '/dashboard/payment/charity',
                element: <CharityRolePayment></CharityRolePayment>
            }
            ,
            
            // Admin Dashboard

            {
                path: "/dashboard/manage-donations",
                element: <AdminRoute>
                    <ManageDonations></ManageDonations>
                </AdminRoute>
            }
            ,
            {
                path: "/dashboard/manage-users",
                element:
                    <AdminRoute>
                        <ManageUsers></ManageUsers>
                    </AdminRoute>
            }
            ,
            {
                path: "/dashboard/manage-role-requests",
                element:
                    <AdminRoute>
                        <ManageRoleRequests></ManageRoleRequests>
                    </AdminRoute>
            }
            ,
            {
                path: "/dashboard/manage-requests",
                element:
                    <AdminRoute>
                        <ManageRequests></ManageRequests>
                    </AdminRoute>
            }
            ,
            {
                path: "/dashboard/feature-donations",
                element:
                    <AdminRoute>
                        <FeatureDonations></FeatureDonations>
                    </AdminRoute>
            }
            ,
            // Resturant Routes
            {
                path: "/dashboard/restaurant/donation-stats",
                element: <ResturantRoute>
                    <DonationStats></DonationStats>
                </ResturantRoute>
            }
            ,
            {
                path: "/dashboard/restaurant/add-donation",
                element: <ResturantRoute>
                    <AddDonationForm></AddDonationForm>
                </ResturantRoute>
            }
            ,
            {
                path: "/dashboard/restaurant/my-donations",
                element:
                    <ResturantRoute>
                        <MyDonations></MyDonations>
                    </ResturantRoute>
            }
            ,
            {
                path: "/dashboard/restaurant/requested-donations",
                element:
                    <ResturantRoute>
                        <RequestedDonations></RequestedDonations>
                    </ResturantRoute>
            }
            ,
            {
                path: "/dashboard/restaurant/update-donation/:id",
                element: <ResturantRoute>
                    <UpdateDonation></UpdateDonation>
                </ResturantRoute>
            }
            ,
            // Charity Routes
            {
                path: "/dashboard/charity/my-requests",
                element: <CharityRoute>
                    <MyRequests></MyRequests>
                </CharityRoute>
            }
            ,
            {
                path: "/dashboard/charity/my-pickups",
                element: <CharityRoute>
                    <MyPickups></MyPickups>
                </CharityRoute>
            }
            ,
            {
                path: "/dashboard/charity/received-donations",
                element: <CharityRoute>
                    <ReceivedDonations></ReceivedDonations>
                </CharityRoute>
            }
            ,
            // Shared Route for user and charity
            {
                path: "/dashboard/user-transactions",
                element:
                    <TransactionRoute>
                        <TransactionHistory></TransactionHistory>
                    </TransactionRoute>
            }
            ,
            // User Routes
            {
                path: "/dashboard/my-reviews",
                element: 
                <UserRoute>
                    <MyReviews></MyReviews>
                </UserRoute>
            }
            ,
            {
                path: "/dashboard/favorites",
                element:
                    <MyFavorites></MyFavorites>
            },
            {
                path: '/dashboard/request-charity-role',
                element: <UserRoute>
                    <RequestCharityRole></RequestCharityRole>
                </UserRoute>
            },

        ]
    },
    // Parent Layout for Authentication
    {
        path: '/',
        element: <AuthLayout></AuthLayout>,
        errorElement: <ErrorPage />,

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
