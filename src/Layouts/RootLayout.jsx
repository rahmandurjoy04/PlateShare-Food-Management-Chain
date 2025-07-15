import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Shared/Navbar';


const RootLayout = () => {
   return (
       <div>
           <Navbar></Navbar>
           <Outlet />
           {/* <Footer></Footer> */}
       </div>
   );
};


export default RootLayout;