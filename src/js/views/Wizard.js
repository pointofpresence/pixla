/**
 * @module views/Wizard
 */
define("views/Wizard", [
    "backbone",
    "jquery",
    "underscore",
    "templates"
], function (Backbone, $, _, templates) {
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
                    id:     id
                });
            });

            return html;
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

            var srcImage = this.elements.srcImage[0];
            var cvs = document.createElement("canvas");
            cvs.width = srcImage.width;
            cvs.height = srcImage.height;
            var ctx = cvs.getContext("2d");
            ctx.drawImage(srcImage, 0, 0, cvs.width, cvs.height);
            var idt = ctx.getImageData(0, 0, cvs.width, cvs.height);
            var cid = this.elements.inputFilter.val();
            var out = this.collection.doit(cid, idt, cvs.width, cvs.height);
            idt.data.set(out);
            ctx.putImageData(idt, 0, 0);

            this.elements.dstImage.attr("src", cvs.toDataURL("image/png"));
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