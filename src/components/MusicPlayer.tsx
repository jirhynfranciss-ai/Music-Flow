import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Download,
  Share2,
  ListMusic,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showQueue, setShowQueue] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const {
    currentSong,
    isPlaying,
    queue,
    queueIndex,
    volume,
    shuffle,
    repeat,
    togglePlay,
    nextSong,
    prevSong,
    setVolume,
    setProgress,
    toggleShuffle,
    toggleRepeat,
    currentUser,
    likeSong,
    unlikeSong,
    addToLibrary,
    theme,
    playQueue,
  } = useStore();

  const isLiked = currentUser?.likedSongs.includes(currentSong?.id || '');

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current && currentSong) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / currentSong.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && currentSong) {
      const time = (parseFloat(e.target.value) / 100) * currentSong.duration;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleEnded = () => {
    if (repeat === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      nextSong();
    }
  };

  const handleDownload = () => {
    if (currentSong) {
      const link = document.createElement('a');
      link.href = currentSong.audioUrl;
      link.download = `${currentSong.title} - ${currentSong.artistName}.mp3`;
      link.click();
    }
  };

  const handleShare = () => {
    if (currentSong && navigator.share) {
      navigator.share({
        title: currentSong.title,
        text: `Check out ${currentSong.title} by ${currentSong.artistName}`,
        url: window.location.href,
      });
    }
  };

  const handleLike = () => {
    if (!currentSong || !currentUser) return;
    if (isLiked) {
      unlikeSong(currentSong.id);
    } else {
      likeSong(currentSong.id);
    }
  };

  const handleAddToLibrary = () => {
    if (currentSong && currentUser) {
      addToLibrary(currentSong.id);
    }
  };

  if (!currentSong) return null;

  const isDark = theme === 'dark';

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Expanded View */}
      {isExpanded && (
        <div className={`fixed inset-0 z-50 ${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-b from-purple-100 via-white to-gray-100'}`}>
          <div className="h-full flex flex-col p-6">
            <button
              onClick={() => setIsExpanded(false)}
              className={`self-start p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
            >
              <ChevronDown className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-800'}`} />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
              <img
                src={currentSong.albumCover}
                alt={currentSong.title}
                className="w-72 h-72 rounded-2xl shadow-2xl object-cover mb-8"
              />

              <div className="text-center mb-8 w-full">
                <h2 className={`text-2xl font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentSong.title}
                </h2>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentSong.artistName}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full mb-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / currentSong.duration) * 100 || 0}
                  onChange={handleSeek}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${(currentTime / currentSong.duration) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} ${(currentTime / currentSong.duration) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-sm mt-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{formatTime(currentTime)}</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{formatTime(currentSong.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full transition ${shuffle ? 'text-purple-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>
                <button
                  onClick={prevSong}
                  className={`p-2 rounded-full transition ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/10'}`}
                >
                  <SkipBack className="w-8 h-8" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
                <button
                  onClick={nextSong}
                  className={`p-2 rounded-full transition ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/10'}`}
                >
                  <SkipForward className="w-8 h-8" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full transition ${repeat !== 'off' ? 'text-purple-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {repeat === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-8">
                <button onClick={handleLike} className="p-2">
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
                <button onClick={handleDownload} className={`p-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  <Download className="w-6 h-6" />
                </button>
                <button onClick={handleShare} className={`p-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  <Share2 className="w-6 h-6" />
                </button>
                <button onClick={handleAddToLibrary} className={`p-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  <ListMusic className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Sidebar */}
      {showQueue && (
        <div className={`fixed right-0 top-0 h-full w-80 z-40 shadow-xl ${isDark ? 'bg-gray-900' : 'bg-white'} animate-slideUp`}>
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Queue</h3>
              <button onClick={() => setShowQueue(false)} className={`p-1 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
                <X className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-800'}`} />
              </button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
            {queue.map((song, index) => (
              <div
                key={`${song.id}-${index}`}
                onClick={() => playQueue(queue, index)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${index === queueIndex ? 'bg-purple-600/20' : isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
              >
                <img src={song.albumCover} alt={song.title} className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className={`truncate text-sm ${index === queueIndex ? 'text-purple-400' : isDark ? 'text-white' : 'text-gray-900'}`}>
                    {song.title}
                  </p>
                  <p className={`truncate text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{song.artistName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mini Player */}
      <div className={`fixed bottom-0 left-0 right-0 z-30 ${isDark ? 'bg-gray-900/95 backdrop-blur-xl border-t border-gray-800' : 'bg-white/95 backdrop-blur-xl border-t border-gray-200'}`}>
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Song Info */}
            <div className="flex items-center gap-3 w-64">
              <button onClick={() => setIsExpanded(true)}>
                <img
                  src={currentSong.albumCover}
                  alt={currentSong.title}
                  className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
                />
              </button>
              <div className="min-w-0">
                <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentSong.title}</p>
                <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{currentSong.artistName}</p>
              </div>
              <button onClick={handleLike} className="ml-2">
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Controls */}
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={toggleShuffle}
                  className={`p-1 rounded transition ${shuffle ? 'text-purple-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  onClick={prevSong}
                  className={`p-1 rounded transition ${isDark ? 'text-white hover:text-purple-400' : 'text-gray-800 hover:text-purple-600'}`}
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-gray-900" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={nextSong}
                  className={`p-1 rounded transition ${isDark ? 'text-white hover:text-purple-400' : 'text-gray-800 hover:text-purple-600'}`}
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleRepeat}
                  className={`p-1 rounded transition ${repeat !== 'off' ? 'text-purple-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {repeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 w-full max-w-xl">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / currentSong.duration) * 100 || 0}
                  onChange={handleSeek}
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${(currentTime / currentSong.duration) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} ${(currentTime / currentSong.duration) * 100}%)`,
                  }}
                />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formatTime(currentSong.duration)}</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 w-48 justify-end">
              <button onClick={() => setShowQueue(!showQueue)} className={`p-2 rounded ${showQueue ? 'text-purple-500' : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <ListMusic className="w-5 h-5" />
              </button>
              <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className={`p-2 rounded ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 ${volume * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} ${volume * 100}%)`,
                }}
              />
              <button onClick={handleDownload} className={`p-2 rounded ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <Download className="w-5 h-5" />
              </button>
              <button onClick={() => setIsExpanded(true)} className={`p-2 rounded ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
