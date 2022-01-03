import Subscript from '@avo/subscript'
import { EXPECTED_TIMESTEP } from '@avo/constants'

const TERMINAL_VELOCITY = 8
const GRAVITY_ACCELERATION = 1

export default class ZeldaControls extends Subscript {
  constructor (app) {
    super(app)
    this._type = 'zelda-controls'
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play (timeStep) {
    const app = this._app
    super.play(timeStep)

    if (app.hero) {
      const keysPressed = app.playerInput.keysPressed
      let intent = undefined
      let directionX = 0
      let directionY = 0

      if (keysPressed['ArrowRight']) directionX++
      if (keysPressed['ArrowDown']) directionY++
      if (keysPressed['ArrowLeft']) directionX--
      if (keysPressed['ArrowUp']) directionY--

      if (
        (keysPressed['x'] && !keysPressed['x'].acknowledged)
        || (keysPressed['X'] && !keysPressed['X'].acknowledged)
      ) {
        intent = {
          name: 'dash',
          directionX,
          directionY,
        }
        if (keysPressed['x']) keysPressed['x'].acknowledged = true
        if (keysPressed['X']) keysPressed['X'].acknowledged = true

      } else if (directionX || directionY) {
        intent = {
          name: 'move',
          directionX,
          directionY,
        }
      }

      app.hero.intent = intent
    }
  }
}
