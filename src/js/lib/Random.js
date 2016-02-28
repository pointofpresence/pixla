import Canvas from './Canvas';
import 'fabric';

export default {
    /**
     * @param {number} w
     * @param {number} h
     * @param {number} count
     * @returns {string|*}
     */
    generate: function (w, h, count) {
        count      = count || 100;

        Canvas.createEmptyCanvas(w, h, 'random-canvas');
        let canvas = new fabric.Canvas('random-canvas');

        canvas.setDimensions({width: w, height: h});

        let objects = Object.keys(this.objects);

        let rect = new fabric.Rect({
            left: 0,
            top:  0,

            fill: 'rgb(' + [
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255)
            ].join(',') + ')',

            width:  w,
            height: h
        });

        canvas.add(rect);

        for (let i = 0; i <= Math.round(Math.random() * count); i++) {
            let o = objects[Math.round(Math.random() * (objects.length - 1))];
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
        poly: (canvas, w, h) => {
            let points = [];

            for (let i = 0; i <= Math.round(Math.random() * 100); i++) {
                points.push({x: Math.round(Math.random() * w), y: Math.round(Math.random() * h)});
            }

            let rect = new fabric.Polygon(points, {
                fill: 'rgb(' + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(',') + ')',

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
        rect: (canvas, w, h) => {
            let rect = new fabric.Rect({
                left: Math.round(Math.random() * w),
                top:  Math.round(Math.random() * h),

                fill: 'rgb(' + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(',') + ')',

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
        ellipse: (canvas, w, h) => {
            let rect = new fabric.Ellipse({
                left: Math.round(Math.random() * w),
                top:  Math.round(Math.random() * h),

                fill: 'rgb(' + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(',') + ')',

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
        triangle: (canvas, w, h) => {
            let rect = new fabric.Triangle({
                left: Math.round(Math.random() * w),
                top:  Math.round(Math.random() * h),

                fill: 'rgb(' + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(',') + ')',

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
        circle: (canvas, w, h) => {
            let rect = new fabric.Circle({
                left: Math.round(Math.random() * w),
                top:  Math.round(Math.random() * h),

                fill: 'rgb(' + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(',') + ')',

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
}