import React, { useState } from "react";
import './App.css';
import Home from './Home';
import Explorations from './Explorations';
import Exploration from './Exploration';

export function App() {
  const [route, setRoute] = useState('home'); // `home` or `explorations`

  const NAVBAR = (
    <div className="navbar">
      <div onClick={() => setRoute('home')}>Home</div>
      <div onClick={() => setRoute('explorations')}>Explorations</div>
    </div>
  );

  const HOME = <>
    {NAVBAR}
    <Home />
  </>;
  const EXPLORATIONS = <>
    {NAVBAR}
    <Explorations />
  </>;


  let VIEW;
  if (route === 'home') VIEW = HOME;
  if (route === 'explorations') VIEW = EXPLORATIONS;

  return (
    <div className="App">
      <div className="main-page">
        {VIEW}
      </div>
    </div>
  )
}