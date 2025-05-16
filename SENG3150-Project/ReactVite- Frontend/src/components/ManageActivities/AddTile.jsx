/*
    This file is used to create the add category tile.
*/
import ActivityTileBody from './TileBody';
import '@progress/kendo-theme-default/dist/all.css';
import './TileLayoutContainer.css';
import addCategory from './TileLayoutContainer.jsx';
import React, { useState } from 'react';

const AddCategoryTile = () => {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAddCategory = () => {
        if (newCategoryName.trim() !== '') {
            addCategory(newCategoryName);
            setNewCategoryName('');
        }
    };

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
                    <div style={{ textAlign: 'center', paddingBottom: '5px', marginTop: '10px' }}>
                        <button
                            type="button"
                            onClick={handleAddCategory}
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

export default AddCategoryTile;