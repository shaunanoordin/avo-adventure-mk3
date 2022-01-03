class Subscript {
  constructor (app) {
    this._app = app
    this._type = 'subscript'
    this.name = ''  // Optional identifier

    // Expired subscripts are removed at the end of the cycle.
    this._expired = false
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play (timeStep) {}

  paint (layer = 0) {}
}

export default Subscript
