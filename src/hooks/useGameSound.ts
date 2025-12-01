import { useEffect, useRef, useCallback } from 'react';

import backsoundFile from '../assets/backsound.mp3';
import cardflipFile from '../assets/cardflip.wav';
import loseFile from '../assets/lose.wav';
import winFile from '../assets/win.wav';
import unoFile from '../assets/uno.wav';

interface GameSoundHook {
  playCardFlip: () => void;
  playWin: () => void;
  playLose: () => void;
  playUno: () => void;
  stopBacksound: () => void;
}

export const useGameSound = (): GameSoundHook => {
  const backsoundRef = useRef<HTMLAudioElement | null>(null);
  const cardflipRef = useRef<HTMLAudioElement | null>(null);
  const loseRef = useRef<HTMLAudioElement | null>(null);
  const winRef = useRef<HTMLAudioElement | null>(null);
  const unoRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize all audio elements
    backsoundRef.current = new Audio(backsoundFile);
    backsoundRef.current.loop = true;
    backsoundRef.current.volume = 0.3;

    cardflipRef.current = new Audio(cardflipFile);
    cardflipRef.current.volume = 0.5;

    loseRef.current = new Audio(loseFile);
    loseRef.current.volume = 0.6;

    winRef.current = new Audio(winFile);
    winRef.current.volume = 0.6;

    unoRef.current = new Audio(unoFile);
    unoRef.current.volume = 0.7;

    // Start background music
    const playBacksound = async () => {
      try {
        await backsoundRef.current?.play();
      } catch (error) {
        console.log('Background music autoplay prevented:', error);
      }
    };

    playBacksound();

    // Cleanup on unmount
    return () => {
      backsoundRef.current?.pause();
      backsoundRef.current = null;
      cardflipRef.current = null;
      loseRef.current = null;
      winRef.current = null;
      unoRef.current = null;
    };
  }, []);

  const playCardFlip = useCallback(() => {
    if (cardflipRef.current) {
      cardflipRef.current.currentTime = 0;
      cardflipRef.current.play().catch(err => console.log('Card flip sound error:', err));
    }
  }, []);

  const playWin = useCallback(() => {
    if (winRef.current) {
      winRef.current.currentTime = 0;
      winRef.current.play().catch(err => console.log('Win sound error:', err));
    }
  }, []);

  const playLose = useCallback(() => {
    if (loseRef.current) {
      loseRef.current.currentTime = 0;
      loseRef.current.play().catch(err => console.log('Lose sound error:', err));
    }
  }, []);

  const playUno = useCallback(() => {
    if (unoRef.current) {
      unoRef.current.currentTime = 0;
      unoRef.current.play().catch(err => console.log('UNO sound error:', err));
    }
  }, []);

  const stopBacksound = useCallback(() => {
    backsoundRef.current?.pause();
  }, []);

  return {
    playCardFlip,
    playWin,
    playLose,
    playUno,
    stopBacksound,
  };
};
