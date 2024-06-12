import React, { useState, useCallback } from "react";
import { useImmer } from "use-immer";
import './Explorations.css';
import Exploration from './Exploration';
import allspecies_map from './img/allspecies_map.png';
import allspecies_histo from './img/allspecies_histo.png';
import threespecies_histo from './img/threespecies_histo.png';

const csv2json = require('csvtojson');
let csvFileUrl; // Defined in handleSetLayout;
import URLCHESAPEAKE from 'url:./data/chesapeake.csv';
import URLFROGS from 'url:./data/frogs.csv';
import URLJOURNEY from 'url:./data/journeynorth.csv';
import URLWATERINSIGHTS from 'url:./data/waterinsights.csv';

const DATASETS = [
  {
    label: 'chesapeake',
    url: URLCHESAPEAKE,
    headers: [ // in sort order
      "Station Name",
      "Observation Date",
      "Latitude",
      "Longitude",
      "Observation Time",
      "Observation Notes",
      "Relative Humidity",
      "Barometric Pressure",
      "Air Temperature",
      "Wind Direction ",
      "Visibility ",
      "Water Temperature",
      "Turbidity",
      "Secchi Depth",
      "Width",
      "Depth",
      "Stream Discharge",
      "Surface Water Appearance",
      "Stream Bank Eroision",
      "Water Type",
      "Salinity",
      "Conductivity",
      "Dissolved Oxygen",
      "Nitrate",
      "Ammonia",
      "Phosphate",
      "pH",
      "Biological Oxygen Demand",
      "Total Dissolved Solids",
      "Fecal Coliform",
      "Dissolved Carbon Dioxide",
      "Tolerant Macroinvertebrates",
      "Less Sensitive Macroinvertebrates",
      "Sensitive Macroinvertebrates",
      "Total Index Value",
      "Caddisfly (Trichoptera-Other)",
      "Mayfly (Ephemeroptera)",
      "Stonefly (Plecoptera)",
      "Watersnipe Flies (Diptera-Athericidae)",
      "Riffle Beetles (Elmidae)",
      "Water Pennies (Psephenidae)",
      "Gilled Snails (Viviparidae)",
      "Dobsonfies (Corydalinae)",
      "Fishflies (Chauliodinae)",
      "Netspinning Caddisfly (Trichoptera-Hydropsychidae)",
      "Damselflies (Zygoptera)",
      "Dragonflies (Anisoptera)",
      "Alderflies (Sialidae)",
      "Crayfish (Astacoidea)",
      "Scuds (Amphipoda)",
      "Aquatic Sowbugs (Isopoda)",
      "Clams (Sphaeriidae)",
      "Mussels (Palaeoheterodonta)",
      "Aquatic Worms (Oligochaeta)",
      "Black Flies (Diptera-Simuliidae)",
      "Midge Flies",
      "Leeches (Hirundinea)",
      "Lunged Snails (Pulmonata)",
      "Other Macroinvertebrate",
      "silt (mud)",
      'sand (1/16"" - 1/4"" grains)',
      'gravel (1/4"" - 2"" stones)',
      'cobbles (2"" - 10"" stones)',
      'boulders (> 10"" stones)',
      "trees",
      "shrubs",
      "grass",
      "bare soil",
      "rocks",
      "other"
    ]
  },
  {
    label: 'frogwatch',
    url: URLFROGS,
    headers: [ // in sort order
      "Observation Date",
      "Start Time",
      "End Time",
      "Species",
      "Call Intensity",
      "Air Temperature",
      "Characterize Land Use",
      "Observation Notes"
    ]
  },
  {
    label: 'journeynorth',
    url: URLJOURNEY,
    headers: [ // in sort order
      "Station Name",
      "Observation Date",
      "Latitude",
      "Longitude",
      "Reporting Category",
      "# Observed",
      "Comments"
    ]
  },
  {
    label: 'waterinsights',
    url: URLWATERINSIGHTS,
    headers: [ // in sort order
      "Observation Date",
      "Station Name",
      "Water Type",
      "pH",
      "Nitrate",
      "Nitrite",
      "Hardness",
      "Chlorine",
      "Alkalinity",
      "Other Observations",
      "Latitude",
      "Longitude"
    ]
  },
]


// CSV DATA LOADING
let alreadyLoaded = false;
let fieldsToShow = []; // in sort order
let fullDataset = [];

export default function Explorations() {
  const [route, setRoute] = useState('browser');
  // CSV
  const [selectedDataset, setSelectedDataset] = useState(DATASETS[0]);
  const [tableData, updateTableData] = useImmer({ count: 0, headers: [], data: [] });


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


  // UI Handlers - - - - - - - - - - - - - - - - - 
  function handleDatasetSelect(index) {
    setSelectedDataset(DATASETS[index]);
    console.log('handle datsetselect', JSON.stringify(DATASETS[index]));
  }
  function handleSetLayout(layout) {
    // 1. Load CSV First
    //    a. set selected dataset
    console.warn('selected dataset', selectedDataset.url, selectedDataset.headers)
    csvFileUrl = selectedDataset.url;
    fieldsToShow = selectedDataset.headers;
    // initFilters(selectedDataset.label);
    //    b. load 
    loadCSV();
    // // 2. Then set layout
    // setLayout(layout);
  }
  handleSetLayout('chesapeake');


  /// CSV //////////////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -- Loader Function
  async function loadCSV() {
    if (alreadyLoaded) return console.log('...skipping');
    console.log('...loadCSV! csvFileUrl', csvFileUrl, fieldsToShow)
    await fetch(csvFileUrl)
      .then(r => r.text())
      .then(text => {
        console.log('......result', alreadyLoaded)
        alreadyLoaded = true;
        csv2json()
          .fromString(text)
          .then((json) => {
            if (json === undefined) return console.error('Could not load CSV!');
            const allData = {
              count: json.length,
              data: json,
              headers: fieldsToShow
            };
            fullDataset = allData;
            console.warn('......loadCSV apply filter allData is', allData)
            applyFilters(allData);
          });
      });
  }
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const applyFilters = useCallback((allData, filters) => {
    console.log('applyFIlter caleld fullDataset is', allData)
    updateTableData(draft => {
      draft.headers = allData.headers;
      // Apply Filters
      // data {
      //   Observation: '1/2/23',
      //   Temperature: 5,
      //   Chlorine: 0.01,
      //   Notes: undefined
      // }
      // filter   {
      //       title: "Chlorine > 0.1ppm",
      //       field: "Chlorine",
      //       min: 0.1,
      //       max: undefined
      //     }
      const filteredData = filters
        ? allData.data.filter(d => {
          let passed = true;
          filters.forEach(f => {
            if (!Object.hasOwn(d, f.field)) return;
            if (f.eq !== undefined && !String(d[f.field]).includes(String(f.eq))) passed = false;
            if (f.min !== undefined && d[f.field] <= f.min) passed = false;
            if (f.max !== undefined && d[f.field] >= f.max) passed = false;
          });
          return passed;
        })
        : allData.data;
      const rowData = filteredData.map(row => {
        const items = [];
        fieldsToShow.forEach(k => items.push(row[k]));
        return items;
      });
      draft.data = rowData;
      draft.count = rowData.length;
      console.log('count', draft.count)
    });
  }, [updateTableData, fieldsToShow]);

  const newFilters = undefined;
  applyFilters(fullDataset, newFilters);

  /// UI HANDLERS /////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function evt_ShowExploration(event) {
    console.log('Show Exploration', event.target);
    setRoute('exploration');
  }
  function evt_CloseExploration(event) { console.log('Close Exploration', event.target); setRoute('browser'); }


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
          <tr key={i}>
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
      {BROWSER_TABLE}
    </>
  );

  const EXPLORATION = (
    <Exploration onExit={evt_CloseExploration} />
  );

  let VIEW;
  if (route === 'browser') VIEW = BROWSER;
  if (route === 'exploration') VIEW = EXPLORATION;

  return (
    <div className="Explorations">
      {VIEW}
    </div>
  );
}

