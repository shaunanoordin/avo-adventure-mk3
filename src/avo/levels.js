import { PLAYER_ACTIONS, DIRECTIONS } from './constants'

import Hero from './atom/hero'
import Goal from './atom/goal'
import Wall from './atom/wall'
import Ball from './atom/ball'
import Enemy from './atom/enemy'

export default class Levels {
  constructor (app) {
    this._app = app
    this.current = 0
  }

  reset () {
    const app = this._app
    app.hero = undefined
    app.atoms = []
    app.camera = {
      target: null, x: 0, y: 0,
    }
    app.playerAction = PLAYER_ACTIONS.IDLE
    app.victory = 0
    app.victoryCountdown = 0
    app.setInteractionMenu(false)
  }

  load (level = 0) {
    const app = this._app
    this.current = level

    this.reset()
    this.generate_default()
  }

  reload () {
    this.load(this.current)
  }

  /*
  Default level.
   */
  generate_default () {
    const app = this._app

    app.hero = new Hero(app, 11, 1)
    app.atoms.push(app.hero)
    app.camera.target = app.hero

    app.atoms.push(new Goal(app, 15, 20))

    app.atoms.push(new Wall(app, 0, 0, 1, 23))  // West Wall
    app.atoms.push(new Wall(app, 22, 0, 1, 23))  // East Wall
    app.atoms.push(new Wall(app, 1, 0, 21, 1))  // North Wall
    app.atoms.push(new Wall(app, 1, 22, 21, 1))  // South Wall
    app.atoms.push(new Wall(app, 3, 2, 3, 1))
    app.atoms.push(new Wall(app, 3, 4, 3, 1))

    app.atoms.push(new Ball(app, 8, 6))

    const enemy = new Enemy(app, 4, 8)
    enemy.direction = DIRECTIONS.EAST
    app.atoms.push(enemy)
  }
}
