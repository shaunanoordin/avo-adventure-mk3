## Transition

A Transition describes an in-game event. Basically, they're very versatile
scripts.

For example, if the player reaches the exit of a dungeon, we can start the
"VictoryCountdownTransition" script to move the game from a playable state to
the "Congratulations, you won!" screen.

- `Transition.js` provides the base code for all Transition types.
- Transitions are usually temporary, but we can always create an
  infinite-duration Transition.
