import { createBrowserRouter } from "react-router";
import RootLayout from "./Layouts/RootLayout";
import HomePage from "./Pages/HomePage/HomePage";


export const router = createBrowserRouter([
   {
       path:'/',
       Component:RootLayout,
       children:[
           {
               index:true,
               Component:HomePage
           },
           {
               // Multiple Components will come here
           }
       ]
   }
])
