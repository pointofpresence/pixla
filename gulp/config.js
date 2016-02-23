var root   = "./",
    src    = root + "src/",
    dist   = root + "dist/",
    jsSrc  = src + "js/",
    jsDst  = dist + "js/",
    node   = root + "node_modules/",
    bower  = root + "bower_components/",
    imgSrc = src + "images/",
    imgDst = dist + "images/";

module.exports = {
    "root":      root,
    "dist":      dist,
    "imgSrc":    imgSrc,
    "imgDst":    imgDst,
    "jade":      "src/jade/",
    "less":      "src/less/",
    "css":       "dist/css/",
    "readMeSrc": "src/README.md",
    "readMeDst": "README.md",
    "jsSrc":     jsSrc,
    "jsDst":     jsDst
};