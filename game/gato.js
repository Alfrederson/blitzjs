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
import { constrain } from "./util";

let sprite


Preload( async b =>{
    sprite = await b.LoadImage("gato.png")
})

const CAT_WIDTH = 48
const CAT_HEIGHT = 32

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

    touchingMap = -1

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

        // movimentos felinos
        
        let out = [0,0,0,0]

        this.sy += 0.2
        this.y += this.sy 

        // corrigiu verticalmente.
        if(s.tileMap.objectCollides(
            [this.x, this.y, CAT_WIDTH, CAT_HEIGHT],
            out
        )!==-1){
            // batendo a cabeça no teto...
            this.y += this.sy > 0 ? -out[3] : out[3]
            this.sy = 0
            this.grounded=true    
        }else{            
            this.grounded=false
        }

        if(this.grounded){
            if(this.walking){
                this.sx += 0.4 * this.walkingSpeed
            }else{
                this.sx *= 0.9
            }            
        }         
        this.sx = constrain(this.sx, -4,4)
        this.x += this.sx
        // bora ver se ele bate nas paredes.
        if(s.tileMap.objectCollides(
            [this.x, this.y, CAT_WIDTH, CAT_HEIGHT],
            out
        )!==-1){
            this.sx = 0
            this.x += out[0]+out[2]/2 > this.x+CAT_WIDTH/2 ? -out[2] : out[2]
            document.getElementById("debug").innerText = out.map(x => x.toFixed(2)).join(",")    
        }else{
            document.getElementById("debug").innerText = ""   
        }       
    }

    /**
     * @param {IB2D} b
     */
    render(b){
        b.SetScale( this.side ,1)

        b.DrawImage( sprite, this.x+CAT_WIDTH/2, this.y+CAT_HEIGHT/2 )
        b.SetScale( 1, 1)

    }

}

export { Gato }