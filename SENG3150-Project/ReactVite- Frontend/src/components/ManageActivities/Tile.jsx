/*
    This file makes a tile for the tile layout of the Manage Activities page.
    Each tile is a category.
    The body of the tile is a list of activities in that category.
*/
import React from 'react';
import ActivityTileBody from './TileBody';
import ActivityTileHead from './TileHeader';
import { X } from 'lucide-react'; // You can use any icon you prefer
import '@progress/kendo-theme-default/dist/all.css';
import ReactDOM from 'react-dom';

const createTile = (categoryName, showConfirmation, confirmationMessage) => {

    // // Asks the user for confirmation before deleting the activity
    // const handleConfirmation = () => {
    //     //Display a confirmation window
    //     setConfirmationMessage(`Are you sure you want to delete the activity "${categoryName}"?`);
    //     setShowConfirmation(true);
    // };

    // //TODO: Handle the confirmation response
    // const handleConfirmationResponse = () => {
    //     // User confirmed, proceed with deletion
    //     alert(`Activity "${categoryName}" deleted.`);
    // }

    return {
        defaultPosition: { colSpan: 1, rowSpan: 1 },
        header: (
            <>
                <div>
                    <ActivityTileHead categoryName={categoryName} />
                </div>
            </>
        ),
        body: (
            <div className="group relative">
                <ActivityTileBody categoryName={categoryName} />
            </div>
        ),
        reorderable: false,
        resizable: false,
    };
};

export default createTile;