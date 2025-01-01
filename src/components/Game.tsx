import React, { useState, useEffect } from 'react';
import { getRandomAircraft, isValidGuess } from '../utils';
import { AircraftData, GuessResult } from '../types/aircraft';
import Board from './Board';
import Keyboard from './Keyboard';

const Game: React.FC = () => {
  const [targetAircraft, setTargetAircraft] = useState<AircraftData>({
    icao: '',
    manufacturer: '',
    model: '',
  });
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const maxGuesses = 6;

  useEffect(() => {
    const newTargetAircraft = getRandomAircraft();
    setTargetAircraft(newTargetAircraft);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameOver) return;

      const key = event.key.toUpperCase();
      if (key === 'ENTER') {
        submitGuess();
      } else if (key === 'BACKSPACE') {
        deleteLetter();
      } else if (/^[A-Z0-9]$/.test(key)) {
        addLetter(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, currentGuess, guesses, targetAircraft]);

  const handleKeyInput = (key: string) => {
    if (isGameOver) return;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      deleteLetter();
    } else {
      addLetter(key);
    }
  };

  const addLetter = (letter: string) => {
    if (currentGuess.length < targetAircraft.icao.length) {
      setCurrentGuess([...currentGuess, letter]);
    }
  };

  const deleteLetter = () => {
    if (currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
  };

  const submitGuess = () => {
    const guess = currentGuess.join('');

    if (guess.length !== targetAircraft.icao.length) {
      return;
    }

    if (!isValidGuess(guess)) {
      displayAlert('Not in aircraft list');
      return;
    }

    const guessResult = evaluateGuess();
    setGuesses([...guesses, guessResult]);

    if (guess === targetAircraft.icao) {
      setIsGameOver(true);
      displayAlert('You won!', true);
    } else if (guesses.length === maxGuesses - 1) {
      setIsGameOver(true);
      displayAlert(`You lost! It was ${targetAircraft.icao}`, true);
    }

    setCurrentGuess([]);
  };

  const evaluateGuess = (): GuessResult[] => {
    const guess = currentGuess.join('');
    const result: GuessResult[] = [];
    let targetLetters = targetAircraft.icao.split('');

    // First, mark the correct guesses
    for (let i = 0; i < targetAircraft.icao.length; i++) {
      if (guess[i] === targetAircraft.icao[i]) {
        result.push({ letter: guess[i], status: 'correct' });
        targetLetters[i] = ''; // Mark this position as already evaluated
      } else {
        result.push({ letter: guess[i], status: 'absent' }); // Default to absent
      }
    }

    // Then, mark the present guesses, avoiding duplicates
    for (let i = 0; i < result.length; i++) {
      if (result[i].status === 'absent' && targetLetters.includes(guess[i])) {
        result[i].status = 'present';
        const index = targetLetters.indexOf(guess[i]);
        targetLetters[index] = ''; // Mark this letter as already evaluated
      }
    }

    return result;
  };

  const displayAlert = (message: string, persist = false) => {
    setAlertMessage(message);
    setShowAlert(true);
    if (!persist) {
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage('');
      }, 2000);
    }
  };

  return (
    <div className="game-container">
      <h1>Aircraftle</h1>
      {showAlert && <div className="alert">{alertMessage}</div>}
      <Board
        wordLength={targetAircraft.icao.length}
        maxGuesses={maxGuesses}
        guesses={guesses}
        currentGuess={currentGuess}
      />
      <Keyboard onKeyInput={handleKeyInput} />
    </div>
  );
};

export default Game;