import { make, LoadImage, DrawImage, Preload, Sin, Cos } from "./blitz/blitz"
import GameState from "./game_state"

import Missil from "./missil"

let sprite

Preload( ()=>{
  sprite = LoadImage("porco.png")
})

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

      if(this.shooting){
        if(++this.ticker >= 3){
          this.shootingFrom = 1 - this.shootingFrom

          state.spawn( make(new Missil(), {
            x : this.x -  16 + this.shootingFrom*32,
            y : this.y,
            sy : this.sy+4
          }))
  
          this.ticker = 0
        }  
      }

      if(++this.burstTicker >= 20){
        this.shooting = !this.shooting
        this.burstTicker=0
      }

      this.x += this.sx
      this.y += this.sy
    }

    render(){
      DrawImage( sprite, this.x-64, this.y-64 )
    }

    initialize(){

    }
}


export default Pig;