# AvO Game Engine

The AvO Game Engine is the core of the whole video game, running the general game logic that lets players experience a specific [Story](./story/).

- The game engine handles low-level things like loading files, rendering graphics, and managing time cycles.
- A Story handles high-level things like defining the scenario, the characters in the game, and the victory/defeat rules.
- The [Starter Story](../starter-story/) is an example Story that players can play, and developers can edit/copy.

## Folder Index

Here's a guide to everything in this folder.

- `avo.js`: **the game engine itself.** This is the main _thing_ that runs _everything else._
- `constants.js`: **global fixed values** used to define everything from "what's the size of a sprite tile?" to "what's North?" 
- `game-ai.js`: collection of functions for helping with game AI. (Pathfinding, mostly.) 
- `image-asset.js`: helper class for easily loading image files.
- `json-asset.js`: helper class for easily loading JSON files.
- `misc.js`: collection of uncategorised yet helpful functions.
- `physics.js`: collection of functions for helping with game physics. (Collisions, mostly.)

The following are base classes for the game objects, rules, etc used inside a game.

- `entity/`: an **Entity** is a _thing_ that exists in the game world. You could call it a _game object,_ if you like.
- `interaction/`: an **Interaction** (aka Interaction Menu) a standalone UI package (think HTML `<form>`) that allows players to interact with the non-action parts of the game.
- `rule/`: a **Rule** (aka Game Rule) a catch-all term for small scripts.
- `story/`: a **Story** specifies the actual story/game that the player will play through.
- `tile/`: 