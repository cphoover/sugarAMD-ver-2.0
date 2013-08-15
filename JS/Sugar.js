/** document.currentScript polyfill via https://raw.github.com/samyk/jiagra/master/jiagra.js **/
"undefined"===typeof document.currentScript&&function(){var c=document.getElementsByTagName("script");document._currentScript=document.currentScript;var d=document.actualScript=function(){if(document._currentScript)return document._currentScript;var a;try{omgwtf}catch(d){a=d.stack}if(a){for(var b=-1!==a.indexOf(" at ")?" at ":"@";-1!==a.indexOf(b);)a=a.substring(a.indexOf(b)+b.length);a=a.substring(0,a.indexOf(":",a.indexOf(":")+1));a:{for(b=0;b<c.length;b++)if(c[b].src===a){a=c[b];break a}a=void 0}return a}};
document.__defineGetter__&&document.__defineGetter__("currentScript",d)}();



/** MAIN LOGIC **/
;(function($){
    "use strict";
    function sugar(_dependencies, _callback) {


        var currentScript     = sugar.getCurrentScript();

        var currentScriptSrc  = currentScript.getAttribute('src');

        var $currentScript    = $(currentScript);
        var namespaceString   = sugar.convertFilenameToNamespace(currentScript.getAttribute('src'));
        var callback          = ("function" === typeof _callback  || "object" === typeof _callback)   ? _callback     : _dependencies;
        var dependencies      = _dependencies instanceof Array ? _dependencies : null;            



        if (null === dependencies  || dependencies.length === 0){
                sugar.moduleDone($currentScript, namespaceString, callback);
        } else if (dependencies.length > 0) {

            
            var dependencyMap = {};
            dependencies.forEach(function (_dependency) {

                dependencyMap[_dependency] = false;

                var dependencyFileName = sugar.convertNamespaceToFilename(_dependency);
                // if already added to screen continue in loop...
                if ($('[src="' + dependencyFileName + '"]').length > 0) {
                    return false;
                }

                var script = sugar.addModuleToDom(dependencyFileName);

                $(script).on("dependenciesLoaded", function () {
                    var loaded = sugar.convertFilenameToNamespace(this.getAttribute('src'));
                    dependencyMap[loaded] = true;
                    if(sugar.checkDone(dependencyMap)) {
                        sugar.moduleDone($currentScript, namespaceString, callback);
                    }
                });
            });
        }

    }

    sugar.base = "/JS/";

    sugar.moduleContainer = (function () {
        var moduleContainer = document.getElementById("sugar-module-container");
        if(null === moduleContainer) {
            moduleContainer = document.createElement("div");
            moduleContainer.id = "sugar-module-container";
            document.body.appendChild(moduleContainer);
        }
        return moduleContainer;
    })();


    sugar.addModuleToDom = function(_src){
        var script = document.createElement("script");
        script.setAttribute('src',  _src);
        sugar.moduleContainer.appendChild(script);
        return script;
    };

    sugar.convertNamespaceToFilename = function(_namespace){
        return sugar.base  +  _namespace.replace(/\./g, "/") + ".js";
    };

    sugar.convertFilenameToNamespace = function(_filename){
        return _filename.replace(sugar.base, '').replace(".js", "").replace(/\//g, ".");
    };

    sugar.moduleDone = function(_$currentScript, _namespaceString, _callback){
            sugar.createNamespace(_namespaceString, _callback());
            _$currentScript.trigger("dependenciesLoaded");
    };

    sugar.getCurrentScript = function () {
        return document.currentScript;
    };

    sugar.checkDone = function (dependencyMap) {
        for (var dependency in dependencyMap){
            if (dependencyMap.hasOwnProperty(dependency) && !dependencyMap[dependency]) {
                return false; 
            }
        }
        return true;
    };

    sugar.createNamespace = function(_namespaceString, _val, _context) {


        if("undefined" !== typeof _val && ("function" !== typeof _val && "object" !== typeof _val)){
            throw "namespace must be an object";
        }
            
        var parts       = _namespaceString.split('.'),
            parent      = _context || window,
            currentPart = '';
        
        for(var i = 0, length = parts.length; i < length; i++) {
            currentPart         = parts[i];
            parent[currentPart] = parent[currentPart] || ((i === parts.length - 1 && "undefined" !== typeof _val) ? _val : {});
            parent              = parent[currentPart];
        }

        return parent;
    };


    (function () {
        var startScript = $("[sugar-main]");
        if(0 < startScript.length) {
            var namespace = startScript.attr("sugar-main");
            sugar.addModuleToDom(sugar.convertNamespaceToFilename(namespace));  
        }
    })();

    window.sugarAMD = window.sugar = sugar;

})("undefined" !== typeof Zepto ? Zepto : jQuery);

