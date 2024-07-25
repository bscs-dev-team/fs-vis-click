import React, { useState } from "react";
import './Exploration.css';
import NotLoggedIn from "./NotLoggedIn";
import EXPItemsList from './EXPItemsList';
import EXPView from './EXPView';
import { title } from 'process';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
const IcnPencil = <FontAwesomeIcon icon={faPencil} />;

export default function Exploration({ fs, setFs }) {
  const [titleIsEditable, setTitleIsEditable] = useState(false);
  const [descriptionIsEditable, setDescriptionIsEditable] = useState(false);


  /// LOAD DATA ///////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const { selectedExploration, selectedVisual, explorations } = fs;
  const exploration = explorations.find(e => e.id === selectedExploration) || {
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
  function evt_Embed(event) { alert('Show and copy Embed URL') }
  function evt_SaveAs(event) { alert('Show "Save As..." dialog') }

  function setRoute(route) {
    setFs(draft => {
      draft.selectedExploration = null;
      draft.selectedVisual = null;
      draft.route = route;
    });
  }

  function deselectExploration() {
    setFs(draft => {
      draft.selectedExploration = null;
    });
  }

  function evt_ToggleTitleEdit(event) {
    setTitleIsEditable(!titleIsEditable);
  }

  function evt_ToggleDescriptionEdit(event) {
    setDescriptionIsEditable(!descriptionIsEditable);
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

  function evt_TogglePublic(event) {
    setFs(draft => {
      const vis = draft.explorations.find(e => e.id === draft.selectedExploration)
        .privacy = event.target.value === "0" ? "Private" : "Public";
    });
  }


  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  const NAVBAR = (
    <div className="navbar">
      <div>
        <span onClick={() => setRoute('home')}>Home</span> &gt;{' '}
        <span onClick={deselectExploration}>Explorations</span> &gt;{' '}
        {selectedExploration}: {exploration.name}
      </div>
    </div>
  );

  const TITLE = (
    <div className="title">
      EXPLORATION:{' '}
      {(fs.user.isLoggedIn || fs.editWithoutSaving) && !exploration.locked
        ? titleIsEditable
          ? (
            <>
              <input type="text" value={exploration.name} onChange={evt_OnTitleChange} />
              <button className='transparent-light' onClick={evt_ToggleTitleEdit}>Save</button>
            </>
          )
          : (
            <>
              {exploration.name}
              <button className='transparent-light' onClick={evt_ToggleTitleEdit}>{IcnPencil}</button>
            </>
          )
        : <>{exploration.name}</>
      }
      <div style={{ flexGrow: 1 }}></div>
      <div className="tableOrMap">
        <label>Public</label>
        <input value={exploration.privacy === 'Public' ? "0" : "1"} onClick={evt_TogglePublic} readOnly type="range" min="0" max="1" step="1" />
        <label>Private</label>
      </div>
    </div>
  );

  const SIDEBAR = (
    <div className="sidebar">
      <EXPItemsList fs={fs} setFs={setFs} />
      <div className="notes">
        {(fs.user.isLoggedIn || fs.editWithoutSaving) && !exploration.locked
          ? descriptionIsEditable
            ? <>
              <h4>YOUR IDEAS & QUESTIONS
                <button className='transparent-light' onClick={evt_ToggleDescriptionEdit}>Save</button>
              </h4>
              <textarea
                value={exploration.description}
                placeholder="You can use this space to describe the idea or question you would like to explore.  Add any ideas and questions as you make new maps and graphs"
                onChange={evt_OnDescriptionChange}
              />

            </>
            : <>
              <h4>YOUR IDEAS & QUESTIONS
                <button className='transparent-light' onClick={evt_ToggleDescriptionEdit}>{IcnPencil}</button>
              </h4>
              <div className="description">{exploration.description}</div>
            </>
          : <>
            <h4>YOUR IDEAS & QUESTIONS</h4>
            <div className="description">{exploration.description}</div>
          </>
        }
      </div>
    </div>
  );

  const VISUALIZATION = (
    <div className="visualization">
      {selectedVisual
        ? <div className="vis-list">
          {visuals.map(v => <EXPView key={v.id} id={v.id} fs={fs} setFs={setFs} />)}
        </div>
        : <div className="help">
          To start, click "NEW MAP/GRAPH" to create a new way of looking at the data in a display (e.g., graph, map).
        </div>}
    </div>
  );

  const FOOTER = (
    <div className="footer">
      <button className="transparent" onClick={evt_CopyLink}>Copy Link</button>
      <button className="transparent" onClick={evt_Embed}>Embed Exploration</button>
      <button className="primary" onClick={evt_SaveAs}>Edit a Copy</button>
      <button className="secondary" onClick={deselectExploration}>Back to Explorations</button>
    </div>
  );

  return (
    <div className="Exploration">
      {NAVBAR}
      <div className="border">
        {TITLE}
        <div className="content">
          {SIDEBAR}
          {VISUALIZATION}
        </div>
        {FOOTER}
        {!fs.user.isLoggedIn && !fs.editWithoutSaving && !exploration.locked && <NotLoggedIn fs={fs} setFs={setFs} />}
      </div>
    </div>
  )
}