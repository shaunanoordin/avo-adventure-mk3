import Atom from '@avo/atom'
import Shot from '@avo/atom/types/shot'
import { PLAYER_ACTIONS, TILE_SIZE } from '@avo/constants'

export default class Enemy extends Atom {
  constructor (app, col = 0, row = 0) {
    super(app)
    this._type = 'enemy'

    this.colour = '#4c4'
    this.x = col * TILE_SIZE + TILE_SIZE / 2
    this.y = row * TILE_SIZE + TILE_SIZE / 2

    this.action = {
      name: 'shoot',
      counter: 0,
    }
  }

  play (timeStep) {
    const app = this._app
    super.play(timeStep)

    this.processAction(timeStep)
  }

  processAction (timeStep) {
    if (!this.action) return
    const action = this.action
    const app = this._app

    if (action.name === 'shoot') {
      const DURATION = 500
      const progress = action.counter / DURATION

      if (!action.acknowledged && progress > 0.5) {
        action.acknowledged = true
        app.atoms.push(new Shot(app, this.x, this.y, this.rotation, this))
      }

      action.counter += timeStep
      if (action.counter >= DURATION) {
        this.action = {
          name: 'shoot',
          counter: 0,
        }
      }
    }
  }
}
