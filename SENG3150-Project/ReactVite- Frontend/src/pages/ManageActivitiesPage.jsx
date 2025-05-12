/**
 * Author: David Hong (c3428258)
 * Date: 2025-05-07
 * 
 */

import React from 'react'
import Header from '../components/Dashboard/Header'
import '@progress/kendo-theme-default/dist/all.css';
import './ManageActivitiesPage.css';
import TileLayoutContainer from '../components/ManageActivities/TileLayoutContainer';

  // Sample of Categories as tiles
  const tiles = [
    {
      defaultPosition: {colSpan: 1, rowSpan: 1},
      header: "First Tile",
      body: <p>{"Body of Default"}</p>,
      reorderable: false,
      resizable: true,
    },
  ];

  // Sample of Category as tiles
  //Methods to create a tile using category name
  // tiles.push(CategoryComponent("hehehaha"));
  // tiles.push(CategoryComponent("Category 1"));
  // tiles.push(CategoryComponent("Category 2"));
  // tiles.push(CategoryComponent("Category 3"));
  // tiles.push(CategoryComponent("Category 4"));
  // tiles.push(CategoryComponent("Category 5"));
  // tiles.push(CategoryComponent("Category 6"));
  // tiles.push(CategoryComponent("Category 7"));

const ManageActivitiesPage = () => {
  return (
    <>
      {/* <Header with options side bar/> */}
      <Header/>
      <div className='tilelayoutcontainer'>

          {/* Tile Container for Categories */}
          <TileLayoutContainer/>
      </div>
    </>
  )
}

export default ManageActivitiesPage