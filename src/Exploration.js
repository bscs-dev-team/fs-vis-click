import React, { useState, useEffect } from "react";
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
  // if there isn't a selectedVisual, select the first one
  if (!selectedVisual && exploration.visuals.length > 0) {
    setFs(draft => {
      draft.selectedVisual = exploration.visuals[0].id;
    });
  }
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
    if (!fs.user.isLoggedIn) alert("Unsaved changes.  Please login to save changes, or click 'Save to Link' to save your changes? [Back to Exploration] [Close and discard changes]");
    setFs(draft => {
      draft.selectedExploration = null;
      draft.selectedVisual = null;
      draft.route = route;
    });
  }

  function deselectExploration() {
    if (!fs.user.isLoggedIn) alert("Unsaved changes.  Please login to save changes, or click 'Save to Link' to save your changes? [Back to Exploration] [Close and discard changes]");
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

  function evt_ToggleFavorite(event) {
    setFs(draft => {
      const e = draft.explorations.find(e => e.id === draft.selectedExploration)
      e.favorite = !e.favorite;
    });
  }

  function evt_Login() {
    setFs(draft => {
      const user = draft.user;
      user.isLoggedIn = true;
      user.userName = 'bentbloh@gmail.com';
    });
  };

  function evt_DialogShow(event) {
    if (!fs.user.isLoggedIn || !exploration.isOwner)
      setFs(draft => {
        draft.showSaveToLinkDialog = true;
      })
  }
  function evt_DialogHide(event) {
    setFs(draft => {
      draft.showSaveToLinkDialog = false;
    })
  }

  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  const NAVBAR = (
    <div className="navbar">
      <div>
        <span className="url" onClick={() => setRoute('home')}>Home</span> &gt;{' '}
        <span className="url" onClick={deselectExploration}>Explorations</span> &gt;{' '}
        <span className="current">{selectedExploration}: {exploration.name}</span>
      </div>
    </div>
  );

  const TITLE = (
    <div className="title">
      EXPLORATION:{' '}
      {titleIsEditable
        ? (
          <>
            <input type="text" value={exploration.name} onChange={evt_OnTitleChange} />
            <button className='transparent-light' onClick={evt_ToggleTitleEdit}>Save</button>
          </>
        )
        : (
          <>
            {exploration.name}
            <button className={`transparent-light ${!fs.user.isLoggedIn || !exploration.isOwner ? 'disabled' : ''}`} onClick={evt_ToggleTitleEdit}
              onMouseEnter={evt_DialogShow} onMouseLeave={evt_DialogHide}>{IcnPencil}</button>
          </>
        )
      }
      <div style={{ flexGrow: 1 }}></div>
      <div className="tableOrMap">
        <label>Private</label>
        <input value={exploration.privacy === 'Public' ? "1" : "0"} onClick={evt_TogglePublic} readOnly type="range" min="0" max="1" step="1" />
        <label>Public</label>
      </div>
      {' '}
      <button className="secondary" onClick={evt_ToggleFavorite}>
        {exploration.favorite ? "🩷" : "♡"}
      </button>
    </div>
  );

  const SIDEBAR = (
    <div className="sidebar">
      <EXPItemsList fs={fs} setFs={setFs} />
      <div className="notes">
        {descriptionIsEditable
          ? <>
            <h4>YOUR IDEAS & QUESTIONS
              <button className='transparent-light' onClick={evt_ToggleDescriptionEdit}
              >Save</button>
            </h4>
            <textarea
              value={exploration.description}
              placeholder="You can use this space to describe the idea or question you would like to explore.  Add any ideas and questions as you make new maps and graphs"
              onChange={evt_OnDescriptionChange}
            />

          </>
          : <>
            <h4>YOUR IDEAS & QUESTIONS
              <button className={`transparent-light ${!fs.user.isLoggedIn || !exploration.isOwner ? 'disabled' : ''}`} onClick={evt_ToggleDescriptionEdit}
                onMouseEnter={evt_DialogShow} onMouseLeave={evt_DialogHide}>{IcnPencil}</button>
            </h4>
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
      {/* <button className="secondary" onClick={deselectExploration}>Back to Explorations</button> */}
      <button className={fs.user.isLoggedIn ? "primary" : "secondary"} onClick={evt_SaveAs}>Edit a Copy</button>
      <div style={{ flexGrow: 1 }}></div>
      <button className="transparent" onClick={evt_Embed}>Embed Exploration</button>
      <div style={{ flexGrow: 1 }}></div>
      <button className={fs.user.isLoggedIn ? "tertiary" : "primary"} onClick={evt_CopyLink}>
        {fs.user.isLoggedIn
          ? "Copy Link"
          : "Save Exploration Link"
        }
      </button>
    </div>
  );

  const DIALOG_LOGIN = (
    <div className="dialog warning">
      <h2>Saving requires Login</h2>
      <p>You can add and edit maps and graphs, but you will not be able to save your explorations until you log in.</p>
      <p>Log in to edit and save changes to an exploration to your account.</p>
      <p><i><a href="">Register for free</a> if you don't have an account.</i></p>
      <button onClick={evt_Login}>Login</button>
    </div>
  )

  // You're logged in, but you're not the owner of this exploration. You can edit it, but you can't save it. You can save a copy of it, though.
  const DIALOG_COPY = (
    <div className="dialog">
      <h2>"Edit a Copy" to Make Changes</h2>
      <p>You are viewing an exploration that is not owned by you.</p>
      <p>Click "Edit a Copy" to duplicate this exploration and make and save changes to it.</p>

      <button className="primary" onClick={evt_Login}>Edit a Copy</button>
    </div>
  )

  console.log('render logged in', fs.user.isLoggedIn, 'isOwner', exploration.isOwner)
  return (
    <div className={`Exploration ${fs.user.isLoggedIn && exploration.isOwner ? 'isOwner' : ''}`}>
      {NAVBAR}
      <div className="border">
        {TITLE}
        <div className="content">
          {SIDEBAR}
          {VISUALIZATION}
        </div>
        {FOOTER}
      </div>
      {fs.showSaveToLinkDialog && !fs.user.isLoggedIn && !exploration.isOwner && DIALOG_LOGIN}
      {fs.showSaveToLinkDialog && fs.user.isLoggedIn && !exploration.isOwner && DIALOG_COPY}
    </div>
  )
}