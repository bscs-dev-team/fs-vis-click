import './EXPEdit.css';
import histo from './img/vis-widget-card-histogram.png';
import map from './img/vis-widget-card-map.png';
import numeric from './img/vis-widget-card-numeric.png';
import range from './img/vis-widget-card-range-plot.png';
import scatterplot from './img/vis-widget-card-scatterplot.png';
import timeseries from './img/vis-widget-card-timeseries.png';
import map_gray from './img/map_gray.png';
import table from './img/table.png';

export default function EXPEdit({ fs, setFs, onExit }) {

  const TYPES = (<>
    <div className="card" onClick={() => evt_OnSelectType('map')}>
      <img src={map} />
      <label>Map</label>
      <p><i>Geographic</i></p>
      <p>Display observations on a map with a configurable base layer and additional data layers</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('histo')}>
      <img src={histo} />
      <label>Histogram</label>
      <p><i>Categorical</i></p>
      <p>Display observations in a bar chart grouped by the value of a selected field</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('numeric')}>
      <img src={numeric} />
      <label>Numeric Summary</label>
      <p><i>Summary</i></p>
      <p>Display a single aggregate value representing all the observations</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('timeseries')}>
      <img src={timeseries} />
      <label>Time Series</label>
      <p><i>Line graph</i></p>
      <p>Display values over time for each station</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('scatterplot')}>
      <img src={scatterplot} />
      <label>Scatter Plot</label>
      <p><i>Dispersion</i></p>
      <p>Compare 2 numeric values from each observation simultaneously</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('range')}>
      <img src={range} />
      <label>Range Plot</label>
      <p><i>Range</i></p>
      <p>Compare relative numeric ranges</p>
    </div>
  </>);

  /// LOAD DATA ///////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const { selectedExploration, editingVisual } = fs;
  const exploration = fs.explorations.find(e => e.id === selectedExploration);
  const visuals = exploration && exploration.visuals ? exploration.visuals : [];
  const visual = visuals.find(v => v.id === editingVisual) || {
    title: 'Untitled', description: '', image: map_gray
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
  function evt_OnSelectType(type) {
    setFs(draft => {
      draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.find(v => v.id === draft.selectedVisual).type = type;
    });
  }
  function evt_DeselectType() {
    setFs(draft => {
      draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.find(v => v.id === draft.editingVisual).type = null;
    });
  }
  function evt_ToggleMap(event) {
    setFs(draft => {
      const vis = draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.find(v => v.id === draft.editingVisual).showTable = event.target.value === "0" ? false : true;
    });
  }


  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const SELECT_TYPE = (
    <>
      <label>2. Select a map/graph type</label>
      <div className="typeselector">
        {TYPES}
      </div>
    </>
  )

  const CONFIGURE = (
    <>
      <label>2. Configure Map/Grap</label>
      <div className="configure">
        <label className="help">Determine how the data is displayed</label>

        <label>Selected Graph Type: {visual.type} <button onClick={evt_DeselectType}>Change Map/Graph Type</button></label>


        <label>X Axis:
          <select>
            <option>Air Temperature</option>
            <option>Call Intensity</option>
          </select>
        </label>

        <label>X Axis Order:
          <select>
            <option>Air Temperature</option>
            <option>Call Intensity</option>
          </select>
        </label>

        <label><input type="checkbox" />&nbsp;Round bucket values</label>

        <label>Y Axis summary method
          <select>
            <option>Air Temperature</option>
            <option>Call Intensity</option>
          </select>
        </label>

        <label>Categorize By:
          <select>
            <option>Air Temperature</option>
            <option>Call Intensity</option>
          </select>
        </label>
      </div>
    </>
  );

  return (
    <div>
      <div className="screen"></div>
      <div className="EXPEdit">
        <div className="content">

          <div className="sidebar">
            <h3>DISPLAY</h3>
            <br />
            <br />
            <label>TITLE</label>
            <input type="text" value={visual.title} placeholder="MAP or GRAPH Title" onChange={evt_OnTitleChange} />
            <label>DESCRIBE THIS MAP/GRAPH</label>
            <input type="text" value={visual.description} placeholder="Summarize what this map/graph shows" onChange={evt_OnDescriptionChange} />
            <br />
            <br />
            <label>1. Select Your Data</label>
            <select value={visual.filter}>
              <option value="all">All Observations</option>
              <option value="recent">Recent Observations</option>
              <option value="ca">California Observations</option>
            </select>
            <div className="minicontrolbar">
              <button className="small">EDIT</button>
              <button className="small">NEW DATA SELECTION</button>
            </div>
            <br />
            {visual.type ? CONFIGURE : SELECT_TYPE}
          </div>

          <div className="visualization">
            <div className="minicontrolbar">
              <label>DATA SELECTION PREVIEW: All Observations</label>
              <div className="tableOrMap">
                <label>Table</label>
                <input value={visual.showTable ? "0" : "1"} onClick={evt_ToggleMap} type="range" min="0" max="1" step="1" />
                <label>Map</label>
              </div>
            </div>
            <img src={visual.showTable ? table : visual.image} />
          </div>

          <div className="table">
          </div>

        </div>
        <div className="controlbar">
          <button disabled>Duplicate</button>
          <div style={{ flexGrow: 1 }}></div>
          <button onClick={onExit}>Cancel</button>
          <button className="primary" onClick={onExit}>Save</button>
        </div>
      </div>
    </div >
  )
}