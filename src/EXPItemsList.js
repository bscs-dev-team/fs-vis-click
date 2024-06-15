import React, { useState } from "react";
import './EXPItemsList.css';
import EXPEdit from './EXPEdit';

export default function EXPItemsList({ fs, setFs }) {
  const [showEditor, setShowEditor] = useState(false);

  function evt_NewDisplay(event) {
    console.log('New Display', event.target);
    setShowEditor(true);
  }

  function evt_CloseEditor(event) {
    setShowEditor(false);
  }

  const { selectedExploration, selectedVisual } = fs;
  console.log('Selected exploration', selectedExploration, selectedVisual)
  const exploration = fs.explorations.find(e => e.id === selectedExploration);
  const visuals = exploration && exploration.visuals ? exploration.visuals : [];
  const visual = visuals.find(v => v.id === selectedVisual) || {
    title: 'Untitled', description: '', image: null
  };
  console.log('Loaded visual', visual)

  const ITEMS = visuals;

  const EDITOR = (
    <EXPEdit fs={fs} setFs={setFs} onExit={evt_CloseEditor} />
  )

  return (
    <div className="EXPItems">
      <h4>SAVED VISUALS</h4>
      <div className='EXPItemsList'>
        {ITEMS.length < 1
          ? <div className="help">Your saved displays will appear here</div>
          : ITEMS.map((item, i) => (
            <div className='item' key={i}>
              <img src={item.image} alt={item.title} />
              <div className='description'>
                <div>{item.title}</div>
                <div>{item.description}</div>
              </div>
            </div>
          ))
        }
      </div>
      {fs.user.isLoggedIn && <div className="controlbar">
        <button disabled>EDIT</button>
        <button className="primary" onClick={evt_NewDisplay}>NEW DISPLAY</button>
      </div>}
      {showEditor && EDITOR}
    </div>
  );
}