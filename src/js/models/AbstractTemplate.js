"use strict";

var Backbone = require("backbone"),
    _        = require("lodash"),
    Buffer   = require("../lib/Buffer");

module.exports = function () {
    //noinspection JSValidateJSDoc
    return Backbone.Model.extend({
        TILE_WIDTH:  0,
        TILE_HEIGHT: 0,

        w: 0,
        h: 0,

        pattern: [],

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} x
         * @param {number} y
         * @returns {Array}
         */
        getColors: function (data, x, y) {
            return [];
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {{data: Uint8ClampedArray, w: number, h: number}}
         */
        doit: function (data, w, h) {
            this.w = w;
            this.h = h;

            return {
                data: data,
                w:    this.w,
                h:    this.h
            };
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        crop: function (data, x, y, w, h) {
            data = Buffer.grab(data, this.w, this.h, x, y, w, h);

            this.w = w;
            this.h = h;

            return data;
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} x
         * @param {number} y
         * @returns {Array}
         */
        getPixelXY: function (data, x, y) {
            return Buffer.getPixelXY(data, x, y, this.w);
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} x
         * @param {number} y
         * @param {Array} color
         */
        setPixelXY: function (data, x, y, color) {
            Buffer.setPixelXY(data, x, y, color, this.w);
        }
    });
};