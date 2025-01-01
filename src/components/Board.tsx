import React from 'react';
import Tile from './Tile';
import { GuessResult } from '../types/aircraft';

interface BoardProps {
  wordLength: number;
  maxGuesses: number;
  guesses: GuessResult[][];
  currentGuess: string[];
}

const Board: React.FC<BoardProps> = ({ wordLength, maxGuesses, guesses, currentGuess }) => {
  return (
    <div className="board">
      {Array.from({ length: maxGuesses }).map((_, rowIndex) => (
        <div key={rowIndex} className="row">
          {Array.from({ length: wordLength }).map((_, tileIndex) => {
            const guessResult = guesses[rowIndex]?.[tileIndex];
            const currentGuessLetter = currentGuess[tileIndex];
            let letter = '';
            let status: 'correct' | 'present' | 'absent' | 'active' | 'empty' = 'empty';

            if (guessResult) {
              letter = guessResult.letter;
              status = guessResult.status;
            } else if (rowIndex === guesses.length && currentGuessLetter) {
              letter = currentGuessLetter;
              status = 'active';
            }

            return (
              <Tile key={tileIndex} letter={letter} status={status} />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;