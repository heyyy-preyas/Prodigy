# Task 3: Tic-Tac-Toe Game

This project implements an interactive tic-tac-toe game with a modern UI/UX design and AI opponent options. The game allows players to play against each other or against an AI with varying difficulty levels.

## Features

- **Interactive Game Board**: Click to place your X or O markers
- **Player vs Player Mode**: Play against a friend
- **Player vs AI Mode**: Play against an AI opponent
- **Multiple AI Difficulty Levels**:
  - Easy: Makes random moves
  - Medium: Makes smart moves with occasional mistakes
  - Hard: Unbeatable AI using minimax algorithm
- **Score Tracking**: Keep track of X and O wins
- **Game State Management**: Automatically detects wins and draws
- **Responsive Design**: Works on all screen sizes

## Extra Features

1. **Hover Preview**: See where your mark will be placed before clicking
2. **Win Animation**: Winning cells are highlighted with animation
3. **Confetti Celebration**: Confetti animation when a player wins
4. **Victory Modal**: Shows winner with animation and play again option
5. **Game Statistics**: Tracks and displays scores for both players
6. **Reset Animation**: Smooth transition when resetting the game
7. **Visual Feedback**: UI changes to indicate current player and game state

## How to Use

1. Open `index.html` in any modern web browser
2. Play against a friend by taking turns to place X and O marks
3. Or toggle the "Play vs AI" button to play against the computer
4. Select AI difficulty level (Easy, Medium, Hard)
5. Click on an empty cell to place your mark
6. First player to get three marks in a row (horizontally, vertically or diagonally) wins
7. Use the Reset button to start a new game

## Troubleshooting

If you encounter any issues with the game:

1. **Game board not visible**: Make sure all CSS files are loaded properly. The game board should appear as a 3x3 grid in the center of the page.
2. **Clicks not registering**: Check the browser console for any JavaScript errors. The cells should respond to clicks by placing X or O marks.
3. **AI not working**: Ensure you've clicked the "Play vs AI" button. The button should change color to indicate that AI mode is active.
4. **Page not loading**: Try clearing your browser cache or opening the page in a different browser.

## Technical Implementation

The game is built with vanilla JavaScript and uses the following features:

- **Grid Layout**: CSS Grid for the game board layout
- **Flexbox**: For responsive positioning of elements
- **CSS Variables**: For consistent theming
- **CSS Animations**: For smooth transitions and visual feedback
- **DOM Manipulation**: For updating the game state
- **Event Listeners**: For handling user interactions
- **Minimax Algorithm**: For the unbeatable AI opponent

## AI Implementation

The game offers three levels of AI difficulty:

- **Easy**: Makes completely random moves
- **Medium**: Uses a mix of strategic and random moves (70/30 split)
- **Hard**: Uses the minimax algorithm to make optimal moves (unbeatable)

## Technologies Used

- HTML5
- CSS3 (with custom properties/variables)
- JavaScript (vanilla, no frameworks)
- Font Awesome for icons

## Color Scheme

The project uses the same light and minimal color palette as previous tasks:
- Primary (X color): Light blue (#6a98ff)
- Secondary: Very light blue (#f0f4ff)
- Accent (O color): Light pink (#ff7eb3)
- Text: Dark gray (#333)
- Background: Light gray and white 