## Entity

An Entity is a _thing_ that exists in the game world. You could call it a
_game object,_ if you like.

General Rules:

- An Entity is a physical object that interacts with the game's physics system.
  - An Entity has physical characteristics like a size, a shape, solidity, etc.
  - An Entity has positional data, such as x/y/z coordinates and a
    direction/rotation.
    - The game world is 2D so technically only `.x` and `.y` matter in terms of
      physics, but we have a "pseudo" z value to simulate jumping/flying
      Entities.
  - An Entity has advanced physics attributes, such as acceleration values.
    - `.moveX` and `.moveY` keeps track of the Entity's personal locomotion,
      e.g. walking to the East.
    - `.pushX` and `.pushY` keeps track of external forces acting on the Entity,
      e.g. getting pushed by winds.
  - An Entity's "physicality" rule can be bent or broken, of course. For
    example, we can create a spooky ghost that passes through objects by setting
    `.solid` to false, or we can create an immovable wall by setting `.movable`
    to false.

- An Entity can have Effects applied to it.
  - An Effect is _something that happens to_ an Entity. For example, an Entity
    can receive the "Pushed by Wind" or "Damaged by Sword" Effects.
  - Some Effects are instantaneous, others have durations.
  - An Entity _reacts_ to Effects. (To be technical: the code for responding to
    an Effect lies in the Entity, not the Effect nor the source of the Effect.
    For example, if an Elf Entity receives a "Damage, 10" Effect from an Orc
    Entity, the Elf will go "Ah, I've take 10 Damage, I should remove 10 points
    from my Health. Argh, ow, alas.") 

- An Entity can be interacted with. (i.e. have the "Interact" action of another
  Entity target it.)
  - An Entity _reacts_ to an Interaction. (This is similar to how an Entity
    reacts to Effects. For example, if a Hero Entity interacts with a Treasure
    Chest Entity, the Treasure Chest will go "ahhah, I'm being opened by the
    hero, so I should open the Inventory menu to show my contents.")

- An Entity is visualised in the game world as an animated sprite.
  - An Entity has a sprite sheet.

Technical Notes:

- When an Entity's `._expired` flag is set to true, that Entity is removed from
  the game world at the next update step.

### Creature

A Creature is a type of Entity which has the agency to perform actions.

- A Creature can have an _intent,_ and an _action._
  - An _intent_ is something the Creature is planning to do. e.g. the player
    presses the 'B' button, and wants the Hero Creature to jump. 
  - An _action_ is something the Creature is actually doing.
  - An _intent_ is usually turned into an _action,_ provided that it can be
    done. e.g. pressing 'B' to jump won't work if the Hero Creature is knocked
    unconscious.

- A Creature has Health.
  - A standard human has 30 Health.
  - When a Creature's Health reaches 0, it is knocked out (KO-ed).

- A Creature can be in one of a few states:
  - "Active" means the Creature is alive, awake, and able to perform actions.
  - "Inactive" means the Creature is asleep, or stunned, or otherwise
    incapacitated and can't perform actions.
  - "KO" means the Creature is knocked out (has 0 Health) and can't perform
    actions.
    - Usually, when the Player's Hero Creature is knocked out, it's a game over.
    - Some KO-ed Creatures stay in the game world, while other KO-ed creature
      are cleaned up

- A Creature can perform the following actions:
  - Move (walk, run, fly)
  - Interact (with another Entity)
  - Use Equipped Skill
  - Use Equipped Item

- A Creature can carry Items.

- A Creature can have Skills.

### Structure

### Item
