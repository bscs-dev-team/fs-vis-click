import './Exploration.css';
import Login from './Login';
import EXPItemsList from './EXPItemsList';
import { title } from 'process';

export default function Exploration({ fs, setFs }) {


  /// LOAD DATA ///////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const { selectedExploration, selectedVisual } = fs;
  const exploration = fs.explorations.find(e => e.id === selectedExploration) || {
    name: 'Untitled', description: '', modifed: new Date(), privacy: 'Private', visuals: []
  };
  const visuals = exploration && exploration.visuals ? exploration.visuals : [];
  const visual = visuals.find(v => v.id === selectedVisual) || {
    title: 'Untitled', description: '', image: null
  };


  /// UI HANDLERS /////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function evt_SetPublic(event) { alert('set privacy to public') }
  function evt_CopyLink(event) { alert('Copy URL to clipboard') }
  function evt_Embed(event) { alert('Embed URL') }
  function evt_SaveAs(event) { alert('Save As...') }

  function setRoute(route) {
    setFs(draft => {
      draft.route = route;
    });
  }

  function deselectExploration() {
    setFs(draft => {
      draft.selectedExploration = null;
    });
  }

  function evt_OnTitleChange(event) {
    setFs(draft => {
      draft.explorations.find(e => e.id === draft.selectedExploration).name = event.target.value;
    });
  }
  function evt_OnDescriptionChange(event) {
    setFs(draft => {
      draft.explorations.find(e => e.id === draft.selectedExploration).description = event.target.value;
    });
  }


  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  const NAVBAR = (
    <div className="navbar">
      <div>
        <span onClick={() => setRoute('home')}>Frogwatch</span> &gt;{' '}
        <span onClick={deselectExploration}>My Data Explorations</span> &gt;{' '}
        {selectedExploration}: {exploration.name}
      </div>
      <Login fs={fs} setFs={setFs} />
    </div>
  );

  const TITLE = (
    <div className="title">
      EXPLORATION:{' '}
      {fs.user.isLoggedIn
        ? (
          <>
            <input type="text" value={exploration.name} onChange={evt_OnTitleChange} />
            <button className='transparent-light'>EDIT</button>
          </>
        )
        : <>{exploration.name}</>
      }
    </div>
  );

  const SIDEBAR = (
    <div className="sidebar">
      <EXPItemsList fs={fs} setFs={setFs} />
      <div className="notes">
        <h4>YOUR IDEAS & QUESTIONS</h4>
        {fs.user.isLoggedIn
          ? <textarea
            value={exploration.description}
            placeholder="You can use this space to describe the idea or question you would like to explore.  Add any ideas and questions as you make new maps and graphs"
            onChange={evt_OnDescriptionChange}
          />
          : <div className="description">{exploration.description}</div>
        }
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
      {fs.user.isLoggedIn && <button className="transparent" onClick={evt_SaveAs}>Save Exploration As...</button>}
      <button className="outline" onClick={deselectExploration}>Back to Explorations</button>
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