/**
 * Copyright (c) 2015 pointofpresence
 * ReSampled.Pixla (pixla) - Online image filter
 * @version v0.0.7
 * @build Sun, 21 Jun 2015 12:52:00 GMT
 * @link https://github.com/pointofpresence/pixla
 * @license MIT
 */
define("lib/Fileinput",["jquery"],function($){"use strict";var b=function(d,e){this.options=e,this.$elementFilestyle=[],this.$element=$(d)};b.prototype={clear:function(){this.$element.val(""),this.$elementFilestyle.find(":text").val(""),this.$elementFilestyle.find(".badge").remove()},destroy:function(){this.$element.removeAttr("style").removeData("filestyle").val(""),this.$elementFilestyle.remove()},disabled:function(d){if(d===!0)this.options.disabled||(this.$element.attr("disabled","true"),this.$elementFilestyle.find("label").attr("disabled","true"),this.options.disabled=!0);else{if(d!==!1)return this.options.disabled;this.options.disabled&&(this.$element.removeAttr("disabled"),this.$elementFilestyle.find("label").removeAttr("disabled"),this.options.disabled=!1)}},buttonBefore:function(d){if(d===!0)this.options.buttonBefore||(this.options.buttonBefore=!0,this.options.input&&(this.$elementFilestyle.remove(),this.constructor(),this.pushNameFiles()));else{if(d!==!1)return this.options.buttonBefore;this.options.buttonBefore&&(this.options.buttonBefore=!1,this.options.input&&(this.$elementFilestyle.remove(),this.constructor(),this.pushNameFiles()))}},icon:function(d){if(d===!0)this.options.icon||(this.options.icon=!0,this.$elementFilestyle.find("label").prepend(this.htmlIcon()));else{if(d!==!1)return this.options.icon;this.options.icon&&(this.options.icon=!1,this.$elementFilestyle.find(".glyphicon").remove())}},input:function(e){if(e===!0)this.options.input||(this.options.input=!0,this.options.buttonBefore?this.$elementFilestyle.append(this.htmlInput()):this.$elementFilestyle.prepend(this.htmlInput()),this.$elementFilestyle.find(".badge").remove(),this.pushNameFiles(),this.$elementFilestyle.find(".group-span-filestyle").addClass("input-group-btn"));else{if(e!==!1)return this.options.input;if(this.options.input){this.options.input=!1,this.$elementFilestyle.find(":text").remove();var d=this.pushNameFiles();d.length>0&&this.options.badge&&this.$elementFilestyle.find("label").append(' <span class="badge">'+d.length+"</span>"),this.$elementFilestyle.find(".group-span-filestyle").removeClass("input-group-btn")}}},size:function(d){if(void 0===d)return this.options.size;var f=this.$elementFilestyle.find("label"),e=this.$elementFilestyle.find("input");f.removeClass("btn-lg btn-sm"),e.removeClass("input-lg input-sm"),"nr"!=d&&(f.addClass("btn-"+d),e.addClass("input-"+d))},buttonText:function(d){return void 0===d?this.options.buttonText:(this.options.buttonText=d,void this.$elementFilestyle.find("label span").html(this.options.buttonText))},buttonName:function(d){return void 0===d?this.options.buttonName:(this.options.buttonName=d,void this.$elementFilestyle.find("label").attr({"class":"btn "+this.options.buttonName}))},iconName:function(d){return void 0===d?this.options.iconName:void this.$elementFilestyle.find(".glyphicon").attr({"class":".glyphicon "+this.options.iconName})},htmlIcon:function(){return this.options.icon?'<span class="glyphicon '+this.options.iconName+'"></span> ':""},htmlInput:function(){return this.options.input?'<input type="text" class="form-control '+("nr"==this.options.size?"":"input-"+this.options.size)+'" disabled> ':""},pushNameFiles:function(){var d="",f=[];void 0===this.$element[0].files?f[0]={name:this.$element[0]&&this.$element[0].value}:f=this.$element[0].files;for(var e=0;e<f.length;e++)d+=f[e].name.split("\\").pop()+", ";return this.$elementFilestyle.find(":text").val(""!==d?d.replace(/\, $/g,""):""),f},constructor:function(){var h=this,f="",g=h.$element.attr("id"),i="";""!==g&&g||(g="filestyle-"+$(".bootstrap-filestyle").length,h.$element.attr({id:g})),i='<span class="group-span-filestyle '+(h.options.input?"input-group-btn":"")+'"><label for="'+g+'" class="btn '+h.options.buttonName+" "+("nr"==h.options.size?"":"btn-"+h.options.size)+'" '+(h.options.disabled?'disabled="true"':"")+">"+h.htmlIcon()+h.options.buttonText+"</label></span>",f=h.options.buttonBefore?i+h.htmlInput():h.htmlInput()+i,h.$elementFilestyle=$('<div class="bootstrap-filestyle input-group">'+f+"</div>"),h.$elementFilestyle.find(".group-span-filestyle").attr("tabindex","0").keypress(function(j){return 13===j.keyCode||32===j.charCode?(h.$elementFilestyle.find("label").click(),!1):void 0}),h.$element.css({position:"absolute",clip:"rect(0px 0px 0px 0px)"}).attr("tabindex","-1").after(h.$elementFilestyle),h.options.disabled&&h.$element.attr("disabled","true"),h.$element.change(function(){var j=h.pushNameFiles();0==h.options.input&&h.options.badge?0==h.$elementFilestyle.find(".badge").length?h.$elementFilestyle.find("label").append(' <span class="badge">'+j.length+"</span>"):0==j.length?h.$elementFilestyle.find(".badge").remove():h.$elementFilestyle.find(".badge").html(j.length):h.$elementFilestyle.find(".badge").remove()}),window.navigator.userAgent.search(/firefox/i)>-1&&h.$elementFilestyle.find("label").click(function(){return h.$element.click(),!1})}};var a=$.fn.filestyle;$.fn.filestyle=function(e,d){var f="",g=this.each(function(){if("file"===$(this).attr("type")){var j=$(this),h=j.data("filestyle"),i=$.extend({},$.fn.filestyle.defaults,e,"object"==typeof e&&e);h||(j.data("filestyle",h=new b(this,i)),h.constructor()),"string"==typeof e&&(f=h[e](d))}});return"undefined"!=typeof f?f:g},$.fn.filestyle.defaults={buttonText:"Choose file",iconName:"glyphicon-folder-open",buttonName:"btn-default",size:"nr",input:!0,badge:!0,icon:!0,buttonBefore:!1,disabled:!1},$.fn.filestyle.noConflict=function(){return $.fn.filestyle=a,this},$(function(){$(".filestyle").each(function(){var e=$(this),d={input:"false"!==e.attr("data-input"),icon:"false"!==e.attr("data-icon"),buttonBefore:"true"===e.attr("data-buttonBefore"),disabled:"true"===e.attr("data-disabled"),size:e.attr("data-size"),buttonText:e.attr("data-buttonText"),buttonName:e.attr("data-buttonName"),iconName:e.attr("data-iconName"),badge:"false"!==e.attr("data-badge")};e.filestyle(d)})})}),define("models/TriangleAbstract",["backbone"],function(Backbone){"use strict";return Backbone.Model.extend({defaults:{name:"Abstract Generator",description:"Abstract Model for Generators"},options:{},w:0,h:0,setPixel:function(data,index,color){var i=4*index;data[i]=color[0],data[i+1]=color[1],data[i+2]=color[2],data[i+3]=color[3]},getPixel:function(data,index){var i=4*index;return[data[i],data[i+1],data[i+2],data[i+3]]},getPixelXY:function(data,x,y){return this.getPixel(data,y*this.w+x)},setPixelXY:function(data,x,y,color){return this.setPixel(data,y*this.w+x,color)},componentToHex:function(c){var hex=c.toString(16);return 1==hex.length?"0"+hex:hex},rgbaToHex:function(color){return this.componentToHex(color[0])+this.componentToHex(color[1])+this.componentToHex(color[2])+this.componentToHex(color[3])},setShadeBlendPixel:function(data,x,y,percent,blendColor){var oc=this.getPixelXY(data,x,y),n=0>percent?-1*percent:percent;blendColor=blendColor?blendColor:0>percent?[0,0,0,oc[3]]:[255,255,255,oc[3]];var R=Math.round((blendColor[0]-oc[0])*n)+oc[0],G=Math.round((blendColor[1]-oc[1])*n)+oc[1],B=Math.round((blendColor[2]-oc[2])*n)+oc[2],A=Math.round((blendColor[3]-oc[3])*n)+oc[3];this.setPixelXY(data,x,y,[R,G,B,A])},setMixPixel:function(data,x,y,blendColor){var oc=this.getPixelXY(data,x,y),n=blendColor[3]/255,n2=1-n;this.setPixelXY(data,x,y,[parseInt(oc[0]*n2+blendColor[0]*n),parseInt(oc[1]*n2+blendColor[1]*n),parseInt(oc[2]*n2+blendColor[2]*n),oc[3]])}})}),define("models/TriangleCross",["backbone","underscore","models/TriangleAbstract"],function(Backbone,_,TriangleAbstractModel){"use strict";return TriangleAbstractModel.extend({defaults:_.extend({},TriangleAbstractModel.prototype.defaults,{name:"Triangle Cross",description:"Triangle Cross Filter"}),options:_.extend({},TriangleAbstractModel.prototype.options,{}),TILE_WIDTH:16,TILE_HEIGHT:16,doit:function(data,w,h){this.w=w,this.h=h;for(var out=new Uint8ClampedArray(data.data),tiles_w=parseInt(this.w/this.TILE_WIDTH),tiles_h=parseInt(this.h/this.TILE_HEIGHT),new_w=tiles_w*this.TILE_WIDTH,new_h=tiles_h*this.TILE_HEIGHT,pattern=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],[4,4,1,1,1,1,1,1,1,1,1,1,1,1,2,2],[4,4,4,1,1,1,1,1,1,1,1,1,1,2,2,2],[4,4,4,4,1,1,1,1,1,1,1,1,2,2,2,2],[4,4,4,4,4,1,1,1,1,1,1,2,2,2,2,2],[4,4,4,4,4,4,1,1,1,1,2,2,2,2,2,2],[4,4,4,4,4,4,4,1,1,2,2,2,2,2,2,2],[4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],[4,4,4,4,4,4,4,3,3,2,2,2,2,2,2,2],[4,4,4,4,4,4,3,3,3,3,2,2,2,2,2,2],[4,4,4,4,4,3,3,3,3,3,3,2,2,2,2,2],[4,4,4,4,3,3,3,3,3,3,3,3,2,2,2,2],[4,4,4,3,3,3,3,3,3,3,3,3,3,2,2,2],[4,4,3,3,3,3,3,3,3,3,3,3,3,3,2,2],[4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2]],x=0;new_w+1>x;x+=this.TILE_WIDTH)for(var y=0;new_h+1>y;y+=this.TILE_HEIGHT){var colors=[];colors[1]=this.getPixelXY(data.data,x+this.TILE_WIDTH/2,y+this.TILE_HEIGHT/4),colors[2]=this.getPixelXY(data.data,x+this.TILE_WIDTH-this.TILE_WIDTH/4,y+this.TILE_HEIGHT/2),colors[3]=this.getPixelXY(data.data,x+this.TILE_WIDTH/2,y+this.TILE_HEIGHT-this.TILE_HEIGHT/4),colors[4]=this.getPixelXY(data.data,x+this.TILE_WIDTH/4,y+this.TILE_HEIGHT/2);for(var px=0;px<this.TILE_WIDTH;px++)for(var py=0;py<this.TILE_WIDTH;py++)pattern[py][px]&&this.setPixelXY(out,x+px,y+py,colors[pattern[py][px]])}return out}})}),define("models/TriangleCube",["backbone","underscore","models/TriangleAbstract"],function(Backbone,_,TriangleAbstractModel){"use strict";return TriangleAbstractModel.extend({defaults:_.extend({},TriangleAbstractModel.prototype.defaults,{name:"Triangle Cube",description:"Triangle Cube Filter"}),options:_.extend({},TriangleAbstractModel.prototype.options,{}),TILE_WIDTH:21,TILE_HEIGHT:21,doit:function(data,w,h){this.w=w,this.h=h;for(var out=new Uint8ClampedArray(data.data),pattern=[[0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5],[4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,5],[4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,5,5,5,5,5],[4,4,4,4,4,4,4,4,3,3,3,3,3,3,5,5,5,5,5,5,5],[4,4,4,4,4,4,4,4,4,4,3,3,5,5,5,5,5,5,5,5,5],[4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5],[4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5],[4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5],[4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5],[4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5],[0,0,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,0],[0,0,0,0,4,4,4,4,4,4,4,5,5,5,5,5,5,5,0,0,0],[0,0,0,0,0,0,4,4,4,4,4,5,5,5,5,5,0,0,0,0,0],[0,0,0,0,0,0,0,0,4,4,4,5,5,5,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,4,5,0,0,0,0,0,0,0,0,0]],border=[[0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0],[0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],[0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],[0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0]],hot=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0],[0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0],[0,0,0,0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,0],[0,0,0,0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],spark=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],top=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,6,6,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,6,6,6,6,6,6,0,0,0,0,0,0,0],[0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0],[0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0],[0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0],[0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0],[0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0],[0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0],[0,0,0,0,0,0,0,0,6,6,6,6,6,6,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],shadow=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],step=0,border_c=[0,0,0,196],hot_c=[255,255,255,128],top_c=[255,255,255,128],shadow_c=[0,0,0,128],spark_c=[255,255,255,255],y=-this.TILE_HEIGHT;y<this.h;y+=this.TILE_HEIGHT-6){for(var x=-this.TILE_WIDTH;x<this.w;x+=this.TILE_WIDTH-1){var colors=[];colors[1]=border_c,colors[2]=hot_c;var x3=parseInt(x+this.TILE_WIDTH/2);x3=x3>this.w?this.w:x3,x3=0>x3?0:x3,colors[3]=this.getPixelXY(data.data,x3,y+3);var x4=x+5;x4=x4>this.w?this.w:x4,x4=0>x4?0:x4;var y4=y+11;y4=y4>this.h?this.h:y4,colors[4]=this.getPixelXY(data.data,x4,y4);var x5=x+14;x5=x5>this.w?this.w:x5,x5=0>x5?0:x5;var y5=y+11;y5=y5>this.h?this.h:y5,colors[5]=this.getPixelXY(data.data,x5,y5),colors[6]=top_c,colors[7]=shadow_c,colors[8]=spark_c;var offsetX=0;1==step&&(offsetX=10);for(var px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(var py=0;py<this.TILE_HEIGHT;py++)pattern[py][px]&&this.setPixelXY(out,x+px+offsetX,y+py,colors[pattern[py][px]]);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)hot[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,hot_c);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)top[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,top_c);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)shadow[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,shadow_c);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)spark[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,spark_c);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)border[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,border_c)}step=1==step?0:1}return out}})}),define("models/TriangleCubeSimple",["backbone","underscore","models/TriangleAbstract"],function(Backbone,_,TriangleAbstractModel){"use strict";return TriangleAbstractModel.extend({defaults:_.extend({},TriangleAbstractModel.prototype.defaults,{name:"Triangle Cube Simple",description:"Triangle Cube Simple Filter"}),options:_.extend({},TriangleAbstractModel.prototype.options,{}),TILE_WIDTH:21,TILE_HEIGHT:21,doit:function(data,w,h){this.w=w,this.h=h;for(var out=new Uint8ClampedArray(data.data),pattern=[[0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],[0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0],[0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0]],border=[[0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0],[0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],[0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],[0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0]],hot=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0],[0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0],[0,0,0,0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,0],[0,0,0,0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],spark=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],top=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,6,6,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,6,6,6,6,6,6,0,0,0,0,0,0,0],[0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0],[0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0],[0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0],[0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0],[0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0],[0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,0,0,0,0,0],[0,0,0,0,0,0,0,0,6,6,6,6,6,6,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],shadow=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,7,7,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,7,7,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],step=0,border_c=[0,0,0,196],hot_c=[255,255,255,128],top_c=[255,255,255,128],shadow_c=[0,0,0,128],spark_c=[255,255,255,255],y=-this.TILE_HEIGHT;y<this.h;y+=this.TILE_HEIGHT-6){for(var x=-this.TILE_WIDTH;x<this.w;x+=this.TILE_WIDTH-1){var colors=[];colors[1]=border_c,colors[2]=hot_c;var x3=parseInt(x+this.TILE_WIDTH/2);x3=x3>this.w?this.w:x3,x3=0>x3?0:x3;var y3=parseInt(y+this.TILE_HEIGHT/2);y3=y3>this.h?this.h:y3,colors[3]=this.getPixelXY(data.data,x3,y3),colors[6]=top_c,colors[7]=shadow_c,colors[8]=spark_c;var offsetX=0;1==step&&(offsetX=10);for(var px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(var py=0;py<this.TILE_HEIGHT;py++)pattern[py][px]&&this.setPixelXY(out,x+px+offsetX,y+py,colors[pattern[py][px]]);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)hot[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,hot_c);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)top[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,top_c);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)shadow[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,shadow_c);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)spark[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,spark_c);for(px=0;px<this.TILE_WIDTH;px++)if(!(x+px+offsetX>this.w||0>x+px+offsetX))for(py=0;py<this.TILE_HEIGHT;py++)border[py][px]&&this.setMixPixel(out,x+px+offsetX,y+py,border_c)}step=1==step?0:1}return out}})}),define("collections/Generator",["backbone"],function(Backbone){"use strict";return Backbone.Collection.extend({comparator:"name",doit:function(cid,data,w,h){return this.get({cid:cid}).doit(data,w,h)}})}),define("views/Wizard",["backbone","jquery"],function(Backbone,$){"use strict";return Backbone.View.extend({el:"#wizard",encoded:null,imageName:null,elements:[],filterCid:null,initialize:function(){this.elements.preloader=this.$(".preloader"),this.elements.error=this.$(".error400"),this.elements.srcImage=this.$(".src-image"),this.elements.dstImage=this.$(".dst-image"),this.elements.inputFilter=this.$("#input-filter"),this.elements.optionsModal=this.$("#options-modal"),this.elements.messageModal=this.$("#message"),this.elements.filterOptionsBtn=this.$("#filter-options"),this.collection.each(function(generator){this.elements.inputFilter.append($("<option/>",{value:generator.cid,text:generator.get("name")}))},this)},events:{"click #input-url":"selectAll","click #input-url-button":"loadUrl","click #filter-options":"onFilterOptionsClick","change #input-file":"select","change #input-filter":"onFilterChange"},message:function(msg){this.elements.messageModal.find(".message-body p").text(msg),this.elements.messageModal.modal()},buildOptions:function(){},onFilterChange:function(e){if(this.filterCid=$(e.currentTarget).val(),this.filterCid){var model=this.collection.get(this.filterCid),options=model.options;options&&Object.keys(options).length?this.elements.filterOptionsBtn.prop("disabled",!1):this.elements.filterOptionsBtn.prop("disabled",!0),this.render()}else this.elements.filterOptionsBtn.prop("disabled",!0)},onFilterOptionsClick:function(e){e.preventDefault(),this.elements.optionsModal.modal()},showPreloader:function(state){state===!0||"undefined"==typeof state?this.elements.preloader.show():this.elements.preloader.fadeOut()},loadUrl:function(e){e.preventDefault();var url=$.trim(this.$("#input-url").val());!url.length||url.length>8190||(this.showPreloader(),$.getJSON("/api.php",{url:url},function(data){0==parseInt(data.error)?(this.elements.srcImage.title=data.name,this.elements.srcImage.attr("src",data.data),this.imageName=data.name,this.encoded=data.data,this.render()):this.elements.error.show(),this.showPreloader(!1)}.bind(this)))},selectAll:function(e){$(e.currentTarget).select()},render:function(){if(this.encoded){this.showPreloader(),this.elements.error.hide();var srcImage=this.elements.srcImage[0],cvs=document.createElement("canvas");cvs.width=srcImage.width,cvs.height=srcImage.height;var ctx=cvs.getContext("2d");ctx.drawImage(srcImage,0,0,cvs.width,cvs.height);var idt=ctx.getImageData(0,0,cvs.width,cvs.height),cid=this.elements.inputFilter.val(),out=this.collection.doit(cid,idt,cvs.width,cvs.height);idt.data.set(out),ctx.putImageData(idt,0,0),this.elements.dstImage.attr("src",cvs.toDataURL("image/png")),this.showPreloader(!1)}},select:function(event){var selectedFile=event.target.files[0],reader=new FileReader;this.elements.srcImage.title=selectedFile.name,this.imageName=selectedFile.name,reader.onload=function(event){this.elements.srcImage.attr("src",event.target.result),this.encoded=event.target.result,this.render()}.bind(this),reader.readAsDataURL(selectedFile)}})}),define("templates",function(require){"use strict";return{}}),require.config({paths:{underscore:"//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",backbone:"//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min",jquery:"//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min",bootstrap:"//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",share:"//yastatic.net/share/share"},shim:{underscore:{exports:"_"},backbone:{exports:"Backbone",deps:["jquery","underscore"]},bootstrap:{deps:["jquery"]}},waitSeconds:60}),require(["jquery","models/TriangleCross","models/TriangleCube","models/TriangleCubeSimple","collections/Generator","views/Wizard","bootstrap","share","lib/Fileinput"],function($,TriangleCrossModel,TriangleCubeModel,TriangleCubeSimpleModel,GeneratorCollection,WizardView){"use strict";$(function(){if($(document).on("click","a[href=#]",function(e){e.preventDefault()}),$("footer").css("background-color",$("body > nav").css("background-color")),$("footer *").css("color",$(".navbar-default .navbar-nav > li > a").css("color")),"undefined"==typeof FileReader||!$.isFunction(FileReader))return void $("#old-browser").fadeIn("slow");$('[data-toggle="tooltip"]').tooltip(),$("#wizard").show(),$(":file").filestyle({buttonText:"",buttonName:"btn-primary"});var generators=new GeneratorCollection([new TriangleCrossModel,new TriangleCubeModel,new TriangleCubeSimpleModel]);new WizardView({collection:generators})})});