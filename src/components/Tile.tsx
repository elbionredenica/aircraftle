import React from 'react';

interface TileProps {
  letter: string;
  status?: 'correct' | 'present' | 'absent' | 'active' | 'empty';
}

const Tile: React.FC<TileProps> = ({ letter, status }) => {
  return (
    <div className={`tile ${status ? status : ''}`}>
      {letter}
    </div>
  );
};

export default Tile;