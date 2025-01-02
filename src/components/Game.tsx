import React, { useState, useEffect, useRef } from 'react';
import { getRandomAircraft, isValidGuess } from '../utils';
import { AircraftData, GuessResult } from '../types/aircraft';
import Board from './Board';
import Keyboard from './Keyboard';
import Modal from './Modal';
import { FaGithub, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';

const Game: React.FC = () => {
  const [targetAircraft, setTargetAircraft] = useState<AircraftData>({
    icao: '',
    manufacturer: '',
    model: '',
    imageUrl: '',
    wikiUrl: '',
  });
  const alertTimeout = useRef<number | null>(null);

  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showIcaoInfoModal, setShowIcaoInfoModal] = useState(false);
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
      displayAlert('Not enough letters');
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
      setModalMessage('You won!');
      setShowModal(true);
    } else if (guesses.length === maxGuesses - 1) {
      setIsGameOver(true);
      setModalMessage('You lost!');
      setShowModal(true);
    }

    setCurrentGuess([]);
  };

  const evaluateGuess = (): GuessResult[] => {
    const guess = currentGuess.join('');
    const result: GuessResult[] = [];
    let targetLetters = targetAircraft.icao.split('');

    for (let i = 0; i < targetAircraft.icao.length; i++) {
      if (guess[i] === targetAircraft.icao[i]) {
        result.push({ letter: guess[i], status: 'correct' });
        targetLetters[i] = '';
      } else {
        result.push({ letter: guess[i], status: 'absent' });
      }
    }

    for (let i = 0; i < result.length; i++) {
      if (result[i].status === 'absent' && targetLetters.includes(guess[i])) {
        result[i].status = 'present';
        const index = targetLetters.indexOf(guess[i]);
        targetLetters[index] = '';
      }
    }

    return result;
  };

  const displayAlert = (message: string, persist = false) => {
    setAlertMessage(message);
    setShowAlert(true);

    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }

    if (!persist) {
      alertTimeout.current = window.setTimeout(() => {
        setShowAlert(false);
        setAlertMessage('');
        alertTimeout.current = null;
      }, 2000);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="icon-group">
          <FaQuestionCircle
            className="icon"
            onClick={() => setShowHowToPlayModal(true)}
            title="How to Play"
          />
          <FaInfoCircle
            className="icon"
            onClick={() => setShowIcaoInfoModal(true)}
            title="ICAO Info"
          />
        </div>
        <h1>Aircraftle</h1>
        <div style={{ width: '60px' }}></div> {/* Placeholder to balance the header */}
      </header>

      {/* Alert Message */}
      {showAlert && (
        <div className={`alert ${alertMessage === 'You won!' || alertMessage === 'You lost!' ? 'success' : ''}`}>
          {alertMessage}
        </div>
      )}

      {/* Existing Game, Board and Keyboard components */}
      <Board
        wordLength={targetAircraft.icao.length}
        maxGuesses={maxGuesses}
        guesses={guesses}
        currentGuess={currentGuess}
      />
      <Keyboard onKeyInput={handleKeyInput} />

      {/* Modals */}
      <Modal
        isOpen={showHowToPlayModal}
        onClose={() => setShowHowToPlayModal(false)}
        title="How to Play"
      >
        <p>Guess the ICAO aircraft type designator in 6 tries.</p>
        <p>Each guess must be a valid ICAO code. Hit the enter button to submit.</p>
        <p>After each guess, the color of the tiles will change:</p>
        <div className="color-explanation">
          <div className="color-explanation-item">
            <div className="color-box correct"></div>
            <span>
              <strong>Green:</strong> The letter is in the word and in the correct spot.
            </span>
          </div>
          <div className="color-explanation-item">
            <div className="color-box present"></div>
            <span>
              <strong>Yellow:</strong> The letter is in the word but in the wrong spot.
            </span>
          </div>
          <div className="color-explanation-item">
            <div className="color-box absent"></div>
            <span>
              <strong>Gray:</strong> The letter is not in the word.
            </span>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showIcaoInfoModal}
        onClose={() => setShowIcaoInfoModal(false)}
        title="About ICAO Codes"
      >
        <p>
          ICAO aircraft type designators are 2-4 character codes used in aviation to identify different
          types of aircraft.
        </p>
        <p>
          These codes are used by air traffic control and airline operations for flight planning and
          identification.
        </p>
        <p>
          <b>Note:</b> To simplify the game and make it more meaningful, only the ICAO codes with 4 characters are used.
        </p>
        <p>
          <a
            href="https://en.wikipedia.org/wiki/List_of_aircraft_type_designators"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more on Wikipedia
          </a>
        </p>
      </Modal>

      <Modal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} title="About">
        <p>Hey there! 👋 I'm Elbion, a junior at Minerva University, diving deep into the world of Computational Sciences. I'm concentrating on Machine Learning and Statistics 🤖📊, and when I'm not training models or crunching numbers, you can probably find me moving pieces on a chessboard or gazing up at the sky, admiring airplanes ✈️.</p>
        <p>Got ideas or found a bug? Head over to the <a href="https://github.com/elbionredenica/aircraftle" target="_blank" rel="noopener noreferrer">GitHub repo</a> and open an issue. And if you want to connect, you can also find me on <a href="https://www.linkedin.com/in/elbionred/" target="_blank" rel="noopener noreferrer">LinkedIn</a>!</p>
        <p>
            I truly hope you're enjoying the game! If you're feeling generous and want to
            show your appreciation, you can support the project by buying me a
            coffee (or a virtual one! ☕). 🙏
            </p>
            <a
              href="https://www.ko-fi.com/elbionredenica" 
              target="_blank"
              rel="noopener noreferrer"
              className="link-button"
            >
              Support the Project
            </a>
      </Modal>

      <footer className="game-footer">
        <button className="link-button" onClick={() => setShowAboutModal(true)}>
          About
        </button>
        <a
          href="https://github.com/elbionredenica"
          target="_blank"
          rel="noopener noreferrer"
          className="link-button"
        >
          <FaGithub style={{ marginRight: '5px' }} />
          GitHub
        </a>
      </footer>

      {/* Modal for Win/Lose - Fixed Duplication */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={modalMessage}
        aircraft={isGameOver ? targetAircraft : undefined}
      />
    </div>
  );
};

export default Game;