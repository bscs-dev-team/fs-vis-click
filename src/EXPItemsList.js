import React, { useState } from "react";
import './EXPItemsList.css';
import allspecies_map from './img/allspecies_map.png';
import allspecies_histo from './img/allspecies_histo.png';
import threespecies_histo from './img/threespecies_histo.png';
import EXPEdit from './EXPEdit';

export default function EXPItemsList() {
  const [showEditor, setShowEditor] = useState(false);

  function evt_NewDisplay(event) {
    console.log('New Display', event.target);
    setShowEditor(true);
  }

  function evt_CloseEditor(event) {
    setShowEditor(false);
  }

  const ITEMS_DATA = [
    { name: 'All 2021 Data', description: 'All data collected in 2021', image: allspecies_map },
    { name: 'Species Histogram', description: 'A histogram showing all species observed', image: allspecies_histo },
    { name: 'Species Map', description: 'A map showing where species have been found', image: threespecies_histo },
  ];

  const ITEMS = [];

  const EDITOR = (
    <EXPEdit onExit={evt_CloseEditor} />
  )

  return (
    <div className="EXPItems">
      <h4>SAVED VISUALS</h4>
      <div className='EXPItemsList'>
        {ITEMS.length < 1
          ? <div className="help">Your saved displays will appear here</div>
          : ITEMS.map((item, i) => (
            <div className='item' key={i}>
              <img src={item.image} alt={item.name} />
              <div className='description'>
                <div>{item.name}</div>
                <div>{item.description}</div>
              </div>
            </div>
          ))
        }
      </div>
      <div className="controlbar">
        <button disabled>EDIT</button>
        <button className="primary" onClick={evt_NewDisplay}>NEW DISPLAY</button>
      </div>
      {showEditor && EDITOR}
    </div>
  );
}