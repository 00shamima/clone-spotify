import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisplayHome from './DisplayHome';
import DisplayAlbum from './DisplayAlbum';
import DisplaySong from './DisplaySong';
// commit
const Display = () => {
  return (
    <div className='w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
      <Routes>
        <Route path="/*" element={<DisplayHome />} />
        <Route path="album/:id" element={<DisplayAlbum />} />
        <Route path="/song/:id" element={<DisplaySong />} />
      </Routes>
    </div>
  );
};

export default Display;