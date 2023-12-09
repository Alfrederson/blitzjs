import {

    make,

    IB2D,
    Preload,
} from "./blitz/blitz.js"

import {
    MouseX,
    MouseY
} from "./blitz/input.js"

import Stack from "./stack.js"

const MAX_THINGS = 500

/**
 * @typedef {Object} IGameThing
 * @property {boolean} dead - se for verdadeiro, vai remover o objeto.
 * @property {function} update - Atualiza.
 * @property {function} [render] - Renderiza.
 * @param {function} [renderUi] - Se ele desenha coisa na UI.
 */

// /** @interface  */
// class IGameThing {
//     /** @type {boolean} */
//     dead
//     /** @param {GameState} gamestate */
//     update(gamestate) { }
//     /** @param {IB2D} b2d */
//     render(b2d) { }

//     /** @param {IB2D} b2d */
//     renderUi(b2d){ }
// }

class GameState {

    screen = {
        width : 0,
        height : 0
    }

    /** @type {Stack} */
    _scene = new Stack(MAX_THINGS)

    /** @type {Stack} */
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
        b.Cls(255,255,255)

        for (let i = 0; i < this._scene.top; i++) {
            let obj = this._scene.at(i)
            obj.render && obj.render(b)
        }

        for (let i = 0; i < this._scene.top; i++) {
            let obj = this._scene.at(i)
            obj.renderUi && obj.renderUi(b)
        }

    }
}

export { GameState }