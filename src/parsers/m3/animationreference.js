/**
 * @constructor
 * @param {BinaryReader} reader
 */
function M3ParserPixelAnimationReference(reader) {
    /** @member {number} */
    this.interpolationType = reader.readUint16();
    /** @member {number} */
    this.animFlags = reader.readUint16();
    /** @member {number} */
    this.animId = reader.readUint32();
    /** @member {Uint8Array} */
    this.initValue = reader.readUint8Array(4);
    /** @member {Uint8Array} */
    this.nullValue = reader.readUint8Array(4);

    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function M3ParserUint16AnimationReference(reader) {
    /** @member {number} */
    this.interpolationType = reader.readUint16();
    /** @member {number} */
    this.animFlags = reader.readUint16();
    /** @member {number} */
    this.animId = reader.readUint32();
    /** @member {number} */
    this.initValue = reader.readUint16();
    /** @member {number} */
    this.nullValue = reader.readUint16();

    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function M3ParserUint32AnimationReference(reader) {
    /** @member {number} */
    this.interpolationType = reader.readUint16();
    /** @member {number} */
    this.animFlags = reader.readUint16();
    /** @member {number} */
    this.animId = reader.readUint32();
    /** @member {number} */
    this.initValue = reader.readUint32();
    /** @member {number} */
    this.nullValue = reader.readUint32();

    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function M3ParserFloat32AnimationReference(reader) {
    /** @member {number} */
    this.interpolationType = reader.readUint16();
    /** @member {number} */
    this.animFlags = reader.readUint16();
    /** @member {number} */
    this.animId = reader.readUint32();
    /** @member {number} */
    this.initValue = reader.readFloat32();
    /** @member {number} */
    this.nullValue = reader.readFloat32();

    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function M3ParserVector2AnimationReference(reader) {
    /** @member {number} */
    this.interpolationType = reader.readUint16();
    /** @member {number} */
    this.animFlags = reader.readUint16();
    /** @member {number} */
    this.animId = reader.readUint32();
    /** @member {Float32Array} */
    this.initValue = reader.readFloat32Array(2);
    /** @member {Float32Array} */
    this.nullValue = reader.readFloat32Array(2);

    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function M3ParserVector3AnimationReference(reader) {
    /** @member {number} */
    this.interpolationType = reader.readUint16();
    /** @member {number} */
    this.animFlags = reader.readUint16();
    /** @member {number} */
    this.animId = reader.readUint32();
    /** @member {Float32Array} */
    this.initValue = reader.readFloat32Array(3);
    /** @member {Float32Array} */
    this.nullValue = reader.readFloat32Array(3);

    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function M3ParserVector4AnimationReference(reader) {
    /** @member {number} */
    this.interpolationType = reader.readUint16();
    /** @member {number} */
    this.animFlags = reader.readUint16();
    /** @member {number} */
    this.animId = reader.readUint32();
    /** @member {Float32Array} */
    this.initValue = reader.readFloat32Array(4);
    /** @member {Float32Array} */
    this.nullValue = reader.readFloat32Array(4);

    reader.skip(4); // ?
}

export {
    M3ParserPixelAnimationReference,
    M3ParserUint16AnimationReference,
    M3ParserUint32AnimationReference,
    M3ParserFloat32AnimationReference,
    M3ParserVector2AnimationReference,
    M3ParserVector3AnimationReference,
    M3ParserVector4AnimationReference
};
