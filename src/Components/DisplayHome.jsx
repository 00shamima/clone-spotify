import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import AlbumItems from './AlbumItems';
import SongItem from './SongItem';

const DisplayHome = () => {
  const [albumsData, setAlbumsData] = useState([]);
  const [songsData, setSongsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const albumsRes = await fetch('https://spotgpt-backend.onrender.com/api/album/list');
        const songsRes = await fetch('https://spotgpt-backend.onrender.com/api/song/list');

        if (!albumsRes.ok || !songsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const albumsData = await albumsRes.json();
        const songsData = await songsRes.json();

        setAlbumsData(albumsData.albums);
        setSongsData(songsData.songs);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl text-white'>Top playlists</h1>
        <div className='flex overflow-auto'>
          {albumsData.map((item) => (
            <AlbumItems
              key={item._id}
              name={item.name}
              desc={item.desc}
              id={item._id}
              image={item.image}
            />
          ))}
        </div>
      </div>

      <div className='my-5 font-bold text-2xl text-white'>
        <h1 className='my-5 font-bold text-2xl'>Today's biggest hits</h1>
        <div className='flex overflow-auto'>
          {songsData.map((item) => (
            <SongItem
              key={item._id}
              name={item.name}
              desc={item.desc}
              id={item._id}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayHome;