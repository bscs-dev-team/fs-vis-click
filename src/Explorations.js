import React, { useState, useCallback } from "react";
import './Explorations.css';
import Exploration from './Exploration';
import allspecies_map from './img/allspecies_map.png';
import allspecies_histo from './img/allspecies_histo.png';
import threespecies_histo from './img/threespecies_histo.png';

export default function Explorations({ fs, setFs }) {

  const FEATURED_DATA = [fs.explorations[0], fs.explorations[1], fs.explorations[2]];
  const EXPLORATIONS_DATA = fs.explorations.filter(e => e.isOwner);
  const FAVORITED_DATA = fs.explorations.filter(e => e.favorite);
  const NEXTINDEX = fs.explorations.length + 2;

  /// UI HANDLERS /////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function evt_NewExploration(event) {
    console.log('New Exploration', event.target);
    setFs(draft => {
      draft.explorations.push({
        id: NEXTINDEX,
        name: 'Untitled',
        description: '',
        modified: new Date(),
        privacy: 'Private',
        visuals: [],
        filters: [...fs.defaultFilters],
        favorite: false,
        isOwner: fs.user.isLoggedIn
      });
      draft.selectedExploration = NEXTINDEX;
      draft.editWithoutSaving = null;
    });
  }

  function evt_SelectFeature(id) {
    setFs(draft => {
      draft.selectedExploration = id;
    });
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
        <div className='featured-item' key={i} onClick={() => evt_SelectFeature(exploration.id)}>
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
            <td>
              <img src={exploration.image} />&nbsp;
              {exploration.name}
            </td>
            <td>{exploration.description}</td>
            <td>{exploration.modified.toDateString()}</td>
            <td>{exploration.privacy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const FAVORITED_TABLE = (
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
        {FAVORITED_DATA.map((exploration, i) => (
          <tr key={i} onClick={() => evt_SelectExploration(exploration.id)}>
            <td>
              <img src={exploration.image} />&nbsp;
              {exploration.name}
            </td>
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
      <h1>Explorations</h1>
      <p>FrogWatch Volunteer Data.
        See observations from FrogWatch USA volunteers in maps and graphs, or create your own visualization of data.</p>
      <h3>Featured Explorations</h3>
      <div className='featured'>
        {FEATURED}
      </div>
      <h3>My Data Explorations</h3>
      <button className='secondary' onClick={evt_NewExploration}>+ Create New Exploration</button>
      {fs.user.isLoggedIn
        ? BROWSER_TABLE
        : <div className="empty-table help">Login to save and share your explorations</div>
      }
      <h3>Favorites 🩷</h3>
      {fs.user.isLoggedIn
        ? FAVORITED_TABLE
        : <div className="empty-table help">Login to view your favorited explorations</div>
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

