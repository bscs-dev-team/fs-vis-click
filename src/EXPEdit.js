import './EXPEdit.css';
import histo from './img/vis-widget-card-histogram.png';
import map from './img/vis-widget-card-map.png';
import numeric from './img/vis-widget-card-numeric.png';
import range from './img/vis-widget-card-range-plot.png';
import scatterplot from './img/vis-widget-card-scatterplot.png';
import timeseries from './img/vis-widget-card-timeseries.png';
import map_gray from './img/map_gray.png';

export default function EXPEdit({ onExit }) {
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
              <img src={histo} />
              <img src={map} />
              <img src={numeric} />
              <img src={range} />
              <img src={scatterplot} />
              <img src={timeseries} />
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