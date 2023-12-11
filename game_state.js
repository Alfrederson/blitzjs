import {
    IB2D,
} from "./blitz/blitz.js"

import { TileMap } from "./game/tileMap.js"
import { constrain } from "./game/util.js"

import Stack from "./stack.js"

const MAX_THINGS = 500

// Isso aqui não é coisa de framework não. É 100% lógica do jogo.
// Isso aqui não é GODOT não que te obriga a pensar do jeito que o framework quer.

/**
 * @typedef {function(GameState):void} UpdateMethod
 * @typedef {function(IB2D, GameState): void} RenderMethod
 */

/**
 * @typedef {Object} IGameThing
 * @property {boolean} dead - se for verdadeiro, vai remover o objeto.
 * @property {UpdateMethod} update - Atualiza.
 * @property {RenderMethod} [renderUi] - Se ele desenha coisa na UI, definir esse método.
 * @property {RenderMethod} [render] - Renderiza.
 */

class GameState {

    screen = {
        width : 0,
        height : 0,

        cameraX : 0,
        cameraY : 0
    }

    // faz a "câmera" olhar pra uma posição x/y no espaço.
    lookAt(x,y){
        let dx = x - this.screen.cameraX
        let dy = y - this.screen.cameraY

        if (Math.abs(dx) <= 1)
            dx = 0
        if (Math.abs(dy) <= 1)
            dy = 0
        this.screen.cameraX += dx / 10
        this.screen.cameraY += dy / 10

        this.screen.cameraX = constrain(
            this.screen.cameraX,
            0,
            this.tileMap.width*32 - this.screen.width
        )
        this.screen.cameraY = constrain(
            this.screen.cameraY,
            0,
            this.tileMap.height*32 - this.screen.height
        )
    }

    tileMap = new TileMap()

    /** @type {Stack<IGameThing>} */
    _scene = new Stack(MAX_THINGS)

    /** @type {Stack<IGameThing>} */
    _alives = new Stack(MAX_THINGS)

    ticks = 60

    /** @param {IGameThing} what */
    spawn(what) {
        this._alives.push(what)
    }

    /** @param {IGameThing} what */
    kill(what) {
        what.dead = true
    }

    update() {
        // loop through all the objects in the scene stack updating them
        for (let i = 0; i < this._scene.top; i++) {
            let obj = this._scene.at(i)
            if (!obj)
                continue

            obj.update && obj.update(this)

            // this is still alive...
            if (!obj.dead) {
                this._alives.push(obj)
            } else {
                this._scene.forget(i)
            }
        }

        // troca as pilhas
        let tmp = this._scene
        this._scene = this._alives
        this._alives = tmp
        this._alives.reset()
    }

    /**
     * @param {IB2D} b 
     */
    render(b) {
        this.tileMap.render(b,this) 

        for (let i = 0; i < this._scene.top; i++) {
            let obj = this._scene.at(i)
            obj.render && obj.render(b,this)
        }

        for (let i = 0; i < this._scene.top; i++) {
            let obj = this._scene.at(i)
            obj.renderUi && obj.renderUi(b,this)
        }

    }
}

export { GameState }