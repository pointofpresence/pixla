import TriangleDithering     from '../models/TriangleDithering';
import TriangleKuwahara      from '../models/TriangleKuwahara';
import TriangleCross         from '../models/TriangleCross';
import TriangleCrossRadial   from '../models/TriangleCrossRadial';
import TrianglePeecol        from '../models/TrianglePeecol';
import TriangleBlocks        from '../models/TriangleBlocks';
import TriangleLine          from '../models/TriangleLine';
import TriangleMeander       from '../models/TriangleMeander';
import TriangleRealCross     from '../models/TriangleRealCross';
import TriangleSkull         from '../models/TriangleSkull';
import TriangleStone         from '../models/TriangleStone';
import TriangleStoneAdvanced from '../models/TriangleStoneAdvanced';

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
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Line": function () {
        return new TriangleLine;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Meander": function () {
        return new TriangleMeander;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Real Cross": function () {
        return new TriangleRealCross;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Skull": function () {
        return new TriangleSkull;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Stone": function () {
        return new TriangleStone;
    },

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    "Stone Advanced": function () {
        return new TriangleStoneAdvanced;
    }
}