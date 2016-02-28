"use strict";

var TriangleLine          = require("../models/TriangleLine"),
    TriangleMeander       = require("../models/TriangleMeander"),
    TriangleRealCross     = require("../models/TriangleRealCross"),
    TriangleSkull         = require("../models/TriangleSkull"),
    TriangleStone         = require("../models/TriangleStone"),
    TriangleStoneAdvanced = require("../models/TriangleStoneAdvanced");

import TriangleDithering from '../models/TriangleDithering';
import TriangleKuwahara from '../models/TriangleKuwahara';
import TriangleCross from '../models/TriangleCross';
import TriangleCrossRadial from '../models/TriangleCrossRadial';
import TrianglePeecol from '../models/TrianglePeecol';
import TriangleBlocks from '../models/TriangleBlocks';

export default {
    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Cross": function () {
        return new TriangleCross;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Cross Radial": function () {
        return new TriangleCrossRadial;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Peecol": function () {
        return new TrianglePeecol;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Blocks": function () {
        return new TriangleBlocks;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Dithering": function () {
        return new TriangleDithering;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
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
}