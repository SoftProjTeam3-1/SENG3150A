/**
 * Author: David Hong (c3428258)
 * Date: 2025-05-07
 * 
 */

import React from 'react'
import Header from '../components/Dashboard/Header'
import ActivityComponent from '../components/ManageActivities/ActivityComponent'
import CategoryComponent from '../components/ManageActivities/CategoryComponent'
import SessionWindowFrame from '../components/ManageActivities/SessionWindowFrame'

const ManageActivitiesPage = () => {
  return (
      <>
        <div className="flex flex-1 flex-col justify-center ">
          {/* <ActivityComponent/> */}
          <Header/>
          <SessionWindowFrame/>
        </div>
      </>

  )
}

export default ManageActivitiesPage