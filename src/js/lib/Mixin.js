import _ from 'lodash';

export default
{
    /**
     * @param str
     * @returns {*}
     */
    capitalize: function (str) {
        if (str.length) {
            str = str.charAt(0).toUpperCase() + str.slice(1);
        }

        return str;
    },

    /**
     * @returns {*}
     */
    format: function () {
        console.warn('Mixin.format is deprecated. Use ES6 strings instead.')

        var s = arguments[0];

        for (var i = 1; i < arguments.length; i++) {
            var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            s         = s.replace(regEx, arguments[i]);
        }

        return s;
    },

    /**
     * @param data
     * @returns {*}
     */
    deepClone: function (data) {
        return this.map(data, this.clone);
    }
};