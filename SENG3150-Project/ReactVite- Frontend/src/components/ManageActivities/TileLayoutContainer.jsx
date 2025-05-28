/*
    This file is the tile section of the Manage Activities page.
    It contains the tile layout for the categories of activities
*/
import {TileLayout} from '@progress/kendo-react-layout';
import React, { useState, useEffect } from 'react';
import createTile from './Tile.jsx';
import '@progress/kendo-theme-default/dist/all.css';
import './TileLayoutContainer.css';

const TileLayoutContainer = () => {
    //variable to store the new category name
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [tiles, setTiles] = useState([]);
    
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    //Method to create an add tile
    const AddCategoryTile = () => {
        return {
            defaultPosition: { colSpan: 1, rowSpan: 1 },
            header: (<>New Category</>),
            body: (
                <>
                        <div style={{ textAlign: 'center', paddingBottom: '5px' }}>
                            <input
                                type="text"
                                placeholder="Enter New Category Name"
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                value={newCategoryName}
                                style={{
                                    width: '100%',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    height: '30px',
                                    textAlign: 'left',
                                    paddingLeft: '5px',
                                }}
                            />
                        </div>
                        <div style={{ textAlign: 'center', paddingBottom: '5px' }}>
                            <input
                                type="text"
                                placeholder="Enter a Description"
                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                                value={newCategoryDescription}
                                style={{
                                    width: '100%',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    height: '30px',
                                    textAlign: 'left',
                                    paddingLeft: '5px',
                                }}
                            />
                        </div>  
                        <div style={{ textAlign: 'center', paddingBottom: '5px', marginTop: '10px' }}>
                            {/* TODO */}
                            <button
                                type="button"
                                onClick={loadNewCategory}
                                style={{
                                    backgroundColor: '#202C39',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '5px 12px',
                                    cursor: 'pointer',
                                }}>
                                Add Category
                            </button>
                        </div>
                </>
            ),
            reorderable: false,
            resizable: false,
        };
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
                    createTile(activityTypes.name, showConfirmation, confirmationMessage)
                );
                setTiles(loadedTiles);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    //Method to add a new category
    async function loadNewCategory(){
        if (newCategoryName.trim() === '' || newCategoryDescription.trim() === '') {
            alert('Please enter a category name and description.');
            return;
        }
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
            location.reload(); // Reload the page to see the new category
        }
        catch(error){
            console.error('Error adding category:', error);
        }
    };

    return (
        <>
            <div className='tilelayoutcontainer' id="form-root">
                {/* Tile Container for Categories */}
               <TileLayout
                 style={{ backgroundColor: '#f0f0f0' }}
                 columns={6}
                    //rowHeight={100}
                    gap={{ rows: 20, columns: 20 }}
                    items={[...tiles, AddCategoryTile()]}
                    autoFlow='row dense'
               />
            </div>
        </>
    )
};
export default TileLayoutContainer;