(function (sap) {
    "use strict";

    // SAPUI5 delivered namespaces from https://ui5.sap.com/#/api/sap
    const UI5_LIBS = [
        "sap.apf",
        "sap.base",
        "sap.chart",
        "sap.collaboration",
        "sap.f",
        "sap.fe",
        "sap.fileviewer",
        "sap.gantt",
        "sap.landvisz",
        "sap.m",
        "sap.ndc",
        "sap.ovp",
        "sap.rules",
        "sap.suite",
        "sap.tnt",
        "sap.ui",
        "sap.uiext",
        "sap.ushell",
        "sap.uxap",
        "sap.viz",
        "sap.webanalytics",
        "sap.zen"
    ];

    /**
     * Extracts library and component dependencies from manifest
     * @param {string} manifestPath - Path to manifest.json
     * @returns {Promise<string>} Promise resolving to comma-separated list of dependencies
     */
    const fioriToolsGetManifestLibs = function (manifestPath) {
        const url = manifestPath;
        let result = "";
        /**
         * Extracts keys from library or component object, filtering out UI5 delivered namespaces
         * @param {Object} libOrComp - Object containing library or component definitions
         * @param {string} libOrCompKeysString - Existing comma-separated string of keys
         * @returns {string} Updated comma-separated string of keys
         */
        const getKeys = function (libOrComp, libOrCompKeysString) {
            const keys = Object.keys(libOrComp);
            const filteredKeys = keys.filter(key => 
                !UI5_LIBS.some(namespace => 
                    key === namespace || key.startsWith(namespace + ".")
                )
            );

            const existingKeys = libOrCompKeysString ? [libOrCompKeysString] : [];
            return [...existingKeys, ...filteredKeys].join(",");
        };
        /**
         * Extracts component usage names from component usages object
         * @param {Object} compUsages - Component usages object
         * @param {string} libOrCompKeysString - Existing comma-separated string of keys
         * @returns {string} Updated comma-separated string of keys
         */
        const getComponentUsageNames = function (compUsages, libOrCompKeysString) {
            const compNames = Object.keys(compUsages).map(key => compUsages[key].name);
            const filteredNames = compNames.filter(name => 
                !UI5_LIBS.some(namespace => 
                    name === namespace || name.startsWith(namespace + ".")
                )
            );

            const existingKeys = libOrCompKeysString ? [libOrCompKeysString] : [];
            return [...existingKeys, ...filteredNames].join(",");
        };
        return new Promise(function (resolve, reject) {
            sap.ui.require(["sap/ui/thirdparty/jquery"], function (localJQuery) {
                localJQuery.ajax(url)
                    .done(function (manifest) {
                        if (manifest) {
                            const sapUI5Config = manifest["sap.ui5"];
                            
                            if (sapUI5Config?.dependencies) {
                                if (sapUI5Config.dependencies.libs) {
                                    result = getKeys(sapUI5Config.dependencies.libs, result);
                                }
                                if (sapUI5Config.dependencies.components) {
                                    result = getKeys(sapUI5Config.dependencies.components, result);
                                }
                            }
                            
                            if (sapUI5Config?.componentUsages) {
                                result = getComponentUsageNames(sapUI5Config.componentUsages, result);
                            }
                        }
                        resolve(result);
                    })
                    .fail(function () {
                        reject(new Error("Could not fetch manifest at '" + manifestPath + "'"));
                    });
            });
        });
    };
    /**
     * Registers module paths for dependencies found in app index
     * @param {Object} dataFromAppIndex - Data returned from app index service
     */
    const registerModules = function (dataFromAppIndex) {
        Object.keys(dataFromAppIndex).forEach(function (moduleDefinitionKey) {
            const moduleDefinition = dataFromAppIndex[moduleDefinitionKey];
            
            if (moduleDefinition?.dependencies) {
                moduleDefinition.dependencies.forEach(function (dependency) {
                    if (dependency.url?.length > 0 && dependency.type === "UI5LIB") {
                        sap.ui.require(["sap/base/Log"], function (Log) {
                            Log.info("Registering Library " +
                                encodeURI(dependency.componentId) +
                                " from server " +
                                encodeURI(dependency.url));
                        });
                        
                        const compId = dependency.componentId.replace(/\./g, "/");
                        const config = {
                            paths: {
                                [compId]: dependency.url
                            }
                        };
                        sap.ui.loader.config(config);
                    }
                });
            }
        });
    };
    /**
     * Registers the module paths for dependencies of the given component.
     * @param {string} manifestPath - The path to the app manifest
     * @returns {Promise} Promise resolved when module paths are registered
     */
    const registerComponentDependencyPaths = function (manifestPath) {
        return fioriToolsGetManifestLibs(manifestPath).then(function (libs) {
            if (!libs?.length) {
                return undefined;
            }

            let url = "/sap/bc/ui2/app_index/ui5_app_info?id=" + libs;
            const sapClient = new URLSearchParams(window.location.search).get("sap-client");
            
            if (sapClient?.length === 3) {
                url += "&sap-client=" + sapClient;
            }

            return new Promise(function (resolve) {
                sap.ui.require(["sap/ui/thirdparty/jquery"], function (localJQuery) {
                    localJQuery.ajax(url)
                        .done(function (data) {
                            if (data) {
                                registerModules(data);
                            }
                            resolve();
                        })
                        .fail(function () {
                            resolve(); // Don't reject, just continue
                        });
                });
            });
        });
    };

    /**
     * Registers SAP icon fonts for the application
     */
    const registerSAPFonts = function () {
        sap.ui.require(["sap/ui/core/IconPool"], function (IconPool) {
            // Fiori Theme font family and URI
            const fioriTheme = {
                fontFamily: "SAP-icons-TNT",
                fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
            };
            IconPool.registerFont(fioriTheme);

            // SAP Business Suite Theme font family and URI
            const bSuiteTheme = {
                fontFamily: "BusinessSuiteInAppSymbols",
                fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
            };
            IconPool.registerFont(bSuiteTheme);
        });
    };
    /**
     * Sets up internationalization and document title
     * @param {string} resourceRoot - Root path for i18n resources
     */
    const setupI18nAndTitle = function (resourceRoot) {
        sap.ui.require(["sap/base/i18n/Localization"], function (Localization) {
            sap.ui.require(["sap/base/i18n/ResourceBundle"], function (ResourceBundle) {
                const oResourceBundle = ResourceBundle.create({
                    url: resourceRoot + "i18n/i18n.properties",
                    locale: Localization.getLanguage()
                });
                document.title = oResourceBundle.getText("appTitle");
            });
        });
    };

    /*eslint-disable fiori-custom/sap-browser-api-warning, fiori-custom/sap-no-dom-access*/
    const currentScript = document.getElementById("locate-reuse-libs") || document.currentScript;
    const manifestUri = currentScript.getAttribute("data-sap-ui-manifest-uri");
    const componentName = currentScript.getAttribute("data-sap-ui-componentName");
    const useMockserver = currentScript.getAttribute("data-sap-ui-use-mockserver");
    
    // Patch (KW): resourceRoot is needed to load the correct ResourceBundles
    const resourceRoot = manifestUri.substring(0, manifestUri.lastIndexOf('/') + 1);
    return registerComponentDependencyPaths(manifestUri)
        .catch(function (error) {
            sap.ui.require(["sap/base/Log"], function (Log) {
                Log.error(error);
            });
        })
        .finally(function () {
            // Set up internationalization and document title
            sap.ui.require(["sap/ui/core/Core"], async function(Core) {
                Core.ready(() => {
                    setupI18nAndTitle(resourceRoot);
                });
            });

            if (componentName?.length > 0) {
                if (useMockserver === "true") {
                    initializeAppWithMockserver(componentName);
                } else {
                    initializeAppStandalone();
                }
            } else {
                initializeUshellSandbox();
            }
        });

    /**
     * Initialize app with mockserver for testing
     * @param {string} componentName - Name of the component
     */
    function initializeAppWithMockserver(componentName) {
        sap.ui.require(["sap/ui/core/Core"], async function(Core) {
            Core.ready(() => {
                registerSAPFonts();
                sap.ui.require([componentName.replace(/\./g, "/") + "/localService/mockserver"], function (server) {
                    server.init();
                    sap.ui.require(["sap/ushell/Container"], async function (Container) {
                        Container.createRenderer(true).then(function (component) {
                            component.placeAt("content");
                        });
                    });
                });
            });
        });
    }

    /**
     * Initialize app in standalone mode
     */
    function initializeAppStandalone() {
        sap.ui.require(["sap/ui/core/ComponentSupport"]);
        
        sap.ui.require(["sap/ui/core/Core"], async function(Core) {
            Core.ready(() => {
                registerSAPFonts();
                setupI18nAndTitle(resourceRoot);
            });
        });
    }

    /**
     * Initialize ushell sandbox environment
     */
    function initializeUshellSandbox() {
        sap.ui.require(["sap/ui/core/Core"], async function(Core) {
            Core.ready(() => {
                registerSAPFonts();
                sap.ui.require(["sap/ushell/Container"], async function (Container) {
                    try {
                        Container.createRenderer(true).then(function (component) {
                            component.placeAt("content");
                        });
                    } catch (error) {
                        // Support older versions of UI5
                        Container.createRenderer().placeAt("content");
                    }
                });
            });
        });
    }
})(sap);
