import './EXPEdit.css';
import histo from './img/vis-widget-card-histogram.png';
import map from './img/vis-widget-card-map.png';
import numeric from './img/vis-widget-card-numeric.png';
import range from './img/vis-widget-card-range-plot.png';
import scatterplot from './img/vis-widget-card-scatterplot.png';
import timeseries from './img/vis-widget-card-timeseries.png';
import map_gray from './img/map_gray.png';

export default function EXPEdit({ fs, setFs, onExit }) {

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
            <input type="text" placeholder="MAP or GRAPH Title" />
            <label>DESCRIBE THIS MAP/GRAPH</label>
            <input type="text" placeholder="Summarize what this map/graph shows" />
            <br />
            <br />
            <label>1. Select Your Data</label>
            <select>
              <option>All Observations</option>
              <option>Recent Observations</option>
            </select>
            <div className="minicontrolbar">
              <button className="small">EDIT</button>
              <button className="small">NEW DATA SELECTION</button>
            </div>
            <label>2. Select a map/graph type</label>
            <div className="typeselector">
              {TYPES}
            </div>
          </div>

          <div className="visualization">
            <div className="minicontrolbar">
              <label>DATA SELECTION PREVIEW: All Observations</label>
              <div className="tableOrMap">
                <label>Table</label><input type="range" min="0" max="1" step="1" /><label>Map</label>
              </div>
            </div>
            <img src={map_gray} />
          </div>

          <div className="table">
          </div>

        </div>
        <div className="controlbar">
          <button disabled>Duplicate</button>
          <div style={{ flexGrow: 1 }}></div>
          <button disabled>Cancel</button>
          <button className="primary" onClick={onExit}>Save</button>
        </div>
      </div>
    </div >
  )
}