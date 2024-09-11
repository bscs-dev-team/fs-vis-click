import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";
import './Exploration.css';
import NotLoggedIn from "./NotLoggedIn";
import EXPItemsList from './EXPItemsList';
import EXPView from './EXPView';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
const IcnPencil = <FontAwesomeIcon icon={faPencil} />;

export default function Exploration({ fs, setFs }) {
  // Joyride
  const STEPS = [
    {
      target: '.title-text',
      content: 'This is name of the exploration.  Use a short descriptive name to help you distinguish it from other explorations. Click the pencil to edit.'
    },
    {
      target: '.exploration-new-btn',
      content: 'Create a "New Map/Graph" by clicking this button'
    },
    {
      target: '.EXPItemsList',
      content: 'Your maps and graphs will be saved here.'
    },
    {
      target: '.exploration-edit-btn',
      content: 'Select a map/graph and click "Edit" to edit the Map or Graph'
    },
    {
      target: '.notes',
      content: 'Use this space to describe the idea or question you would like to explore.  Add any ideas and questions as you make new maps and graphs. Click the pencil to edit.'
    },
    {
      target: '.lognsave',
      content: 'Log in to save your work!'
    }
  ]
  const [titleIsEditable, setTitleIsEditable] = useState(false);
  const [descriptionIsEditable, setDescriptionIsEditable] = useState(false);
  const [copiedDialogIsOpen, setCopiedDialogIsOpen] = useState(false);
  const [needsSaving, setNeedsSaving] = useState(false);
  const [hintText, setHintText] = useState('');


  useEffect(() => {
    console.log('user logged in, save changes')
    setFs(draft => {
      const exp = draft.explorations.find(e => e.id === draft.selectedExploration);
      // if the exploration was not previously saved and the user JUST logged in, mark it as saved
      if (exp.notSaved && draft.user.isLoggedIn) { exp.notSaved = false; }
    });

  }, [fs.user.isLoggedIn]);


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

  /// METHODS /////////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const MODE = {
    VIEW: 'view',
    EDIT: 'edit',
    EDIT_COPY: 'edit-copy'
  };
  function getViewMode() {
    // console.log('isOwner:', exploration.isOwner, 'notSaved:', exploration.notSaved, 'isLoggedIn:', fs.user.isLoggedIn)
    if (exploration.notSaved) {
      // console.log('ViewMode', MODE.EDIT_COPY)
      return MODE.EDIT_COPY;
    } else if (fs.user.isLoggedIn && exploration.isOwner) {
      // console.log('ViewMode', MODE.EDIT)
      return MODE.EDIT;
    } else { // !exploration.isOwner
      // console.log('ViewMode', MODE.VIEW)
      return MODE.VIEW;
    }
  }

  /// UI HANDLERS /////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function evt_CopyLink(event) { alert('Copy URL to clipboard') }
  function evt_Embed(event) { alert('Show and copy Embed URL') }
  function evt_Download(event) { alert('Download file to disk') }
  function evt_EditACopy(event) {
    console.error('Edit a Copy')
    const NEXTINDEX = fs.explorations.length + 2;
    setFs(draft => {
      draft.explorations.push({
        id: NEXTINDEX,
        name: 'COPY of ' + exploration.name,
        description: exploration.description,
        modified: new Date(),
        privacy: exploration.privacy,
        visuals: [...exploration.visuals],
        filters: [...exploration.filters],
        favorite: false,
        isOwner: true,
        notSaved: !fs.user.isLoggedIn
      });
      draft.selectedExploration = NEXTINDEX;
      draft.editWithoutSaving = null;
      draft.showTour = true;
      draft.tourStep = 5;
    });
    setCopiedDialogIsOpen(true);
  }

  function setRoute(route) {
    //if (!fs.user.isLoggedIn) alert("Unsaved changes.  Please login to save changes, or click 'Save to Link' to save your changes? [Back to Exploration] [Close and discard changes]");
    if (!fs.user.isLoggedIn) setNeedsSaving(true);
    else setFs(draft => {
      draft.selectedExploration = null;
      draft.selectedVisual = null;
      draft.route = route;
    });
  }

  function deselectExploration() {
    setFs(draft => { draft.selectedExploration = null });
  }

  function safeDeselectExploration() {
    if (!fs.user.isLoggedIn) setNeedsSaving(true);
    else deselectExploration;
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
  function evt_LoginNSave() {
    setFs(draft => {
      const user = draft.user;
      user.isLoggedIn = true;
      user.userName = 'bentbloh@gmail.com';
      const e = draft.explorations.find(e => e.id === draft.selectedExploration)
      e.notSaved = false;
    });
  }

  function evt_LoginHintShow(text) {
    setHintText(text);
    setFs(draft => {
      draft.showLoginHint = true;
    })
  }
  function evt_LoginHintHide(event) {
    setFs(draft => {
      draft.showLoginHint = false;
    })
  }

  function evt_DialogShow(event) {
    setFs(draft => {
      draft.showEditModeDialog = true;
    })
  }
  function evt_DialogHide(event) {
    setFs(draft => {
      draft.showEditModeDialog = false;
    })
  }

  function evt_ClearCopiedDialog(event) {
    setCopiedDialogIsOpen(false);
  }

  function evt_JoybackCallback(data) {
    console.log('Joyback', data)
    setFs(draft => {
      if (data.action === 'next') {
        console.log('enext step', data.index + 1)
        draft.showTour = true;
        draft.tourStep = data.index + 1;
      }
    })
  }

  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


  const NAVBAR = (
    <div className="navbar">
      <div>
        <span className="url" onClick={() => setRoute('home')}>Home</span> &gt;{' '}
        <span className="url" onClick={safeDeselectExploration}>Explorations</span> &gt;{' '}
        <span className="current">{selectedExploration}: {exploration.name}</span>
      </div>
    </div>
  );

  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const TITLE = (
    <div className="title">
      EXPLORATION:&nbsp;
      {titleIsEditable
        ? (
          <>
            <input className="title-text" type="text" value={exploration.name} onChange={evt_OnTitleChange} />
            <button className='transparent-light' onClick={evt_ToggleTitleEdit}>Save</button>
          </>
        )
        : (
          <>
            <span className="title-text" >{exploration.name}</span>
            <button className={`transparent-light ${!exploration.isOwner ? 'disabled' : ''}`}
              onMouseEnter={() => {
                if (!exploration.isOwner) evt_LoginHintShow('You do not own this exploration, so you cannot edit its title.')
              }}
              onMouseLeave={evt_LoginHintHide}
              onClick={evt_ToggleTitleEdit}
            >{IcnPencil}</button>
          </>
        )
      }
      <div style={{ flexGrow: 1 }}></div>
      {exploration.isOwner
        ? 'EDITABLE'
        : 'VIEW-ONLY'
      }
      <div style={{ flexGrow: 1 }}></div>
      <div className="tableOrMap">
        <label>Private</label>
        <input value={exploration.privacy === 'Public' ? "1" : "0"} onClick={evt_TogglePublic} readOnly type="range" min="0" max="1" step="1" />
        <label>Public</label>
      </div>
      {' '}
      <button className={`secondary ${!fs.user.isLoggedIn ? 'disabled' : ''}`} onClick={evt_ToggleFavorite}>
        {fs.user.isLoggedIn && exploration.favorite ? "🩷" : "♡"}
      </button>
    </div>
  );

  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
              <button className={`transparent-light ${!exploration.isOwner ? 'disabled' : ''}`}
                onClick={evt_ToggleDescriptionEdit}
                onMouseEnter={() => {
                  if (!exploration.isOwner) evt_LoginHintShow('You do not own this exploration, so you cannot edit its description.')
                }}
                onMouseLeave={evt_LoginHintHide}
              >{IcnPencil}</button>
            </h4>
            <div className="description">{exploration.description}</div>
          </>
        }
      </div>
    </div>
  );

  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const FOOTER = (
    <div className="footer">
      {/* <button className="secondary" onClick={deselectExploration}>Back to Explorations</button> */}
      <button className={`${getViewMode() === MODE.EDIT_COPY
        ? 'transparent-light disabled'
        : getViewMode() === MODE.VIEW ? "primary" : "transparent"}`}
        onMouseEnter={() => {
          if (getViewMode() === MODE.EDIT_COPY) evt_LoginHintShow('Unsaved exploration.  Nothing to copy.')
        }}
        onMouseLeave={evt_LoginHintHide}
        onClick={evt_EditACopy}>Edit a Copy</button>
      <div style={{ flexGrow: 1 }}></div>
      <button
        className={`transparent-light ${getViewMode() === MODE.EDIT_COPY ? 'disabled' : ''}`}
        onMouseEnter={() => {
          if (getViewMode() === MODE.EDIT_COPY) evt_LoginHintShow('You can embed an exploration after you\'ve saved it.')
        }}
        onMouseLeave={evt_LoginHintHide}
        onClick={evt_Embed}>Embed Exploration</button>
      <button
        className={`transparent-light ${getViewMode() === MODE.EDIT_COPY ? 'disabled' : ''}`}
        onMouseEnter={() => {
          if (getViewMode() === MODE.EDIT_COPY) evt_LoginHintShow('You can copy a link to the exploration after you\'ve saved it.')
        }}
        onMouseLeave={evt_LoginHintHide}
        onClick={evt_CopyLink}>Copy Link</button>
      <div style={{ flexGrow: 1 }}></div>
      <button
        className={`primary`}
        onClick={evt_Download}>Download Exploration</button>
      <div style={{ flexGrow: 1 }}></div>
      {getViewMode() === MODE.EDIT_COPY &&
        <button className="lognsave secondary" onClick={evt_LoginNSave}>Login and Save</button>}
    </div>
  );


  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Call to Action: Copy Link
  // View mode: Edit-Only
  // NOT isLoggedIn
  // NOT isOwner
  // 
  const HINT = (
    <div className="hint">
      <p>{hintText}</p>
    </div>
  )

  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Call to Action: Copy Link
  // View mode: Edit-Only
  // NOT isLoggedIn
  // NOT isOwner
  // 
  const DIALOG_LOGIN = (
    <div className="dialog warning">
      <h2>Saving requires Login</h2>
      <p>You can add and edit maps and graphs, but you will not be able to save your
        explorations until you log in.</p>
      <p>1. To save your work without logging in,
        "Close" the window and use the "Copy Link" button.  You can then paste
        that link to your own document and re-open this saved exploration at an time without
        having to log in.</p>
      <p>--or--</p>
      <p>2. Log in to edit and save changes to an exploration to your account. Once you're logged in, your changes are saved automatically.<i><a href="">Register for free</a> if you don't have an account.</i></p>
      <div className="controlbar">
        <button onClick={evt_Login}>Login</button>
        <button onClick={evt_DialogHide}>Close</button>
      </div>
    </div>
  )

  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Call to Action: Edit a Copy
  // View mode: View-Only
  // NOT isOwner
  // You're logged in, but you're not the owner of this exploration. You can edit it, but you can't save it. 
  // You can save a copy of it, though.
  const DIALOG_EDITCOPY = (
    <div className="dialog">
      <h2>"Edit a Copy" to Make Changes</h2>
      <p>You are viewing an exploration that is not owned by you.</p>
      <p>If you would like to make and save changes, click "Edit a Copy" to duplicate and make changes to your own exploration.</p>
      <button className="primary" onClick={evt_DialogHide}>Close</button>
    </div>
  )

  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Dialog shown right after you've copied an exploration
  const DIALOG_COPIED = (
    <div className="dialog">
      <h2>COPIED</h2>
      <p>Your exploration has been copied.</p>
      <p>To save your work, please log in.</p>
      <button className="primary" onClick={evt_ClearCopiedDialog}>OK</button>
    </div>
  )

  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Dialog shown right after you've copied an exploration
  const DIALOG_BEFOREUNLOAD = (
    <div className="dialog">
      <h2>Save Changes?</h2>
      <p>You've made changes to your exploration.</p>
      <p>To save your work, please log in.</p>
      <div className="controlbar">
        <button onClick={() => setNeedsSaving(false)}>Back to Editing</button>
        <button onClick={evt_Login}>Login</button>
        <button onClick={deselectExploration}>Close without Saving</button>
      </div>
    </div>
  )

  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  console.log('render logged in', fs.user.isLoggedIn, 'isOwner', exploration.isOwner)
  return (
    <div className={`Exploration ${fs.user.isLoggedIn && exploration.isOwner ? 'isOwner' : ''}`}>
      <Joyride
        run={fs.showTour}
        stepIndex={fs.tourStep}
        steps={STEPS}
        callback={evt_JoybackCallback}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        styles={{
          options: { zIndex: 10000 }
        }} />
      {NAVBAR}
      <div className="border">
        {TITLE}
        <div className="content">
          {SIDEBAR}
          {VISUALIZATION}
        </div>
        {FOOTER}
      </div>
      {fs.showLoginHint && HINT}
      {fs.showEditModeDialog && getViewMode() === MODE.EDIT_COPY && DIALOG_LOGIN}
      {fs.showEditModeDialog && getViewMode() === MODE.VIEW && DIALOG_EDITCOPY}
      {copiedDialogIsOpen && DIALOG_COPIED}
      {needsSaving && DIALOG_BEFOREUNLOAD}
    </div>
  )
}