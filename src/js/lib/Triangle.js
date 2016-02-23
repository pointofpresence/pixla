"use strict";

var TriangleCross         = require("../models/TriangleCross"),
    TrianglePeecol        = require("../models/TrianglePeecol"),
    TriangleBlocks        = require("../models/TriangleBlocks"),
    TriangleCrossRadial   = require("../models/TriangleCrossRadial"),
    TriangleDithering     = require("../models/TriangleDithering"),
    TriangleKuwahara      = require("../models/TriangleKuwahara"),
    TriangleLine          = require("../models/TriangleLine"),
    TriangleMeander       = require("../models/TriangleMeander"),
    TriangleRealCross     = require("../models/TriangleRealCross"),
    TriangleSkull         = require("../models/TriangleSkull"),
    TriangleStone         = require("../models/TriangleStone"),
    TriangleStoneAdvanced = require("../models/TriangleStoneAdvanced");

module.exports = function () {
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
};