## Story

A Story specifies the actual story/game that the player will play through.

For example, a "ZeldaStory" would represent a top-down puzzle-solving adventure
game. It'd specify which assets to load, initialise the controls/rules/goals of
the game, and generate a dungeon for the players to explore.

- `Story.js` provides the base code for all Story types.
- `.start()` runs when all assets have loaded and the AvO engine is ready to
  start the game.
- `.assets` (read-only) defines all the assets that need to be loaded before the
  game can start.