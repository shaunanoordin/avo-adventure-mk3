class Subscript {
  constructor (app) {
    this._app = app
    this._type = 'subscript'

    // Expired subscripts are removed at the end of the cycle.
    this._expired = false
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play (timeStep) {}
}

export default Subscript
