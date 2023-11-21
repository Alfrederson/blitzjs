import {
    BeginDraw,
    Cls,
    DrawImage,
    EndDraw,
    Graphics,
    LoadImage
} from "./webgl"

import {
    AttachInput,
    MouseX,
    MouseY
} from "./input"

/**
 * Inicializa um "objeto" com propriedades específicas.
 * @param {object} x 
 * @param {object|undefined} properties 
 * @returns 
 */
function make(x, properties){

    //let result = Object.create(x)
    x.initialize && x.initialize()

    if(properties){
        for(let k of Object.keys(properties)){
            x[k] = properties[k]
        }
    }

    return x
}






/** @interface */
class IApp {
    setup(){}
    draw(){}
}

/**
 * Registra uma função para ser executada no preload.
 * O preload é executado antes do initialize.
 * Este é o lugar para pré-carregar sprites e afins.
 * @param {function} fn 
 */
function Preload(fn){
    _preloadFunctions.push(fn)
}

const _preloadFunctions = []


/**
 * Inicializa a engine. game deve implementar a interface iapp.
 * @param {IApp} game 
 */

async function Start(game){
    for(let fn of _preloadFunctions){
        console.log("preload...")
        await fn()
    }

    game.setup()

    function draw(){

        BeginDraw()
        game.draw()
        EndDraw()

        requestAnimationFrame(draw)
    }

    draw()
}







/**
 * Desenha texto na posição xy
 * @param {string} txt 
 * @param {number} x 
 * @param {number} y 
 */
function DrawText(txt, x, y){
    ////@ts-expect-error
    // text(txt, x, y)
}




  



const PI_BY_180 = (Math.PI / 180)

/**
 * @param {number} a
 */
function Sin(a){
    return Math.sin( a * PI_BY_180)
}

/**
 * @param {number} a
 */
function Cos(a){
    return Math.cos( a * PI_BY_180)
}



export {
    // core
    make,

    // matemática
    Sin,
    Cos,

    // ciclo de vida
    Start,
    Preload,

    // Sistema , eu acho
    Graphics,

    Cls,

    // imagens
    LoadImage,
    DrawImage,

    // texto
    DrawText,


    // input
    MouseX,
    MouseY
}