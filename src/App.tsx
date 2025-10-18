import React, { useEffect, useState } from 'react'
import Board from './Board'
import Controls from './Controls'
import { BoardProvider } from './store'

export default function App(){
  const [dark, setDark] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('dark')||'true') }catch{return true}
  })
  useEffect(()=>{
    document.body.classList.toggle('dark', dark)
    try{ localStorage.setItem('dark', JSON.stringify(dark)) }catch{}
  },[dark])

  return (
    <div className="container">
      <div className="topbar">
        <div className="brand"><h1>WODSpark</h1></div>
        <div className="switch">
          <label>Dark mode</label>
          <input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)}/>
        </div>
      </div>

      <BoardProvider>
        <div className="grid">
          <Controls/>
          <Board/>
        </div>
      </BoardProvider>
    </div>
  )
}
