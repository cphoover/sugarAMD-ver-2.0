;(function($){

    function sugar(_dependencies, _callback) {
        var currentScript     = sugar.getCurrentScript(),
            $currentScript    = $(currentScript),
            namespaceString   = currentScript.src.replace(".js", "").replace(/\//g, "."),
            callback          = "function" === typeof _callback     ? _callback     : _dependencies,
            dependencies      = "array"    === typeof _dependencies ? _dependencies : null;            

        if (null === dependencies){
            sugar.moduleDone($currentScript, namespaceString, callback);
        } else if (0 < dependencies.length) {
            var dependencyMap = {};
            dependencies.foreach(function (_dependency) {
                dependencyMap[_dependency] = false;

                var dependencyFileName = sugar.convertNamespaceToFilename(_dependency);

                // if already added to screen continue in loop...
                if (0 < $('[src="' + dependencyFileName + '"]').length) {
                    return false;
                }

                var script = sugar.addModuleToDom(dependencyFileName);

                $(script).on("dependenciesLoaded", function () {
                    dependencyMap[_dependency] = true;
                    if(sugar.checkDone(dependencyMap)) {
                        sugar.moduleDone($currentScript, namespaceString, callback);
                    }
                })
            })
        }
    }


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
        script.src = _src;
        sugar.moduleContainer.appendChild(script);
        return script;
    };

    sugar.convertNamespaceToFilename = function(_namespace){
        return _namespace.replace(/\./g, "/") + ".js";
    };

    sugar.moduleDone = function(_$currentScript, _namespaceString, _callback){
        sugar.createNamespaces(_namespaceString, _callback);
        _$currentScript.trigger("dependenciesLoaded");
    };

    sugar.getCurrentScript = function () {
        var modules = sugar.moduleContainer.getElementsByTagName("script");
        return modules[modules.length - 1];
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
            parent[currentPart] = parent[currentPart] || ((i == parts.length - 1 && "undefined" !== typeof _val) ? _val : {});
            parent              = parent[currentPart];
        }

        return parent;
    };


    (function () {
        var startScript = $("[sugar-main]");
        if(0 < startScript.length) {
            var namespace = startScript.attr("sugar-main");
            sugar.addModuleToDom(sugar.convertNamespaceToFilename(namespace)))   
        }
    })();

    window.sugarAMD = window.sugar = sugar;

})(Zepto || jQuery);
