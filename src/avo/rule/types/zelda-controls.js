import Rule from '@avo/rule'
import { EXPECTED_TIMESTEP, LAYERS, TILE_SIZE } from '@avo/constants'

/*
Standard player controls for top-down adventure games.
 */
export default class ZeldaControls extends Rule {
  constructor (app) {
    super(app)
    this._type = 'zelda-controls'
  }

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

  paint (layer = 0) {
    const hero = this._app.hero
    const c2d = this._app.canvas2d
    const camera = this._app.camera

    if (layer === LAYERS.HUD) {
      // Draw UI data
      // ----------------
      const X_OFFSET = TILE_SIZE * 1.5
      const Y_OFFSET = TILE_SIZE * -1.0
      const LEFT = X_OFFSET
      const RIGHT = this._app.canvasWidth - X_OFFSET
      const BOTTOM = this._app.canvasHeight + Y_OFFSET
      c2d.font = '3em Source Code Pro'
      c2d.textBaseline = 'bottom'
      c2d.lineWidth = 8

      const health = Math.max(hero?.health, 0) || 0
      let text = '❤️'.repeat(health)
      c2d.textAlign = 'left'
      c2d.strokeStyle = '#fff'
      c2d.strokeText(text, LEFT, BOTTOM)
      c2d.fillStyle = '#c44'
      c2d.fillText(text, LEFT, BOTTOM)

      text = hero?.action?.name + ' (' + hero?.moveSpeed.toFixed(2) + ')'
      c2d.textAlign = 'right'
      c2d.strokeStyle = '#fff'
      c2d.strokeText(text, RIGHT, BOTTOM)
      c2d.fillStyle = '#c44'
      c2d.fillText(text, RIGHT, BOTTOM)
      // ----------------
    }
  }
}
