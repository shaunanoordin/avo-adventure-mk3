import Entity from '@avo/entity'
import { DIRECTIONS } from '@avo/constants'

export default class EntityWithToonSprites extends Entity {
  constructor (app, col = 0, row = 0) {
    super(app)
    this._type = 'entity-with-toon-sprites'

    // Toon sprites only have two orientations (south-east-facing and
    // north-east-facing), and are flipped horizontally depending on the
    // entity's rotation.
    this.facingEW = DIRECTIONS.EAST
    this.facingNS = DIRECTIONS.SOUTH
  }

  get rotation () { return this._rotation }

  set rotation (val) {
    this._rotation = val
    while (this._rotation > Math.PI) { this._rotation -= Math.PI * 2 }
    while (this._rotation <= -Math.PI) { this._rotation += Math.PI * 2 }

    if (this._rotation < 0) {
      this.facingNS = DIRECTIONS.NORTH
    } else if (this._rotation >= 0) {  // Favour south-facing
      this.facingNS = DIRECTIONS.SOUTH
    }

    const absRotation = Math.abs(this._rotation)
    if (this._rotation < MATH.PI * 0.5) {
      this.facingEW = DIRECTIONS.EAST
    } else if (this._rotation > MATH.PI * 0.5) {
      this.facingEW = DIRECTIONS.WEST
    }
  }
}
