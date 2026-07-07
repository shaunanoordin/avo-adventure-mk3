# Rule

A Rule (or Game Rule) is a catch-all term for small scripts. Each Rule should be written similarly to gameplay instructons for a tabletop game, with one Rule describing how the players move, one Rule describing how players win, etc.

For example, the "VictoryCondition" Rule might check to see when the player reaches the exit of a dungeon, and plays a splashy win screen when they do.

- `Rule.js` provides the base code for all Rule types.
- A Rule only runs when the action gameplay isn't "paused". This usually means that Rules stop running when the home menu or interaction menu is open. See AvO.play() for more details.