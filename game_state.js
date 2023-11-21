import {
    make,
    Cls,
    DrawText,
    Preload,

    LoadImage,
    DrawImage,

    MouseX,
    MouseY
} from "./blitz/blitz.js"


import Pig from "./box.js"
import Stack from "./stack.js"



let cursor

Preload(()=>{
    cursor = LoadImage("cursor.png")
})


const MAX_THINGS = 500

/** @interface  */
class IGameThing {
    /** @type {boolean} */
    dead
    /** @param {GameState} gamestate */
    update(gamestate) { }
    /** @param {GameState} gamestate */
    render(gamestate) { }
}

class GameState {
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

        // coisinhas de lógica de jogo (não deixar aqui)
        this.ticks--
        if (this.ticks == 0) {
            this.spawn(make(new Pig(), {
                x: Math.random() * 800,
                y: -128,
                sx: -5 + Math.random() * 10,
                sy: 2 + Math.random() * 4
            }))

            this.ticks = 60
        }

        // troca as pilhas
        let tmp = this._scene
        this._scene = this._alives
        this._alives = tmp
        this._alives.reset()
    }

    render() {
        Cls(0,0,0)

        DrawText("Scene stack top:" + this._scene.top, 20, 20)
        DrawText("Alives stack top:" + this._alives.top, 20, 40)

        for (let i = 0; i < this._scene.top; i++) {
            let obj = this._scene.at(i)
            obj.render && obj.render()
        }

        DrawImage( cursor, MouseX(), MouseY() )

    }
}

export default GameState