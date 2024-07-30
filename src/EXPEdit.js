import './EXPEdit.css';
import FilterEdit from './FilterEdit';
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
    <div className="card" onClick={() => evt_OnSelectType('map', map)}>
      <img src={map} />
      <label>Map</label>
      <p><i>Geographic</i></p>
      <p>Display observations on a map with a configurable base layer and additional data layers</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('histo', histo)}>
      <img src={histo} />
      <label>Histogram</label>
      <p><i>Categorical</i></p>
      <p>Display observations in a bar chart grouped by the value of a selected field</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('numeric', numeric)}>
      <img src={numeric} />
      <label>Numeric Summary</label>
      <p><i>Summary</i></p>
      <p>Display a single aggregate value representing all the observations</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('timeseries', timeseries)}>
      <img src={timeseries} />
      <label>Time Series</label>
      <p><i>Line graph</i></p>
      <p>Display values over time for each station</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('scatterplot', scatterplot)}>
      <img src={scatterplot} />
      <label>Scatter Plot</label>
      <p><i>Dispersion</i></p>
      <p>Compare 2 numeric values from each observation simultaneously</p>
    </div>
    <div className="card" onClick={() => evt_OnSelectType('range', range)}>
      <img src={range} />
      <label>Range Plot</label>
      <p><i>Range</i></p>
      <p>Compare relative numeric ranges</p>
    </div>
  </>);

  /// LOAD DATA ///////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const { selectedExploration, editingVisual, editingFilter } = fs;
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
  function evt_OnSelectType(type, image) {
    setFs(draft => {
      const vis = draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.find(v => v.id === draft.selectedVisual);
      vis.type = type;
      vis.image = image;
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
  function evt_OnSelectFilter(event) {
    setFs(draft => {
      draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.find(v => v.id === draft.editingVisual).filter = Number(event.target.value)
    });
  }
  function evt_EditFilter(event) {
    setFs(draft => {
      draft.editingFilter = visual.filter;
    });
  }
  function evt_NewFilter(event) {
    setFs(draft => {
      const newId = Math.random();
      const newFilter = { id: newId, label: "Untitled" };
      const exploration = draft.explorations.find(e => e.id === draft.selectedExploration);
      const visual = exploration.visuals.find(v => v.id === draft.editingVisual);
      exploration.filters = [newFilter, ...exploration.filters];
      visual.filter = newId;
      draft.editingFilter = newId;
    });
  }


  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const SELECT_TYPE = (
    <div className="step">
      <h4>2. Select a map/graph type</h4>
      <div className="typeselector">
        {TYPES}
      </div>
    </div>
  )

  const CONFIGURE = (
    <div className="step">
      <h4>2. Configure Map/Graph</h4>
      <div className="configure">
        <label className="help">Determine how the data is displayed</label>

        <label>Selected Map/Graph Type: {visual.type} <button onClick={evt_DeselectType}>Change Map/Graph Type</button></label>


        <label>X Axis:&nbsp;
          <select>
            <option>Air Temperature</option>
            <option>Call Intensity</option>
          </select>
        </label>

        <label>X Axis Order:&nbsp;
          <select>
            <option>Air Temperature</option>
            <option>Call Intensity</option>
          </select>
        </label>

        <label><input type="checkbox" readOnly />&nbsp;Round bucket values</label>

        <label>Y Axis summary method:&nbsp;
          <select>
            <option>Air Temperature</option>
            <option>Call Intensity</option>
          </select>
        </label>

        <label>Categorize By:&nbsp;
          <select>
            <option>Air Temperature</option>
            <option>Call Intensity</option>
          </select>
        </label>
      </div>
    </div>
  );

  return (
    <div>
      <div className="screen"></div>
      <div className="EXPEdit">
        <h3>MAP/GRAPH</h3>
        <div className="content">

          <div className="sidebar">
            <label>TITLE</label>
            <input type="text" value={visual.title} placeholder="MAP or GRAPH Title" onChange={evt_OnTitleChange} />
            <label>DESCRIBE THIS MAP/GRAPH</label>
            <input type="text" value={visual.description} placeholder="Summarize what this map/graph shows" onChange={evt_OnDescriptionChange} />
            <div className="filter step">
              <label>1. Select Your Data</label>
              <div>
                <div className="minicontrolbar">
                  <select value={visual.filter} onChange={evt_OnSelectFilter}>
                    {exploration.filters.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>
                  <button className="mini" onClick={evt_EditFilter}>EDIT</button>
                </div>
                <button className="mini" onClick={evt_NewFilter}>NEW DATA SELECTION</button>
              </div>
            </div>
            <br />
            {visual.type ? CONFIGURE : SELECT_TYPE}
          </div>

          <div className="visualization">
            <div className="minicontrolbar">
              <label>DATA SELECTION PREVIEW: All Data</label>
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

        <div className="controlbar">
          <button disabled>Edit a Copy</button>
          <div style={{ flexGrow: 1 }}></div>
          <button onClick={onExit}>Cancel</button>
          <button className="primary" onClick={onExit}>Save</button>
        </div>
        {editingFilter && <FilterEdit fs={fs} setFs={setFs} />}
      </div>
    </div >
  )
}