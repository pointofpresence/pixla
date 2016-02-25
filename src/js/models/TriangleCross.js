"use strict";

var Backbone = require("backbone"),
    _        = require("lodash");

import AbstractTemplate from './AbstractTemplate';

export default class extends AbstractTemplate {
    constructor() {
        super();

        this.pattern = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
            [4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
            [4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 4, 1, 1, 2, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2],
            [4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2],
            [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2],
            [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2]
        ];

        this.TILE_WIDTH  = 16;
        this.TILE_HEIGHT = 16;
    }

    getColors(data, x, y) {
        let colors = [];

        colors[1] = this.getPixelXY(data, x + this.TILE_WIDTH / 2, y + this.TILE_HEIGHT / 4);
        colors[2] = this.getPixelXY(data, x + this.TILE_WIDTH - this.TILE_WIDTH / 4, y + this.TILE_HEIGHT / 2);
        colors[3] = this.getPixelXY(data, x + this.TILE_WIDTH / 2, y + this.TILE_HEIGHT - this.TILE_HEIGHT / 4);
        colors[4] = this.getPixelXY(data, x + this.TILE_WIDTH / 4, y + this.TILE_HEIGHT / 2);

        return colors;
    }

    doit(data, w, h) {
        this.w = w;
        this.h = h;

        let tilesW = Math.floor(this.w / this.TILE_WIDTH),
            tilesH = Math.floor(this.h / this.TILE_HEIGHT);

        let newW = tilesW * this.TILE_WIDTH,
            newH = tilesH * this.TILE_HEIGHT;

        data = this.crop(data, 0, 0, newW, newH);

        //noinspection JSUnresolvedFunction
        let out = new Uint8ClampedArray(data.length);

        let pattern = _.isFunction(this.pattern) ? this.pattern() : this.pattern,
            colors, x, y, px, py;

        for (x = 0; x < newW; x += this.TILE_WIDTH) {
            for (y = 0; y < newH; y += this.TILE_HEIGHT) {
                colors = this.getColors(data, x, y);

                for (px = 0; px < this.TILE_WIDTH; px++) {
                    for (py = 0; py < this.TILE_WIDTH; py++) {
                        if (pattern[py][px]) {
                            this.setPixelXY(
                                out,
                                x + px,
                                y + py,
                                colors[pattern[py][px]]);
                        }
                    }
                }
            }
        }

        return {
            data: out,
            w:    this.w,
            h:    this.h
        };
    }
}