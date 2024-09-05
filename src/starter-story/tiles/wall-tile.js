import Tile from '@avo/tile'
import { LAYERS } from '@avo/constants.js'

export default class WallTile extends Tile {
  constructor (app, col = 0, row = 0) {
    super(app, col, row)
    this._type = 'floor-tile'

    this.colour = '#808080'
    this.solid = true

    this.spriteSheet = app.assets['map']
  }

  paint (layer = 0) {
    if (layer === LAYERS.BACKGROUND) {
      this.paintSprite({
        spriteRow: 1,
      })
    } else if (layer === LAYERS.CEILING) {
      this.paintSprite({
        spriteRow: 0,
        spriteOffsetY: this.spriteOffsetY * 3
      })
    }
  }
}
