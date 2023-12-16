import { OnTouchEnd, OnTouchMove, OnTouchStart, ClearAll } from "../../blitz/input";
import { Gato } from "./gato";
import { Nub } from "../nub";
import { GameState } from "../../game_state";

const NUB_SIZE = 64


/**
 * @param {GameState} state 
 * @param {Gato} gato 
 */
function ControlarGato(state, gato) {

    let nubWalk = new Nub(NUB_SIZE*1.5, state.screen.height * 0.75 + NUB_SIZE/2)
    let nubJump = new Nub(state.screen.width - NUB_SIZE*0.5, state.screen.height * 0.75 + NUB_SIZE/2)

    // Remove todos os event handleus
    ClearAll()

    const nubs = [nubWalk, nubJump]
    // gatinho começa a andar
    OnTouchStart(touches => {
        for (let i = 0; i < touches.length; i++) {
            let { x, y, n } = touches[i];
            for (let nub of nubs) {
                if (nub.touching(x, y)) {
                    nub.press(x, y, n)
                    continue
                }
            }
        }
    })

    OnTouchMove(touches => {
        for (let i = 0; i < touches.length; i++) {
            // direção do gatinho
            let { x, y, n } = touches[i]
            if (n == nubWalk.touch) {
                nubWalk.move(x, y)
                nubWalk.dy = 0
            }
            // pulo
            if (n == nubJump.touch) {
                nubJump.move(x, y)
            }
        }
    })

    OnTouchEnd(touches => {
        for (let i = 0; i < touches.length; i++) {
            for (let nub of nubs) {
                if (touches[i].n == nub.touch) {
                    nub.release()
                }
            }
        }
    })

    // A gente pode fazer isso porque é javascript......

    // Em teoria assim a gente consegue ter fases diferentes com esquema de controle diferentes.
    nubWalk.update = function(){
        if(this.touch !== -1){
            gato.walk( this.getX() )
        }else{
            gato.stop()
        }
    }

    nubJump.update = function(){
        if(this.released()){
            gato.pounce( - 0.3 * this.releasedX, - 0.3 * this.releasedY)
        }
        if(gato.touchingLedge && this.held()){
            gato.hang()           
        }
    }

    state.spawn( nubWalk )
    state.spawn( nubJump )
}

export { 
    ControlarGato
}