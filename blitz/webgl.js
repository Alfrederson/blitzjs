import { mat4 } from "gl-matrix"

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

const _gl = {
    /** @type {WebGLRenderingContext|null} */
    ctx : null,

    /** @type {WebGLProgram|null} */
    shaderProgram : null,

    /** @type {WebGLProgramInfo|null} */
    programInfo : null,

    /** @type {WebGLBuffer|null} */
    positionBuffer : null,

    /** @type {mat4} */
    projectionMatrix : mat4.create()
}

const _state = {
    scale : [1,1],
    drawColor : [1,1,1,1]
}

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

/**
 * 
 * @param {number} width 
 * @param {number} height 
 * @param {string} elementId 
 */
function Graphics(width,height, elementId){
    /** @type {HTMLCanvasElement | null} */
    // @ts-ignore
    const element = document.getElementById(elementId);

    if(!element){
        throw "Não achei o elemento."
    }
    if(!(element instanceof HTMLCanvasElement)){
        throw "Elemento não é um canvas."
    }

    element.width=width
    element.height=height

    _gl.ctx = element.getContext("webgl");

    if(!_gl.ctx)
        throw "Não consegui pegar um contexto de renderização."
    // iniciar os shadeus lá
    _gl.shaderProgram = initShaderProgram(_gl.ctx, vsSource, fsSource)

    _gl.programInfo = {
        program : _gl.shaderProgram,
        attribLocations :{
            vertexPosition: _gl.ctx.getAttribLocation(_gl.shaderProgram,"aVertexPosition")
        },
        uniformLocations: {
            projectionMatrix: _gl.ctx.getUniformLocation(_gl.shaderProgram,"uProjectionMatrix"),
            modelViewMatrix: _gl.ctx.getUniformLocation(_gl.shaderProgram,"uModelViewMatrix"),
            drawColor : _gl.ctx.getUniformLocation(_gl.shaderProgram,"uDrawColor")
        }
    }

    _gl.positionBuffer = {
        position : initPositionBuffer(_gl.ctx)
    }

    _gl.projectionMatrix = mat4.create()
    mat4.ortho(_gl.projectionMatrix,0,width,height,0,-1,1)    

}

/**
 * Limpa a tela.
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 */
function Cls(r,g,b){
    _gl.ctx?.clearColor(r/255,g/255,b/255,1.0)
    _gl.ctx?.clear(_gl.ctx.COLOR_BUFFER_BIT)
}

/**
 * Carrega uma imagem.
 * @param {string} imageName 
 */
function LoadImage(imageName){
    return {
        width : 32,
        height : 32
    }
}

function LoadAnimImage(imageName,frameWidth, frameHeight, firstFrame,frameCount){

}

function DrawImage(imageHandler, x, y){
    if(!_gl.ctx)
        throw "sem contexto"
    if(!_gl.programInfo)
        throw "sem program info"

    const modelViewMatrix = mat4.create()
    // cria uma matriz de translação
    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [x,y,0]
    )
    // escala pra deixar no tamanho da imagem...
    mat4.scale(
        modelViewMatrix,
        modelViewMatrix,
        [imageHandler.width,imageHandler.height,1]
    )
    // escala e posiciona o quadradinho
    _gl.ctx.uniformMatrix4fv(
        _gl.programInfo.uniformLocations.modelViewMatrix,
        false, // transpose
        modelViewMatrix
    )
    // WEBGL É CHATO DEMAIS
    // cor
    _gl.ctx.uniform4fv(
        _gl.programInfo.uniformLocations.drawColor,
        _state.drawColor
    )

    _gl.ctx.drawArrays(
        _gl.ctx.TRIANGLE_STRIP,
        0, // offset
        4  // vertexCount
    )
}

function BeginDraw(){
    if(!_gl.ctx)
        throw "sem contexto"
    if(!_gl.programInfo)
        throw "sem program info"

    setPositionAttribute(
        _gl.ctx,
        _gl.positionBuffer,
        _gl.programInfo
    )

    _gl.ctx.useProgram( _gl.programInfo.program )

    // define os uniformes (globais)
    _gl.ctx.uniformMatrix4fv(
        _gl.programInfo.uniformLocations.projectionMatrix,
        false, // transpose,
        _gl.projectionMatrix
    )
}

function EndDraw(){

}

export {
    Graphics,
    LoadImage,
    LoadAnimImage,
    BeginDraw,
    EndDraw,
    DrawImage,
    Cls,
}