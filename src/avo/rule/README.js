## Rule

A Rule is catch-all term for small self-contained routines that run
in-game events.

For example, if the player reaches the exit of a dungeon, we can start the
"VictoryCountdown" Rule to transition the game from a playable state to the
"Congratulations, you won!" screen, over 5 seconds, with some visual flourish.

- `Rule.js` provides the base code for all Rule types.
- They're called "sub" scripts to differentitate them from the "main" JavaScript
  code.
