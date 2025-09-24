import React, { useContext } from 'react';
import { assets } from '../assets/assets/assets';
import { PlayerContext } from '../context/PlayerContext';

export const Player = () => {
    const { 
        audioRef, 
        track, 
        playStatus, 
        play, 
        pause, 
        time, 
        seekSong,
        playNext, 
        playPrevious,
        isLooping, 
        toggleLoop 
    } = useContext(PlayerContext);

    if (!track) {
        return (
            <div className="h-[10%] bg-black flex justify-center items-center text-white">
                No songs loaded.
            </div>
        );
    }

    return (
        <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
            {/* Left side: song details */}
            <div className='hidden lg:flex items-center gap-4'>
                <img className='w-12' src={track.image} alt="" />
                <div>
                    <p>{track.name}</p>
                    <p>{track.desc?.slice(0, 16) + "..."}</p>
                </div>
            </div>

            {/* Center: player controls and seek bar */}
            <div className="flex flex-col items-center gap-1 m-auto">
                <div className="flex gap-4">
                    <img className="w-4 cursor-pointer opacity-50" src={assets.shuffle_icon} alt="Shuffle" />
                    
                    {/* Previous Button */}
                    <img onClick={playPrevious} className="w-4 cursor-pointer" src={assets.prev_icon} alt="Previous" />
                    
                    {/* Play/Pause Button */}
                    {playStatus
                        ? <img onClick={pause} className="w-4 cursor-pointer" src={assets.pause_icon} alt="Pause" />
                        : <img onClick={play} className="w-4 cursor-pointer" src={assets.play_icon} alt="Play" />
                    }
                    
                    {/* Next Button (FIXED) */}
                    <img onClick={playNext} className="w-4 cursor-pointer" src={assets.next_icon} alt="Next" />
                    
                    {/* Loop Button */}
                    <img 
                        onClick={toggleLoop} 
                        // Visual feedback for loop status
                        className={`w-4 cursor-pointer ${isLooping ? 'opacity-100 text-green-500' : 'opacity-50'}`} 
                        src={assets.loop_icon} 
                        alt="Loop" 
                    />
                </div>
                {/* Timeline */}
                <div className="flex items-center gap-5">
                    <p>{time.currentTime.minute}:{time.currentTime.second < 10 ? `0${time.currentTime.second}` : time.currentTime.second}</p>
                    <div onClick={seekSong} className="w-[60vw] max-w-[500px] bg-gray-50 h-1 rounded-full cursor-pointer">
                        <div className="bg-green-800 h-1 rounded-full" style={{ width: `${(audioRef.current ? (audioRef.current.currentTime / audioRef.current.duration) * 100 : 0)}%` }}></div>
                    </div>
                    <p>{time.totalTime.minute}:{time.totalTime.second < 10 ? `0${time.totalTime.second}` : time.totalTime.second}</p>
                </div>
            </div>

            {/* Right side: volume and other icons */}
            <div className='hidden lg:flex items-center gap-2 opacity-75'>
                <img className='w-4' src={assets.plays_icon} alt="" />
                <img className='w-4' src={assets.mic_icon} alt="" />
                <img className='w-4' src={assets.queue_icon} alt="" />
                <img className='w-4' src={assets.speaker_icon} alt="" />
                <img className='w-4' src={assets.volume_icon} alt="" />
                <div className='w-20 bg-slate-50 h-1 rounded'></div>
                <img className='w-4' src={assets.mini_player_icon} alt="" />
                <img className='w-4' src={assets.zoom_icon} alt="" />
            </div>
            
            {/* Audio element remains here, referencing the ref from the context */}
            <audio ref={audioRef} src={track.file} preload="auto"></audio>
        </div>
    );
};