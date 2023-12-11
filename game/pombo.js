import { IB2D, Preload } from "../blitz/blitz"
import { GameState } from "../game_state"
import { FILTRO_SOLIDO } from "./tileMap"

let sprite

Preload( async b =>{
    sprite = await b.LoadImage("fakePombo.png")
})

const PARADO = 0
const FUGINDO = 1
const VOANDO = 2
const POUSANDO = 3

const estados = [
    "parado",
    "fugindo",
    "voando",
    "pousando"
]

const POMBO_WIDTH = 32
const POMBO_HEIGHT = 32

class Pombo {
    grounded = false
    ceiled = false
    state = POUSANDO
    dead = false
    x = 96
    y = 320
    flightTime = 0
    // por quantos frames o pombo vai voar?
    willFlyFor = 0
    sx = 0
    sy = 0
    timer = 0

    constructor(x,y){
        this.x = x
        this.y = y
    }
    /** @param {GameState} s */
    update(s){
        // esse pombo tem que parecer um pombo.
        let oldState = this.state
        switch(this.state){
            case PARADO:
                this.sx = 0.0
                this.sy = 0.0
                if(this.timer++ >= 120){
                    this.timer = 0
                    this.state = FUGINDO
                    this.sx = Math.random() > 0.5 ? 1 : -1
                }
            break;
            case POUSANDO:
                this.sy += 0.1
                if(this.timer++ >= 5){
                    if(Math.random() >= 0.9){
                        this.sx = Math.random() > 0.5 ? 1 : -1
                        this.state = VOANDO
                        this.willFlyFor = (5 + Math.random()*5)*60
                    }
                    this.timer = 0 
                }
                if(this.grounded){
                    this.state = PARADO
                    this.timer = 0
                }
            break;
            case VOANDO:
                this.sy = Math.sin(this.flightTime+=0.1)
                if(this.timer++ >= this.willFlyFor || this.ceiled){
                    this.timer = 0
                    this.state = POUSANDO
                }
                if(this.grounded){
                    this.state = PARADO
                    this.timer = 0
                }            
            break;
            case FUGINDO:
                this.sy -= 0.1
                if(this.ceiled){
                    this.state = POUSANDO
                    this.timer = 0
                    break;
                }
                if(this.timer++ >= 60){
                    this.timer = 0
                    this.state = VOANDO
                    this.sy = 0
                    this.willFlyFor = (5 + Math.random()*5)*60
                }
            break;
        }
        if(this.state !== oldState){
            document.getElementById("debug").innerText = estados[this.state]
        }

        this.y += this.sy

        // tocando no chão/teto
        let out = [0,0,0,0]
        if(s.tileMap.objectCollides(
            [this.x,this.y,POMBO_WIDTH,POMBO_HEIGHT],
            out,
            FILTRO_SOLIDO
        )!==-1){
            // tava descendo, então vou estar grounded.
            this.ceiled = this.sy < 0
            this.grounded = this.sy >= 0
            this.y += this.sy < 0 ? out[3] : -out[3]
            this.sy = 0
        }else{
            this.grounded = false
            this.ceiled = false
        }

        this.x += this.sx
        if(s.tileMap.objectCollides(
            [this.x,this.y,POMBO_WIDTH,POMBO_HEIGHT],
            out,
            FILTRO_SOLIDO
        )!==-1){
            this.x += this.sx > 0 ? -out[2] : out[2]
            this.sx *= -1
        }
    }

    /**
     * @param {IB2D} b
     * @param {GameState} s
     */
    render(b,s){
        b.SetScale(1,1)
        b.DrawImage(sprite,
            this.x - s.screen.cameraX,
            this.y - s.screen.cameraY
        )
    }
}


export { Pombo }