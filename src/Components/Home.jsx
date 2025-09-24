import React from 'react'
import { Sidebar } from './Sidebar';
import { Player } from './Player';
import Display from './Display';

const Home = () => {
  return (
    <div className="h-screen bg-black">
      <div className="h-[90%] flex ">
        <Sidebar />
        <Display/>
      </div>
      <Player />
    </div>
  )
};

export default Home;