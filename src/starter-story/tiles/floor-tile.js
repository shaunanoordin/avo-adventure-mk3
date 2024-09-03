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
    const app = this._app
    const c2d = app.canvas2d
    if (!this.spriteSheet) return

    app.applyCameraTransforms()

    if (layer === LAYERS.BACKGROUND) {
      const srcX = 0 * this.spriteSizeX
      const srcY = 2 * this.spriteSizeY
      const sizeX = this.spriteSizeX
      const sizeY = this.spriteSizeY
      
      c2d.translate(this.x, this.y)
      c2d.scale(this.spriteScale, this.spriteScale)

      const tgtX = this.spriteOffsetX
      const tgtY = this.spriteOffsetY

      c2d.drawImage(this.spriteSheet.img,
        srcX, srcY, sizeX, sizeY,
        tgtX, tgtY, sizeX, sizeY
      )
    }

    app.undoCameraTransforms()
  }
}