# AvO Source Code

Welcome to the source code for the AvO game! If you're reading this, it likely means you're interested in understanding how this game works, or how to modify this game to create your own stories. Welcome, fellow game developer!

## How This Works

In this folder, you'll find the following items:

- `avo/`: this is the AvO Game Engine, which runs the general game logic.
  - The game engine handles low-level things like loading files, rendering graphics, and managing time cycles.
- `starter-story/`: this is an example Story - i.e. the actual, specific game that players play.
  - a Story handles high-level things like defining the scenario, the characters in the game, and the victory/defeat rules. 
- `main.js`: this is the script that initialises the AvO Game Engine, and tells it to run the Starter Story.
- `main.scss`: this defines the stylesheet for the web page.

Note that everything in this folder is the source code. The compiled code will be in the [`/app`](../app/) folder, and the web page ([`/index.html`](../index.html)) will link to the compiled code.

## Creating A New Game

If you want to create a new game, you'll want to create your own Story.

1. Create a new Story. Use [`starter-story/`](./starter-story/) as a template.
2. (Optional) Place yours assets (image files, sound files, etc) into the [`/assets`](../assets/) folder.
3. Modify [`main.js`](./main.js) so that it loads your Story.
4. Run `npm start` to compile the code and start the local web server. Play your game on `http://localhost:3000`. (See the main [README.md](../README.md))
