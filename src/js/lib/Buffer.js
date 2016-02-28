import Canvas from '../lib/Canvas';

export default class Buffer {
    static get COLORS() {
        return {
            BLACK: [0, 0, 0, 255],
            WHITE: [255, 255, 255, 255]
        }
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} srcW
     * @param {number} srcH
     * @param {number} dstX
     * @param {number} dstY
     * @param {number} dstW
     * @param {number} dstH
     * @returns {Uint8ClampedArray}
     */
    static grab(data, srcW, srcH, dstX, dstY, dstW, dstH) {
        let tempCvs   = Canvas.createEmptyCanvas(srcW, srcH),
            tempCtx   = tempCvs.getContext('2d'),
            tempIData = tempCtx.createImageData(srcW, srcH);

        tempIData.data.set(data);
        tempCtx.putImageData(tempIData, 0, 0);

        //noinspection JSValidateTypes
        return tempCtx.getImageData(
            Math.floor(dstX),
            Math.floor(dstY),
            Math.floor(dstW),
            Math.floor(dstH)
        ).data;
    }

    /**
     * @param srcData
     * @param srcW
     * @param srcH
     * @param destData
     * @param destX
     * @param destY
     * @param destW
     * @param destH
     * @returns {CanvasPixelArray}
     */
    static draw(srcData, srcW, srcH, destData, destX, destY, destW, destH) {
        let tempCvs       = Canvas.createEmptyCanvas(destW, destH),
            tempCtx       = tempCvs.getContext('2d'),
            tempSrcIData  = tempCtx.createImageData(srcW, srcH),
            tempDestIData = tempCtx.createImageData(destW, destH);

        tempDestIData.data.set(destData);
        tempCtx.putImageData(tempDestIData, 0, 0);

        tempSrcIData.data.set(srcData);
        tempCtx.putImageData(tempSrcIData, destX, destY);

        return tempCtx.getImageData(0, 0, destW, destH).data;
    }

    /**
     * @param data
     * @param index
     * @returns {*[]}
     */
    static getPixel(data, index) {
        let i = index * 4;

        return [
            data[i],
            data[i + 1],
            data[i + 2],
            data[i + 3]
        ];
    }

    /**
     * @param data
     * @param x
     * @param y
     * @param w
     * @returns {*}
     */
    static getPixelXY(data, x, y, w) {
        return Buffer.getPixel(data, Math.floor(y * w + x));
    }

    /**
     * @param data
     * @param index
     * @param color
     */
    static setPixel(data, index, color) {
        let i = index * 4;



        data[i]     = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = color[3];

        //console.log(color)
        //console.log([data[i], data[i + 1], data[i + 2], data[i + 3]])
        //debugger
    }

    /**
     * @param data
     * @param x
     * @param y
     * @param color
     * @param w
     */
    static setPixelXY(data, x, y, color, w) {
        if (x >= w) {
            return;
        }

        Buffer.setPixel(data, y * w + x, color);
    }

    /**
     * @param color1
     * @param color2
     * @param percent
     * @returns {*[]}
     */
    static mixColors(color1, color2, percent) {
        let n = percent || 0.5;

        let R = Math.round((color2[0] - color1[0]) * n) + color1[0],
            G = Math.round((color2[1] - color1[1]) * n) + color1[1],
            B = Math.round((color2[2] - color1[2]) * n) + color1[2],
            A = Math.round((color2[3] - color1[3]) * n) + color1[3];

        return [
            R, G, B, A
        ];
    }

    /**
     * @param data
     * @param x
     * @param y
     * @param blendColor
     * @param w
     */
    static setMixPixel(data, x, y, blendColor, w) {
        let oc = Buffer.getPixelXY(data, x, y, w),
            n  = blendColor[3] / 255.0,
            n2 = 1.0 - n;

        Buffer.setPixelXY(data, x, y, [
            Math.floor(oc[0] * n2 + blendColor[0] * n),
            Math.floor(oc[1] * n2 + blendColor[1] * n),
            Math.floor(oc[2] * n2 + blendColor[2] * n),
            oc[3]
        ], w);
    }

    /**
     *
     * @param data Uint8ClampedArray
     * @param x int
     * @param y int
     * @param percent float -1 to 1
     * @param blendColor RGBA array
     * @returns {string}
     * @param w
     */
    static setShadeBlendPixel(data, x, y, percent, blendColor, w) {
        let oc = Buffer.getPixelXY(data, x, y, w),
            n  = percent < 0 ? percent * -1 : percent;

        blendColor = blendColor
            ? blendColor
            : (percent < 0 ? [0, 0, 0, oc[3]] : [255, 255, 255, oc[3]]);

        let R = Math.round((blendColor[0] - oc[0]) * n) + oc[0],
            G = Math.round((blendColor[1] - oc[1]) * n) + oc[1],
            B = Math.round((blendColor[2] - oc[2]) * n) + oc[2],
            A = Math.round((blendColor[3] - oc[3]) * n) + oc[3];

        Buffer.setPixelXY(data, x, y, [
                R, G, B, A
            ], w
        );
    }

    /**
     * @param {number} c
     * @returns {string}
     */
    static componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    /**
     * @param {Array} color
     * @returns {string}
     */
    static rgbaToHex(color) {
        return Buffer.componentToHex(color[0])
            + Buffer.componentToHex(color[1])
            + Buffer.componentToHex(color[2])
            + Buffer.componentToHex(color[3]);
    }

    /**
     * @param h
     * @param s
     * @param v
     * @returns {*[]}
     */
    static hsvToRgb(h, s, v) {
        let r, g, b,
            i = Math.floor(h * 6),
            f = h * 6 - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
            default:
                break;
        }

        return [r * 255, g * 255, b * 255];
    }

    /**
     *
     * @param r
     * @param g
     * @param b
     * @returns {*[]}
     */
    static rgbToHsv(r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;

        let max = Math.max(r, g, b),
            min = Math.min(r, g, b);

        let h, s,
            v = max,
            d = max - min;

        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
                default:
                    break;
            }

            h /= 6;
        }

        return [h, s, v];
    }
}