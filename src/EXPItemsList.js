import React, { useState } from "react";
import './EXPItemsList.css';
import EXPEdit from './EXPEdit';
import map_gray from './img/map_gray.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
const IcnTrash = <FontAwesomeIcon icon={faTrashCan} />;


export default function EXPItemsList({ fs, setFs }) {


  /// LOAD DATA ///////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const { selectedExploration, selectedVisual, editingVisual } = fs;
  const exploration = fs.explorations.find(e => e.id === selectedExploration);
  const visuals = exploration && exploration.visuals ? exploration.visuals : [];
  const visual = visuals.find(v => v.id === selectedVisual) || {
    title: 'Untitled', description: '', image: null
  };
  const NEXTINDEX = visuals.length + 2;



  /// UI HANDLERS /////////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function evt_SelectVisual(id) {
    console.log('Select Visual', id);
    setFs(draft => {
      draft.selectedVisual = id;
    });
  }

  function evt_EditVisual(id) {
    console.log('Editing Visual', id);
    setFs(draft => {
      draft.editingVisual = draft.selectedVisual;
    });
  }

  function evt_NewVisual(event) {
    console.log('New Display', event.target);
    setFs(draft => {
      draft.explorations.find(e => e.id === draft.selectedExploration)
        .visuals.push({
          id: NEXTINDEX,
          title: 'Untitled',
          description: '',
          image: map_gray,
          filter: 1
        });
      draft.selectedVisual = NEXTINDEX;
      draft.editingVisual = NEXTINDEX;
    });
  }

  function evt_CloseEditor(event) {
    setFs(draft => {
      draft.editingVisual = null;
    });
  }

  function evt_DialogShow(event) {
    console.log('show dialog')
    setFs(draft => {
      draft.showEditModeDialog = true;
    })
  }
  function evt_DialogHide(event) {
    console.log('hide dialog')
    setFs(draft => {
      draft.showEditModeDialog = false;
    })
  }



  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const ITEMS = visuals;

  const EDITOR = (
    <EXPEdit fs={fs} setFs={setFs} onExit={evt_CloseEditor} />
  )

  // console.log('selectedVisual', selectedVisual, 'editingVisual', editingVisual, 'visual', visual, 'ITEMS', ITEMS)

  return (
    <div className="EXPItems">
      <h4>SAVED MAPS/GRAPHS</h4>
      <div className="help">Drag to change the sort order</div>
      <div className='EXPItemsList'>
        {ITEMS.length < 1
          ? <div className="help">Your saved maps/graphs will appear here</div>
          : ITEMS.map((item, i) => (
            <div className={`item ${selectedVisual === item.id ? 'selected' : ''}`} key={i} onClick={() => evt_SelectVisual(item.id)}>
              <img src={item.image} alt={item.title} />
              <div className='description'>
                <h3>{item.title}</h3>
                <div>{item.description}</div>
              </div>
            </div>
          ))
        }
      </div>
      <div className="controlbar">
        <button
          className={`exploration-edit-btn ${!exploration.isOwner ? 'disabled' : ''}`}
          onClick={evt_EditVisual}
          onMouseEnter={evt_DialogShow} onMouseLeave={evt_DialogHide}>EDIT</button>
        <button
          className={`exploration-edit-btn ${!exploration.isOwner ? 'disabled' : ''}`}
          onMouseEnter={evt_DialogShow} onMouseLeave={evt_DialogHide}>{IcnTrash}</button>
        <button className={`exploration-new-btn primary ${!exploration.isOwner ? 'disabled' : ''}`}
          onClick={evt_NewVisual}
          onMouseEnter={evt_DialogShow} onMouseLeave={evt_DialogHide}>NEW MAP/GRAPH</button>
      </div>
      {editingVisual !== null && EDITOR}
    </div>
  );
}