/*
    This file makes a tile for the tile layout of the Manage Activities page.
    Each tile is a category.
    The body of the tile is a list of activities in that category. WOAH!
*/
import React from 'react';
import ActivityTileBody from './TileBody';
import ActivityTileHead from './TileHeader';
import { X } from 'lucide-react'; // You can use any icon you prefer
import '@progress/kendo-theme-default/dist/all.css';
import ReactDOM from 'react-dom';


const createTile = (categoryName, onHeaderClick) => {

    return {
        defaultPosition: { colSpan: 1, rowSpan: 1 },
        header: (
            <>
                <div>
                    <ActivityTileHead 
                    categoryName={categoryName}
                    onHeaderClick={onHeaderClick}
                    />
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