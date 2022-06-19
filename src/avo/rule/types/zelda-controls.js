import Rule from '@avo/rule'
import Physics from '@avo/physics'
import { EXPECTED_TIMESTEP, LAYERS, TILE_SIZE } from '@avo/constants'

/*
Standard player controls for top-down adventure games.
 */
export default class ZeldaControls extends Rule {
  constructor (app) {
    super(app)
    this._type = 'zelda-controls'
  }

  play (timeStep) {
    const app = this._app
    const hero = app.hero
    super.play(timeStep)

    if (hero) {
      const keysPressed = app.playerInput.keysPressed
      let intent = undefined
      let directionX = 0
      let directionY = 0

      if (keysPressed['ArrowRight']) directionX++
      if (keysPressed['ArrowDown']) directionY++
      if (keysPressed['ArrowLeft']) directionX--
      if (keysPressed['ArrowUp']) directionY--

      if (
        (keysPressed['x'] && !keysPressed['x'].acknowledged)
        || (keysPressed['X'] && !keysPressed['X'].acknowledged)
      ) {
        intent = {
          name: 'dash',
          directionX,
          directionY,
        }
        if (keysPressed['x']) keysPressed['x'].acknowledged = true
        if (keysPressed['X']) keysPressed['X'].acknowledged = true

      } else if (directionX || directionY) {
        intent = {
          name: 'move',
          directionX,
          directionY,
        }
      }

      hero.intent = intent
    }
  }

  paint (layer = 0) {
    const hero = this._app.hero
    const c2d = this._app.canvas2d
    const camera = this._app.camera

    if (layer === LAYERS.HUD) {
      // Draw UI data
      // ----------------
      const X_OFFSET = TILE_SIZE * 1.5
      const Y_OFFSET = TILE_SIZE * -1.0
      const LEFT = X_OFFSET
      const RIGHT = this._app.canvasWidth - X_OFFSET
      const BOTTOM = this._app.canvasHeight + Y_OFFSET
      c2d.font = '2em Source Code Pro'
      c2d.textBaseline = 'bottom'
      c2d.lineWidth = 8

      const health = Math.max(hero?.health, 0) || 0
      let text = '❤️'.repeat(health)
      c2d.textAlign = 'left'
      c2d.strokeStyle = '#fff'
      c2d.strokeText(text, LEFT, BOTTOM)
      c2d.fillStyle = '#c44'
      c2d.fillText(text, LEFT, BOTTOM)

      text = hero?.action?.name + ' (' + hero?.moveSpeed.toFixed(2) + ')'
      c2d.textAlign = 'right'
      c2d.strokeStyle = '#fff'
      c2d.strokeText(text, RIGHT, BOTTOM)
      c2d.fillStyle = '#c44'
      c2d.fillText(text, RIGHT, BOTTOM)
      // ----------------

    } else if (layer === LAYERS.BACKGROUND) {
      this.paintLineOfSight(hero)
    }
  }

  /*
  Draw a line of sight (cast a ray) starting from a specified Atom (usually the
  hero), in the direction they're facing.
   */
  paintLineOfSight (srcAtom) {
    if (!srcAtom) return
    const c2d = this._app.canvas2d
    const camera = this._app.camera
    const atoms = this._app.atoms

    const MAX_LINE_OF_SIGHT_DISTANCE = 320

    // Intended line of sight, i.e. a ray starting from the hero/source Atom.
    const lineOfSight = {
      start: {
        x: srcAtom.x,
        y: srcAtom.y,
      },
      end: {
        x: srcAtom.x + MAX_LINE_OF_SIGHT_DISTANCE * Math.cos(srcAtom.rotation),
        y: srcAtom.y + MAX_LINE_OF_SIGHT_DISTANCE * Math.sin(srcAtom.rotation),
      }
    }

    let actualLineOfSightEndPoint = undefined

    // For each other Atom, see if it intersects with the source Atom's LOS
    atoms.forEach(atom => {
      if (atom === srcAtom) return

      // TODO: check for opaqueness and/or if the atom is visible.

      const vertices = atom.vertices
      if (vertices.length < 2) return

      // Every atom has a "shape" that can be represented by a polygon.
      // (Yes, even circles.) Check each segment (aka edge aka side) of the
      // polygon.
      for (let i = 0 ; i < vertices.length ; i++) {
        const segment = {
          start: {
            x: vertices[i].x,
            y: vertices[i].y,
          },
          end: {
            x: vertices[(i + 1) % vertices.length].x,
            y: vertices[(i + 1) % vertices.length].y,
          },
        }

        // Find the intersection. We want to find the intersection point
        // closest to the source Atom (the LOS ray's starting point).
        const intersection = Physics.getLineIntersection(lineOfSight, segment)
        if (!actualLineOfSightEndPoint || (intersection && intersection.distanceFactor < actualLineOfSightEndPoint.distanceFactor)) {
          actualLineOfSightEndPoint = intersection
        }
      }
    })

    if (!actualLineOfSightEndPoint) {
      actualLineOfSightEndPoint = {
        x: srcAtom.x + MAX_LINE_OF_SIGHT_DISTANCE* Math.cos(srcAtom.rotation),
        y: srcAtom.y + MAX_LINE_OF_SIGHT_DISTANCE * Math.sin(srcAtom.rotation),
      }
    }

    // Expected line of sight
    c2d.beginPath()
    c2d.moveTo(lineOfSight.start.x + camera.x, lineOfSight.start.y + camera.y)
    c2d.lineTo(lineOfSight.end.x + camera.x, lineOfSight.end.y + camera.y)
    c2d.closePath()
    c2d.strokeStyle = '#c88'
    c2d.lineWidth = 3
    c2d.setLineDash([5, 5])
    c2d.stroke()
    c2d.setLineDash([])

    // Actual line of sight
    c2d.beginPath()
    c2d.moveTo(lineOfSight.start.x + camera.x, lineOfSight.start.y + camera.y)
    c2d.lineTo(actualLineOfSightEndPoint.x + camera.x, actualLineOfSightEndPoint.y + camera.y)
    c2d.closePath()
    c2d.strokeStyle = '#39f'
    c2d.lineWidth = 3
    c2d.stroke()

    // Expected end of line of sight
    c2d.beginPath()
    c2d.arc(lineOfSight.end.x + camera.x, lineOfSight.end.y + camera.y, 4, 0, 2 * Math.PI)
    c2d.closePath()
    c2d.fillStyle = '#c88'
    c2d.fill()

    // Actual end of line of sight
    c2d.beginPath()
    c2d.arc(actualLineOfSightEndPoint.x + camera.x, actualLineOfSightEndPoint.y + camera.y, 8, 0, 2 * Math.PI)
    c2d.closePath()
    c2d.fillStyle = '#39f'
    c2d.fill()
  }
}
