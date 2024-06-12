import './Exploration.css';
import EXPItemsList from './EXPItemsList';

export default function Exploration({ onExit }) {

  function evt_SetPublic(event) { alert('set privacy to public') }
  function evt_CopyLink(event) { alert('Copy URL to clipboard') }
  function evt_Embed(event) { alert('Embed URL') }
  function evt_SaveAs(event) { alert('Save As...') }
  function evt_BackToExplorations(event) { onExit(event) }

  const NAVBAR = (
    <div className="navbar">
      <div>Frogwatch &gt; My Data Exploration &gt; 39</div>
      <div>bentbloh@gmail.com</div>
    </div>
  );

  const TITLE = (
    <div className="title">
      <label>EXPLORATION
        <input type="text" value="Untitled" />
        <button className='transparent-light'>EDIT</button>
      </label>
    </div>
  );

  const SIDEBAR = (
    <div className="sidebar">
      <EXPItemsList />
      <div className="notes">
        <h4>YOUR IDEAS & QUESTIONS</h4>
        <textarea placeholder="You can use this space to describe the idea or question you would like to explore.  Add any ideas and questions as you make new maps and graphs"></textarea>
      </div>
    </div>
  );

  const VISUALIZATION = (
    <div className="visualization">
      <div className="help">
        To start, click "NEW DISPLAY" to create a new way of looking at the data in a display (e.g., graph, map).
      </div>
    </div>
  );

  const FOOTER = (
    <div className="footer">
      <button className="transparent" onClick={evt_SetPublic}>PRIVATE: Only you can view this exploration</button>
      <button className="transparent" onClick={evt_CopyLink}>Copy Link</button>
      <button className="transparent" onClick={evt_Embed}>Embed Exploration</button>
      <button className="transparent" onClick={evt_SaveAs}>Save Exploration As...</button>
      <button className="outline" onClick={evt_BackToExplorations}>Back to Explorations</button>
    </div>
  );

  return (
    <div className="Exploration">
      {NAVBAR}
      {TITLE}
      <div className="content">
        {SIDEBAR}
        {VISUALIZATION}
      </div>
      {FOOTER}
    </div >
  )
}