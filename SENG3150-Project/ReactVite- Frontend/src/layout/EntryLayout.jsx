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
  return (
      <>
        {/* Big white box */}
        <div className="flex flex-col min-h-screen bg-white">

          {/* Box before header */}
          <div className={"flex justify-center items-center bg-white h-15"}>
          </div>

          {/* Header */}
          <Header/>

          {/* Grey box for output */}
            <div className={"flex justify-center"}>
              <div>
                <Outlet/>
              </div>
            </div>
          <div className={"mt-auto"}>
            {/* Footer*/}
            <Footer/>
          </div>
        </div>

      </>
  )
}


export default EntryLayout