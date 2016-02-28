export default {
    /**
     * @param w
     * @param h
     * @param [id]
     * @returns {HTMLElement}
     */
    createEmptyCanvas: (w, h, id) => {
        let canvas    = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;

        if (id) {
            canvas.id = id;
        }

        return canvas;
    },

    /**
     * @param image
     * @returns {HTMLElement}
     */
    convertImageToCanvas: (image) => {
        var canvas = this.createEmptyCanvas(image.width, image.height);
        canvas.getContext('2d').drawImage(image, 0, 0);

        return canvas;
    },

    /**
     * @param canvas
     * @param callback
     */
    convertCanvasToImage: (canvas, callback) => {
        let image = new Image();

        image.onload = function () {
            callback(image);
        };

        image.src = canvas.toDataURL('image/png');
    },

    /**
     * @param w
     * @param h
     * @returns {ImageData}
     */
    createEmptyBuffer: (w, h) => {
        let cvs    = document.createElement('canvas');
        cvs.width  = w;
        cvs.height = h;

        return cvs.getContext('2d').getImageData(0, 0, cvs.width, cvs.height);
    }
};