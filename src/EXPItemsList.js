import React, { useState } from "react";
import './EXPItemsList.css';
import EXPEdit from './EXPEdit';
import map_gray from './img/map_gray.png';

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
          image: map_gray
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



  /// COMPONENT RENDER ////////////////////////////////////////////////////////
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const ITEMS = visuals;

  const EDITOR = (
    <EXPEdit fs={fs} setFs={setFs} onExit={evt_CloseEditor} />
  )


  return (
    <div className="EXPItems">
      <h4>SAVED VISUALS</h4>
      <div className="help">Drag to change the sort order</div>
      <div className='EXPItemsList'>
        {ITEMS.length < 1
          ? <div className="help">Your saved displays will appear here</div>
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
      {fs.user.isLoggedIn && <div className="controlbar">
        <button disabled={!selectedVisual} onClick={evt_EditVisual}>EDIT</button>
        <button className="primary" onClick={evt_NewVisual}>NEW DISPLAY</button>
      </div>}
      {editingVisual !== null && EDITOR}
    </div>
  );
}