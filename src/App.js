import React, { useState, useCallback } from "react";
import { useImmer } from "use-immer";
import './App.css';
import Home from './Home';
import Login from './Login';
import Explorations from './Explorations';

import allspecies_map from './img/allspecies_map.png';
import allspecies_histo from './img/allspecies_histo.png';
import threespecies_histo from './img/threespecies_histo.png';

/// CONSTANTS ////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const MAP_TYPES = ['map', 'histo', 'numeric', 'range', 'scatterplot', 'timeseries'];




/// INIT STATE ////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const DEFAULT_FILTERS = [
  { id: 1, label: 'All Observations' },
  { id: 2, label: 'Recent Observations' },
  { id: 3, label: 'My Observations' }
];

const initialFSState = {
  defaultFilters: DEFAULT_FILTERS,
  user: {
    isLoggedIn: false,
    userName: null,
  },
  route: 'home', // 'home' or 'explorations'
  selectedExploration: null,
  selectedVisual: null,
  selectedDataset: null,
  editingVisual: null,
  editingFilter: null,
  editWithoutSaving: null, // Allow non-logged in user to edit visualizations
  explorations: [
    {
      id: 1,
      name: 'Histogram Frog vs Toad',
      description: 'A histogram of frog and toad observations', modified: new Date(), privacy: 'Public',
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 1, type: 'map', image: allspecies_map, showTable: false },
        { id: 2, title: 'Species Histogram', description: 'A histogram showing all species observed', filter: 2, type: 'histo', image: allspecies_histo, showTable: false },
        { id: 3, title: 'CA Species Histogram', description: 'A histogram showing CA frogs', filter: 3, type: 'map', image: threespecies_histo, showTable: false }
      ],
      filters: [{ id: 4, label: 'CA Frogs' }, ...DEFAULT_FILTERS]
    },
    {
      id: 2,
      name: 'Histogram American Bullfrogs',
      description: 'A histogram of American Bullfrogs', modified: new Date(), privacy: 'Public',
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 1, type: 'map', image: allspecies_map, showTable: false },
      ],
      filters: [...DEFAULT_FILTERS]
    },
    {
      id: 3,
      name: 'Map American Bullfrogs',
      description: 'A map of American Bullfrogs', modified: new Date(), privacy: 'Public',
      filters: [...DEFAULT_FILTERS]
    },
    {
      id: 4,
      name: 'Copy of Histogram Frog vs Toad',
      description: 'A histogram of frog and toad observations', modified: new Date(), privacy: 'Public',
      filters: [...DEFAULT_FILTERS]
    },
  ],
  datasets: DATASETS
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
      // if clicking "Explorations" again, clear the selected exploration 
      // so we'll go back to the main Exploration screen
      if (route === 'explorations') draft.selectedExploration = null;
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
          className={fs.route === 'data' ? 'outline' : 'transparent'}
          onClick={() => evt_SetRoute('data')}>Data</button>
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
  const DATA = <>
    {NAVBAR}
    <div>Data</div>
    <button>+ Add Data</button>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>My Observations</div>
      <div>Recent Observations</div>
      <div>All Observations</div>
    </div>
  </>
  const EXPLORATIONS = <>
    {NAVBAR}
    <Explorations fs={fs} setFs={setFs} />
  </>;


  let VIEW;
  if (fs.route === 'home') VIEW = HOME;
  if (fs.route === 'data') VIEW = DATA;
  if (fs.route === 'explorations') VIEW = EXPLORATIONS;

  return (
    <div className="App">
      <div className="main-page">
        {VIEW}
      </div>
    </div>
  )
}