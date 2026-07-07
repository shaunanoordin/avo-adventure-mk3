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

Rule
- Add `.runWhileMenuIsOpen = false` (or `ignorePause = false`) property.

Game AI
- ChaserEnemy: if entity can directly see Hero, it should make a beeline to the Hero. Otherwise, use the A* pathing.

rework-hero-and-creatures branch:
- build up Creature class
- check if Intent & Actions can be simplified
  - replace Intent with NextAction?
- add .state and .stateTransition and .setState() ?

Rename things:
- ~~Entity's moveX/Y => selfMoveX/Y~~ (Tried this, it's too wordy.)
- ~~Entity's pushX/Y => forceMoveX/Y~~
- Creature => Actor?
- ~~Interaction => UIMenu?~~ (Interaction now called InteractionMenu)

App & Layout:
- Allow app to support horizontal, vertical, and square layouts
- Improve CSS for home screen, interaction screen, etc in different layouts.
