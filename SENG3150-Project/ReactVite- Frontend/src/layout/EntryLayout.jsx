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
import Logo from '../assets/logo.png';


const EntryLayout = () => {
  return (
      <>
        {/* Big white box */}
        <div className="flex flex-col min-h-screen bg-[#f7fce8]">

          {/* Box before header */}
          <div className="flex justify-center items-center flex-1 bg-white-700 fit">
          </div>

          {/* Header */}
          <Header/>

          {/* Grey box for output */}
          <main className="flex justify-center items-center flex-1 bg-white-700 fit">
            <div className="flex flex-row items-center bg-gray-700 text-white rounded-lg p-6 w-95 max-w-4xl shadow-lg">
              <Outlet/>
            </div>
          </main>
          <div>

            {/* Footer*/}
          </div>
          <Footer/>
        </div>
      </>
  )
}

export default EntryLayout