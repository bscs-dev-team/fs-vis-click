import React, { useState } from "react";
import './FilterEdit.css';
import map_gray from './img/map_gray.png';
import table from './img/table.png';

export default function FilterEdit({ fs, setFs }) {
  const [showTable, setShowTable] = useState(false);

  /// LOAD DATA ///////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const { selectedExploration, editingVisual } = fs;
  const exploration = fs.explorations.find(e => e.id === selectedExploration);
  const visuals = exploration && exploration.visuals ? exploration.visuals : [];
  const visual = visuals.find(v => v.id === editingVisual) || {
    title: 'Untitled', description: '', image: map_gray, filter: 1
  };
  const selectedFilter = exploration.filters.find(f => f.id === Number(visual.filter));

  /// UI HANDLERS /////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function evt_OnTitleChange(event) {
    setFs(draft => {
      const exploration = draft.explorations.find(e => e.id === draft.selectedExploration);
      const visual = exploration.visuals.find(v => v.id === draft.editingVisual);
      exploration.filters.find(f => f.id === visual.filter).label = event.target.value;
    });
  }
  function evt_OnSelect(event) {
    setFs(draft => {
      draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.find(v => v.id === draft.selectedVisual).filter = event.target.value
    });
  }
  function evt_ToggleMap(event) {
    setShowTable(!showTable);
  }
  function evt_OnExit(event) {
    setFs(draft => {
      draft.editingFilter = null;
    });
  }

  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return (
    <div>
      <div className="screen"></div>
      <div className="FilterEdit">
        <h3>SELECT YOUR DATA</h3>
        <div className="content">

          <div className="sidebar">
            <div>
              <label>SELECTED DATA NAME </label>
              <input type="text" value={selectedFilter.label} placeholder="Data Source and Filter" onChange={evt_OnTitleChange} />
            </div>
            <div className="steps">
              <div className="step">
                <label>1. Select Data Source</label>
                <div>
                  <div className="help">Select the source from which to fetch data.</div>
                  <select>
                    <option value="frog">FrogWatch USA</option>
                    <option value="chesapeake">Chesapeake</option>
                  </select>
                  <div>
                    <input type="checkbox" /> Limit to 5,000 results
                  </div>
                </div>
              </div>
              <div className="step">
                <label>2. Filters</label>
                <div>
                  <div className="help">Add filters to show only items that match your criteria.</div>
                  <div>
                    <button>+ Add filter</button> 1 filter
                  </div>

                  <br />

                  <label>Value</label>
                  <div className="help">Add filters to show only items that match your criteria.</div>
                  <div className="form">

                    <label>Field:</label>
                    <select>
                      <option>Wind</option>
                      <option>Species</option>
                    </select>
                    <label>Match:</label>
                    <select>
                      <option>Any of these values</option>
                      <option>Any value except</option>
                    </select>
                    <label>Values:</label>
                    <input type="text" value={visual.filterSource} />
                    <hr /><br />

                    <label>Field:</label>
                    <select>
                      <option>Wind</option>
                      <option>Species</option>
                    </select>
                    <label>Match:</label>
                    <select>
                      <option>Any of these values</option>
                      <option>Any value except</option>
                    </select>
                    <label>Values:</label>
                    <input type="text" value={visual.filterSource} />
                    <hr /><br />

                    <label>Field:</label>
                    <select>
                      <option>Wind</option>
                      <option>Species</option>
                    </select>
                    <label>Match:</label>
                    <select>
                      <option>Any of these values</option>
                      <option>Any value except</option>
                    </select>
                    <label>Values:</label>
                    <input type="text" value={visual.filterSource} />

                  </div>
                </div>
              </div>
              <br />
            </div>
            <div className="controlbar">
              <button disabled>Edit a Copy</button>
              <div style={{ flexGrow: 1 }}></div>
              <button onClick={evt_OnExit}>Cancel</button>
              <button className="primary" onClick={evt_OnExit}>Save</button>
            </div>
          </div>


          <div className="visualization">
            <div className="minicontrolbar">
              <label>DATA SELECTION PREVIEW: {visual.filter}</label>
              <div className="tableOrMap">
                <label>Table</label>
                <input value={visual.showTable ? "0" : "1"} onClick={evt_ToggleMap} readOnly type="range" min="0" max="1" step="1" />
                <label>Map</label>
              </div>
            </div>
            <img src={showTable ? table : map_gray} />
          </div>

          <div className="table">
          </div>

        </div>
      </div>
    </div >
  )
}