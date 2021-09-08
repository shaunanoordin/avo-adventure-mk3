export default class ImageAsset {
  constructor (url) {
    this.url = url
    this.img = null
    this.ready = false
    this.img = new Image()
    this.img.onload = function() {
      this.ready = true
    }.bind(this)
    this.img.src = this.url
  }
}
