/**
 * @module views/Wizard
 */
define("views/Wizard", [
    "backbone",
    "jquery",
    "underscore",
    "templates",
    "lib/Canvas",
    "sortable",
    "fabric"
], function (Backbone, $, _, templates, Canvas, Sortable) {
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
            this.elements.inputRandom = this.$("#input-random");
            this.elements.optionsModal = this.$("#options-modal");
            this.elements.optionsForm = this.$("#options-form");
            this.elements.messageModal = this.$("#message");
            this.elements.filterOptionsBtn = this.$("#filter-options");
            this.elements.save = this.$("#output-save");

            this.collection.each(function (generator) {
                this.elements.inputFilter.append($("<option/>", {
                    value: generator.cid,
                    text:  generator.get("name")
                }));
            }, this);

            var selectedFilter = this.getSelectedFilter();

            if (selectedFilter) {
                this.elements.inputFilter.val(selectedFilter);
            }

            this.filterCid = this.elements.inputFilter.val();
            this.filterChanged();

            var encoded = this.getEncoded();

            if (encoded) {
                this.encoded = encoded;
                this.elements.srcImage.attr("src", encoded);
                this.render();
            }
        },

        events: {
            "click #input-random":     "onRandomClick",
            "click #input-url":        "selectAll",
            "click #input-url-button": "loadUrl",
            "click #filter-options":   "onFilterOptionsClick",
            "click #options-apply":    "onOptionsApplyClick",
            "change #input-file":      "select",
            "change #input-filter":    "onFilterChange"
        },

        /**
         * @returns {*|number}
         */
        getSelectedFilter: function () {
            return localStorage["filter"];
        },

        /**
         * @param id
         */
        setSelectedFilter: function (id) {
            localStorage["filter"] = id;
        },

        getEncoded: function () {
            return localStorage["encoded"] ? JSON.parse(localStorage["encoded"]) : null;
        },

        setEncoded: function (data) {
            localStorage["encoded"] = JSON.stringify(data);
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

        draw: {
            poly: function (canvas, w, h) {
                var points = [];

                for (var i = 0; i <= Math.round(Math.random() * 100); i++) {
                    points.push({x: Math.round(Math.random() * w), y: Math.round(Math.random() * h)});
                }

                var rect = new fabric.Polygon(points, {
                    fill: "rgb(" + [
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255)
                    ].join(",") + ")",

                    left:    Math.round(Math.random() * w),
                    top:     Math.round(Math.random() * h),
                    angle:   Math.round(Math.random() * 360),
                    opacity: Math.round(Math.random() * 100) / 100
                });

                rect.setShadow({
                    color:   'rgba(0,0,0,0.3)',
                    offsetX: Math.round(Math.random() * 20),
                    offsetY: Math.round(Math.random() * 20)
                });

                canvas.add(rect);
            },

            rect: function (canvas, w, h) {
                var rect = new fabric.Rect({
                    left: Math.round(Math.random() * w),
                    top:  Math.round(Math.random() * h),

                    fill: "rgb(" + [
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255)
                    ].join(",") + ")",

                    width:   Math.round(Math.random() * w),
                    height:  Math.round(Math.random() * h),
                    angle:   Math.round(Math.random() * 360),
                    opacity: Math.round(Math.random() * 100) / 100
                });

                rect.setShadow({
                    color:   'rgba(0,0,0,0.3)',
                    offsetX: Math.round(Math.random() * 20),
                    offsetY: Math.round(Math.random() * 20)
                });

                canvas.add(rect);
            },

            ellipse: function (canvas, w, h) {
                var rect = new fabric.Ellipse({
                    left: Math.round(Math.random() * w),
                    top:  Math.round(Math.random() * h),

                    fill: "rgb(" + [
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255)
                    ].join(",") + ")",

                    rx:      Math.round(Math.random() * w),
                    ry:      Math.round(Math.random() * h),
                    opacity: Math.round(Math.random() * 100) / 100
                });

                rect.setShadow({
                    color:   'rgba(0,0,0,0.3)',
                    offsetX: Math.round(Math.random() * 20),
                    offsetY: Math.round(Math.random() * 20)
                });

                canvas.add(rect);
            },

            triangle: function (canvas, w, h) {
                var rect = new fabric.Triangle({
                    left: Math.round(Math.random() * w),
                    top:  Math.round(Math.random() * h),

                    fill: "rgb(" + [
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255)
                    ].join(",") + ")",

                    width:   Math.round(Math.random() * w),
                    height:  Math.round(Math.random() * h),
                    angle:   Math.round(Math.random() * 360),
                    opacity: Math.round(Math.random() * 100) / 100
                });

                rect.setShadow({
                    color:   'rgba(0,0,0,0.3)',
                    offsetX: Math.round(Math.random() * 20),
                    offsetY: Math.round(Math.random() * 20)
                });

                canvas.add(rect);
            },

            circle: function (canvas, w, h) {
                var rect = new fabric.Circle({
                    left: Math.round(Math.random() * w),
                    top:  Math.round(Math.random() * h),

                    fill: "rgb(" + [
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255)
                    ].join(",") + ")",

                    radius:  Math.round(Math.random() * w / 2),
                    opacity: Math.round(Math.random() * 100) / 100
                });

                rect.setShadow({
                    color:   'rgba(0,0,0,0.3)',
                    offsetX: Math.round(Math.random() * 20),
                    offsetY: Math.round(Math.random() * 20)
                });

                canvas.add(rect);
            }
        },

        onRandomClick: function (e) {
            e.preventDefault();

            var w = 505, h = 505;

            var el = Canvas.createEmptyCanvas(w, h, "random-canvas"),
                canvas = new fabric.Canvas("random-canvas");

            canvas.setDimensions({width: w, height: h});

            var objects = Object.keys(this.draw);

            var rect = new fabric.Rect({
                left: 0,
                top:  0,

                fill: "rgb(" + [
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(",") + ")",

                width:  w,
                height: h
            });

            canvas.add(rect);

            for (var i = 0; i <= Math.round(Math.random() * 100); i++) {
                var o = objects[Math.round(Math.random() * (objects.length - 1))];
                this.draw[o](canvas, w, h);
            }

            var data = canvas.toDataURL();
            this.elements.srcImage.attr("src", data);
            this.encoded = data;
            this.setEncoded(this.encoded);

            this.render();
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
                this.setSelectedFilter(this.filterCid);

                var model = this.collection.get(this.filterCid),
                    options = model.options;

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

            this.elements.optionsForm.html(form);

            this.sortable = Sortable.create(this.elements.optionsForm.get(0), {
                sort:      true,
                group:     this.filterCid,
                handle:    ".drag-handle",
                animation: 150
            });

            if (localStorage[this.filterCid]) {
                this.sortable.sort(
                    Object.keys(JSON.parse(localStorage[this.filterCid]))
                );
            }

            this.elements.optionsModal.modal();
        },

        showPreloader: function (state) {
            state === true || typeof state === "undefined"
                ? this.elements.preloader.show()
                : this.elements.preloader.fadeOut();
        },

        /**
         * @description Loading from URL
         * @param e
         */
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

                    this.setEncoded(this.encoded);

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
        },

        /**
         * @description Loading from disk
         * @param event
         */
        select: function (event) {
            var selectedFile = event.target.files[0];
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
        }
    });
});