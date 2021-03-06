import mix from '../../../common/mix';
import { uintToTag } from '../../../common/math';
import Texture from '../../texture';
import { decodeDxt1, decodeDxt3, decodeDxt5 } from './dxt';

/**
 * @see Largely based on https://github.com/toji/webctx-texture-utils/blob/master/texture-util/dds.js
 * @constructor
 * @extends Texture
 * @memberOf Dds
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function DdsTexture(env, pathSolver, handler, extension) {
    Texture.call(this, env, pathSolver, handler, extension);
}

DdsTexture.prototype = {
    initialize(src) {
        let gl = this.env.gl,
            compressedTextures = this.env.webgl.extensions.compressedTextureS3tc,
            DDS_MAGIC = 0x20534444,
            DDSD_MIPMAPCOUNT = 0x20000,
            DDPF_FOURCC = 0x4,
            FOURCC_DXT1 = 0x31545844,
            FOURCC_DXT3 = 0x33545844,
            FOURCC_DXT5 = 0x35545844,
            header = new Int32Array(src, 0, 31);

        if (header[0] !== DDS_MAGIC) {
            this.onerror('InvalidSource', 'WrongMagicNumber');
            return false;
        }

        if (!(header[20] & DDPF_FOURCC)) {
            this.onerror('UnsupportedFeature', 'FourCC');
            return false;
        }

        let fourCC = header[21],
            blockBytes,
            internalFormat;

        if (fourCC === FOURCC_DXT1) {
            blockBytes = 8;
            internalFormat = compressedTextures ? compressedTextures.COMPRESSED_RGBA_S3TC_DXT1_EXT : null;
        } else if (fourCC === FOURCC_DXT3) {
            blockBytes = 16;
            internalFormat = compressedTextures ? compressedTextures.COMPRESSED_RGBA_S3TC_DXT3_EXT : null;
        } else if (fourCC === FOURCC_DXT5) {
            blockBytes = 16;
            internalFormat = compressedTextures ? compressedTextures.COMPRESSED_RGBA_S3TC_DXT5_EXT : null;
        } else {
            this.onerror(UintToTag(fourCC))
            return false;
        }

        let mipmapCount = 1;

        if (header[2] & DDSD_MIPMAPCOUNT) {
            mipmapCount = Math.max(1, header[7]);
        }

        let width = header[4],
            height = header[3],
            dataOffset = header[1] + 4,
            dataLength,
            data;

        const id = gl.createTexture();

        this.width = width;
        this.height = height;
        this.webglResource = id;

        gl.bindTexture(gl.TEXTURE_2D, id);
        
        for (let i = 0; i < mipmapCount; i++) {
            dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes;

            // Let the GPU handle the compressed data if it supports it.
            if (internalFormat) {
                data = new Uint8Array(src, dataOffset, dataLength);

                gl.compressedTexImage2D(gl.TEXTURE_2D, i, internalFormat, width, height, 0, data);
            // Otherwise, decode the data on the client.
            } else {
                data = new Uint16Array(src, dataOffset, dataLength / 2);

                if (fourCC === FOURCC_DXT1) {
                    gl.texImage2D(gl.TEXTURE_2D, i, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_SHORT_5_6_5, decodeDxt1(data, width, height));
                } else if (fourCC === FOURCC_DXT3) {
                    gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, decodeDxt3(data, width, height));
                } else {
                    gl.texImage2D(gl.TEXTURE_2D, i, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, decodeDxt5(data, width, height));
                }
            }

            dataOffset += dataLength;
            width *= 0.5;
            height *= 0.5;
        }

        this.setParameters(gl.REPEAT, gl.REPEAT, gl.LINEAR, mipmapCount > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);

        return true;
    }
};

mix(DdsTexture.prototype, Texture.prototype);

export default DdsTexture;
