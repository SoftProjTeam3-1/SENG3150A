/*
    This file is the tile section of the Manage Activities page.
    It contains the tile layout for the categories of activities
*/
import {TileLayout} from '@progress/kendo-react-layout';
import React, { useState, useEffect, use } from 'react';
import createTile from './Tile.jsx';
import '@progress/kendo-theme-default/dist/all.css';
import './TileLayoutContainer.css';

export const TileLayoutContainer = () => {
    //variable to store the new category name
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [tiles, setTiles] = useState([]);
    const [updateSwitch, setUpdateSwitch] = useState(false);

    //Method to create an add tile
    const AddCategoryTile = () => {
        return {
            defaultPosition: { colSpan: 1, rowSpan: 1 },
            header: (<>New Category</>),
            body: (
            <form
                onSubmit={(e) => {
                e.preventDefault();
                loadNewCategory();
                }}
            >
                <div className="text-center pb-1.5">
                <input
                    type="text"
                    placeholder="Enter New Category Name"
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    value={newCategoryName}
                    className="w-full rounded border border-gray-300 h-8 pl-2 text-left"
                    required
                />
                </div>
                <div className="text-center pb-1.5 mt-2.5">
                <button
                    type="submit"
                    className="bg-[#202C39] text-white border-none rounded px-3 py-1 cursor-pointer"
                >
                    Add Category
                </button>
                </div>
            </form>
            ),
            reorderable: false,
            resizable: false,
        };
    };
    // Method to handle header click
    const onHeaderClick = (categoryName) => {
        // This function can be used to handle header clicks, e.g., to refresh the tile layout
        console.log(`Header clicked for category: ${categoryName}`);
        // You can implement any logic here, such as fetching new data or updating the UI
        setUpdateSwitch(!updateSwitch); // Toggle the update switch to refresh the tiles
    };

    // Sample of Categories as tiles
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/activityType/getAll', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const parsedData = await response.json();

                const loadedTiles = parsedData.activityTypes.map((activityTypes) =>
                    createTile(activityTypes.name, onHeaderClick)
                );
                setTiles(loadedTiles);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [updateSwitch]);


    //Method to add a new category
    async function loadNewCategory(){
        try{
            const response = await fetch('/api/activityType/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name : newCategoryName,
                    description: newCategoryDescription
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Category added successfully:', data);
            setNewCategoryName(''); // Clear the input field after successful addition
            setNewCategoryDescription('');
            onHeaderClick(); // Call onHeaderClick to refresh the tile layout
        }
        catch(error){
            console.error('Error adding category:', error);
        }
    };

    // Responsive columns based on screen width
    const getColumns = () => {
        if (window.innerWidth < 640) return 1; // mobile
        if (window.innerWidth < 1024) return 3; // tablet
        if (window.innerWidth < 1280) return 4; // small desktop
        return 5; // large desktop
    };

    const [columns, setColumns] = useState(getColumns());

    useEffect(() => {
        const handleResize = () => setColumns(getColumns());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <>
            <div className='tilelayoutcontainer' id="form-root">
                {/* Tile Container for Categories */}
                <TileLayout
                    style={{ backgroundColor: '#f0f0f0' }}
                    columns={columns}
                    gap={{ rows: 20, columns: 20 }}
                    items={[...tiles, AddCategoryTile()]}
                    autoFlow='row dense'
                />
            </div>
        </>
    )
};
export default TileLayoutContainer;