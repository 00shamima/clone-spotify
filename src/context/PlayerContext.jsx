import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();

    const [songs, setSongs] = useState([]);
    const [track, setTrack] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    const play = () => {
        // Only attempt to play if a track is loaded
        if (track) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (track) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = async (id) => {
        const selectedSong = songs.find(song => song._id === id);
        if (selectedSong) {
            setTrack(selectedSong);
            
            // CRITICAL: Set the audio source here for seamless transition
            if (audioRef.current) {
                audioRef.current.src = selectedSong.file;
                try {
                    await audioRef.current.play();
                    setPlayStatus(true);
                } catch (error) {
                    console.error("Autoplay prevented:", error);
                    // User may need to interact first, but the source is set
                }
            } else {
                console.error("AudioRef is not available.");
            }
        }
    };
    
    // Logic for finding and playing the previous track
    const playPrevious = () => {
        if (track && songs.length > 0) {
            const currentIndex = songs.findIndex(song => song._id === track._id);
            // Cycle back to the last song if at the first
            const newIndex = (currentIndex - 1 + songs.length) % songs.length;
            playWithId(songs[newIndex]._id);
        }
    };
    
    // Logic for finding and playing the next track
    const playNext = () => {
        if (track && songs.length > 0) {
            const currentIndex = songs.findIndex(song => song._id === track._id);
            // Cycle back to the first song if at the last
            const newIndex = (currentIndex + 1) % songs.length;
            playWithId(songs[newIndex]._id);
        }
    };

    const toggleLoop = () => {
        setIsLooping(prev => !prev);
        if (audioRef.current) {
            audioRef.current.loop = !isLooping; 
        }
    };

    const seekSong = (e) => {
        if (audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime = ((e.nativeEvent.offsetX / e.nativeEvent.target.offsetWidth) * audioRef.current.duration);
        }
    };

    // 1. EFFECT: Fetch songs and set initial track
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await axios.get("https://spotgpt-backend.onrender.com/api/song/list");
                setSongs(res.data.songs);
                if (res.data.songs.length > 0) {
                    // Only set the track state here
                    setTrack(res.data.songs[0]);
                }
            } catch (err) {
                console.error("Failed to fetch songs:", err);
            }
        };
        fetchSongs();
    }, []);

    // 2. EFFECT: Handle audio playback events (runs when track/isLooping/songs changes)
    useEffect(() => {
        // IMPORTANT: Only proceed if audioRef.current and track are available
        if (track && audioRef.current) {
            // CRITICAL FIX: Set the audio source once the track is set and the ref is ready
            audioRef.current.src = track.file;

            // Define event handlers
            const updateTime = () => {
                if (isNaN(audioRef.current.duration)) return;
                
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                });
            };

            const handleSongEnd = () => {
                setPlayStatus(false);
                // Only auto-play next if not looping
                if (!isLooping) { 
                    playNext();
                }
            };
            
            // Attach event listeners
            audioRef.current.ontimeupdate = updateTime;
            audioRef.current.onended = handleSongEnd;

            // Cleanup function
            return () => {
                if (audioRef.current) {
                    audioRef.current.ontimeupdate = null;
                    audioRef.current.onended = null;
                }
            };
        }
    }, [track, isLooping, songs]); // Depend on track, looping status, and songs array

    const contextValue = {
        audioRef,
        songs, 
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        seekSong,
        playNext,
        playPrevious,
        isLooping,
        toggleLoop
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;