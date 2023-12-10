import { mat4 } from "gl-matrix"
import { IImage } from "../blitz"

/** @interface */
class IWGLImage extends IImage {
    /** @type {WebGLTexture} */
    texture
    /** @type {number[][]} */
    uvs
}

/** @type{ Map<string,IWGLImage> } */
const _imageMap = new Map()

/**
 * @param {WebGLRenderingContext} ctx
 * @param {string} imageName
 * @param {number} frameWidth
 * @param {number} frameHeight
 * @returns {Promise<IWGLImage>|IWGLImage}
 */

function loadImage(ctx, imageName, frameWidth, frameHeight){
    let img = _imageMap.get(imageName)
    if (img) return img;

    return new Promise( (resolve,reject)=>{
        const texture = ctx.createTexture()
        if(!texture){
            reject("não consegui criar uma textura")
            return
        }        

        const result = {
            width : 32,
            height: 32,
            frameWidth,
            frameHeight,
            frameCount : 1,
            texture,
            uvs : []
        }

        const image = new Image()

        image.onload = function(){
            console.log("carreguei "+imageName)
            result.width = image.width
            result.height = image.height

            if(frameWidth !== 0 && frameHeight !== 0){
                result.frameCount = (result.width / frameWidth)|0 * (result.height / frameHeight)|0 
                for(let i = 0; i < result.frameCount;i++){
                    let pos = i / result.frameCount

                    let u0 = pos
                    let v0 = 0
                    let u1 = pos + (1/result.frameCount) 
                    let v1 = 1
                    
                    // @ts-expect-error
                    result.uvs.push([u0,v0,u1,v1])
                }
            }else{
                result.frameWidth = image.width
                result.frameHeight = image.height
            }

            ctx.bindTexture(ctx.TEXTURE_2D,texture)
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST)
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST)    
            ctx.texImage2D(ctx.TEXTURE_2D,0,ctx.RGBA,ctx.RGBA,ctx.UNSIGNED_BYTE,image)

            _imageMap.set(imageName, result)

            resolve(result)
        }
        image.onerror = function(){
            reject("não consegui carregar " + imageName)
        }
        image.src = imageName
    })
}


let oldImage
let oldTextCoord
/**
 * 
 * @param {WebGLRenderingContext} ctx 
 * @param {IWGLImage} imageHandler 
 * @param {*} programInfo 
 * @param {number[]} color 
 * @param {number} rotation
 * @param {number} x 
 * @param {number} y 
 * @param {number} scaleX 
 * @param {number} scaleY
 */
function drawImage(ctx,imageHandler,programInfo, color, rotation, x, y, scaleX, scaleY){
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
        rotation,
    )
    // escala pra deixar no tamanho da imagem...
    mat4.scale(
        modelViewMatrix,
        modelViewMatrix,
        [imageHandler.frameWidth * scaleX,imageHandler.frameHeight * scaleY,1]
    )

    if(oldImage !== imageHandler.texture){
        ctx.bindTexture(ctx.TEXTURE_2D,imageHandler.texture)
        oldImage = imageHandler.texture
    }

    // escala e posiciona o quadradinho
    ctx.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false, // transpose
        modelViewMatrix
    )

    // cor
    ctx.uniform4fv(
        programInfo.uniformLocations.drawColor,
        color
    )

    ctx.uniform1i(programInfo.uniformLocations.uSampler,0)

    ctx.drawArrays(
        ctx.TRIANGLE_STRIP,
        0, // offset
        4  // vertexCount
    )
}


export {
    loadImage,
    drawImage,

    IWGLImage
}