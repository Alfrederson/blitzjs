import { mat4 } from "gl-matrix"
import { IB2D, IImage } from "./blitz"

/**
 * WebGL program with attribute and uniform locations.
 * @typedef {Object} WebGLProgramInfo
 * @property {WebGLProgram} program - The WebGL program.
 * @property {Object} attribLocations - Attribute locations.
 * @property {number} attribLocations.vertexPosition - The location of the vertex position attribute.
 * @property {Object} uniformLocations - Uniform locations.
 * @property {WebGLUniformLocation | null} uniformLocations.projectionMatrix - The location of the projection matrix uniform.
 * @property {WebGLUniformLocation | null} uniformLocations.modelViewMatrix - The location of the model-view matrix uniform.
 * @property {WebGLUniformLocation | null} uniformLocations.drawColor - The location of the drawColor uniform.
*/



const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`

// Talvez usar isso pra mudar a cor dos sprites
const fsSource = `
    uniform lowp vec4 uDrawColor;
    void main(){
        gl_FragColor = uDrawColor;
    }
`

/**
 * Carrega um shader a partir de uma string.
 * @param {WebGLRenderingContext} ctx
 * @param {number} type
 * @param {string} source
 */
function loadShader(ctx, type, source){
    const shader = ctx.createShader(type)
    if(!shader)
        throw "Não consegui criar o shader"
    ctx.shaderSource(shader,source)
    ctx.compileShader(shader)
    if(!ctx.getShaderParameter(shader,ctx.COMPILE_STATUS)){
        let msg = "Erro compilando o shader: " + ctx.getShaderInfoLog(shader)
        ctx.deleteShader(shader)
        throw msg
    }
    return shader
}

/**
 * @param {WebGLRenderingContext} ctx
 * @param {string} vsSource
 * @param {string} fsSource
 */
function initShaderProgram(ctx,vsSource,fsSource){
    let shaderProgram = ctx.createProgram()
    if(!shaderProgram)
        throw "Não consegui criar um shader program"

    const vs = loadShader(ctx,ctx.VERTEX_SHADER,vsSource)
    const fs = loadShader(ctx,ctx.FRAGMENT_SHADER,fsSource)

    ctx.attachShader(shaderProgram,vs)
    ctx.attachShader(shaderProgram,fs)
    ctx.linkProgram(shaderProgram)

    if(!ctx.getProgramParameter(
        shaderProgram,
        ctx.LINK_STATUS
    )){
        throw `Não consegui inicializar o shader program: ${ctx.getProgramInfoLog(shaderProgram)}`
    }

    return shaderProgram
}

/**
 * 
 * @param {WebGLRenderingContext} ctx 
 */
function initPositionBuffer(ctx){
    const positionBuffer = ctx.createBuffer()
    ctx.bindBuffer(ctx.ARRAY_BUFFER,positionBuffer)
    const positions = [
        0.5, 0.5,
        -0.5, 0.5,
        0.5, -0.5,
        -0.5, -0.5
    ]
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(positions),ctx.STATIC_DRAW)
    return positionBuffer
}

/**
 * 
 * @param {WebGLRenderingContext} ctx 
 * @param {*} buffers 
 * @param {WebGLProgramInfo} programInfo 
 */
function setPositionAttribute(ctx, buffers, programInfo){
    ctx.bindBuffer(
        ctx.ARRAY_BUFFER,
        buffers.position
    )
    ctx.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        2, // numComponents
        ctx.FLOAT,// type
        false ,// normalize
        0,     // stride
        0      // offset
    )
    ctx.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition
    )
}

/** @implements {IB2D} */
class WGL_B2D {
    /** @type {WebGLRenderingContext|null} */
    ctx = null

    /** @type {WebGLProgram|null} */
    shaderProgram = null

    /** @type {WebGLProgramInfo|null} */
    programInfo = null

    /** @type {WebGLBuffer|null} */
    positionBuffer = null

    /** @type {mat4} */
    projectionMatrix = mat4.create()

    scale = [1,1]
    rotation = 45
    drawColor = [1,1,1,1]

    /**
     * Carrega uma imagem.
     * @param {string} imageName 
     */
    LoadImage(imageName){
        console.log("Loading ",imageName)
        return {
            width : 32,
            height : 32,
            frameCount : 1
        }
    }

    LoadAnimImage(imageName,frameWidth, frameHeight, firstFrame,frameCount){

    }


    /**
     * 
     * @param {number} width 
     * @param {number} height 
     * @param {string} elementId 
     */
    Graphics(width,height, elementId){
        /** @type {HTMLCanvasElement | null} */
        // @ts-ignore
        const canvas = document.getElementById(elementId);

        if(!canvas)
            throw "Não achei o elemento."
        if(!(canvas instanceof HTMLCanvasElement))
            throw "Elemento não é um canvas."

        const body= document.getElementsByTagName("body")[0]
        // manter a proporção da tela
        const letterBox = function(){
            let innerRatio = width/height
            let outerRatio = body.clientWidth / body.clientHeight    

            if (outerRatio > innerRatio){
                canvas.width = body.clientHeight * innerRatio
                canvas.height = body.clientHeight;
            }else{
                canvas.width = body.clientWidth
                canvas.height = body.clientWidth/innerRatio
            }
        }

        letterBox()

        this.ctx = canvas.getContext("webgl");

        if(!this.ctx)
            throw "Não consegui pegar um contexto de renderização."
        // iniciar os shadeus lá
        this.shaderProgram = initShaderProgram(this.ctx, vsSource, fsSource)

        this.programInfo = {
            program : this.shaderProgram,
            attribLocations :{
                vertexPosition: this.ctx.getAttribLocation(this.shaderProgram,"aVertexPosition")
            },
            uniformLocations: {
                projectionMatrix: this.ctx.getUniformLocation(this.shaderProgram,"uProjectionMatrix"),
                modelViewMatrix: this.ctx.getUniformLocation(this.shaderProgram,"uModelViewMatrix"),
                drawColor : this.ctx.getUniformLocation(this.shaderProgram,"uDrawColor")
            }
        }

        this.positionBuffer = {
            position : initPositionBuffer(this.ctx)
        }

        this.projectionMatrix = mat4.create()
        mat4.ortho(this.projectionMatrix,0,width,height,0,-1,1)    

        // faz isso uma vez só....
        setPositionAttribute(
            this.ctx,
            this.positionBuffer,
            this.programInfo
        )

        this.ctx.useProgram( this.programInfo.program )
        
        // usa aquela matriz de projeção ortogonal uma vez só
        this.ctx.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false, // transpose,
            this.projectionMatrix
        )

        // ajusta o tamanho do canvas pra ficar  bunitim
        window.addEventListener("resize", ()=>{
            letterBox()
            this.ctx?.viewport(0,0, this.ctx.canvas.width, this.ctx.canvas.height)
        })
    }
    /**
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     */
    Cls(r,g,b){
        this.ctx?.clearColor(r/255,g/255,b/255,1.0)
        this.ctx?.clear(this.ctx.COLOR_BUFFER_BIT)            
    }


    /**
     * @param {number} angle
     */
    SetAngle(angle){
        this.rotation = angle
    }

    /**
     * @param {IImage} imageHandler
     * @param {number} x
     * @param {number} y
     */
    DrawImage(imageHandler, x, y){
        if(!this.ctx)
            throw "sem contexto"
        if(!this.programInfo)
            throw "sem program info"
    
        const modelViewMatrix = mat4.create()
        // cria uma matriz de translação
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            [x,y,0]
        )
        mat4.rotateZ(
            modelViewMatrix,
            modelViewMatrix,
            this.rotation
        )
        // escala pra deixar no tamanho da imagem...
        mat4.scale(
            modelViewMatrix,
            modelViewMatrix,
            [imageHandler.width,imageHandler.height,1]
        )
        // escala e posiciona o quadradinho
        this.ctx.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false, // transpose
            modelViewMatrix
        )
        // WEBGL É CHATO DEMAIS
        // cor
        this.ctx.uniform4fv(
            this.programInfo.uniformLocations.drawColor,
            this.drawColor
        )
    
        this.ctx.drawArrays(
            this.ctx.TRIANGLE_STRIP,
            0, // offset
            4  // vertexCount
        )
    }
    
    /**
     * 
     * @param {string} text 
     * @param {number} x 
     * @param {number} y 
     */
    DrawText(text,x,y){

    }

}

export {
    WGL_B2D
}