import aircraftData from '../data/aircraft.json';
import { AircraftData } from '../types/aircraft';

export const getRandomAircraft = (): AircraftData => {
  const randomIndex = Math.floor(Math.random() * aircraftData.length);
  console.log(aircraftData[randomIndex])
  return aircraftData[randomIndex];
};

export const isValidGuess = (guess: string): boolean => {
    return aircraftData.some((aircraft) => aircraft.icao === guess);
};