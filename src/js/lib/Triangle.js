/* global define */

define("lib/Triangle", [
    "models/TriangleCross",
    "models/TrianglePeecol",
    "models/TriangleBlocks",
    "models/TriangleCrossRadial",
    "models/TriangleDithering",
    "models/TriangleKuwahara",
    "models/TriangleLine",
    "models/TriangleMeander",
    "models/TriangleRealCross",
    "models/TriangleSkull",
    "models/TriangleStone",
    "models/TriangleStoneAdvanced"
], function (TriangleCross,
             TrianglePeecol,
             TriangleBlocks,
             TriangleCrossRadial,
             TriangleDithering,
             TriangleKuwahara,
             TriangleLine,
             TriangleMeander,
             TriangleRealCross,
             TriangleSkull,
             TriangleStone,
             TriangleStoneAdvanced) {
    "use strict";

    //noinspection JSValidateJSDoc
    return {
        /**
         * @returns {TriangleCross}
         */
        "Cross": function () {
            return new TriangleCross;
        },

        /**
         * @returns {TriangleCrossRadial}
         */
        "Cross Radial": function () {
            return new TriangleCrossRadial;
        },

        /**
         * @returns {TrianglePeecol}
         */
        "Peecol": function () {
            return new TrianglePeecol;
        },

        /**
         * @returns {TriangleBlocks}
         */
        "Blocks": function () {
            return new TriangleBlocks;
        },

        /**
         * @returns {TriangleDithering}
         */
        "Dithering": function () {
            return new TriangleDithering;
        },

        /**
         * @returns {TriangleKuwahara}
         */
        "Kuwahara": function () {
            return new TriangleKuwahara;
        },

        /**
         * @returns {TriangleLine}
         */
        "Line": function () {
            return new TriangleLine;
        },

        /**
         * @returns {TriangleMeander}
         */
        "Meander": function () {
            return new TriangleMeander;
        },

        /**
         * @returns {TriangleRealCross}
         */
        "Real Cross": function () {
            return new TriangleRealCross;
        },

        /**
         * @returns {TriangleSkull}
         */
        "Skull": function () {
            return new TriangleSkull;
        },

        /**
         * @returns {TriangleStone}
         */
        "Stone": function () {
            return new TriangleStone;
        },

        /**
         * @returns {TriangleStoneAdvanced}
         */
        "Stone Advanced": function () {
            return new TriangleStoneAdvanced;
        }
    };
});