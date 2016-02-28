export default {
    /**
     * @returns {*}
     */
    getFilter: () => {
        return localStorage["filter"] ? JSON.parse(localStorage["filter"]) : {}
    },

    /**
     * @param filter
     */
    setFilter: (filter) => {
        localStorage["filter"] = JSON.stringify(filter || {});
    },

    unsetFilter: () => delete localStorage["filter"],

    /**
     * @returns {*}
     */
    getEncoded: () => {
        return localStorage["encoded"] ? JSON.parse(localStorage["encoded"]) : null;
    },

    /**
     * @param data
     */
    setEncoded: (data) => localStorage["encoded"] = JSON.stringify(data)
};