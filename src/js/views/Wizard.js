/**
 * @module views/Wizard
 */
define("views/Wizard", [
    "backbone",
    "jquery",
    "underscore",
    "templates",
    "lib/Canvas"
], function (Backbone, $, _, templates, Canvas) {
    "use strict";

    return Backbone.View.extend({
        el:        "#wizard",
        encoded:   null,
        imageName: null,
        elements:  [],
        filterCid: null,

        initialize: function () {
            this.elements.preloader = this.$(".preloader");
            this.elements.error = this.$(".error400");
            this.elements.srcImage = this.$(".src-image");
            this.elements.dstImage = this.$(".dst-image");
            this.elements.inputFilter = this.$("#input-filter");
            this.elements.optionsModal = this.$("#options-modal");
            this.elements.messageModal = this.$("#message");
            this.elements.filterOptionsBtn = this.$("#filter-options");

            this.collection.each(function (generator) {
                this.elements.inputFilter.append($("<option/>", {
                    value: generator.cid,
                    text:  generator.get("name")
                }));
            }, this);

            this.filterCid = this.elements.inputFilter.val();
            this.filterChanged();
        },

        events: {
            "click #input-url":        "selectAll",
            "click #input-url-button": "loadUrl",
            "click #filter-options":   "onFilterOptionsClick",
            "click #options-apply":    "onOptionsApplyClick",
            "change #input-file":      "select",
            "change #input-filter":    "onFilterChange"
        },

        message: function (msg) {
            this.elements.messageModal.find(".message-body p").text(msg);
            this.elements.messageModal.modal();
        },

        buildOptions: function (model) {
            var options = model.options;
            var html = "";

            _.each(options, function (o, id) {
                html += templates.options[o.type]({
                    option: o,
                    id:     id,
                    value:  localStorage[this.filterCid]
                        ? JSON.parse(localStorage[this.filterCid])[id]
                        : null
                });
            }, this);

            return html;
        },

        onOptionsApplyClick: function (e) {
            e.preventDefault();

            var options = {};

            this.elements.optionsModal
                .find("[data-option]")
                .each(function () {
                    var $e = $(this);
                    options[$e.data("option")] = $e.val();
                });

            localStorage[this.filterCid] = JSON.stringify(options);
            this.elements.optionsModal.modal("hide");

            this.render();
        },

        onFilterChange: function (e) {
            this.filterCid = $(e.currentTarget).val();
            this.filterChanged();
        },

        filterChanged: function () {
            if (this.filterCid) {
                var model = this.collection.get(this.filterCid);
                var options = model.options;

                if (!options || !Object.keys(options).length) {
                    this.elements.filterOptionsBtn.prop("disabled", true);
                } else {
                    this.elements.filterOptionsBtn.prop("disabled", false);
                }

                this.render();

            } else {
                this.elements.filterOptionsBtn.prop("disabled", true);
            }
        },

        onFilterOptionsClick: function (e) {
            e.preventDefault();

            var model = this.collection.get(this.filterCid);

            this.elements.optionsModal
                .find(".modal-title")
                .html(templates.OptionsTitle({
                    name: model.get("name")
                }));

            this.elements.optionsModal
                .find(".description")
                .text(model.get("description"));

            var form = this.buildOptions(model);

            this.elements.optionsModal
                .find(".options-form")
                .html(form);

            this.elements.optionsModal.modal();
        },

        showPreloader: function (state) {
            state === true || typeof state === "undefined"
                ? this.elements.preloader.show()
                : this.elements.preloader.fadeOut();
        },

        loadUrl: function (e) {
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

                    this.render();
                } else {
                    this.elements.error.show();
                }

                this.showPreloader(false);
            }).bind(this));
        },

        selectAll: function (e) {
            $(e.currentTarget).select();
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
                result = this.collection.doit(this.filterCid, idtIn, cvsIn.width, cvsIn.height),
                cvsOut = Canvas.createEmptyCanvas(result.w, result.h),
                ctxOut = cvsOut.getContext("2d"),
                idtOut = ctxOut.createImageData(result.w, result.h);

            idtOut.data.set(result.data);
            ctxOut.putImageData(idtOut, 0, 0);

            this.elements.dstImage.attr("src", cvsOut.toDataURL("image/png"));
            this.showPreloader(false);
        },

        select: function (event) {
            var selectedFile = event.target.files[0];
            var reader = new FileReader();

            this.elements.srcImage.title = selectedFile.name;
            this.imageName = selectedFile.name;

            reader.onload = (function (event) {
                this.elements.srcImage.attr("src", event.target.result);
                this.encoded = event.target.result;
                this.render();
            }).bind(this);

            reader.readAsDataURL(selectedFile);
        }
    });
});