/**
 * @module views/Wizard
 */
define("views/Wizard", [
    "backbone",
    "jquery",
    "underscore",
    "templates",
    "lib/Canvas",
    "lib/Processor",
    "lib/Storage",
    "lib/Random",
    "lib/Options",
    "lib/Preset",
    "sortable",
    "fabric"
], function (Backbone, $, _, templates, Canvas, Processor, Storage, Random, Options, Preset, Sortable) {
    "use strict";

    return Backbone.View.extend({
        el:        "#wizard",
        encoded:   null,
        imageName: null,
        elements:  [],
        filterId:  null,

        initialize: function () {
            // fieldsets blocker
            this.elements.preloader = this.$(".preloader");

            // download error
            this.elements.error = this.$(".error400");

            // source img
            this.elements.srcImage = this.$(".src-image");

            // filtered image
            this.elements.dstImage = this.$(".dst-image");

            // presets selectbox
            this.elements.inputPreset = this.$("#input-preset");

            // options dialog
            this.elements.optionsModal = this.$("#options-modal");

            // options form
            this.elements.optionsForm = this.$("#options-form");

            // message box (reserved)
            this.elements.messageModal = this.$("#message");

            // save button
            this.elements.save = this.$("#output-save");

            Object.keys(Preset).forEach(function (key) {
                this.elements.inputPreset.append($("<option/>", {
                    value: key,
                    text:  key
                }));
            }, this);

            var encoded = Storage.getEncoded();

            if (encoded) {
                this.encoded = encoded;
                this.elements.srcImage.attr("src", encoded);
                this.render();
            }
        },

        events: {
            // generate image button
            "click #input-random":     "onRandomButtonClick",

            // just select all when url textbox clicked
            "click #input-url":        "onUrlTextClick",

            // download button
            "click #input-url-button": "onDownloadButtonClick",

            // show options button
            "click #show-options":     "onShowOptionsButtonClick",

            // apply options button
            "click #options-apply":    "onOptionsApplyClick",

            // fileinput changed
            "change #input-file":      "onFileChange",

            // change preset
            "change #input-preset":    "onPresetChange"
        },

        /**
         * @param {Event} e
         */
        onRandomButtonClick: function (e) {
            e.preventDefault();

            var data = Random.generate(505, 505, 100);

            this.elements.srcImage.attr("src", data);
            this.encoded = data;
            Storage.setEncoded(this.encoded);

            this.render();
        },

        /**
         * @param {Event} e
         */
        onOptionsApplyClick: function (e) {
            e.preventDefault();

            var options = {};

            this.elements.optionsModal
                .find("[data-option]")
                .each(function () {
                    var $e = $(this);
                    options[$e.data("option")] = $e.val();
                });

            Storage.setFilter(options);
            this.elements.optionsModal.modal("hide");
            this.render();
        },

        /**
         * @param {Event} e
         */
        onPresetChange: function (e) {
            this.presetId = $(e.currentTarget).val();

            if (this.presetId && Preset[this.presetId]) {
                Storage.setFilter(Preset[this.presetId]);
            } else {
                Storage.unsetFilter();
            }

            this.render();
        },

        /**
         * @param {Event} e
         */
        onShowOptionsButtonClick: function (e) {
            e.preventDefault();

            var form = this.buildOptions();

            this.elements.optionsForm.html(form);

            this.sortable = Sortable.create(this.elements.optionsForm.get(0), {
                sort:      true,
                group:     "options",
                handle:    ".drag-handle",
                animation: 150
            });

            var filter = Storage.getFilter();

            if (!_.isEmpty(filter)) {
                this.sortable.sort(
                    Object.keys(filter)
                );
            }

            this.elements.optionsModal.modal();
        },

        /**
         * @description Loading from URL
         * @param {Event} e
         */
        onDownloadButtonClick: function (e) {
            e.preventDefault();

            var url = $.trim(this.$("#input-url").val());

            if (!url.length || url.length > 8190) {
                return;
            }

            this.showPreloader();

            $.getJSON("/api.php", {url: url}, (function (data) {
                if (parseInt(data.error) == 0) {
                    this.elements.srcImage.title = data.name;
                    this.elements.srcImage.attr("src", data.data);
                    this.imageName = data.name;
                    this.encoded = data.data;

                    Storage.setEncoded(this.encoded);

                    this.render();
                } else {
                    this.elements.error.show();
                }

                this.showPreloader(false);
            }).bind(this));
        },

        /**
         * @param {Event} e
         */
        onUrlTextClick: function (e) {
            $(e.currentTarget).select();
        },

        /**
         * @description Loading from disk
         * @param {Event} e
         */
        onFileChange: function (e) {
            var selectedFile = e.target.files[0];
            var reader = new FileReader();

            this.elements.srcImage.title = selectedFile.name;
            this.imageName = selectedFile.name;

            reader.onload = (function (event) {
                this.elements.srcImage.attr("src", event.target.result);
                this.encoded = event.target.result;

                this.setEncoded(this.encoded);

                this.render();
            }).bind(this);

            reader.readAsDataURL(selectedFile);
        },

        /**
         * @description Show message box
         * @param msg
         */
        message: function (msg) {
            this.elements.messageModal.find(".message-body p").text(msg);
            this.elements.messageModal.modal();
        },

        /**
         * @returns {string}
         */
        buildOptions: function () {
            var options = Options.options,
                storageData = Storage.getFilter(),
                html = "";

            _.each(options, function (o, id) {
                html += templates.options[o.type]({
                    option: o,
                    id:     id,
                    value:  storageData[id] || null
                });
            }, this);

            return html;
        },

        showPreloader: function (state) {
            state === true || typeof state === "undefined"
                ? this.elements.preloader.show()
                : this.elements.preloader.fadeOut();
        },

        render: function () {
            if (!this.encoded) {
                return;
            }

            this.showPreloader();
            this.elements.error.hide();

            var srcImage = this.elements.srcImage[0],
                cvsIn = Canvas.createEmptyCanvas(srcImage.width, srcImage.height),
                ctxIn = cvsIn.getContext("2d");

            ctxIn.drawImage(srcImage, 0, 0, cvsIn.width, cvsIn.height);

            var idtIn = ctxIn.getImageData(0, 0, cvsIn.width, cvsIn.height),

                result = Processor.doit(idtIn, cvsIn.width, cvsIn.height),

                cvsOut = Canvas.createEmptyCanvas(result.w, result.h),
                ctxOut = cvsOut.getContext("2d"),
                idtOut = ctxOut.createImageData(result.w, result.h);

            idtOut.data.set(result.data);
            ctxOut.putImageData(idtOut, 0, 0);

            this.outData = cvsOut.toDataURL("image/png");

            this.elements.dstImage.attr("src", this.outData);

            var d = new Date(),
                name = "pixla_"
                    + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
                    + "_" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds()
                    + ".png";

            this.elements.save.attr("href", this.outData);
            this.elements.save.attr("download", name);

            this.showPreloader(false);
        }
    });
});