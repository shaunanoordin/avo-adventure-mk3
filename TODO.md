# TODO

SASS/CSS
- remove SASS, use standard CSS
- update colours to use 6-digit hex, instead of 3-digit hex

AvO Startup
- Remove ExampleStory as the defeault story, OR simplify the ExampleStory.

AvO Rendering
- (experimental) Math.floor() on App.camera transform, and on Entity.paint()
- Review LAYERS. Do the current number (and name) of layers make sense?

Coding
- Import full file names?

Story
- (long term) Story should have a .finish() OR a .deconstructor().
  - This should be implemented should AvO ever allow switching Stories.

Game AI
- ChaserEnemy: if entity can directly see Hero, it should make a beeline to the Hero. Otherwise, use the A* pathing.
