import Tile from '@avo/tile'
import { LAYERS } from '@avo/constants.js'

export default class FloorTile extends Tile {
  constructor (app, col = 0, row = 0) {
    super(app, col, row)
    this._type = 'floor-tile'

    this.colour = '#f0f0f0'
    this.solid = false

    this.spriteSheet = app.assets['map']
  }

  paint (layer = 0) {
    if (layer === LAYERS.BOTTOM) {
      this.paintSprite({
        spriteRow: 2,
      })
    }
  }
}
