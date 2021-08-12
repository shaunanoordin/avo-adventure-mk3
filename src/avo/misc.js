/*
Checks if a number is (close enough) to zero.
Due to the imprecise way floating number data can be stored, it's possible for
a mathematical 0 to be represented as something incredibly small like
1.4210854715202004e-14. This screws boolean checks like (num === 0)
 */
export function isZero (num) {
  return -1e-10 < num && num < 1e-10
}
