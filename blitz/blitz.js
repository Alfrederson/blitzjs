/** @interface */

class IB2D{
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {string} elementId 
     */
    Graphics(width,height,elementId){}

    /**
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     */
    Cls(r,g,b){}

    /**
     * 
     * @param {string} text 
     * @param {number} x 
     * @param {number} y 
     */
    DrawText(text,x,y){}

    /**
     * @param {string} fileName
     * @returns {IImage}
     */
    LoadImage(fileName){
        return new IImage()
    }

    /**
     * @param {IImage} imageHandler
     * @param {number} x
     * @param {number} y
     */
    DrawImage(imageHandler,x,y){}
}

/** @interface */
class IImage {
    /** @type {number} */
    width
    /** @type {number} */
    height
    /** @type {number} */
    frameCount
}


/**
 * Inicializa um "objeto" com propriedades específicas.
 * @param {object} x 
 * @param {object|undefined} properties 
 * @returns 
 */
function make(x, properties){
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
    /** @param {IB2D} b */
    setup(b){}
    /** @param {IB2D} b */
    draw(b){}
}

/**
 * Registra uma função para ser executada no preload.
 * O preload é executado antes do initialize.
 * Este é o lugar para pré-carregar sprites e afins.
 * @param {function(IB2D):void} fn 
 */
function Preload(fn){
    _preloadFunctions.push(fn)
}

const _preloadFunctions = []

/**
 * Inicializa a engine. game deve implementar a interface iapp.
 * @param {IApp} game 
 * @param {IB2D} b2d
 */

async function Start(game, b2d){
    
    for(let fn of _preloadFunctions){
        await fn(b2d)
    }

    game.setup(b2d)

    function draw(){
        game.draw(b2d)        
        requestAnimationFrame(draw)
    }

    draw()
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
    IB2D,   // interface de renderizador
    IImage, // imagem
    IApp    // de joguinho
};

export {
    // core
    make,

    // matemática
    Sin,
    Cos,

    // ciclo de vida
    Start,
    Preload,
}