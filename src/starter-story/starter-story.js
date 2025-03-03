import Story from '@avo/story'
import ImageAsset from '@avo/image-asset.js'
import { ROTATIONS } from '@avo/constants.js'

import Hero from './entities/hero.js'
import Wizard from './entities/wizard.js'
import ChaserEnemy from './entities/chaser-enemy.js'

import FloorTile from './tiles/floor-tile'
import WallTile from './tiles/wall-tile.js'

import PlayerControls from './rules/player-controls.js'

export default class StarterStory extends Story {
  constructor (app) {
    super(app)

    this.assets = {
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

    // Setup rules
    app.addRule(new PlayerControls(app))

    // Setup map
    app.gameMap.tiles = []
    app.gameMap.width = 25
    app.gameMap.height = 25

    const MAP_STRING = `
      #########################
      #.......................#
      #.......................#
      #.......................#
      #.......................#
      #.......................#
      #.......................#
      #.......................#
      ####.####.......####.####
      #.......#.......#.......#
      #.......#.......#..#.#..#
      #.......#.......#.#...#.#
      #...............#.......#
      #.......#.......#.......#
      #.......#.......#..###..#
      #.......#.......#.......#
      ####.####.......####.####
      #.......#.......#.......#
      #.......#.......#.......#
      #.......#.......#.......#
      #.......................#
      #.......#.......#.......#
      #.......#.......#.......#
      #.......#.......#.......#
      #########################
    `.replace(/\s/g, '')

    for (let row = 0 ; row < app.gameMap.height ; row++) {
      app.gameMap.tiles.push([])
      for (let col = 0 ; col < app.gameMap.width ; col++) {
        const tileType = MAP_STRING[row * app.gameMap.width + col]
        if (tileType === '#') {
          const tile = new WallTile(app, col, row)
          app.gameMap.tiles[row].push(tile)
        } else {
          const tile = new FloorTile(app, col, row)
          app.gameMap.tiles[row].push(tile)
        }
      }
    }

    // Add Hero
    app.hero = app.addEntity(new Hero(app, 12, 20))
    app.hero.rotation = ROTATIONS.NORTH
    app.camera.target = app.hero

    // Add other entities
    app.addEntity(new Wizard(app, 11, 4))
    app.addEntity(new ChaserEnemy(app, 11, 6))

  }
}
