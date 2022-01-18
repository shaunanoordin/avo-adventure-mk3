import Rule from '@avo/rule'
import { EXPECTED_TIMESTEP } from '@avo/constants'

export default class CNY2022Controls extends Rule {
  constructor (app) {
    super(app)
    this._type = 'cny2022-controls'
  }

  play (timeStep) {
    const app = this._app
    super.play(timeStep)

    if (app.hero) {

    }
  }

  paint (layer = 0) {
    const c2d = this._app.canvas2d
    const camera = this._app.camera
    const pointer = this._app.playerInput.pointerCurrent

    if (layer === 1 && pointer) {
      const crosshairX = pointer.x
      const crosshairY = pointer.y
      const crosshairSize = 16
      const crosshairLeft = crosshairX - crosshairSize
      const crosshairRight = crosshairX + crosshairSize
      const crosshairTop = crosshairY - crosshairSize
      const crosshairBottom = crosshairY + crosshairSize

      console.log(crosshairX, crosshairY)

      c2d.beginPath()
      c2d.moveTo(crosshairLeft, crosshairY)
      c2d.lineTo(crosshairRight, crosshairY)
      c2d.moveTo(crosshairX, crosshairTop)
      c2d.lineTo(crosshairX, crosshairBottom)
      c2d.strokeStyle = '#c88'
      c2d.lineWidth = 3
      c2d.stroke()
    }
  }
}
