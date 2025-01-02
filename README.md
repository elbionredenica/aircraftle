# Aircraftle

## A Wordle-inspired game to guess ICAO aircraft type designators

**Aircraftle** is a fun and engaging web game inspired by the popular word game Wordle. Instead of guessing a word, players try to guess the **ICAO aircraft type designator** of a randomly selected aircraft.

## Features

*   **Multiple Guesses:** Players get 6 attempts to guess the correct ICAO code.
*   **Keyboard Input:** An on-screen keyboard for easy input, especially on mobile devices.
*   **Responsive Design:** Adapts to different screen sizes, providing a great experience on desktops, tablets, and mobile phones.
*   **Win/Loss Modal:** Displays the aircraft's image, manufacturer, model, ICAO code, and a Wikipedia link when the game ends.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **CSS:** For styling the game.
*   **React Icons:** For the icons used in the header.

## Getting Started

### Prerequisites

*   **Node.js:** Make sure you have Node.js installed on your system. You can download it from [https://nodejs.org/](https://nodejs.org/).
*   **npm (or yarn):** npm is the package manager for Node.js and comes bundled with it. You can also use yarn as an alternative: [https://yarnpkg.com/](https://yarnpkg.com/).

### Installation

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

    Replace `<repository-url>` with the URL of your project's repository and `<repository-name>` with the name of the directory.

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Game

1. **Start the development server:**

    ```bash
    npm start
    # or
    yarn start
    ```

    This will start the development server and open the game in your default web browser (usually at `http://localhost:3000`).

### Building for Production

1. **Create a production build:**

    ```bash
    npm run build
    # or
    yarn build
    ```

    This will create an optimized build of your game in the `build` folder. You can then deploy this folder to a web server.

## Customization

*   **Aircraft Data:** The aircraft data is stored in `src/data/aircraft.json`. You can modify this file to add, remove, or update aircraft. Make sure to follow the existing format:

    ```json
    [
      {
        "icao": "A320",
        "manufacturer": "Airbus",
        "model": "A320",
        "imageUrl": "https://...",
        "wikiUrl": "https://..."
      },
      // ... more aircraft
    ]
    ```

## Contributing

Contributions are welcome! If you find a bug or have a feature suggestion, please open an issue or submit a pull request on the project's GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (You'll need to create a LICENSE file and add the MIT License content).