// @ts-ignore
import { sketch } from "p5js-wrapper"


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


let _canvas
const _window = {
    width : 0,
    height : 0,

    mouseX : 0,
    mouseY : 0
}


function MouseX(){
    return _window.mouseX
}

function MouseY(){
    return _window.mouseY
}

/**
 * 
 * @param {number} width 
 * @param {number} height 
 * @param {string} elementId
 */
// @ts-ignore
function Graphics(width, height, elementId){

    /** @type {HTMLCanvasElement | null} */
    // @ts-expect-error
    const element = document.getElementById(elementId);

    if(!element){
        throw "Não achei o elemento."
    }

    let refit_timer

    function refit(){
        _window.width = window.innerWidth-8
        _window.height = window.innerHeight-8

        // @ts-ignore
        resizeCanvas( _window.width, _window.height )
    }

    window.addEventListener("resize", ()=>{
        clearTimeout(refit_timer)
        refit_timer = setTimeout( refit, 100 )
    })

    window.addEventListener("mousemove", ev =>{
        _window.mouseX = ev.clientX
        _window.mouseY = ev.clientY
    })

    // @ts-ignore
    _canvas = createCanvas(window.innerWidth -8,window.innerHeight -8, WEBGL, element)

    refit()
}

/** @interface */
class IApp {
    setup(){}
    draw(){}
}

/**
 * Inicializa a engine. game deve implementar a interface iapp.
 * @param {IApp} game 
 */

function Start(game){
    //@ts-expect-error
    sketch.setup = function(){
        game.setup()
    }

    //@ts-expect-error
    sketch.draw = function(){
        game.draw()
    }
}



const _imageMap = new Map()
/**
 * Carrega uma imagem.
 * @param {string} path 
 * @returns 
 */
function LoadImage(path){
    let img = _imageMap.get(path)

    if(!img){
        //@ts-expect-error
        img = loadImage(path)
        _imageMap.set(path, img)
    }

    return img
}


function Cls(){
    // @ts-ignore
    _canvas.clear()
}

/**
 * Desenha uma imagem.
 * @param {object | undefined} img 
 * @param {number} x 
 * @param {number} y 
 */
function DrawImage(img, x, y){
    //@ts-expect-error
    img && image(img, x - _window.width/2, y - _window.height/2 )
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



//@ts-expect-error
sketch.preload = function(){
    console.log("====preload====")
    for(let fn of _preloadFunctions){
        fn()
    }
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