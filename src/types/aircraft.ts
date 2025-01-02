export interface AircraftData {
    icao: string;
    manufacturer: string;
    model: string;
    imageUrl: string;
    wikiUrl: string;
  }
  
  export interface GuessResult {
    letter: string;
    status: 'correct' | 'present' | 'absent';
  }