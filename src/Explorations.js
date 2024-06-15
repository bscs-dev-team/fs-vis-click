import React, { useState, useCallback } from "react";
import './Explorations.css';
import Exploration from './Exploration';
import allspecies_map from './img/allspecies_map.png';
import allspecies_histo from './img/allspecies_histo.png';
import threespecies_histo from './img/threespecies_histo.png';

export default function Explorations() {
  const [route, setRoute] = useState('browser');

  const FEATURED_DATA = [
    { name: 'All 2021 Data', description: 'All data collected in 2021', image: allspecies_map },
    { name: 'Species Histogram', description: 'A histogram showing all species observed', image: allspecies_histo },
    { name: 'Species Map', description: 'A map showing where species have been found', image: threespecies_histo },
  ];

  const EXPLORATIONS_DATA = [
    { name: 'Histogram Frog vs Toad', description: 'A histogram of frog and toad observations', modified: new Date(), privacy: 'Public' },
    { name: 'Histogram American Bullfrogs', description: 'A histogram of frog and toad observations', modified: new Date(), privacy: 'Public' },
    { name: 'Map American Bullfrogs', description: 'A histogram of frog and toad observations', modified: new Date(), privacy: 'Public' },
    { name: 'Copy of Histogram Frog vs Toad', description: 'A histogram of frog and toad observations', modified: new Date(), privacy: 'Public' },
  ]


  /// UI HANDLERS /////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function evt_ShowExploration(event) {
    console.log('Show Exploration', event.target);
    setRoute('exploration');
  }

  function evt_SelectExploration(id) {
    console.log('Select Exploration', id);
    setFs(draft => {
      draft.selectedExploration = id;
    });
  }

  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const FEATURED = (
    <div className='featured'>
      {FEATURED_DATA.map((exploration, i) => (
        <div className='featured-item' key={i}>
          <img src={exploration.image} alt={exploration.name} />
          <div className='featured-description'>
            <h4>{exploration.name}</h4>
            <div>{exploration.description}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const BROWSER_TABLE = (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Last modified</th>
          <th>Privacy</th>
        </tr>
      </thead>
      <tbody>
        {EXPLORATIONS_DATA.map((exploration, i) => (
          <tr key={i} onClick={() => evt_SelectExploration(exploration.id)}>
            <td>{exploration.name}</td>
            <td>{exploration.description}</td>
            <td>{exploration.modified.toDateString()}</td>
            <td>{exploration.privacy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const BROWSER = (
    <>
      <h3>Featured Explorations</h3>
      <div className='featured'>
        {FEATURED}
      </div>
      <h3>My Data Explorations</h3>
      <button className='secondary' onClick={evt_ShowExploration}>+ Create New Exploration</button>
      {fs.user.isLoggedIn
        ? BROWSER_TABLE
        : <div className="empty-table help">Login to save and share your explorations</div>
      }
    </>
  );

  const EXPLORATION = (
    <Exploration fs={fs} setFs={setFs} />
  );

  const VIEW = fs.selectedExploration === null ? BROWSER : EXPLORATION;
  return (
    <div className="Explorations">
      {VIEW}
    </div>
  );
}

