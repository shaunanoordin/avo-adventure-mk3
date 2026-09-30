# Entity

An Entity is a _thing_ that exists in the game world. You could call it a _game object,_ if you like.

General Rules:

- An Entity is a physical object that interacts with the game's physics system.
  - An Entity has physical characteristics like a size, a shape, solidity, etc.
  - An Entity has positional data, such as x/y/z coordinates and a direction/rotation.
    - The game world is 2D so technically only `.x` and `.y` matter in terms of physics, but we have a "pseudo" z value to simulate jumping/flying Entities.
  - An Entity has advanced physics attributes, such as acceleration values.
    - `.moveX` and `.moveY` keeps track of the Entity's personal locomotion, e.g. walking to the East.
    - `.pushX` and `.pushY` keeps track of external forces acting on the Entity, e.g. getting pushed by winds. (Note: "push" movement also has better physics simulation, so a "pushed" entity can bounce off walls, for example.)
  - An Entity's "physicality" rule can be bent or broken, of course. For example, we can create a spooky ghost that passes through objects by setting `.solid` to false, or we can create an immovable wall by setting `.movable` to false.

- An Entity can have Effects applied to it.
  - An Effect is an ongoing (and usually temporary) attribute that's attached to an Entity.
  - For example, if an Entity is hit by a sword, it gets the "Damage" Effect. If it's pushed around by wind, it gets the "WindPush" Effect.
  - An Entity _reacts_ to Effects. (To be technical: the code for responding to an Effect lies in the Entity, not the Effect nor the source of the Effect. For example, if an Entity sees that it has the "WindPush" Effect, its script causes it to move in the direction of the wind.)
  - Effects have durations. (That duration can be _forever,_ or _instantaneous._)
  - 🛠️ TODO: Effects need their own description.

- An Entity can have Traits.
  - A Trait is a permanent attribute of an Entity.
  - Examples: "Swimmer", "ResistDamage 1"
  - Traits modify how scripts function. For example, if a fireball attempts to apply "Damage 3" Effect, an Entity with "ResistDamage 1" would only add "Damage 2" to its Effects.

- An Entity can be interacted with. (i.e. have the "Interact" action of another Entity target it.)
  - An Entity _reacts_ to an Interaction. (This is similar to how an Entity reacts to Effects. For example, if a Hero Entity interacts with a Treasure Chest Entity, the Treasure Chest will go "ahhah, I'm being opened by the hero, so I should open the Inventory menu to show my contents.")

- An Entity is visualised in the game world as an animated sprite.
  - An Entity has a sprite sheet.

Technical Notes:

- When an Entity's `._expired` flag is set to true, that Entity is removed from the game world at the next update step.

## Creature

A Creature is a type of Entity which has the agency to perform actions.

- A Creature can have an _intent,_ and an _action._
  - An _intent_ is something the Creature is planning to do. e.g. the player presses the 'B' button, and wants the Hero Creature to jump. 
  - An _action_ is something the Creature is actually doing.
  - An _intent_ is usually turned into an _action,_ provided that it can be done. e.g. pressing 'B' to jump won't work if the Hero Creature is knocked unconscious.

- A Creature has a Strength (STR) attribute.
  - A standard Creature has 3 Strength.
  - Strength is a measure of general wellbeing.
  - Special interaction: Damage
    - When a creature receives a new Damage Effect...
      - ...if an existing Damage Effect already exists on a Creature, just add the value of the new Effect to the old Effect. Otherwise, add the new Damage Effect to the Creature's list of Effects.
      - ...if the total amount of Damage _exceeds_ STR, then the Creature's state transitions to Defeated. (Start playing the "KO animation", but Creature is considered Defeated even before they hit the ground.)
      - ...if the total amount of Damage is _equal to or below_ STR, apply the MercyInvincibility Effect for 1s.
  - Design notes:
    - Strength was formerly called Health. Difference here is how damage is modeled: previously, damage reduced Health, and Health regenerated. Now, damage is an effect that "builds up" and eventually decays. Same thing, opposite direction.
    - The benefit of having a static attribute (Strength) as opposed to a moving value/points (Health) is that STR can also be used as a general measure of power.
    - Strength (like Health) is also a way of letting players make mistakes. This is supplemented by mercy invincibility upon taking damage, and the REC attribute.

- A Creature has a Recovery (REC) attribute.
  - A standard Creature has 1 REC, meaning _eventually_ it'll shake off most negative Effects.
  - Recovery is a measure of how quickly a Creature heals from negative Effects. (And possibly how quickly it builds up positive Effects, and how quickly abilities cool down.)
    - For example, an Effect like Burning has (1) a duration, (2) a natural decay rate (usually 1x, or reduce duration by 1 every second), and (3) an additional decay multiplier for REC (usually 1x, meaning 1 REC reduces duration by another 1 every second).
  - Common interactions:
    - Drinking water grants a temporary "Refreshed" Effect that increases REC by 1. (Effectively doubling the heal rate.)
    - Medicine kits can boost REC by a large amount for a short time.

- A special note on the Damage Effect:
  - Effect name: Damage
  - Meaning of "Value": keeps track of total damage received
  - Duration: 30s
  - Natural Decay: 0 (i.e. Damage doesn't go away on its own)
  - Recovery Multiplier: 1x 
  - Script: when duration goes to 0, value is reduced by 1, and duration resets. When duration AND value are both 0, the Effect is removed.
  - Effectively, a Creature with 1 REC will take 30 seconds to recover from 1 damage.

- A Creature has Energy points (EN).
  - 🛠️ A standard Creature has 100 EN. (Value to be tweaked!)
  - Technically EN is not an attribute, but a _points system_ or _meter_ - meaning it has a current value (curEnergy), a max value (maxEnergy), and a(n implied) min value (minEnergy=0). When the script refers to "Energy", this usually means the _current Energy value._
  - Energy is spent to activate some Skills and equipped Items.
  - Energy does _not_ naturally regenerate, but can be recovered, e.g. by eating food.
  - Design Notes:
    - I've been flip-flopping between calling this AP (Action Points) or Energy. Energy is quite self-explanatory, but the term can be overloaded (e.g. Energy weapons). AP is quite versatile (e.g. we can use AP for measuring how often an Item like a Sword can be used) but perhaps too abstract.
    - Energy puts an interesting constraint on player actions, gives players a resource to lightly manage, and motivates players to find items like Food to restore Energy.
  - Max Energy can be increased or decreased.
    - Being in a good mood, etc can increase Max Energy.
    - Being scared, etc can decrease Max Energy.
  - Certain conditions can cause continuous Energy drain.
    - For example, "extremely hot weather" can tire out creatures.
    - Continuous Energy drain should never trigger the Desperation Rule.
  - Desperation Rule: if a creature doesn't have Energy to activate a Skill or
    Item, that Energy cost is applied as Exhaustion instead.
    - Exhaustion is an Effect that that functions like Damage and can knock out a Creature.
    - This ensures players can always activate simple Skills and Items, since Exhaustion eventually decays.

- A Creature can be in one of a few states:
  - "Active" means the Creature is alive, awake, and able to perform actions.
  - "Inactive" means the Creature is alive, but can't perform actions. (e.g. sleeping)
  - "Defeated" means the Creature has 0 Health and can't perform actions.
    - Usually, when the Player's Hero Creature is defeated, it's a game over.
    - Some defeated Creatures stay in the game world, while other defeated creatures are cleaned up.
  - Design Notes:
    - The term "Destroyed" would imply the Creature is/has been removed from the game, so we'll avoid using that term. 
    - We're also specifically avoiding the word "Killed" or "Dead".

- A Creature can perform the following actions:
  - Move (walk, run, fly)
  - Interact (with another Entity)
  - Use Equipped Skill
  - Use Equipped Item

- 🛠️ A Creature might also have the following innate attributes, which are usually hidden but can be interacted with: (There are still under consideration.)
  - Movement Speed (MOV) - affects max movement speed and acceleration, and is affected by movement type.
  - Action Speed (ACT)
  - Sense Range (SNS) - affected by sense types.

- A Creature can carry Items.

- A Creature can have Skills.

## Structure

A Structure is a type of Entity which just exists in the world like a prop. A door or a tree are examples of Structures.

## Item

An Item is a type of Entity can be picked up and added to another Creature, Structure, or Item's inventory.
