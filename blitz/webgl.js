import { mat4 } from "gl-matrix"
import { IB2D, IImage } from "./blitz"

/**
 * WebGL program with attribute and uniform locations.
 * @typedef {Object} WebGLProgramInfo
 * @property {WebGLProgram} program - The WebGL program.
 * @property {Object} attribLocations - Attribute locations.
 * @property {number} attribLocations.vertexPosition - The location of the vertex position attribute.
 * @property {number} attribLocations.textureCoord - The location of the texture position attribute.
 * @property {Object} uniformLocations - Uniform locations.
 * @property {WebGLUniformLocation | null} uniformLocations.projectionMatrix - The location of the projection matrix uniform.
 * @property {WebGLUniformLocation | null} uniformLocations.modelViewMatrix - The location of the model-view matrix uniform.
 * @property {WebGLUniformLocation | null} uniformLocations.drawColor - The location of the drawColor uniform.
 * @property {WebGLUniformLocation | null} uniformLocations.uSampler - The location of the drawColor uniform.
* 
*/



const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec2 vTextureCoord;
    void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`

// Talvez usar isso pra mudar a cor dos sprites
const fsSource = `
    varying lowp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform lowp vec4 uDrawColor;
    void main(){
        gl_FragColor = uDrawColor * texture2D(uSampler,vTextureCoord);
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
 * @param {WebGLRenderingContext} ctx 
 * @param {*} buffers 
 * @param {WebGLProgramInfo} programInfo 
 */
function setPositionAttribute(ctx, buffers, programInfo){
    ctx.bindBuffer(
        ctx.ARRAY_BUFFER,
        buffers
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
 * @param {WebGLRenderingContext} ctx 
 * @param {*} buffers 
 * @param {WebGLProgramInfo} programInfo 
 */
function setTextureCoordAttribute(ctx,buffers,programInfo){
    console.log(programInfo)
    ctx.bindBuffer( ctx.ARRAY_BUFFER,buffers )
    const uv = [
        1,1,
        0,1,
        1,0,
        0,0
    ]
    ctx.bufferData(
        ctx.ARRAY_BUFFER,
        new Float32Array(uv),
        ctx.STATIC_DRAW
    )
    ctx.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        2,
        ctx.FLOAT,
        false,
        0,
        0
    )
    ctx.enableVertexAttribArray( 
        programInfo.attribLocations.textureCoord
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

    /** @type {WebGLBuffer|null} */
    textureCoordinateBuffer = null

    /** @type {mat4} */
    projectionMatrix = mat4.create()

    scale = [1,1]
    rotation = 0
    drawColor = [1,1,1,1]

    /**
     * Carrega uma imagem.
     * @param {string} imageName 
     */
    LoadImage(imageName){
        if(!this.ctx){
            throw "Não tem contexto do webgl"
        }
        const ctx = this.ctx
        const texture = ctx.createTexture()
        // aspecto pixelado

        const result = {
            width : 32,
            height: 32,
            frameCount : 1,
            texture
        }

        const image = new Image()
        image.onload = function(){
            console.log(image.width)
            result.width = image.width
            result.height = image.height
            ctx.bindTexture(ctx.TEXTURE_2D,texture)
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST)
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST)    
            ctx.texImage2D(ctx.TEXTURE_2D,0,ctx.RGBA,ctx.RGBA,ctx.UNSIGNED_BYTE,image)
        }
        image.src = imageName

        return result
    }

    LoadAnimImage(imageName,frameWidth, frameHeight, firstFrame,frameCount){

    }
    /**
     * Inicia os gráficos.
     * @param {number} width 
     * @param {number} height 
     * @param {string} elementId é o id do elemento. função falha se não existir um canvas com esse id. 
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
        const {ctx,shaderProgram} = this

        function ul(u){ return ctx.getUniformLocation( shaderProgram, u) }
        function al(a){ return ctx.getAttribLocation( shaderProgram, a) }

        this.programInfo = {
            program : this.shaderProgram,
            attribLocations :{
                vertexPosition: al("aVertexPosition"),
                textureCoord: al("aTextureCoord")
            },
            uniformLocations: {
                projectionMatrix: ul("uProjectionMatrix"),
                modelViewMatrix: ul("uModelViewMatrix"),
                uSampler : ul("uSampler"),
                drawColor : ul("uDrawColor")
            }
        }

        this.positionBuffer = initPositionBuffer(this.ctx)
        // faz isso uma vez só....
        setPositionAttribute(
            this.ctx,
            this.positionBuffer,
            this.programInfo
        )

        this.textureCoordinateBuffer = this.ctx.createBuffer()
        setTextureCoordAttribute(
            this.ctx,
            this.textureCoordinateBuffer,
            this.programInfo
        )

        this.projectionMatrix = mat4.create()
        mat4.ortho(this.projectionMatrix,0,width,height,0,-1,1)    


        this.ctx.useProgram( this.programInfo.program )
        
        // usa aquela matriz de projeção ortogonal uma vez só
        this.ctx.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false, // transpose,
            this.projectionMatrix
        )

        // alpha blend

        ctx.enable(ctx.BLEND);
        ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);

        // ajusta o tamanho do canvas pra ficar  bunitim
        window.addEventListener("resize", ()=>{
            letterBox()
            this.ctx?.viewport(0,0, this.ctx.canvas.width, this.ctx.canvas.height)
        })
    }
    /**
     * Limpa a tela com a cor especificada.
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     */
    Cls(r,g,b){
        this.ctx?.clearColor(r/255,g/255,b/255,1.0)
        this.ctx?.clear(this.ctx.COLOR_BUFFER_BIT)            
    }

    /**
     * Define o ângulo com o qual as próximas operações de desenho serão chamadas.
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
        let {ctx, programInfo} = this

        if(!ctx)
            throw "sem contexto"
        if(!programInfo)
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

        ctx.bindTexture(ctx.TEXTURE_2D,imageHandler.texture)

        // escala e posiciona o quadradinho
        ctx.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false, // transpose
            modelViewMatrix
        )
        // WEBGL É CHATO DEMAIS
        // cor
        ctx.uniform4fv(
            programInfo.uniformLocations.drawColor,
            this.drawColor
        )

        ctx.uniform1i(programInfo.uniformLocations.uSampler,0)
    
        ctx.drawArrays(
            ctx.TRIANGLE_STRIP,
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