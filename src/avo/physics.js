/*
Physics Subsystem

Contains a bunch of functions to help simulate simple 2D physics between game
objects (Entities). The actual simulation happens in the AvO game engine
(i.e. AvO.play() calls Physics functions) and in the Entity class (e.g.
performing deceleration).

Honestly, this subsystem is mostly used to detect and react to collisions.

The Physics subsystem checks and affects an Entity's following physical
properties:

- .x, .y: position on a 2D plane. (east/west, south/west)
- .pushX, .pushY: "external movement".
- .shape, .solid, .movable, .mass

Note that the following physical properties are IGNORED:

- .z: position on the Z-axis (above/below) doesn't count for collision.
- .moveX, .moveY: movement from self locomotion doesn't directly affect physics
  collisions, nor is affected by it. (In other words, if you want an Entity to
  bounce when it speeds into a wall, use pushX, pushY.)

See the Entity class for more details.
 */

import { SHAPES } from '@avo/constants.js'
import { isZero } from '@avo/misc.js'

const USE_CIRCLE_APPROXIMATION = false

export default class Physics {

  //----------------------------------------------------------------

  /*
  Checks if entity A is touching entity B.
  - If true, returns the corrected coordinates for entA and entB, in form:
    { a: { x, y },
      b: { x, y } }
  - If false, returns null.
   */
  static checkCollision (entA, entB) {
    if (!entA || !entB || entA === entB) return null

    // Circle + Circle collision
    if (entA.shape === SHAPES.CIRCLE && entB.shape === SHAPES.CIRCLE) {
      return Physics.checkCollision_circleCircle(entA, entB)
    }

    // Polygon + Polygon collision. (Squares are polygons, of course.)
    else if (
      (entA.shape === SHAPES.SQUARE || entA.shape === SHAPES.POLYGON) &&
      (entB.shape === SHAPES.SQUARE || entB.shape === SHAPES.POLYGON)
    ) {
      return Physics.checkCollision_polygonPolygon(entA, entB)
    }

    // Circle + Polygon collision.
    else if (
      entA.shape === SHAPES.CIRCLE &&
      (entB.shape === SHAPES.SQUARE || entB.shape === SHAPES.POLYGON)
    ) {
      if (USE_CIRCLE_APPROXIMATION) return Physics.checkCollision_polygonPolygon(entA, entB)

      return Physics.checkCollision_circlePolygon(entA, entB)
    }

    // Polygon + Circle collision
    // It's the reverse of the previous scenario.
    else if (
      (entA.shape === SHAPES.SQUARE || entA.shape === SHAPES.POLYGON) &&
       entB.shape === SHAPES.CIRCLE
    ) {
      if (USE_CIRCLE_APPROXIMATION) return Physics.checkCollision_polygonPolygon(entA, entB)

      let correction = Physics.checkCollision_circlePolygon(entB, entA)
      if (correction) {
        correction = {
          a: correction.b,
          b: correction.a,
        }
      }
      return correction
    }

    return null
  }
  //----------------------------------------------------------------

  static checkCollision_circleCircle (entA, entB) {
    let fractionA = 0
    let fractionB = 0
    if (!entA.solid || !entB.solid) {
      //If either entity isn't solid, there's no collision correction.
    } else if (entA.movable && entB.movable) {
      fractionA = 0.5
      fractionB = 0.5
    } else if (entA.movable) {
      fractionA = 1
    } else if (entB.movable) {
      fractionB = 1
    }

    const distX = entB.x - entA.x
    const distY = entB.y - entA.y
    const dist = Math.sqrt(distX * distX + distY * distY)
    const minimumDist = entA.radius + entB.radius
    if (dist < minimumDist) {
      const angle = Math.atan2(distY, distX)
      const correctDist = minimumDist
      const cosAngle = Math.cos(angle)
      const sinAngle = Math.sin(angle)

      const motion = Physics.getPostCollisionMotion(entA, entB)

      return {
        a: {
          x: entA.x - cosAngle * (correctDist - dist) * fractionA,
          y: entA.y - sinAngle * (correctDist - dist) * fractionA,
          pushX: motion && motion.a.pushX,
          pushY: motion && motion.a.pushY,
        },
        b: {
          x: entB.x + cosAngle * (correctDist - dist) * fractionB,
          y: entB.y + sinAngle * (correctDist - dist) * fractionB,
          pushX: motion && motion.b.pushX,
          pushY: motion && motion.b.pushY,
        }
      }
    }

    return null
  }

  //----------------------------------------------------------------

  static checkCollision_polygonPolygon (entA, entB) {
    let fractionA = 0
    let fractionB = 0
    if (!entA.solid || !entB.solid) {
      //If either entity isn't solid, there's no collision correction.
    } else if (entA.movable && entB.movable) {
      fractionA = 0.5
      fractionB = 0.5
    } else if (entA.movable) {
      fractionA = 1
    } else if (entB.movable) {
      fractionB = 1
    }

    let correction = null
    const verticesA = entA.vertices
    const verticesB = entB.vertices
    const projectionAxes = [...Physics.getShapeNormals(entA), ...Physics.getShapeNormals(entB)]
    for (let i = 0 ; i < projectionAxes.length ; i++) {
      const axis = projectionAxes[i]
      const projectionA = { min: Infinity, max: -Infinity }
      const projectionB = { min: Infinity, max: -Infinity }

      for (let j = 0 ; j < verticesA.length ; j++) {
        const val = Physics.dotProduct(axis, verticesA[j])
        projectionA.min = Math.min(projectionA.min, val)
        projectionA.max = Math.max(projectionA.max, val)
      }
      for (let j = 0 ; j < verticesB.length ; j++) {
        const val = Physics.dotProduct(axis, verticesB[j])
        projectionB.min = Math.min(projectionB.min, val)
        projectionB.max = Math.max(projectionB.max, val)
      }

      const overlap = Math.max(0, Math.min(projectionA.max, projectionB.max) - Math.max(projectionA.min, projectionB.min))
      if (!correction || overlap < correction.magnitude) {
        const sign = Math.sign((projectionB.min + projectionB.max) - (projectionA.min + projectionA.max))
        correction = {
          magnitude: overlap,
          x: axis.x * overlap * sign,
          y: axis.y * overlap * sign,
        }
      }
    }

    if (correction && correction.magnitude > 0) {
      return {
        a: {
          x: entA.x - correction.x * fractionA,
          y: entA.y - correction.y * fractionA,
        },
        b: {
          x: entB.x + correction.x * fractionB,
          y: entB.y + correction.y * fractionB,
        }
      }
    }

    return null
  }

  //----------------------------------------------------------------

  static checkCollision_circlePolygon (entA, entB) {
    let fractionA = 0
    let fractionB = 0
    if (!entA.solid || !entB.solid) {
      //If either entity isn't solid, there's no collision correction.
    } else if (entA.movable && entB.movable) {
      fractionA = 0.5
      fractionB = 0.5
    } else if (entA.movable) {
      fractionA = 1
    } else if (entB.movable) {
      fractionB = 1
    }

    const distX = entB.x - entA.x
    const distY = entB.y - entA.y
    const dist = Math.sqrt(distX * distX + distY * distY)
    const centreToCentreAxis = (dist !== 0)
      ? { x: distX / dist, y: distY / dist }
      : { x: 0, y: 0 }

    let correction = null
    const verticesB = entB.vertices
    const projectionAxes = [centreToCentreAxis, ...Physics.getShapeNormals(entB)]
    for (let i = 0 ; i < projectionAxes.length ; i++) {
      const axis = projectionAxes[i]
      const scalarA = Physics.dotProduct(axis, { x: entA.x, y: entA.y })
      const projectionA = { min: scalarA - entA.radius, max: scalarA + entA.radius }
      const projectionB = { min: Infinity, max: -Infinity }

      for (let j = 0 ; j < verticesB.length ; j++) {
        const val = Physics.dotProduct(axis, verticesB[j])
        projectionB.min = Math.min(projectionB.min, val)
        projectionB.max = Math.max(projectionB.max, val)
      }

      const overlap = Math.max(0, Math.min(projectionA.max, projectionB.max) - Math.max(projectionA.min, projectionB.min))
      if (!correction || overlap < correction.magnitude) {
        const sign = Math.sign((projectionB.min + projectionB.max) - (projectionA.min + projectionA.max))
        correction = {
          magnitude: overlap,
          x: axis.x * overlap * sign,
          y: axis.y * overlap * sign,
        }
      }
    }

    if (correction && correction.magnitude > 0) {
      return {
        a: {
          x: entA.x - correction.x * fractionA,
          y: entA.y - correction.y * fractionA,
        },
        b: {
          x: entB.x + correction.x * fractionB,
          y: entB.y + correction.y * fractionB,
        }
      }
    }
  }

  //----------------------------------------------------------------

  /*  Gets the NORMALISED normals for each edge of the entity's shape. Assumes the entity has the 'vertices' property.
   */
  static getShapeNormals (ent) {
    const vertices = ent.vertices
    if (!vertices) return null
    if (vertices.length < 2) return []  //Look, you need to have at least three vertices to be a shape.

    //First, calculate the edges connecting each vertice.
    //--------------------------------
    const edges = []
    for (let i = 0 ; i < vertices.length ; i++) {
      const p1 = vertices[i]
      const p2 = vertices[(i+1) % vertices.length]
      edges.push({
        x: p2.x - p1.x,
        y: p2.y - p1.y,
      })
    }
    //--------------------------------

    //Calculate the NORMALISED normals for each edge.
    //--------------------------------
    return edges.map((edge) => {
      const dist = Math.sqrt(edge.x * edge.x + edge.y * edge.y)
      if (dist === 0) return { x: 0, y: 0 }
      return {
        x: -edge.y / dist,
        y: edge.x / dist,
      }
    })
    //--------------------------------
  }

  //----------------------------------------------------------------

  static getPostCollisionMotion (entA, entB) {
    if (!entA || !entB) return null

    if (
      !entA.movable || !entA.solid || entA.mass === 0
      || !entB.movable || !entB.solid || entB.mass === 0
      || (entA.mass + entB.mass) === 0
    ) return null

    const collisionAngle = Math.atan2(entB.y - entA.y, entB.x - entA.x)
    const ANGLE_90 = Math.PI / 2
    const totalMass = entA.mass + entB.mass
    const aSpd = entA.pushSpeed
    const bSpd = entB.pushSpeed
    const aAng = entA.pushAngle
    const bAng = entB.pushAngle
    const aMass = entA.mass
    const bMass = entB.mass

    const aGroup =
      ( aSpd * Math.cos(aAng - collisionAngle) * (aMass - bMass)
        + 2 * bMass * bSpd * Math.cos(bAng - collisionAngle)
      ) / totalMass
    const bGroup =
      ( bSpd * Math.cos(bAng - collisionAngle) * (bMass - aMass)
        + 2 * aMass * aSpd * Math.cos(aAng - collisionAngle)
      ) / totalMass

    const entA_pushX =
      aGroup * Math.cos(collisionAngle)
      + aSpd * Math.sin(aAng - collisionAngle) * Math.cos(collisionAngle + ANGLE_90)
    const entA_pushY =
      aGroup * Math.sin(collisionAngle)
      + aSpd * Math.sin(aAng - collisionAngle) * Math.sin(collisionAngle + ANGLE_90)
    const entB_pushX =
      bGroup * Math.cos(collisionAngle)
      + bSpd * Math.sin(bAng - collisionAngle) * Math.cos(collisionAngle + ANGLE_90)
    const entB_pushY =
      bGroup * Math.sin(collisionAngle)
      + bSpd * Math.sin(bAng - collisionAngle) * Math.sin(collisionAngle + ANGLE_90)

    return {
      a: {
        pushX: entA_pushX,
        pushY: entA_pushY,
      },
      b: {
        pushX: entB_pushX,
        pushY: entB_pushY,
      },
    }
  }

  //----------------------------------------------------------------

  static dotProduct (vectorA, vectorB) {
    if (!vectorA || !vectorB) return null
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y
  }

  //----------------------------------------------------------------

  /*
  Calculate intersection between two lines (a ray and a segment of a polygon).
  Useful for determining valids line of sight.

  - Each line is in the format { start: { x, y }, end: { x, y } }
  - Returns null if there's no intersection.
  - Returns { x, y, distanceFactor } if there's an intersection.
    x, y are the coordinates of the intersection point.
    distanceFactor is how far from the ray's origin point the intersection
    occurs. If 1, intersection occurs at the ray's end point. If 0.5,
    intersection occurs halfway between the ray's origin point and end point.

  Original code from https://ncase.me/sight-and-light/
   */
  static getLineIntersection (ray, segment) {
    // Each line is represented in the format:
    // line = originPoint + directionVector * distanceFactor
    // Or a bit more simply:
    // line = origin (o) + direction (d) * factor (f)

    // Ray
    let r_ox = ray.start.x
    let r_oy = ray.start.y
    let r_dx = ray.end.x - ray.start.x
    let r_dy = ray.end.y - ray.start.y

    // Segment
    let s_ox = segment.start.x
    let s_oy = segment.start.y
    let s_dx = segment.end.x - segment.start.x
    let s_dy = segment.end.y - segment.start.y

    // The intersection occurs where ray.x === segment.x and ray.y === segment.y
    // So, we need to solve for r_factor and s_factor in...
    // r_ox + r_dx * r_factor = s_ox + s_dx * s_factor && r_oy + r_dy * r_factor = s_oy + s_dy * s_factor
    let r_factor = null
    let s_factor = null

    if (!isZero(s_dx * r_dy - s_dy * r_dx)) {
      // Solve for s_factor.
      s_factor = (r_dx * (s_oy - r_oy) + r_dy * (r_ox - s_ox)) / (s_dx * r_dy - s_dy * r_dx)

      // There are two ways to solve for r_factor; one works when the ray
      // isn't perfectly horizontal, the other works when the ray isn't
      // perfectly vertical.
      if (!isZero(r_dx)) {
        r_factor = (s_ox + s_dx * s_factor - r_ox) / r_dx
      } else if (!isZero(r_dy)) {
        r_factor = (s_oy + s_dy * s_factor - r_oy) / r_dy
      }
    }

    // Check if the intersection occurs within the length of both lines.
    // (The maths above calculates for infinitely long lines.)
    if (
      r_factor === null || s_factor === null
      || r_factor < 0 || r_factor > 1
      || s_factor < 0 || s_factor > 1
    ) return null

    // Point of intersection
    return {
      x: r_ox + r_dx * r_factor,
      y: r_oy + r_dy * r_factor,
      distanceFactor: r_factor
    }
  }

  //----------------------------------------------------------------

}
