import Story from '@avo/story'
import ImageAsset from '@avo/image-asset.js'
import { ROTATIONS } from '@avo/constants.js'

import Hero from './entities/hero.js'
import Wizard from './entities/wizard.js'
import FloorTile from './tiles/floor-tile'
import WallTile from './tiles/wall-tile.js'

import PlayerControls from './rules/player-controls.js'

export default class StarterStory extends Story {
  constructor (app) {
    super(app)
  }

  get assets () {
    return {
      "hero": new ImageAsset('assets/avo-sprites-2024-08-samiel.png'),
      "map": new ImageAsset('assets/avo-sprites-2024-09-simple-map-tiles.png'),
    }
  }

  start () {
    super.start()
    this.load_first_scene()
  }

  load_first_scene () {
    const app = this._app

    app.hero = app.addEntity(new Hero(app, 11, 20))
    app.hero.rotation = ROTATIONS.NORTH
    app.camera.target = app.hero

    app.addRule(new PlayerControls(app))

    /*
    app.addEntity(new Wall(app, 0, 0, 1, 23))  // West Wall
    app.addEntity(new Wall(app, 22, 0, 1, 23))  // East Wall
    app.addEntity(new Wall(app, 1, 0, 21, 1))  // North Wall
    app.addEntity(new Wall(app, 1, 22, 21, 1))  // South Wall
    */

    app.addEntity(new Wizard(app, 11, 4))

    app.map.tiles = []
    app.map.width = 24
    app.map.height = 24

    const MAP_STRING = `
      ########################
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      #......................#
      ########################
    `.replace(/\s/g, '')

    for (let row = 0 ; row < app.map.height ; row++) {
      app.map.tiles.push([])
      for (let col = 0 ; col < app.map.width ; col++) {
        const tileType = MAP_STRING[col * app.map.width + row]
        if (tileType === '#') {
          const tile = new WallTile(app, col, row)
          app.map.tiles[row].push(tile)
        } else {
          const tile = new FloorTile(app, col, row)
          app.map.tiles[row].push(tile)
        }
      }
    }
  }
}
