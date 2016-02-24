"use strict";

var Canvas = require("./Canvas");

require("fabric");

module.exports = {
    /**
     * @param {number} w
     * @param {number} h
     * @param {number} count
     * @returns {string|*}
     */
    generate: function (w, h, count) {
        count = count || 100;

        var el     = Canvas.createEmptyCanvas(w, h, "random-canvas"),
            canvas = new fabric.Canvas("random-canvas");

        canvas.setDimensions({width: w, height: h});

        var objects = Object.keys(this.objects);

        var rect = new fabric.Rect({
            left: 0,
            top:  0,

            fill: "rgb(" + [
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255)
            ].join(",") + ")",

            width:  w,
            height: h
        });

        canvas.add(rect);

        for (var i = 0; i <= Math.round(Math.random() * count); i++) {
            var o = objects[Math.round(Math.random() * (objects.length - 1))];
            this.objects[o](canvas, w, h);
        }

        return canvas.toDataURL();
    },

    objects: {
        /**
         * @param canvas
         * @param w
         * @param h
         */
        poly: function (canvas, w, h) {
            var points = [];

            for (var i = 0; i <= Math.round(Math.random() * 100); i++) {
                points.push({x: Math.round(Math.random() * w), y: Math.round(Math.random() * h)});
            }

            var rect = new fabric.Polygon(points, {
                fill: "rgb(" + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(",") + ")",

                left:    Math.round(Math.random() * w),
                top:     Math.round(Math.random() * h),
                angle:   Math.round(Math.random() * 360),
                opacity: Math.round(Math.random() * 100) / 100
            });

            rect.setShadow({
                color:   'rgba(0,0,0,0.3)',
                offsetX: Math.round(Math.random() * 20),
                offsetY: Math.round(Math.random() * 20)
            });

            canvas.add(rect);
        },

        /**
         * @param canvas
         * @param w
         * @param h
         */
        rect: function (canvas, w, h) {
            var rect = new fabric.Rect({
                left: Math.round(Math.random() * w),
                top:  Math.round(Math.random() * h),

                fill: "rgb(" + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(",") + ")",

                width:   Math.round(Math.random() * w),
                height:  Math.round(Math.random() * h),
                angle:   Math.round(Math.random() * 360),
                opacity: Math.round(Math.random() * 100) / 100
            });

            rect.setShadow({
                color:   'rgba(0,0,0,0.3)',
                offsetX: Math.round(Math.random() * 20),
                offsetY: Math.round(Math.random() * 20)
            });

            canvas.add(rect);
        },

        /**
         * @param canvas
         * @param w
         * @param h
         */
        ellipse: function (canvas, w, h) {
            var rect = new fabric.Ellipse({
                left: Math.round(Math.random() * w),
                top:  Math.round(Math.random() * h),

                fill: "rgb(" + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(",") + ")",

                rx:      Math.round(Math.random() * w),
                ry:      Math.round(Math.random() * h),
                opacity: Math.round(Math.random() * 100) / 100
            });

            rect.setShadow({
                color:   'rgba(0,0,0,0.3)',
                offsetX: Math.round(Math.random() * 20),
                offsetY: Math.round(Math.random() * 20)
            });

            canvas.add(rect);
        },

        /**
         * @param canvas
         * @param w
         * @param h
         */
        triangle: function (canvas, w, h) {
            var rect = new fabric.Triangle({
                left: Math.round(Math.random() * w),
                top:  Math.round(Math.random() * h),

                fill: "rgb(" + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(",") + ")",

                width:   Math.round(Math.random() * w),
                height:  Math.round(Math.random() * h),
                angle:   Math.round(Math.random() * 360),
                opacity: Math.round(Math.random() * 100) / 100
            });

            rect.setShadow({
                color:   'rgba(0,0,0,0.3)',
                offsetX: Math.round(Math.random() * 20),
                offsetY: Math.round(Math.random() * 20)
            });

            canvas.add(rect);
        },

        /**
         * @param canvas
         * @param w
         * @param h
         */
        circle: function (canvas, w, h) {
            var rect = new fabric.Circle({
                left: Math.round(Math.random() * w),
                top:  Math.round(Math.random() * h),

                fill: "rgb(" + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(",") + ")",

                radius:  Math.round(Math.random() * w / 2),
                opacity: Math.round(Math.random() * 100) / 100
            });

            rect.setShadow({
                color:   'rgba(0,0,0,0.3)',
                offsetX: Math.round(Math.random() * 20),
                offsetY: Math.round(Math.random() * 20)
            });

            canvas.add(rect);
        }
    }
};