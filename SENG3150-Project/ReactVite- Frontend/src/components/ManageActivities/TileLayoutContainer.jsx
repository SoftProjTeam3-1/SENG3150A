/*
    This file is the tile section of the Manage Activities page.
    It contains the tile layout for the categories of activities
*/
import {TileLayout} from '@progress/kendo-react-layout';
import createTile from './Tile.jsx';
import '@progress/kendo-theme-default/dist/all.css';
import './TileLayoutContainer.css';

const TileLayoutContainer = () => {
    // Sample of Categories as tiles
    const tiles = [
        createTile('Track'),
        createTile('Stretching'),
        createTile('Warmups'),
        createTile('Strength'),
        createTile('Cardio'),
        createTile('Agility'),
        createTile('Endurance'),
        createTile('Flexibility'),
        createTile('Speed'),
    ];

    return (
        <>
            <div className='tilelayoutcontainer' id="form-root">
                {/* Tile Container for Categories */}
               <TileLayout
                 style={{ backgroundColor: '#f0f0f0' }}
                 columns={6}
                    //rowHeight={100}
                    gap={{ rows: 20, columns: 20 }}
                    items={tiles}
                    autoFlow='row dense'
               />
            </div>
        </>
    )
};
export default TileLayoutContainer;