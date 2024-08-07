import React, { useRef, useEffect } from "react";
import './EXPView.css';
import histo from './img/vis-widget-card-histogram.png';
import map from './img/vis-widget-card-map.png';
import numeric from './img/vis-widget-card-numeric.png';
import range from './img/vis-widget-card-range-plot.png';
import scatterplot from './img/vis-widget-card-scatterplot.png';
import timeseries from './img/vis-widget-card-timeseries.png';
import map_gray from './img/map_gray.png';
import table from './img/table.png';

export default function EXPView({ id, fs, setFs }) {

  const myRef = useRef(null); // used for scrollIntoView

  useEffect(() => {
    if (fs.selectedVisual === id) {
      myRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [fs.selectedVisual, id]);


  const TYPES = (<>
    <div className="card">
      <img src={map} />
      <label>Map</label>
      <p><i>Geographic</i></p>
      <p>Display observations on a map with a configurable base layer and additional data layers</p>
    </div>
    <div className="card">
      <img src={histo} />
      <label>Histogram</label>
      <p><i>Categorical</i></p>
      <p>Display observations in a bar chart grouped by the value of a selected field</p>
    </div>
    <div className="card">
      <img src={numeric} />
      <label>Numeric Summary</label>
      <p><i>Summary</i></p>
      <p>Display a single aggregate value representing all the observations</p>
    </div>
    <div className="card">
      <img src={range} />
      <label>Time Series</label>
      <p><i>Line graph</i></p>
      <p>Display values over time for each station</p>
    </div>
    <div className="card">
      <img src={scatterplot} />
      <label>Scatter Plot</label>
      <p><i>Dispersion</i></p>
      <p>Compare 2 numeric values from each observation simultaneously</p>
    </div>
    <div className="card">
      <img src={timeseries} />
      <label>Range Plot</label>
      <p><i>Range</i></p>
      <p>Compare relative numeric ranges</p>
    </div>
  </>);

  /// LOAD DATA ///////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const { selectedExploration, selectedVisual, explorations, datasets } = fs;
  const exploration = explorations.find(e => e.id === selectedExploration);
  const visuals = exploration && exploration.visuals ? exploration.visuals : [];
  const visual = visuals.find(v => v.id === id) || {
    title: 'Untitled', description: '', image: null
  };


  /// UI HANDLERS /////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function evt_OnTitleChange(event) {
    setFs(draft => {
      draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.find(v => v.id === draft.selectedVisual).title = event.target.value;
    });
  }
  function evt_OnDescriptionChange(event) {
    setFs(draft => {
      draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.find(v => v.id === draft.selectedVisual).description = event.target.value;
    });
  }
  function evt_ToggleMap(event) {
    setFs(draft => {
      const vis = draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.find(v => v.id === id).showTable = event.target.value === "0" ? false : true;
    });
  }

  function evt_OnExit(event) {
    setFs(draft => {
      draft.selectedVisual = null;
    });
  }

  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const LAYERSDATA = [
    {
      title: 'Basemaps',
      layers: [
        'NatGeo w Wetlands',
        'Topographic',
        'Shaded Relief',
        'Satellite',
        'Gray',
        'World Oceans',
        'Street Map',
        'National Geographic',
      ]
    },
    {
      title: 'Thematic Data',
      layers: [
        'Land Cover (2016)',
        'Wetlands (Zoom in to Display)',
        'Tree Canopy',
        'Parks',
        'Tribal Lands',
        'County Boundaries',
        'American Bullfrog Range'
      ]
    }
  ]
  const LAYERS = LAYERSDATA.map((layer, i) => (
    <div className="layers" key={i}>
      <h4>{layer.title}</h4>
      {layer.layers.map((l, j) => (
        <label><input type="checkbox" key={j} defaultChecked={j === 1} />{l}</label>
      ))}
    </div>
  ));

  const LEGENDDATA = [
    1, 11, 21, 30, 40
  ];
  const LEGEND = (
    <div>
      <h4>Legend</h4>
      <p>Station Observation Count</p>
      <ul>
        {LEGENDDATA.map((l, j) => (
          <li key={j}>{l}</li>
        ))}
      </ul>
    </div>
  ));

  return (
    <div className="EXPView" key={visual.id} ref={myRef}>
      <div className="sidebar">
        {visual.type === 'map'
          ? (<>
            <h3>{LEGEND}</h3>
            <h3>{LAYERS}</h3>
          </>)
          : ''}
      </div>

      <div className="visualization">
        <div className="minicontrolbar">
          <div><b>{visual.title}</b>: {visual.description}</div>
          <div className="tableOrMap">
            <label>Table</label>
            <input value={visual.showTable ? "0" : "1"} onClick={evt_ToggleMap} readOnly type="range" min="0" max="1" step="1" />
            <label>Map</label>
          </div>
        </div>
        <img src={visual.showTable ? table : visual.image} />
      </div>

      <div className="table">
      </div>
    </div>
  )
}