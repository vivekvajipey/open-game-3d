# 3D Character Movement Game - Proof of Concept

A simple 3D game using Three.js featuring third-person character movement similar to Super Mario Galaxy or Legend of Zelda.

## Features

- 3D character movement (WASD keys)
- Character jumping (Spacebar)
- Third-person camera that follows the character
- Simple flat terrain

## How to Run

1. Clone this repository
2. You can run the game in one of these ways:
   - Open the `index.html` file directly in a modern browser
   - Use a local server (recommended):
     ```
     npx serve
     ```
     or
     ```
     python -m http.server
     ```

## Controls

- **W**: Move forward
- **S**: Move backward
- **A**: Move left
- **D**: Move right
- **Spacebar**: Jump

## Technologies Used

- Three.js for 3D rendering
- Vanilla JavaScript for game logic
- HTML5 and CSS3 for basic structure

## Project Structure

- `index.html`: Main entry point
- `styles/`: Contains CSS styling
- `src/`: Contains all JavaScript code
  - `engine/`: Core game engine components (renderer, input, physics)
  - `game/`: Game-specific components (world, character, camera)

This is a proof of concept that can be extended with more features like improved graphics, additional game mechanics, and level design. 