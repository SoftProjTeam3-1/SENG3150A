/**
 * Author: David Hong (c3428258)
 * Date: 2025-05-07
 * 
 */

import React from 'react'
import Header from '../components/Header'
import ActivityComponent from '../components/ManageActivities/ActivityComponent'

const ManageActivities = () => {
  return (
      <>
        <div className="flex flex-1 flex-col justify-center ">
          <ActivityComponent/>
        </div>
      </>

  )
}

export default ManageActivities