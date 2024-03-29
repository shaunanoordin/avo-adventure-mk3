import { PLAYER_ACTIONS } from '@avo/constants'

export default class Story {
  constructor (app) {
    this._app = app
  }

  get assets () {
    return {}
  }

  start () {
    this.reset()
  }

  reset () {
    const app = this._app
    app.hero = undefined
    app.entities = []
    app.clearRules()
    app.camera.target = null
    app.camera.x = 0
    app.camera.y = 0
    app.camera.zoom = 1
    app.playerAction = PLAYER_ACTIONS.IDLE
    app.setInteractionMenu(false)
  }

  reload () {
    this.start()
  }
}
