/**
 * Author: Harrison Armstrong (c3430852)
 * Date: 1/4/2025
 * Description: This component is used to render the entry layout for the application.
 * It includes the header, footer, and the main content area where the different pages will be rendered.
 * The Outlet component is used to render the child routes of the entry layout. (FOUND IN APP.JSX IN THE ROUTING ASSIGNMENT).
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const EntryLayout = () => {
  return (<>
    <Header />
    <Outlet />
    <Footer />
  </>
  )
}

export default EntryLayout