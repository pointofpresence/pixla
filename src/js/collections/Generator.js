/**
 * @module collections/Generator
 */
define("collections/Generator", [
    "backbone"
], function (Backbone) {
    "use strict";

    return Backbone.Collection.extend({
        comparator: "sort",

        doit: function (cid, data, w, h) {
            return this.get({cid: cid}).doit(data, w, h);
        }
    });
});