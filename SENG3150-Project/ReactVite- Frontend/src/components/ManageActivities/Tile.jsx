/*
    This file makes a tile for the tile layout of the Manage Activities page.
    Each tile is a category.
    The body of the tile is a list of activities in that category.
*/
import ActivityTileBody from './TileBody';
import '@progress/kendo-theme-default/dist/all.css';

const createTile = (categoryName) => ({
    defaultPosition: {colSpan: 1, rowSpan: 1},
    // Header is the category name
    header: (<>{categoryName}</>),
    body: <ActivityTileBody categoryName={categoryName} />,
    reorderable: false,
    resizable: false,
});

export default createTile;