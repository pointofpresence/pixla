/**
 * @module views/Wizard
 */
define("views/Wizard", [
    "backbone",
    "templates",
    "jquery"
], function (Backbone, templates, $) {
    "use strict";

    return Backbone.View.extend({
        el:                  "#wizard",
        encoded:             null,
        imageName:           null,
        elements:            [],
        generatorCollection: null,

        initialize: function () {
            this.elements.inputProcess = this.$(".input-process");
            this.elements.preloader = this.$(".preloader");
            this.elements.error = this.$(".error400");
            this.elements.srcImage = this.$(".src-image");
            this.elements.dstImage = this.$(".dst-image");
            this.elements.inputFilter = $("#input-filter");

            this.collection.each(function (generator) {
                this.elements.inputFilter.append($("<option/>", {
                    value: generator.cid,
                    text:  generator.get("name")
                }));
            }, this);
        },

        events: {
            "click .input-process":    "render",
            "change #input-file":      "select",
            "click #input-url":        "selectAll",
            "click #input-url-button": "loadUrl"
        },

        loadUrl: function (e) {
            var url = $.trim($("#input-url").val());

            if (!url.length) return;
            if (url.length > 8190) return;

            this.elements.preloader.show();

            var that = this;

            $.getJSON("/api.php", {url: url}, function (data) {
                if (parseInt(data.error) == 0) {
                    that.elements.srcImage.title = data.name;
                    that.elements.srcImage.attr("src", data.data);
                    that.imageName = data.name;
                    that.encoded = data.data;

                    that.render();
                } else {
                    that.elements.error.show();
                }

                that.elements.preloader.fadeOut("slow");
            })
        },

        selectAll: function (e) {
            $(e.currentTarget).select()
        },

        render: function () {
            if (!this.encoded) return;
            this.elements.error.hide();

            var srcImage = this.elements.srcImage[0];
            var cvs = document.createElement('canvas');
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
        },

        select: function (event) {
            var selectedFile = event.target.files[0];
            var reader = new FileReader();

            this.elements.srcImage.title = selectedFile.name;
            this.imageName = selectedFile.name;

            var that = this;

            reader.onload = function (event) {
                that.elements.srcImage.attr("src", event.target.result);
                that.encoded = event.target.result;
                that.render();
            };

            reader.readAsDataURL(selectedFile);
        }
    });
});