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

    async function getData(){
        try{
            const response = await fetch('/api/activityType/getAll',{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify()
            });
            const data = await response.text();
            console.log(data);
            const jsonData = JSON.parse(data);
            console.log(jsonData);
            return jsonData;
        }
        catch(error){
            console.error('Error fetching data:', error)
        }
    }

    const jsonData = getData();
    const tiles = [];
    for(let i = 0; i < 10; i++){
        tiles.push(createTile(jsonData.activityTypes[i].name))
    }

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