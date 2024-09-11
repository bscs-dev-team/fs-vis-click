import React, { useState, useCallback } from "react";
import { useImmer } from "use-immer";
import './App.css';
import Home from './Home';
import Login from './Login';
import Explorations from './Explorations';

import allspecies_map from './img/allspecies_map.png';
import allspecies_histo from './img/allspecies_histo.png';
import threespecies_histo from './img/threespecies_histo.png';
import map_gray from './img/map_gray.png';

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
  showEditModeDialog: true,
  showTour: false,
  tourStep: 0,
  explorations: [
    {
      id: 1,
      name: 'All 2021 Data',
      description: 'A histogram of frog and toad observations', modified: new Date(),
      image: allspecies_map,
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 1, type: 'map', image: allspecies_map, showTable: false },
        { id: 2, title: 'Species Histogram', description: 'A histogram showing all species observed', filter: 2, type: 'histo', image: allspecies_histo, showTable: false },
        { id: 3, title: 'CA Species Histogram', description: 'A histogram showing CA frogs', filter: 3, type: 'map', image: threespecies_histo, showTable: false }
      ],
      filters: [{ id: 4, label: 'CA Frogs' }, ...DEFAULT_FILTERS],
      featured: true,
      privacy: 'Public',
      isOwner: false
    },
    {
      id: 2,
      name: 'Frog Watch - All Data Visualization + Filters',
      description: 'A histogram of American Bullfrogs', modified: new Date(),
      image: allspecies_map,
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 1, type: 'map', image: allspecies_map, showTable: false },
      ],
      filters: [...DEFAULT_FILTERS],
      featured: true,
      privacy: 'Public',
      isOwner: false
    },
    {
      id: 3,
      name: 'Filter by Species',
      description: 'A map of American Bullfrogs', modified: new Date(),
      image: map_gray,
      visuals: [],
      filters: [...DEFAULT_FILTERS],
      featured: true,
      privacy: 'Public',
      isOwner: false
    },
    {
      id: 4,
      name: 'Invitations To Inquiry: Frog Eat Frog World',
      description: 'A histogram of frog and toad observations', modified: new Date(),
      image: allspecies_map,
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 1, type: 'map', image: allspecies_map, showTable: false },
        { id: 2, title: 'Species Histogram', description: 'A histogram showing all species observed', filter: 2, type: 'histo', image: allspecies_histo, showTable: false },
        { id: 3, title: 'CA Species Histogram', description: 'A histogram showing CA frogs', filter: 3, type: 'map', image: threespecies_histo, showTable: false }
      ],
      filters: [{ id: 4, label: 'CA Frogs' }, ...DEFAULT_FILTERS],
      privacy: 'Public',
      isOwner: false,
      favorite: true
    },
    {
      id: 5,
      name: 'Invitations To Inquiry: Frog Symphony',
      description: 'A histogram of American Bullfrogs', modified: new Date(),
      image: allspecies_map,
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 1, type: 'map', image: allspecies_map, showTable: false },
      ],
      filters: [...DEFAULT_FILTERS],
      privacy: 'Public',
      isOwner: false,
      favorite: true
    },
    {
      id: 6,
      name: 'Invitations To Inquiry: Frog Symphony Maps',
      description: 'A map of American Bullfrogs', modified: new Date(),
      image: map_gray,
      visuals: [],
      filters: [...DEFAULT_FILTERS],
      privacy: 'Public',
      isOwner: false,
      favorite: true
    },
    {
      id: 7,
      name: 'Akron Maps',
      description: 'A histogram of frog and toad observations', modified: new Date(),
      image: allspecies_map,
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 1, type: 'map', image: allspecies_map, showTable: false },
        { id: 2, title: 'Species Histogram', description: 'A histogram showing all species observed', filter: 2, type: 'histo', image: allspecies_histo, showTable: false },
        { id: 3, title: 'CA Species Histogram', description: 'A histogram showing CA frogs', filter: 3, type: 'histo', image: threespecies_histo, showTable: false }
      ],
      filters: [{ id: 4, label: 'CA Frogs' }, ...DEFAULT_FILTERS],
      privacy: 'Public',
      isOwner: true,
      favorite: true
    },
    {
      id: 8,
      name: 'Histogram American Bullfrogs',
      description: 'A histogram of American Bullfrogs', modified: new Date(),
      image: allspecies_map,
      visuals: [
        { id: 1, title: 'All 2021 Data', description: 'All data collected in 2021', filter: 1, type: 'map', image: allspecies_map, showTable: false },
      ],
      filters: [...DEFAULT_FILTERS],
      privacy: 'Public',
      isOwner: true
    },
    {
      id: 9,
      name: 'Map American Bullfrogs',
      description: 'A map of American Bullfrogs', modified: new Date(),
      image: map_gray,
      visuals: [],
      filters: [...DEFAULT_FILTERS],
      privacy: 'Public',
      isOwner: true
    },
    {
      id: 10,
      name: 'Copy of Histogram Frog vs Toad',
      description: 'A histogram of frog and toad observations', modified: new Date(),
      image: map_gray,
      visuals: [],
      filters: [...DEFAULT_FILTERS],
      privacy: 'Public',
      isOwner: true
    },
  ],
  // datasets: DATASETS
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

  function evt_StartTour() {
    setFs(draft => {
      draft.showTour = true;
      draft.tourStep = 0;
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
      <div className="navbar">
        <button className="transparent">Help</button>
        {fs.selectedExploration && <button className="transparent" onClick={evt_StartTour}>Quick Tour</button>}
        <Login fs={fs} setFs={setFs} />
      </div>
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
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
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