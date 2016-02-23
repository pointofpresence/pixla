"use strict";

module.exports = {
    /**
     * @returns {*}
     */
    getFilter: function () {
        return localStorage["filter"] ? JSON.parse(localStorage["filter"]) : {};
    },

    /**
     * @param filter
     */
    setFilter: function (filter) {
        localStorage["filter"] = JSON.stringify(filter || {});
    },

    unsetFilter: function () {
        delete localStorage["filter"];
    },

    /**
     * @returns {*}
     */
    getEncoded: function () {
        return localStorage["encoded"] ? JSON.parse(localStorage["encoded"]) : null;
    },

    /**
     * @param data
     */
    setEncoded: function (data) {
        localStorage["encoded"] = JSON.stringify(data);
    }
};