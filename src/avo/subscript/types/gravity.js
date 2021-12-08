import Subscript from '@avo/subscript'
import { EXPECTED_TIMESTEP } from '@avo/constants'

const TERMINAL_VELOCITY = 8
const GRAVITY_ACCELERATION = 1

class Gravity extends Subscript {
  constructor (app) {
    super(app)
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play (timeStep) {
    const app = this._app
    super.play(timeStep)

    app.atoms.filter(atom => atom.movable).forEach(atom => {
      if (atom.pushY + GRAVITY_ACCELERATION <= TERMINAL_VELOCITY) {
        atom.pushY += GRAVITY_ACCELERATION
      }
    })
  }
}

export default Gravity
