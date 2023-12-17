import { GameState } from "../../game_state";
import { rectsIntersect } from "../util";

/**
 * Sensor é um trigger que é acionado por uma
 * entidade específica ou lista de entidades.
 * Por enquanto é assim, depois vou implementar o grid
 * de objetos pra poder criar interações com todos eles.
 */
class Sensor{
    dead = false
    x = 0
    y = 0
    width = 0
    height = 0

    rect = [0,0,0,0]

    /** @type {import("../interfaces").ICollider} */
    target

    wasTriggered = false
    isTriggered = false

    /**
     * @type {function|undefined}
     */
    enterHandler = undefined
    exitHandler = undefined
    
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(x,y,width,height){
        this.rect = [x,y,width,height]
    }

    /**
     * @param {import("../interfaces").ICollider} target 
     * @param {function} handler 
     */
    onEnter( target, handler ){
        this.target = target
        this.enterHandler = handler
    }

    onExit( target, handler ){
        this.target = target
        this.enterHandler = handler
    }

    /**
     * @param {GameState} s 
     */
    update(s){
        if(this.isTriggered)
            return

        // vê se o target tocou aqui.
        let out = [0,0,0,0]
        let targetRect = [0,0,0,0]
        this.target.getRect(targetRect)

        if( rectsIntersect( this.rect, targetRect, out ) ){
            this.isTriggered = true
            this.enterHandler && this.enterHandler()
            this.dead = true
        }
    }
}

export {
    Sensor
}