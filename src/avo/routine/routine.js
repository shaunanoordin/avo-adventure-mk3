class Routine {
  constructor (app) {
    this._app = app

    // Expired routines are removed at the end of the cycle.
    this._expired = false
  }

  /*
  Section: General Logic
  ----------------------------------------------------------------------------
   */

  play (timeStep) {}
}

export default Routine
