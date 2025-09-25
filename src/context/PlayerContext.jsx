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

    // Helper function to handle the playback logic
    const attemptPlay = async (song) => {
        if (!audioRef.current || !song) {
            console.error("AudioRef or selected song is not available.");
            return;
        }

        // 1. Set the track state (async update)
        setTrack(song); 

        // 2. Set audio source immediately
        audioRef.current.src = song.file;
        audioRef.current.load(); 

        try {
            // 3. Attempt to play
            await audioRef.current.play();
            setPlayStatus(true);
        } catch (error) {
            // 4. Handle Autoplay prevention
            if (error.name === "NotAllowedError" || error.name === "AbortError") {
                console.warn("Autoplay prevented: The user needs to manually click play.");
                // IMPORTANT: If playback is blocked, the song IS NOT playing. Set status to false.
                setPlayStatus(false); 
            } else {
                console.error("Error attempting to play audio:", error);
                setPlayStatus(false);
            }
        }
    }
    
    // --- Public Player Controls ---

    const play = () => {
        if (track && audioRef.current) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (track && audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = async (id) => {
        const selectedSong = songs.find(song => song._id === id);
        if (selectedSong) {
            // Use the new helper function for playback
            await attemptPlay(selectedSong);
        }
    };
    
    // Logic for finding and playing the previous track
    const playPrevious = () => {
        if (track && songs.length > 0) {
            const currentIndex = songs.findIndex(song => song._id === track._id);
            const newIndex = (currentIndex - 1 + songs.length) % songs.length;
            // Directly use the new song object for playback
            attemptPlay(songs[newIndex]);
        }
    };
    
    // Logic for finding and playing the next track
    const playNext = () => {
        if (track && songs.length > 0) {
            const currentIndex = songs.findIndex(song => song._id === track._id);
            const newIndex = (currentIndex + 1) % songs.length;
            // Directly use the new song object for playback
            attemptPlay(songs[newIndex]);
        }
    };

    const toggleLoop = () => {
        const newLoopStatus = !isLooping;
        setIsLooping(newLoopStatus);
        if (audioRef.current) {
            audioRef.current.loop = newLoopStatus; 
        }
    };

    const seekSong = (e) => {
        if (audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime = ((e.nativeEvent.offsetX / e.nativeEvent.target.offsetWidth) * audioRef.current.duration);
        }
    };

    // --- Effects ---

    // 1. EFFECT: Fetch songs and set initial track
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await axios.get("https://spotgpt-backend.onrender.com/api/song/list");
                setSongs(res.data.songs);
                if (res.data.songs.length > 0) {
                    // Set the initial track state. Do NOT attempt to play here due to Autoplay rules.
                    setTrack(res.data.songs[0]);
                }
            } catch (err) {
                console.error("Failed to fetch songs:", err);
            }
        };
        fetchSongs();
    }, []);

    // 2. EFFECT: Handle audio playback events (runs when track/isLooping/songs changes)
    // NOTE: We don't need to set audioRef.current.src here anymore since attemptPlay does it.
    useEffect(() => {
        if (track && audioRef.current) {
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