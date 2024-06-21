import React, { useState, useCallback } from "react";
import { useImmer } from "use-immer";
import './App.css';
import Home from './Home';
import Login from './Login';
import Explorations from './Explorations';

import allspecies_map from './img/allspecies_map.png';
import allspecies_histo from './img/allspecies_histo.png';
import threespecies_histo from './img/threespecies_histo.png';

const initialFSState = {
  user: {
    isLoggedIn: false,
    userName: null,
  },
  route: 'home', // 'home' or 'explorations'
  selectedExploration: null,
  selectedVisual: null,
  selectedDataset: null,
  editingVisual: null,
  explorations: [
    {
      id: 1,
      name: 'Histogram Frog vs Toad',
      description: 'A histogram of frog and toad observations', modified: new Date(), privacy: 'Public',
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 'all', type: 'map', image: allspecies_map, showTable: false },
        { id: 2, title: 'Species Histogram', description: 'A histogram showing all species observed', filter: 'recent', type: 'histo', image: allspecies_histo, showTable: false },
        { id: 3, title: 'CA Species Histogram', description: 'A histogram showing CA frogs', filter: 'ca', type: 'map', image: threespecies_histo, showTable: false }
      ]
    },
    {
      id: 2,
      name: 'Histogram American Bullfrogs',
      description: 'A histogram of American Bullfrogs', modified: new Date(), privacy: 'Public',
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 'all', type: 'map', image: allspecies_map, showTable: false },
      ]
    },
    {
      id: 3,
      name: 'Map American Bullfrogs',
      description: 'A map of American Bullfrogs', modified: new Date(), privacy: 'Public'
    },
    {
      id: 4,
      name: 'Copy of Histogram Frog vs Toad',
      description: 'A histogram of frog and toad observations', modified: new Date(), privacy: 'Public'
    },
  ]
};

/// APP ///////////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export function App() {
  // fs = fieldscope state
  const [fs, setFs] = useImmer(initialFSState);
  const [tableData, updateTableData] = useImmer({ count: 0, headers: [], data: [] });

  function evt_SetRoute(route) {
    setFs(draft => {
      draft.route = route;
    });
  }

  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const NAVBAR = (
    <div className="navbar">
      <div></div>
      <div className="center">
        <button
          className={fs.route === 'home' ? 'outline' : 'transparent'}
          onClick={() => evt_SetRoute('home')}>Home</button>
        <button
          className={fs.route === 'explorations' ? 'outline' : 'transparent'}
          onClick={() => evt_SetRoute('explorations')}>Explorations</button>
      </div>
      <Login fs={fs} setFs={setFs} />
    </div>
  );

  const HOME = <>
    {NAVBAR}
    <Home />
  </>;
  const EXPLORATIONS = <>
    {NAVBAR}
    <Explorations fs={fs} setFs={setFs} />
  </>;


  let VIEW;
  if (fs.route === 'home') VIEW = HOME;
  if (fs.route === 'explorations') VIEW = EXPLORATIONS;

  return (
    <div className="App">
      <div className="main-page">
        {VIEW}
      </div>
    </div>
  )
}