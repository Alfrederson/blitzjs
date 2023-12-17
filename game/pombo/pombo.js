import { IB2D, Preload } from "../../blitz/blitz"
import { GameState } from "../../game_state"
import { Gato } from "../gato/gato"
import { Pena } from "./pena"
import { FILTRO_SOLIDO } from "../tileMap"
import { coin, constrain, dice, diff } from "../util"


import { ANIMATION_CYCLE, ANIMATION_PING_PONG, Animation } from "../animation"

let sprite

Preload( async b =>{
    sprite = await b.LoadAnimImage("fakePombo.png",32,32)
})

const PARADO = 0
const ANDANDO = 1
const FUGINDO = 2
const VOANDO = 3
const POUSANDO = 4


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
    // por quantos frames o pombo vai andar?
    willWalkFor = 0
    sx = 0
    sy = 0
    timer = 0

    animFrame = 0

    // blerg

    /** @type {Gato} */
    static gato

    /** @type {Animation} */
    animFly

    /** @type {Animation} */
    animWalk



    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x,y){
        this.x = x
        this.y = y

        // animação de vôo
        this.animFly = new Animation({ frameCount: 2, frameDelay: 3, type: ANIMATION_PING_PONG, baseFrame: 1 })
        this.animWalk = new Animation({ frameCount: 4, frameDelay: 4, type: ANIMATION_CYCLE, baseFrame: 4 })
    }

    /**
     * @param {number} s
     */
    setState(s){
        this.state = s
        this.timer = 0
    }

    getRect(rect){
        rect[0] = this.x
        rect[1] = this.y
        rect[2] = POMBO_WIDTH
        rect[3] = POMBO_HEIGHT
    }

    /** @param {GameState} s */
    update(s){
        // esse pombo tem que parecer um pombo.
        // QUE LOUCURA TÁ ISSO
        switch(this.state){
            case PARADO:
                if(this.timer++ >= 120){
                    this.timer = 0
                    let num = dice(4)
                    switch(num){
                        case 1:
                            this.setState(ANDANDO)
                            this.willWalkFor = dice(3) * 50
                            this.sx = coin() ? 1 : -1        
                        break;
                        case 2:
                            this.setState(FUGINDO)
                            this.sx = coin() ? 2 : -2
                        break;
                        default:
                            // .......
                    }
                }
            break;
            case ANDANDO:
                
                if(++this.timer >= this.willWalkFor){
                    this.setState(PARADO)
                    this.sx = 0
                }
            break;
            case POUSANDO:
                this.sy += 0.1
                if(this.timer++ >= 5){
                    if(dice(10) > 8){
                        this.sx = coin() ? 1 : -1
                        this.state = VOANDO
                        this.willFlyFor = 5 + dice(5)*30
                    }
                    this.timer = 0 
                }
                if(this.grounded){
                    this.setState(PARADO)
                    this.sx = 0.0                    
                }
            break;
            case VOANDO:
                this.sy = Math.sin(this.flightTime+=0.1)
                if(++this.timer >= this.willFlyFor || this.ceiled){
                    this.setState(POUSANDO)
                }
                if(this.grounded){
                    this.setState(PARADO)
                    this.sx = 0
                }            
            break;
            case FUGINDO:
                // solta peninhas
                if(dice(50)==2){
                    s.spawn(new Pena({x:this.x,y:this.y, sy: -2 *Math.random(), sx:-2 + Math.random()*2}))
                }
                // se não fizer isso, ele vai estar "grounded", e quando
                // ele está grounded, o estado dele muda pra parado
                // caso ele esteja no ar.
                this.sy -= 0.3
                if(this.ceiled){
                    this.setState(POUSANDO)
                    break;
                }
                if(++this.timer >= 60){
                    this.setState(VOANDO)
                    this.sy = 0
                    this.willFlyFor = (5 + dice(5))*60
                }
            break;
        }

        this.animFly.update()
        this.animWalk.update()

        this.sy += 0.2
        this.y += this.sy
        // tocando no chão/teto
        let out = [0,0,0,0]
        if(s.tileMap.objectCollides(
            this,
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
            this,
            out,
            FILTRO_SOLIDO
        )!==-1){
            this.x += this.sx > 0 ? -out[2] : out[2]
            this.sx *= -1
        }

        // foge do gato
        if(this.state == PARADO || this.state == ANDANDO){
            // No geral não é legal fazer isso!!!!!!!!
            // tem que dar um jeito de fazer esse "gato" ser apenas uma coisa amedrontadora no geral
            let gato = Gato.gatoGlobal
            if(gato){
                if( diff(this.x, gato.x) < 128 &&
                    diff(this.y, gato.y) < 128 && 
                    Math.abs( gato.sx ) >= 4){
                    this.state = FUGINDO
                    this.timer = 0
                    this.willFlyFor = 0
                    this.sy = 0
                    // gato ta na direita, vou pra esquerda
                    this.sx = gato.x > this.x ? -3 : 3                
                }    
            }
        }
        // acelera
        if(this.state == VOANDO ||
            this.state == FUGINDO ){
                this.sx = constrain( this.sx + Math.sign(this.sx)*0.1, -4,4)
        }       
    }

    /**
     * @param {IB2D} b
     * @param {GameState} s
     */
    render(b,s){
        b.SetScale(this.sx > 0 ? 1 : -1,1)
        b.SetAngle(0)
        b.SetColor(1,1,1,1)    

        let frame=0
        switch(this.state){
            case PARADO:
                if(this.grounded)
                    frame = 0
                else
                    frame = 2
                break;
            case ANDANDO:
                frame = this.animWalk.frame
                break;
            case FUGINDO:
            case VOANDO:
            case POUSANDO:
                frame = this.animFly.frame
                break;    
            default:
                frame =0
        }

        b.DrawImageFrame(sprite,
            this.x,
            this.y,
            frame
        )
    }
}


export { Pombo, sprite }