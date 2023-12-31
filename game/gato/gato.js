import { 
    IB2D,
    Preload
} from "../../blitz/blitz.js";

import { GameState } from "../../game_state.js"
import { FILTRO_BEIRA, FILTRO_SOLIDO } from "../tileMap.js";
import { constrain } from "../util.js";


import * as pombo from "../pombo/pombo.js"

let sprite

Preload( async b =>{
    sprite = await b.LoadAnimImage("gato.png",64,64)
})

const CAT_FRAME_WIDTH = 64
const CAT_FRAME_HEIGHT = 64

const CAT_WIDTH = 48
const CAT_HEIGHT = 36

const CAT_MARGIN_X = (CAT_FRAME_WIDTH-CAT_WIDTH)/2
const CAT_MARGIN_Y = (CAT_FRAME_HEIGHT-CAT_HEIGHT)/2

class Gato {
    /** @type {Gato|undefined} */
    static gatoGlobal

    grounded = false
    hanging = false
    touchingLedge = false
    jumping = false
    hasPigeon = false
    
    x = 128
    y = 64

    side = 1

    walkingSpeed = 0
    walking = false

    sx = 0
    sy = 0

    dead = false

    touchingMap = -1

    tired = false

    constructor(){
        Gato.gatoGlobal = this
    }

    /**
     * @param {number} speed 
     */
    walk(speed){
        if(speed >= 0.1 || speed <= -0.1)
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
        if(this.grounded || this.hanging){
            this.side = sx > 0 ? -1 : 1
            this.sx += sx * 24
            this.sy += sy * 24
            this.hanging = false
            this.jumping = true
        }
    }

    getRect(rect){
        rect[0] = this.x
        rect[1] = this.y
        rect[2] = CAT_WIDTH
        rect[3] = CAT_HEIGHT
    }

    hang(){
        if(this.touchingLedge && !this.tired){
            this.tired = true
            this.hanging = true
            this.jumping = false
        }
    }

    /**
     * @param {GameState} s
     */
    update (s){
        // movimentos felinos
        
        let out = [0,0,0,0]

        // se o gatinho tá se pendurando,
        // ele não pode cair.
        if(this.hanging){
            this.sy = 0
        }else{
            this.sy += 0.2
        }
        this.y += this.sy 
        // corrigiu verticalmente.
        if(s.tileMap.objectCollides(
            this,
            out,
            FILTRO_SOLIDO
        )!==-1){
            // batendo a cabeça no teto...
            this.y = Math.fround(this.y + (this.sy > 0 ? -out[3] : out[3]))
            this.sy = 0
            this.tired=false
            this.grounded=true    
            this.jumping=false
        }else{                        
            this.grounded=false
        }

        if(this.grounded){
            if(this.walking){
                this.sx += 0.35 * this.walkingSpeed
            }else{
                this.sx *= 0.9
            }            
        }else{
            // air control
            if(this.walking){
                this.sx += 0.1 * this.walkingSpeed
            }
        }
        if(this.hanging) this.sx = 0                
        this.sx = constrain(this.sx, -4,4)

        // se está pendurado, ele não sai do lugar...
        this.x += this.sx
        // bora ver se ele bate nas paredes.
        if(s.tileMap.objectCollides(
            this,
            out,
            FILTRO_SOLIDO
        )!==-1){
            this.sx = 0
            this.x += out[0]+out[2]/2 > this.x+CAT_WIDTH/2 ? -out[2] : out[2]
        }       

        // bora ver se ele pode se pendurar
        let tmp_x = this.x
        this.x += this.side < 0 ? 4 : -4
        if(!this.tired && !this.grounded && s.tileMap.objectCollides(
            this,
            out,
            FILTRO_SOLIDO
        )!==-1){
            // o gato tem que estar bem perto da beira.
            this.touchingLedge = out[3] > 6
        }else{
            this.touchingLedge = false
        }
        this.x = tmp_x    
    }
    /**
     * @param {IB2D} b
     * @param {GameState} s
     */
    render(b,s){
        
        let frame = 0
        if(this.jumping)
            frame = 1
        if(this.hanging)
            frame = 2

        b.SetScale( this.side ,1)
        b.SetColor(1,1,1,1)
        b.SetAngle(0)

        b.DrawImageFrame(sprite,
            this.x - CAT_MARGIN_X,
            this.y - CAT_MARGIN_Y,
            frame
        )
    }

}

export { Gato }