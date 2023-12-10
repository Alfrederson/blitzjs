import { 
    IB2D,
    Preload
} from "../blitz/blitz";
import {
    OnTouchStart,
    OnTouchMove,
    OnTouchEnd,

    ClearTouchStart,
    ClearTouchMove,
    ClearTouchEnd
} from "../blitz/input"
import { GameState } from "../game_state"

let sprite


Preload( async b =>{
    sprite = await b.LoadImage("gato.png")
})


class Gato {

    grounded = false
    
    x = 128
    y = 64

    side = 1

    walkingSpeed = 0
    walking = false

    sx = 0
    sy = 0

    dead = false

    /**
     * @param {number} speed 
     */
    walk(speed){
        if(speed >= 1 || speed <= -1)
            this.side = speed > 0 ? -1 : 1
        this.walkingSpeed = speed
        this.walking = true
    }

    stop(){
        this.walkingSpeed = 0
        this.walking = false
    }

    /**
     * @param {number} sx
     * @param {number} sy
     */
    pounce(sx,sy){
        if(this.grounded){
            this.side = sx > 0 ? -1 : 1
            this.sx = sx
            this.sy = sy
        }
    }

    /**
     * @param {GameState} s
     */
    update (s){


        if(this.sx >= 4)
            this.sx = 4
        if(this.sx <= -4)
            this.sx = -4

        this.sy += 0.2

        this.x += this.sx
        this.y += this.sy

        if(this.y >= s.screen.height-48){
            if(this.walking){
                this.sx += 0.4 * this.walkingSpeed
            }else{
                this.sx *= 0.9
            }
    
            this.y = s.screen.height-48
            this.grounded=true
        }else{
            this.grounded=false
        }
        if(this.x <= 48)
            this.x = 48
        if(this.x >= s.screen.width-48)
            this.x = s.screen.width-48
    }

    /**
     * @param {IB2D} b
     */
    render(b){
        b.SetScale( this.side ,1)
        b.DrawImage( sprite, this.x, this.y )
        b.SetScale( 1, 1)
    }

}

export { Gato }