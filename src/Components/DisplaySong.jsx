import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const DisplaySong = () => {
  const { id } = useParams();
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const response = await fetch(`https://spotgpt-backend.onrender.com/api/song/list`);
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch song data');
        }
        const data = await response.json();
        setSongData(data.song);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };
    fetchSongData();
  }, [id]);

  if (loading) {
    return <div>Loading song...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!songData) {
    return <div>Song not found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className='p-8'>
        <div className='flex gap-8 items-end mb-8'>
          <img className='w-48 rounded' src={songData.image} alt={songData.name} />
          <div className='flex flex-col'>
            <p>Song</p>
            <h1 className='text-5xl font-bold mb-4'>{songData.name}</h1>
            <p className='text-gray-400'>By: {songData.artist}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplaySong;