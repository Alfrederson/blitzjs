import { IB2D, Preload } from "../blitz/blitz"

let nubSprite

Preload(async b => {
  nubSprite = await b.LoadImage("nub.png")
})

class Nub {
  x = 0
  y = 0
  dx = 0
  dy = 0
  length = 32
  touch = -1
  radius = 32
  justReleased = false
  releasedX = 0
  releasedY = 0
  constructor(_x, _y) {
    this.x = _x
    this.y = _y
    this.dx = _x
    this.dy = _y
    this.touch = -1
  }
  getX() {
    return Math.min(Math.max(this.dx - this.x, -this.length), this.length)/this.length
  }
  getY() {
    return Math.min(Math.max(this.dy - this.y, -this.length), this.length)/this.length
  }

  /** 
   * @param {IB2D} b - B2D
   * */
  render(b) {
    b.SetScale(2, 2)
    let x = Math.max(Math.min(this.x + this.length, this.dx), this.x - this.length)
    let y = Math.max(Math.min(this.y + this.length, this.dy), this.y - this.length)
    b.DrawImage(nubSprite, x, y)
    b.SetScale(1, 1)
  }

  touching(x, y) {
    return Math.abs(x - this.x) <= this.radius && Math.abs(y - this.y) <= this.radius * 2
  }
  held(){
    return this.touch !== -1
  }
  released() {
    let r = this.justReleased
    this.justReleased = false
    return r
  }
  release() {
    this.justReleased = true
    this.touch = -1
    this.releasedX = Math.max(-this.length, Math.min(this.dx - this.x, this.length)) / this.length
    this.releasedY = Math.max(-this.length, Math.min(this.dy - this.y, this.length)) / this.length
    this.dx = this.x
    this.dy = this.y
  }
}

export { Nub }