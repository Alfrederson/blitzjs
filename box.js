import { make, IB2D, Preload } from "./blitz/blitz"
import {GameState, IGameThing} from "./game_state"

import Missil from "./missil"

let sprite

Preload( async b =>{
  sprite = await b.LoadImage("porco.png")
  sprite = await b.LoadImage("porco.png")
})

/** @implements {IGameThing} */
class Pig {
    dead = false
    x = 0
    y = 0
    sx = 0
    sy = 0
    ticker = 0
    burstTicker = 0
    shooting = false
    shootingFrom = 0
    angle = 0

    kamikaze=false

    /** @param {GameState} state */
    update(state){
      if(this.x >= 800-32){
        this.x = 800-32
        this.sx *= -1
      }
      if(this.x <= 32){
        this.x = 32
        this.sx *= -1
      }

      if(this.y >= 700){
        state.kill( this )
        return
      }

      this.angle += 12 

      if(this.kamikaze){
        if(this.sy <= 32)
          this.sy += 0.5
      }

      if(this.shooting && !this.kamikaze){
        if(++this.ticker >= 3){
          this.shootingFrom = 1 - this.shootingFrom

          state.spawn( make(new Missil(), {
            x : this.x  -16 + this.shootingFrom*32,
            y : this.y,
            sy : this.sy+4
          }))
  
          this.ticker = 0

        }  
      }

      if(++this.burstTicker >= 20){
        this.shooting = !this.shooting
        this.burstTicker=0
        if(Math.random()>=0.7){
          this.kamikaze=true
        }
      }

      this.x += this.sx
      this.y += this.sy
    }

    /** @param {IB2D} b  */
    render(b){
      b.DrawImage( sprite, this.x, this.y )
    }

    initialize(){

    }
}


export default Pig;