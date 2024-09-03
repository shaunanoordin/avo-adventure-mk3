import { TILE_SIZE, SHAPES, LAYERS } from '@avo/constants.js'

export default class Tile {
  constructor (app, col = 0, row = 0) {
    this._app = app
    this._type = 'tile'

    this.colour = '#f0f0f0'
    this.solid = false
    this.movable = false
    this.mass = 100

    this.x = 0  // This will be set by col
    this.y = 0  // This will be set by row
    this.col = col
    this.row = row
    this.size = TILE_SIZE
    this.shape = SHAPES.SQUARE

    // Animation
    this.spriteSheet = undefined  // Image asset (see app.asset)
    this.spriteSizeX = 16  // Size of each sprite on the sprite sheet
    this.spriteSizeY = 16
    this.spriteScale = 2  // Scale of the sprite when paint()ed
    this.spriteOffsetX = 0.5  // Offset of the sprite when paint()ed. 0.5 means "centre-aligned"
    this.spriteOffsetY = 0.5
  }

  paint (layer) {
    const c2d = this._app.canvas2d
    this._app.applyCameraTransforms()

    if (layer === LAYERS.BACKGROUND) {
      c2d.fillStyle = this.colour
      c2d.beginPath()
      c2d.rect(Math.floor(this.x - this.size / 2), Math.floor(this.y - this.size / 2), this.size, this.size)
      c2d.fill()
    }

    this._app.undoCameraTransforms()
  }

  onCollision (target, collisionCorrection) {}

  /*
  Section: Getters and Setters
  ----------------------------------------------------------------------------
   */

  get left () { return this.x - this.size / 2 }
  get right () { return this.x + this.size / 2 }
  get top () { return this.y - this.size / 2 }
  get bottom () { return this.y + this.size / 2 }

  set left (val) { this.x = val + this.size / 2 }
  set right (val) { this.x = val - this.size / 2 }
  set top (val) { this.y = val + this.size / 2 }
  set bottom (val) { this.y = val - this.size / 2 }

  get col () { return Math.floor(this.x / TILE_SIZE) }
  get row () { return Math.floor(this.y / TILE_SIZE) }

  set col (val) { this.x = val * TILE_SIZE + TILE_SIZE / 2 }
  set row (val) { this.y = val * TILE_SIZE + TILE_SIZE / 2 }

  get vertices () {
    return [
      { x: this.left, y: this.top },
      { x: this.right, y: this.top },
      { x: this.right, y: this.bottom },
      { x: this.left, y: this.bottom }
    ]
  }

  set vertices (val) { console.error('ERROR: Tile.vertices is read only') }

  get segments () {
    const vertices = this.vertices
    if (vertices.length < 2) return []
    return vertices.map((vertex1, i) => {
      const vertex2 = vertices[(i + 1) % vertices.length]
      return {
        start: {
          x: vertex1.x,
          y: vertex1.y,
        },
        end: {
          x: vertex2.x,
          y: vertex2.y,
        },
      }
    })
  }

  set segments (val) { console.error('ERROR: Tile.segments is read only') }
}
