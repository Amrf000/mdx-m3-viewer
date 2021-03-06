import stringHash from '../../common/stringhash';
import ShaderUnit from './shader';
import ShaderProgram from './program';

/**
 * @constructor
 * @param {HTMLCanvasElement} canvas
 */
function WebGL(canvas) {
    let gl = canvas.getContext('webgl', { alpha: false });

    if (!gl) {
        gl = canvas.getContext('experimental-webgl', { alpha: false });
    }

    if (!gl) {
        throw new Error('WebGL: Failed to create a WebGL context!');
    }

    function extensionToCamelCase(ext) {
        let tokens = ext.split('_'),
            result = tokens[1];

        for (let i = 2, l = tokens.length; i < l; i++) {
            result += tokens[i][0].toUpperCase() + tokens[i].substr(1);
        }

        return result;
    }

    let extensions = {};
    for (let extension of gl.getSupportedExtensions()) {
        // Firefox keeps spamming errors about MOZ_ prefixed extension strings being deprecated.
        if (!extension.startsWith('MOZ_')) {
            extensions[extensionToCamelCase(extension)] = gl.getExtension(extension);
        }
    }

    if (!gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) {
        throw new Error('WebGL: No vertex shader texture support!');
    }

    if (!extensions.textureFloat) {
        throw new Error('WebGL: No floating point texture support!');
    }

    if (!extensions.instancedArrays) {
        throw new Error('WebGL: No instanced rendering support!');
    }

    if (!extensions.compressedTextureS3tc) {
        console.warn('WebGL: No compressed textures support! This might reduce performance.');
    }

    gl.extensions = extensions;

    // The only initial setup required, the rest should be handled by the handelrs
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);

    /** @member {WebGLRenderingContext} */
    this.gl = gl;
    /** @member {array} */
    this.extensions = extensions;
    /** @member {Map<number, ShaderUnit>} */
    this.shaderUnits = new Map();
    /** @member {Map<number, ShaderProgram>} */
    this.shaderPrograms = new Map();
    /** @member {?ShaderProgram} */
    this.currentShaderProgram = null;
    /** @member {string} */
    this.floatPrecision = 'precision mediump float;\n';

    // An empty 2x2 texture that is used automatically when binding an invalid texture
    let emptyTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(2, 2));

    /** @member {WebGLTexture} */
    this.emptyTexture = emptyTexture;
}

WebGL.prototype = {
    /**
     * Create a new shader unit. Uses caching.
     * 
     * @param {string} src The shader source.
     * @param {number} type The shader type.
     * @returns {ShaderUnit}
     */
    createShaderUnit(src, type) {
        let hash = stringHash(src),
            shaderUnits = this.shaderUnits;

        if (!shaderUnits.has(hash)) {
            shaderUnits.set(hash, new ShaderUnit(this.gl, src, type));
        }

        return shaderUnits.get(hash);
    },

    /**
     * Create a new shader program. Uses caching.
     * 
     * @param {string} vertexSrc The vertex shader source.
     * @param {string} fragmentSrc The fragment shader source.
     * @returns {ShaderProgram}
     */
    createShaderProgram(vertexSrc, fragmentSrc) {
        let gl = this.gl,
            vertexShader = this.createShaderUnit(vertexSrc, gl.VERTEX_SHADER),
            fragmentShader = this.createShaderUnit(this.floatPrecision + fragmentSrc, gl.FRAGMENT_SHADER),
            shaderPrograms = this.shaderPrograms;

        if (vertexShader.loaded && fragmentShader.loaded) {
            let hash = stringHash(vertexSrc + fragmentSrc);

            if (!shaderPrograms.has(hash)) {
                shaderPrograms.set(hash, new ShaderProgram(gl, vertexShader, fragmentShader));
            }

            let shaderProgram = shaderPrograms.get(hash);

            if (shaderProgram.loaded) {
                return shaderProgram;
            }
        }
    },

    enableVertexAttribs(start, end) {
        let gl = this.gl;

        for (let i = start; i < end; i++) {
            gl.enableVertexAttribArray(i);
        }
    },

    disableVertexAttribs(start, end) {
        let gl = this.gl;

        for (let i = start; i < end; i++) {
            gl.disableVertexAttribArray(i);
        }
    },

    /**
     * Use a shader program.
     * 
     * @param {ShaderProgram} shaderProgram The program.
     */
    useShaderProgram(shaderProgram) {
        let currentShaderProgram = this.currentShaderProgram;

        if (shaderProgram && shaderProgram.loaded && shaderProgram !== currentShaderProgram) {
            let oldAttribs = 0,
                newAttribs = shaderProgram.attribs.size;

            if (currentShaderProgram) {
                oldAttribs = currentShaderProgram.attribs.size;
            }

            this.gl.useProgram(shaderProgram.webglResource);

            if (newAttribs > oldAttribs) {
                this.enableVertexAttribs(oldAttribs, newAttribs);
            } else if (newAttribs < oldAttribs) {
                this.disableVertexAttribs(newAttribs, oldAttribs);
            }

            this.currentShaderProgram = shaderProgram;
        }
    },

    /**
     * Bind a texture.
     * Note that if the given texture is invalid (null or not loaded) then a 2x2 black texture will be bound instead.
     * 
     * @param {Texture} texture The texture to bind.
     * @param {number} unit The texture unit to bind to.
     */
    bindTexture(texture, unit) {
        let gl = this.gl;

        gl.activeTexture(gl.TEXTURE0 + unit);

        if (texture && texture.loaded) {
            gl.bindTexture(gl.TEXTURE_2D, texture.webglResource);
        } else {
            // Bind an empty texture in case an invalid one was given, to avoid WebGL errors.
            gl.bindTexture(gl.TEXTURE_2D, this.emptyTexture);
        }
    }
};

export default WebGL;
