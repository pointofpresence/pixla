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
    'Cross': () => new TriangleCross,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Cross Radial': () => new TriangleCrossRadial,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Peecol': () => new TrianglePeecol,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Blocks': () => new TriangleBlocks,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Dithering': () => new TriangleDithering,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Kuwahara': () => new TriangleKuwahara,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Line': () => new TriangleLine,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Meander': () => new TriangleMeander,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Real Cross': () => new TriangleRealCross,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Skull': () => new TriangleSkull,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Stone': () => new TriangleStone,

    /**
     * @returns {$ES6_ANONYMOUS_CLASS$}
     */
    'Stone Advanced': () => new TriangleStoneAdvanced
}