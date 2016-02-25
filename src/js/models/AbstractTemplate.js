import Backbone from 'backbone';

let _      = require("lodash"),
    Buffer = require("../lib/Buffer");

export default class extends Backbone.Model {
    constructor() {
        super();

        this.TILE_WIDTH  = 0;
        this.TILE_HEIGHT = 0;

        this.w = 0;
        this.h = 0;

        this.pattern = [];
    }

    //noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
    /**
     * @param {Uint8ClampedArray} data
     * @param {number} x
     * @param {number} y
     * @returns {Array}
     */
    getColors(data, x, y) {
        return [];
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {{data: Uint8ClampedArray, w: number, h: number}}
     */
    doit(data, w, h) {
        this.w = w;
        this.h = h;

        return {
            data: data,
            w:    this.w,
            h:    this.h
        };
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    crop(data, x, y, w, h) {
        data = Buffer.grab(data, this.w, this.h, x, y, w, h);

        this.w = w;
        this.h = h;

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} x
     * @param {number} y
     * @returns {Array}
     */
    getPixelXY(data, x, y) {
        return Buffer.getPixelXY(data, x, y, this.w);
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} x
     * @param {number} y
     * @param {Array} color
     */
    setPixelXY(data, x, y, color) {
        Buffer.setPixelXY(data, x, y, color, this.w);
    }
}