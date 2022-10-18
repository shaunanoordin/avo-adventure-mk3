import Entity from '@avo/entity'
import { PLAYER_ACTIONS, TILE_SIZE, EXPECTED_TIMESTEP, LAYERS, DIRECTIONS } from '@avo/constants'

const INVULNERABILITY_WINDOW = 3000
const MOVE_ACTION_CYCLE_DURATION = 1000

export default class Hero extends Entity {
  constructor (app, col = 0, row = 0) {
    super(app)
    this._type = 'hero'

    this.colour = '#000'
    this.x = col * TILE_SIZE + TILE_SIZE / 2
    this.y = row * TILE_SIZE + TILE_SIZE / 2

    this.intent = undefined
    this.action = undefined

    this.health = 3
    this.invulnerability = 0  // Invulnerability time
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play (timeStep) {
    const app = this._app
    super.play(timeStep)

    this.processIntent()
    this.processAction(timeStep)

    // Count down invulnerability time
    if (this.invulnerability > 0) {
      this.invulnerability = Math.max(this.invulnerability - timeStep, 0)
    }
  }

  paint (layer = 0) {
    const app = this._app

    if (this.invulnerability > 0) {  // If invulnerable, flash!
      const flash = Math.floor(this.invulnerability / 300) % 2
      if (flash === 1) return
    }

    this.colour = (app.playerAction === PLAYER_ACTIONS.POINTER_DOWN)
      ? '#e42'
      : '#c44'
    super.paint(layer)

    const c2d = app.canvas2d
    const camera = app.camera
    const animationSpriteSheet = app.assets.hero
    if (!animationSpriteSheet) return

    const SPRITE_SIZE = 48
    let SPRITE_OFFSET_X = 0
    let SPRITE_OFFSET_Y = -16

    const srcSizeX = SPRITE_SIZE
    const srcSizeY = SPRITE_SIZE
    const tgtSizeX = SPRITE_SIZE * 2
    const tgtSizeY = SPRITE_SIZE * 2

    // Draw any special vfx
    const action = this.action
    if (action?.name === 'dash' && action?.state === 'execution' && layer === LAYERS.ATOMS_LOWER) {
      // Draw a "dash line"
      const dashLength = this.size * 2
      const dashWidth = this.size
      const dashTailX = this.x - dashLength * Math.cos(this.rotation)
      const dashTailY = this.y - dashLength * Math.sin(this.rotation)
      c2d.beginPath()
      c2d.moveTo(this.x + camera.x, this.y + camera.y)
      c2d.lineTo(dashTailX + camera.x, dashTailY + camera.y)
      c2d.strokeStyle = 'rgba(255, 255, 0, 0.5)'
      c2d.lineWidth = dashWidth
      c2d.stroke()
    }

    // Draw the sprite
    if (layer === LAYERS.ATOMS_LOWER) {
      const srcX = this.getAnimationSpriteColumn() * SPRITE_SIZE
      const srcY = this.getAnimationSpriteRow() * SPRITE_SIZE
      const tgtX = Math.floor(this.x + camera.x) - srcSizeX / 2 + SPRITE_OFFSET_X - (tgtSizeX - srcSizeX) / 2
      const tgtY = Math.floor(this.y + camera.y) - srcSizeY / 2 + SPRITE_OFFSET_Y - (tgtSizeY - srcSizeY) / 2

      c2d.drawImage(animationSpriteSheet.img, srcX, srcY, srcSizeX, srcSizeY, tgtX, tgtY, tgtSizeX, tgtSizeY)
    }
  }

  /*
  Section: Game Logic
  ----------------------------------------------------------------------------
   */

  applyEffect (effect, source) {
    super.applyEffect(effect, source)
    if (!effect) return

    if (effect.name === 'damage') {
      if (this.invulnerability === 0) {
        this.health = Math.max(this.health - 1, 0)
        this.invulnerability = INVULNERABILITY_WINDOW
      }
    }
  }

  /*
  Section: Intent and Actions
  ----------------------------------------------------------------------------
   */

  /*
  Translate intent into action.
   */
  processIntent () {
    // Failsafe
    if (!this.action) this.goIdle()

    const action = this.action
    const intent = this.intent

    if (!intent) {  // Go idle
      if (action?.name === 'move') this.goIdle()
    } else {  // Perform a new action
      // Note: every 'move' action is considered a new action

      if (action?.name === 'idle' || action?.name === 'move' )  {  // Can the action be overwritten by a new action? If not, the action must play through to its finish.
        this.action = {
          ...intent,
          name: intent.name,
          counter: (action.name === intent.name) ? action.counter : 0,  // If the current action and new intent have the same name, it's just a continuation of the idle or move action, but with other new values (e.g. new directions)
        }
      }
    }
  }

  /*
  Perform the action.
   */
  processAction (timeStep) {
    if (!this.action) return

    const action = this.action

    if (action.name === 'idle') {

      // Do nothing

    } else if (action.name === 'move') {

      const moveAcceleration = this.moveAcceleration * timeStep / EXPECTED_TIMESTEP || 0
      const directionX = action.directionX || 0
      const directionY = action.directionY || 0
      const actionRotation = Math.atan2(directionY, directionX)

      this.moveX += moveAcceleration * Math.cos(actionRotation)
      this.moveY += moveAcceleration * Math.sin(actionRotation)
      this.rotation = actionRotation

      action.counter = (action.counter + timeStep) % MOVE_ACTION_CYCLE_DURATION

    } else if (action.name === 'dash') {
      const WINDUP_DURATION = EXPECTED_TIMESTEP * 5
      const EXECUTION_DURATION = EXPECTED_TIMESTEP * 2
      const WINDDOWN_DURATION = EXPECTED_TIMESTEP * 10
      const PUSH_POWER = this.size * 0.3
      const MAX_PUSH = EXECUTION_DURATION / 1000 * 60 * PUSH_POWER

      if (!action.state) {  // Trigger only once, at the start of the action

        // Figure out the initial direction of the dash
        const directionX = action.directionX  || 0
        const directionY = action.directionY  || 0
        this.rotation = (directionX === 0 && directionY === 0)
          ? this.rotation
          : Math.atan2(directionY, directionX)
        action.rotation = this.rotation  // Records the initial direction of the dash

        action.state = 'windup'
      }

      if (action.state === 'windup') {
        action.counter += timeStep
        if (action.counter >= WINDUP_DURATION) {
          action.state = 'execution'
          action.counter = 0
        }
      } else if (action.state === 'execution') {
        const modifiedTimeStep = Math.min(timeStep, EXECUTION_DURATION - action.counter)
        const pushPower = PUSH_POWER * modifiedTimeStep / EXPECTED_TIMESTEP
        this.pushX += pushPower * Math.cos(action.rotation)
        this.pushY += pushPower * Math.sin(action.rotation)

        action.counter += modifiedTimeStep
        if (action.counter >= EXECUTION_DURATION) {
          action.state = 'winddown'
          action.counter = 0
        }
      } else if (action.state === 'winddown') {
        action.counter += timeStep
        if (action.counter >= WINDDOWN_DURATION) {
          this.goIdle()
        }
      }
    }
  }

  goIdle () {
    this.action = {
      name: 'idle',
      counter: 0,
    }
  }

  /*
  Section: Event Handling
  ----------------------------------------------------------------------------
   */

  /*
  Triggers when this entity hits/touches/intersects with another.
   */
  onCollision (target, collisionCorrection) {
    super.onCollision(target, collisionCorrection)
    if (!target) return
  }

  /*
  Section: Physics/Getters and Setters
  ----------------------------------------------------------------------------
   */

  get moveDeceleration () {
    if (this.action?.name === 'move') return 0
    return this._moveDeceleration
  }

  get pushDeceleration () {
    if (this.action?.name === 'dash' && this.action?.state === 'execution') return 0
    return this._pushDeceleration
  }

  /*
  Section: Animation
  ----------------------------------------------------------------------------
   */
  getAnimationSpriteColumn () {
    switch (this.direction) {
      case DIRECTIONS.NORTH: return 1
      case DIRECTIONS.EAST: return 2
      case DIRECTIONS.SOUTH: return 0
      case DIRECTIONS.WEST: return 3
    }
    return 0
  }

  getAnimationSpriteRow () {
    const action = this.action
    if (!action) return 0

    if (action.name === 'move') {
      const progress = action.counter / MOVE_ACTION_CYCLE_DURATION
      if (progress < 0.3) return 2
      else if (progress < 0.5) return 1
      else if (progress < 0.8) return 3
      else if (progress < 1) return 1

    } else if (action.name === 'dash') {
      if (action.state === 'windup') return 4
      else if (action.state === 'execution') return 1
      else if (action.state === 'winddown') return 1

    }

    return 0
  }
}