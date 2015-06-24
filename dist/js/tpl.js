/**
 * Copyright (c) 2015 pointofpresence
 * ReSampled.Pixla (pixla) - Online image filter
 * @version v0.0.17
 * @build Wed, 24 Jun 2015 16:31:05 GMT
 * @link https://github.com/pointofpresence/pixla
 * @license MIT
 */
!function(){var e=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],n=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,r=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,t=[],i={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g},a=function(e,n){var r=i,t="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(r.interpolate,function(e,n){return"',"+n.replace(/\\'/g,"'")+",'"}).replace(r.evaluate||null,function(e,n){return"');"+n.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"; __p.push('"}).replace(/\r/g,"").replace(/\n/g,"").replace(/\t/g,"")+"');}return __p.join('');";return t};define(function(){var i,o,c;return"undefined"!=typeof window&&window.navigator&&window.document?o=function(e,n){var r=i.createXhr();r.open("GET",e,!0),r.onreadystatechange=function(e){4===r.readyState&&n(r.responseText)},r.send(null)}:"undefined"!=typeof process&&process.versions&&process.versions.node&&(c=require.nodeRequire("fs"),o=function(e,n){n(c.readFileSync(e,"utf8"))}),i={version:"0.24.0",strip:function(e){if(e){e=e.replace(n,"");var t=e.match(r);t&&(e=t[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"").replace(/[\t]/g,"").replace(/[\r]/g,"")},createXhr:function(){var n,r,t;if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;for(r=0;3>r;r++){t=e[r];try{n=new ActiveXObject(t)}catch(i){}if(n){e=[t];break}}if(!n)throw new Error("require.getXhr(): XMLHttpRequest not available");return n},get:o,load:function(e,n,r,o){var c,s=!1,u=e.indexOf("."),p=e.substring(0,u),l=e.substring(u+1,e.length);u=l.indexOf("!"),-1!==u&&(s=l.substring(u+1,l.length),s="strip"===s,l=l.substring(0,u)),c="nameToUrl"in n?n.nameToUrl(p,"."+l):n.toUrl(p+"."+l),i.get(c,function(n){n=a(n),o.isBuild||(n=new Function("obj",n)),n=s?i.strip(n):n,o.isBuild&&o.inlineText&&(t[e]=n),r(n)})},write:function(e,n,r){if(n in t){var a=i.jsEscape(t[n]);r("define('"+e+"!"+n+"', function() {return function(obj) { "+a.replace(/(\\')/g,"'").replace(/(\\\\)/g,"\\")+"}});\n")}}}})}();