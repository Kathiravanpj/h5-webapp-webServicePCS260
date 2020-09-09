var h5;
(function (h5) {
    var application;
    (function (application) {
        var AppController = (function () {
            function AppController(scope, configService, appService, restService, storageService, gridService, userService, languageService, $uibModal, $interval, $timeout, $filter, $q, $window, formService, $location, $http) {
                this.scope = scope;
                this.configService = configService;
                this.appService = appService;
                this.restService = restService;
                this.storageService = storageService;
                this.gridService = gridService;
                this.userService = userService;
                this.languageService = languageService;
                this.$uibModal = $uibModal;
                this.$interval = $interval;
                this.$timeout = $timeout;
                this.$filter = $filter;
                this.$q = $q;
                this.$window = $window;
                this.formService = formService;
                this.$location = $location;
                this.$http = $http;
                this.init();
            }
            AppController.prototype.init = function () {
                var _this = this;
                this.scope.appReady = false;
                this.scope.loadingData = false;
                this.scope.statusBar = [];
                this.scope.statusBarIsCollapsed = true;
                this.scope.statusBarVisible = true;
                this.languageService.getAppLanguage().then(function (val) {
                    _this.scope.languageConstants = _this.languageService.languageConstants;
                    _this.initApplication();
                }, function (errorResponse) {
                    Odin.Log.error("Error getting language constants " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error getting language constants" + errorResponse, statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                });
                if (this.$window.innerWidth <= 768) {
                    this.scope.showSideNavLabel = false;
                    this.scope.showSideNav = false;
                }
                else {
                    this.scope.showSideNavLabel = true;
                    this.scope.showSideNav = true;
                }
            };
            AppController.prototype.initApplication = function () {
                var _this = this;
                this.initGlobalConfig();
                this.initAppScope();
                this.initUIGrids();
                this.initScopeFunctions();
                this.$timeout(function () { _this.scope.appReady = true; }, 5000);
                this.initApplicationConstants();
            };
            AppController.prototype.initGlobalConfig = function () {
                var _this = this;
                this.configService.getGlobalConfig().then(function (configData) {
                    _this.scope.globalConfig = configData;
                    _this.initLanguage();
                    _this.initTheme();
                    _this.getUserContext();
                    _this.initModule();
                }, function (errorResponse) {
                    Odin.Log.error("Error while getting global configuration " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error while getting global configuration " + errorResponse, statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.initAppScope = function () {
                this.scope.transactionStatus = {
                    appConfig: false
                };
                this.scope["errorMessages"] = [];
                this.scope.infiniteScroll = {
                    numToAdd: 20,
                    currentItems: 20
                };
                this.scope.themes = [
                    { themeId: 1, themeIcon: 'leanswiftchartreuse.png', themeName: "Theme1Name", panel: "panel-h5-theme-LC", navBar: "navbar-h5-theme-LC", sideNav: "sideNav-h5-theme-LC", button: "h5Button-h5-theme-LC", h5Grid: "h5Grid-h5-theme-LC", h5Dropdown: "h5Dropdown-h5-theme-LC", navTabs: "navtabs-h5-theme-LC", active: false, available: true },
                    { themeId: 2, themeIcon: 'royalinfor.png', themeName: "Theme2Name", panel: "panel-h5-theme-RI", navBar: "navbar-h5-theme-RI", sideNav: "sideNav-h5-theme-RI", button: "h5Button-h5-theme-RI", h5Grid: "h5Grid-h5-theme-RI", h5Dropdown: "h5Dropdown-h5-theme-RI", navTabs: "navtabs-h5-theme-RI", active: false, available: true },
                    { themeId: 3, themeIcon: 'summersmoothe.png', themeName: "Theme3Name", panel: "panel-h5-theme-SS", navBar: "navbar-h5-theme-SS", sideNav: "sideNav-h5-theme-SS", button: "h5Button-h5-theme-SS", h5Grid: "h5Grid-h5-theme-SS", h5Dropdown: "h5Dropdown-h5-theme-SS", navTabs: "navtabs-h5-theme-SS", active: false, available: true },
                    { themeId: 4, themeIcon: 'pumkinspice.png', themeName: "Theme4Name", panel: "panel-h5-theme-PS", navBar: "navbar-h5-theme-PS", sideNav: "sideNav-h5-theme-PS", button: "h5Button-h5-theme-PS", h5Grid: "h5Grid-h5-theme-PS", h5Dropdown: "h5Dropdown-h5-theme-PS", navTabs: "navtabs-h5-theme-PS", active: false, available: true },
                    { themeId: 5, themeIcon: 'visionimpared.png', themeName: "Theme5Name", panel: "panel-h5-theme-VI", navBar: "navbar-h5-theme-VI", sideNav: "sideNav-h5-theme-VI", button: "h5Button-h5-theme-VI", h5Grid: "h5Grid-h5-theme-VI", h5Dropdown: "h5Dropdown-h5-theme-VI", navTabs: "navtabs-h5-theme-VI", active: false, available: true },
                    { themeId: 6, themeIcon: 'lipstickjungle.png', themeName: "Theme6Name", panel: "panel-h5-theme-LJ", navBar: "navbar-h5-theme-LJ", sideNav: "sideNav-h5-theme-LJ", button: "h5Button-h5-theme-LJ", h5Grid: "h5Grid-h5-theme-LJ", h5Dropdown: "h5Dropdown-h5-theme-LJ", navTabs: "navtabs-h5-theme-LJ", active: false, available: true },
                    { themeId: 7, themeIcon: 'silverlining.png', themeName: "Theme7Name", panel: "panel-h5-theme-SL", navBar: "navbar-h5-theme-SL", sideNav: "sideNav-h5-theme-SL", button: "h5Button-h5-theme-SL", h5Grid: "h5Grid-h5-theme-SL", h5Dropdown: "h5Dropdown-h5-theme-SL", navTabs: "navtabs-h5-theme-SL", active: false, available: true },
                    { themeId: 8, themeIcon: 'steelclouds.png', themeName: "Theme8Name", panel: "panel-h5-theme-SC", navBar: "navbar-h5-theme-SC", sideNav: "sideNav-h5-theme-SC", button: "h5Button-h5-theme-SC", h5Grid: "h5Grid-h5-theme-SC", h5Dropdown: "h5Dropdown-h5-theme-SC", navTabs: "navtabs-h5-theme-SC", active: false, available: true }
                ];
                this.scope.textures = [
                    { textureId: 1, textureIcon: 'diamond.png', textureName: "Wallpaper1Name", appBG: "h5-texture-one", active: false, available: true },
                    { textureId: 2, textureIcon: 'grid.png', textureName: "Wallpaper2Name", appBG: "h5-texture-two", active: false, available: true },
                    { textureId: 3, textureIcon: 'linen.png', textureName: "Wallpaper3Name", appBG: "h5-texture-three", active: false, available: true },
                    { textureId: 4, textureIcon: 'tiles.png', textureName: "Wallpaper4Name", appBG: "h5-texture-four", active: false, available: true },
                    { textureId: 5, textureIcon: 'wood.png', textureName: "Wallpaper5Name", appBG: "h5-texture-five", active: false, available: true }
                ];
                this.scope.supportedLanguages = [{ officialTranslations: false, languageCode: "ar-AR", active: false, available: true }, { officialTranslations: false, languageCode: "cs-CZ", active: false, available: true },
                    { officialTranslations: false, languageCode: "da-DK", active: false, available: true }, { officialTranslations: false, languageCode: "de-DE", active: false, available: true },
                    { officialTranslations: false, languageCode: "el-GR", active: false, available: true }, { officialTranslations: true, languageCode: "en-US", active: true, available: true },
                    { officialTranslations: false, languageCode: "es-ES", active: false, available: true }, { officialTranslations: false, languageCode: "fi-FI", active: false, available: true },
                    { officialTranslations: true, languageCode: "fr-FR", active: false, available: true }, { officialTranslations: false, languageCode: "he-IL", active: false, available: true },
                    { officialTranslations: false, languageCode: "hu-HU", active: false, available: true }, { officialTranslations: false, languageCode: "it-IT", active: false, available: true },
                    { officialTranslations: false, languageCode: "ja-JP", active: false, available: true }, { officialTranslations: false, languageCode: "nb-NO", active: false, available: true },
                    { officialTranslations: false, languageCode: "nl-NL", active: false, available: true }, { officialTranslations: false, languageCode: "pl-PL", active: false, available: true },
                    { officialTranslations: false, languageCode: "pt-PT", active: false, available: true }, { officialTranslations: false, languageCode: "ru-RU", active: false, available: true },
                    { officialTranslations: true, languageCode: "sv-SE", active: false, available: true }, { officialTranslations: false, languageCode: "tr-TR", active: false, available: true },
                    { officialTranslations: false, languageCode: "zh-CN", active: false, available: true }, { officialTranslations: false, languageCode: "ta-IN", active: false, available: true }
                ];
                this.scope.statusBarMessagetype = { Information: 0, Warning: 1, Error: 2 };
                this.scope.views = {
                    h5Application: { url: "views/Application.html" },
                    webService: { url: "views/WebServices.html" }
                };
                this.scope.modules = [
                    { moduleId: 1, activeIcon: 'SampleModule1.png', inactiveIcon: 'SampleModule1-na.png', heading: 'Web Services', content: this.scope.views.webService.url, active: true, available: true }
                ];
                this.scope.appConfig = {};
                this.scope.userContext = new M3.UserContext();
                this.scope["dateRef"] = new Date();
                this.initGlobalSelection();
                this.initWebService();
            };
            AppController.prototype.initGlobalSelection = function () {
                this.scope.globalSelection = {
                    reload: true,
                    transactionStatus: {
                        sampleDataList1: false,
                        sampleDataList2: false,
                        facilityDataList: false,
                        workcenterDataList: false,
                        facility: false,
                        fromlocationDataList: false,
                        warehouseDataList: false,
                        containertypeDataList: false,
                        locationtypeDataList: false,
                        availabilityDataList: false
                    },
                    sampleDataList1: [],
                    sampleData1: undefined,
                    sampleDataList2: [],
                    sampleData2: undefined,
                    facilityDataList: [],
                    userSelection: {},
                    facilityList: [],
                    facilityData: undefined,
                    workcenterList: [],
                    workcenterData: undefined,
                    fromlocationDataList: [],
                    fromlocationData: undefined,
                    warehouseDataList: [],
                    warehouseData: undefined,
                    containertypeDataList: [],
                    containertypeData: undefined,
                    locationtypeDataList: [],
                    locationttypeData: undefined,
                    availabilityDataList: [],
                    availabilityData: undefined
                };
            };
            AppController.prototype.initWebService = function () {
                this.scope.webService = {
                    reload: true,
                    transactionStatus: {
                        programList: false,
                        transactionList: false,
                        executeTransactions: false
                    },
                    collapseSel: false,
                    collapseSection1: false,
                    program: undefined,
                    programList: [],
                    transaction: undefined,
                    transactionList: [],
                    executionMethod: "async",
                    manualInput: false,
                    ignoreBlankInput: true,
                    executionMethodList: [
                        { name: "Parallel (Asynchronously)", value: "async" },
                        { name: "One by one (Synchronously)", value: "sync" },
                    ],
                    maxNumberOfRecords: 100,
                    transactionLayoutInput: [],
                    transactionLayoutOutput: [],
                    inputDataGrid: {},
                    ErrorListGrid: {},
                    isInputDataGridReady: false,
                    selectedInputDataGridRow: {},
                    outputDataGrid: {},
                    isOutputDataGridReady: false,
                    executeConfirmationMessage: "",
                    inputItems: false,
                    errorBoolean: false,
                    errorText: " "
                };
            };
            AppController.prototype.initApplicationConstants = function () {
            };
            AppController.prototype.initScopeFunctions = function () {
            };
            AppController.prototype.initUIGrids = function () {
                var _this = this;
                this.scope.webService.inputDataGrid = this.gridService.getInputDataGrid();
                this.scope.webService.ErrorListGrid = this.gridService.getErrorListGrid();
                this.scope.webService.inputDataGrid.importerDataAddCallback = function (grid, newObjects) {
                    newObjects.forEach(function (newObject) {
                        newObject.executionStatus = undefined;
                        newObject.apiResponse = undefined;
                        newObject.errorCode = undefined;
                        newObject.errorMessage = undefined;
                    });
                    _this.scope.webService.inputDataGrid.data = newObjects;
                    _this.scope.webService.ErrorListGrid.data = [];
                    _this.scope.webService.manualInput = true;
                    _this.gridService.adjustGridHeight("inputDataGrid", _this.scope.webService.inputDataGrid.data.length, 500);
                    _this.gridService.adjustGridHeight("ErrorListGrid", _this.scope.webService.ErrorListGrid.data.length, 500);
                };
                this.initUIGridsOnRegisterApi();
            };
            AppController.prototype.initUIGridsOnRegisterApi = function () {
                var _this = this;
                this.scope.webService.inputDataGrid.onRegisterApi = function (gridApi) {
                    _this.scope.webService.inputDataGrid.gridApi = gridApi;
                    _this.gridService.adjustGridHeight("inputDataGrid", _this.scope.webService.inputDataGrid.data.length, 500);
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.inputDataGridRowSelected(row);
                    });
                };
                this.scope.webService.ErrorListGrid.onRegisterApi = function (gridApi) {
                    _this.scope.webService.ErrorListGrid.gridApi = gridApi;
                    _this.gridService.adjustGridHeight("ErrorListGrid", _this.scope.webService.ErrorListGrid.data.length, 500);
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ErrorListGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ErrorListGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ErrorListGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ErrorListGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("ErrorListGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                };
            };
            AppController.prototype.inputDataGridRowSelected = function (gridRow) {
                this.scope.webService.outputDataGrid.data = [];
                this.scope.webService.selectedInputDataGridRow = {};
                if (gridRow.isSelected) {
                    this.scope.webService.selectedInputDataGridRow = gridRow.entity;
                    var resultItems = angular.isDefined(gridRow.entity.apiResponse) ? gridRow.entity.apiResponse.items : [];
                }
            };
            AppController.prototype.resetUIGridsColumnDefs = function () {
                this.scope.webService.inputDataGrid.columnDefs = this.gridService.getInputDataGrid().columnDefs;
            };
            AppController.prototype.initTheme = function () {
                var _this = this;
                var themeId = this.storageService.getLocalData('h5.app.appName.theme.selected');
                var textureId = this.storageService.getLocalData('h5.app.appName.texture.selected');
                themeId = angular.isNumber(themeId) ? themeId : angular.isNumber(this.scope.globalConfig.defaultThemeId) ? this.scope.globalConfig.defaultThemeId : 1;
                textureId = angular.isNumber(textureId) ? textureId : angular.isNumber(this.scope.globalConfig.defaultTextureId) ? this.scope.globalConfig.defaultTextureId : 1;
                this.themeSelected(themeId);
                this.textureSelected(textureId);
                this.scope.themes.forEach(function (theme) {
                    if (_this.scope.globalConfig.excludeThemes.indexOf(theme.themeId) > -1) {
                        theme.available = false;
                    }
                    else {
                        theme.available = true;
                    }
                });
                this.scope.textures.forEach(function (texture) {
                    if (_this.scope.globalConfig.excludeWallpapers.indexOf(texture.textureId) > -1) {
                        texture.available = false;
                    }
                    else {
                        texture.available = true;
                    }
                });
            };
            AppController.prototype.initModule = function () {
                var _this = this;
                var moduleId = this.storageService.getLocalData('h5.app.appName.module.selected');
                moduleId = angular.isNumber(moduleId) ? moduleId : 1;
                this.scope.activeModule = moduleId;
                this.scope.modules.forEach(function (appmodule) {
                    if (angular.equals(moduleId, appmodule.moduleId)) {
                        appmodule.active = true;
                    }
                    else {
                        appmodule.active = false;
                    }
                    if (_this.scope.globalConfig.excludeModules.indexOf(appmodule.moduleId) > -1) {
                        appmodule.available = false;
                    }
                    else {
                        appmodule.available = true;
                    }
                });
            };
            AppController.prototype.initLanguage = function () {
                var _this = this;
                var languageCode = this.storageService.getLocalData('h5.app.appName.language.selected');
                languageCode = angular.isString(languageCode) ? languageCode : angular.isString(this.scope.globalConfig.defaultLanguage) ? this.scope.globalConfig.defaultLanguage : "en-US";
                this.scope.currentLanguage = languageCode;
                if (!angular.equals(this.scope.currentLanguage, "en-US")) {
                    this.languageService.changeAppLanguage(languageCode).then(function (val) {
                        _this.resetUIGridsColumnDefs();
                    }, function (errorResponse) {
                        Odin.Log.error("Error getting language " + errorResponse);
                        _this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                    });
                }
                this.scope.supportedLanguages.forEach(function (language) {
                    if (angular.equals(language.languageCode, languageCode)) {
                        language.active = true;
                    }
                    else {
                        language.active = false;
                    }
                    if (_this.scope.globalConfig.excludeLanguages.indexOf(language.languageCode) > -1) {
                        language.available = false;
                    }
                    else {
                        language.available = true;
                    }
                });
            };
            AppController.prototype.themeSelected = function (themeId) {
                var _this = this;
                this.scope.themes.forEach(function (theme) {
                    if (angular.equals(theme.themeId, themeId)) {
                        theme.active = true;
                        _this.scope.theme = theme;
                    }
                    else {
                        theme.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.theme.selected', themeId);
            };
            AppController.prototype.textureSelected = function (textureId) {
                var _this = this;
                this.scope.textures.forEach(function (texture) {
                    if (angular.equals(texture.textureId, textureId)) {
                        texture.active = true;
                        _this.scope.texture = texture;
                    }
                    else {
                        texture.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.texture.selected', textureId);
            };
            AppController.prototype.getUserContext = function () {
                var _this = this;
                Odin.Log.debug("is H5 " + this.userService.isH5() + " is Iframe " + Odin.Util.isIframe());
                this.scope.loadingData = true;
                this.userService.getUserContext().then(function (val) {
                    _this.scope.userContext = val;
                    _this.loadGlobalData();
                }, function (reason) {
                    Odin.Log.error("Can't get user context from h5 due to " + reason.errorMessage);
                    _this.scope.statusBar.push({ message: "Can't get user context from h5 " + [reason.errorMessage], statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                    _this.showError("Can't get user context from h5 ", [reason.errorMessage]);
                    _this.loadGlobalData();
                });
            };
            AppController.prototype.launchM3Program = function (link) {
                Odin.Log.debug("H5 link to launch -->" + link);
                this.formService.launch(link);
            };
            AppController.prototype.mapKeyUp = function (event) {
                if (event.keyCode === 115) {
                    this.loadApplicationData();
                }
            };
            AppController.prototype.addMoreItemsToScroll = function () {
                this.scope.infiniteScroll.currentItems += this.scope.infiniteScroll.numToAdd;
            };
            ;
            AppController.prototype.copyCellContentToClipBoard = function (cells) {
                var hiddenTextArea = angular.element(document.getElementById("gridClipboard"));
                hiddenTextArea.val("");
                var textToCopy = '', rowId = cells[0].row.uid;
                cells.forEach(function (cell) {
                    textToCopy = textToCopy == '' ? textToCopy : textToCopy + ",";
                    var cellValue = cell.row.entity[cell.col.name];
                    if (angular.isDefined(cellValue)) {
                        if (cell.row.uid !== rowId) {
                            textToCopy += '\n';
                            rowId = cell.row.uid;
                        }
                        textToCopy += cellValue;
                    }
                });
                hiddenTextArea.val(textToCopy);
                hiddenTextArea.select();
            };
            AppController.prototype.openAboutPage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/About.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeThemePage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeThemeModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeWallpaperPage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeWallpaperModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeAppLanguagePage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeLanguageModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.changeAppLanguage = function (languageCode) {
                var _this = this;
                this.scope.supportedLanguages.forEach(function (language) {
                    if (angular.equals(language.languageCode, languageCode)) {
                        language.active = true;
                        _this.scope.currentLanguage = languageCode;
                    }
                    else {
                        language.active = false;
                    }
                });
                this.languageService.changeAppLanguage(languageCode).then(function (val) {
                    _this.scope.appReady = false;
                    _this.closeModalWindow();
                    _this.resetUIGridsColumnDefs();
                    _this.$timeout(function () { _this.scope.appReady = true; }, 1000);
                }, function (errorResponse) {
                    Odin.Log.error("Error getting language " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: _this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                });
                this.storageService.setLocalData('h5.app.appName.language.selected', languageCode);
            };
            AppController.prototype.sideMenuToggler = function () {
                if (this.$window.innerWidth <= 768) {
                    this.scope.showSideNavLabel = false;
                    this.scope.showSideNav = !this.scope.showSideNav;
                }
                else {
                    this.scope.showSideNav = true;
                    this.scope.showSideNavLabel = !this.scope.showSideNavLabel;
                }
            };
            AppController.prototype.closeModalWindow = function () {
                this.scope.modalWindow.close("close");
            };
            AppController.prototype.closeStatusBar = function () {
                this.scope.statusBarIsCollapsed = true;
                this.scope.statusBar = [];
            };
            AppController.prototype.removeStatusBarItemAt = function (index) {
                if (index || index == 0) {
                    this.scope.statusBar.splice(this.scope.statusBar.length - 1 - index, 1);
                }
                this.scope.statusBarIsCollapsed = this.scope.statusBar.length == 0;
            };
            ;
            AppController.prototype.showError = function (error, errorMessages) {
                var _this = this;
                this.scope["hasError"] = true;
                this.scope["error"] = error;
                this.scope["errorMessages"] = errorMessages;
                if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
                }
                this.scope["destroyErrMsgTimer"] = this.$timeout(function () { _this.hideError(); }, 30000);
            };
            AppController.prototype.hideError = function () {
                this.scope["hasError"] = false;
                this.scope["error"] = null;
                this.scope["errorMessages"] = [];
                this.scope["destroyErrMsgTimer"] = undefined;
            };
            AppController.prototype.showWarning = function (warning, warningMessages) {
                var _this = this;
                this.scope["hasWarning"] = true;
                this.scope["warning"] = warning;
                this.scope["warningMessages"] = warningMessages;
                if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
                }
                this.scope["destroyWarnMsgTimer"] = this.$timeout(function () { _this.hideWarning(); }, 10000);
            };
            AppController.prototype.hideWarning = function () {
                this.scope["hasWarning"] = false;
                this.scope["warning"] = null;
                this.scope["warningMessages"] = null;
                this.scope["destroyWarnMsgTimer"] = undefined;
            };
            AppController.prototype.showInfo = function (info, infoMessages) {
                var _this = this;
                this.scope["hasInfo"] = true;
                this.scope["info"] = info;
                this.scope["infoMessages"] = infoMessages;
                if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
                }
                this.scope["destroyInfoMsgTimer"] = this.$timeout(function () { _this.hideInfo(); }, 10000);
            };
            AppController.prototype.hideInfo = function () {
                this.scope["hasInfo"] = false;
                this.scope["info"] = null;
                this.scope["infoMessages"] = null;
                this.scope["destroyInfoMsgTimer"] = undefined;
            };
            AppController.prototype.loadGlobalData = function () {
                var _this = this;
                var userContext = this.scope.userContext;
                var globalConfig = this.scope.globalConfig;
                this.loadAppConfig(userContext.company, userContext.division, userContext.m3User, globalConfig.environment).then(function (val) {
                    _this.refreshTransactionStatus();
                    _this.loadDefaultFields();
                    _this.hideWarning();
                });
            };
            AppController.prototype.loadDefaultFields = function () {
                var userContext = this.scope.userContext;
                var appConfig = this.scope.appConfig;
                var division = angular.isString(appConfig.searchQuery.divi) ? appConfig.searchQuery.divi : userContext.division;
                var warehouse = angular.isString(appConfig.searchQuery.whlo) ? appConfig.searchQuery.whlo : userContext.WHLO;
                this.scope.globalSelection.sampleData1 = division;
                this.scope.globalSelection.sampleData2 = warehouse;
            };
            AppController.prototype.loadApplicationData = function () {
                var categories = ['globalSelection', 'mainScreen', 'webService'];
                this.clearData(categories);
                this.resetReloadStatus();
                this.loadData(this.scope.activeModule);
            };
            AppController.prototype.clearData = function (categories) {
                var _this = this;
                categories.forEach(function (category) {
                    if (category == "globalSelection") {
                    }
                    if (category == "mainScreen") {
                    }
                    if (category == "sampleModule1") {
                    }
                    if (category == "webService") {
                        _this.scope.webService.isInputDataGridReady = false;
                        _this.scope.webService.inputDataGrid.data = [];
                        _this.scope.webService.ErrorListGrid.data = [];
                        _this.scope.webService.manualInput = false;
                        _this.scope.webService.selectedInputDataGridRow = {};
                        _this.scope.webService.inputDataGrid.columnDefs = _this.gridService.getInputDataGrid().columnDefs;
                    }
                });
            };
            AppController.prototype.resetReloadStatus = function () {
                this.scope.webService.reload = true;
            };
            AppController.prototype.moduleSelected = function (moduleId) {
                this.scope.activeModule = moduleId;
                this.scope.modules.forEach(function (appmodule) {
                    if (angular.equals(moduleId, appmodule.moduleId)) {
                        appmodule.active = true;
                    }
                    else {
                        appmodule.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.module.selected', moduleId);
            };
            AppController.prototype.loadData = function (activeModule) {
                this.refreshTransactionStatus();
                switch (activeModule) {
                    case 1:
                        this.loadwebService(this.scope.webService.reload);
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                }
            };
            AppController.prototype.loadwebService = function (reLoad) {
                var userContext = this.scope.userContext;
                if (reLoad) {
                    this.clearData(["webService"]);
                }
                if (reLoad) {
                    this.callWebServiceOne();
                }
                this.scope.webService.reload = false;
            };
            AppController.prototype.refreshTransactionStatus = function () {
                var isLoading = false;
                for (var transaction in this.scope.transactionStatus) {
                    var value = this.scope.transactionStatus[transaction];
                    if (value == true) {
                        isLoading = true;
                        break;
                    }
                }
                for (var transaction in this.scope.globalSelection.transactionStatus) {
                    var value = this.scope.globalSelection.transactionStatus[transaction];
                    if (value == true) {
                        isLoading = true;
                        break;
                    }
                }
                this.scope.loadingData = isLoading;
                if (isLoading) {
                    return;
                }
                switch (this.scope.activeModule) {
                    case 1:
                        for (var transaction in this.scope.webService.transactionStatus) {
                            var value = this.scope.webService.transactionStatus[transaction];
                            if (value == true) {
                                isLoading = true;
                                break;
                            }
                        }
                        this.scope.loadingData = isLoading;
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                }
            };
            AppController.prototype.loadAppConfig = function (company, division, user, environment) {
                var _this = this;
                var deferred = this.$q.defer();
                this.scope.appConfig = this.scope.globalConfig.appConfig;
                this.scope.appConfig.searchQuery = this.$location.search();
                if (this.scope.appConfig.enableM3Authority) {
                    this.scope.loadingData = true;
                    this.scope.transactionStatus.appConfig = true;
                    var promise1 = this.appService.getAuthority(company, division, user, "CRS610", 1).then(function (result) {
                    });
                    var promises = [promise1];
                    this.$q.all(promises).finally(function () {
                        deferred.resolve(_this.scope.appConfig);
                        _this.scope.transactionStatus.appConfig = false;
                        _this.refreshTransactionStatus();
                        Odin.Log.debug("Application configurations" + JSON.stringify(_this.scope.appConfig));
                    });
                }
                else {
                    deferred.resolve(this.scope.appConfig);
                }
                return deferred.promise;
            };
            AppController.prototype.addNewRowInInputDataGrid = function () {
                var inputDataRows = this.scope.webService.inputDataGrid.data;
                inputDataRows.push({});
                this.gridService.adjustGridHeight("inputDataGrid", inputDataRows.length, 500);
            };
            AppController.prototype.removeInputDataGridRows = function () {
                var inputDataRows = this.scope.webService.inputDataGrid.data;
                var selectedRows = this.scope.webService.inputDataGrid.gridApi.selection.getSelectedRows();
                if (selectedRows.length == 0) {
                    var warningMessage = "Please select the rows to remove";
                    this.showWarning(warningMessage, null);
                    return;
                }
                selectedRows.forEach(function (selectedRow) {
                    var index = inputDataRows.lastIndexOf(selectedRow);
                    inputDataRows.splice(index, 1);
                });
                this.scope.webService.inputDataGrid.gridApi.selection.clearSelectedRows();
                this.gridService.adjustGridHeight("inputDataGrid", inputDataRows.length, 500);
            };
            AppController.prototype.executeTransactions = function () {
                var inputRecords = [];
                var selectedRows = this.scope.webService.inputDataGrid.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                    inputRecords = selectedRows;
                }
                else {
                    inputRecords = this.scope.webService.inputDataGrid.data;
                }
                this.scope.webService.ErrorListGrid.data = [];
                var asyncflag = this.scope.webService.manualInput;
                if (asyncflag) {
                    this.executeAsynchronous("", "", 0, inputRecords, 10, 0);
                }
                else {
                    this.executeLines(inputRecords, 0);
                }
                this.closeModalWindow();
            };
            AppController.prototype.openConfirmExecuteTransactionsModal = function () {
                var userContext = this.scope.userContext;
                var records = this.scope.webService.inputDataGrid.data;
                var selectedRows = this.scope.webService.inputDataGrid.gridApi.selection.getSelectedRows();
                if (records.length == 0) {
                    var warningMessage = "No input rows available to execute";
                    this.showWarning(warningMessage, null);
                    return;
                }
                this.scope.webService.executeConfirmationMessage = "You have selected " + selectedRows.length + " input row(s), Do you want to execute only the selected row(s)?";
                if (selectedRows.length == 0) {
                    this.scope.webService.executeConfirmationMessage = "You didn't selected any rows, Are you sure you want to execute all inputs from the list?";
                }
                var options = {
                    animation: true,
                    templateUrl: "views/ConfirmExecuteTransactionsModal.html",
                    size: "sm",
                    backdrop: 'static',
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.executeLines = function (inputRecords, itemIndex) {
                var _this = this;
                var nextItem = itemIndex;
                var inputRecord = inputRecords[itemIndex];
                this.appService.getPDS001Sync(inputRecords[nextItem].W1FACI, inputRecords[nextItem].W1ITNO, "100").then(function (val) {
                    if (val.items.length > 0) {
                        var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>' + inputRecords[nextItem].CONO + '</cred:company><cred:division>' + inputRecords[nextItem].DIVI + '</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>' + inputRecords[nextItem].W1FACI + '</pcs:W1FACI><pcs:W1ITNO>' + inputRecords[nextItem].W1ITNO + '</pcs:W1ITNO><pcs:W1PCDT>' + inputRecords[nextItem].W1PCDT + '</pcs:W1PCDT><pcs:W1PCTP>' + inputRecords[nextItem].W1PCTP + '</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>' + val.item.STRT + '</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>' + inputRecords[nextItem].WWCSU1 + '</pcs:WWCSU1><pcs:WWMAUM>' + inputRecords[nextItem].WWMAUM + '</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                        _this.executeXMLHttp(inputRecords, itemIndex, strXml).then(function (response) {
                            nextItem++;
                            console.log("G strXml -- SUCCESS---" + strXml);
                            if (nextItem < inputRecords.length) {
                                _this.executeLines(inputRecords, nextItem);
                            }
                            else {
                                _this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
                                _this.gridService.adjustGridHeight("ErrorListGrid", _this.scope.webService.ErrorListGrid.data.length, 500);
                            }
                        });
                    }
                }, function (err) {
                    var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>' + inputRecords[nextItem].CONO + '</cred:company><cred:division>' + inputRecords[nextItem].DIVI + '</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>' + inputRecords[nextItem].W1FACI + '</pcs:W1FACI><pcs:W1ITNO>' + inputRecords[nextItem].W1ITNO + '</pcs:W1ITNO><pcs:W1PCDT>' + inputRecords[nextItem].W1PCDT + '</pcs:W1PCDT><pcs:W1PCTP>' + inputRecords[nextItem].W1PCTP + '</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>' + inputRecords[nextItem].W1STRT + '</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>' + inputRecords[nextItem].WWCSU1 + '</pcs:WWCSU1><pcs:WWMAUM>' + inputRecords[nextItem].WWMAUM + '</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                    _this.executeXMLHttp(inputRecords, itemIndex, strXml).then(function (response) {
                        nextItem++;
                        console.log("G strXml -- FAILURE---" + strXml);
                        if (nextItem < inputRecords.length) {
                            _this.executeLines(inputRecords, nextItem);
                        }
                        else {
                            _this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
                            _this.gridService.adjustGridHeight("ErrorListGrid", _this.scope.webService.ErrorListGrid.data.length, 500);
                        }
                    });
                });
            };
            AppController.prototype.executeXMLHttp = function (inputRecords, itemIndex, strXml) {
                var _this = this;
                var deferred = _this.$q.defer();
                var nextItem = itemIndex;
                var executeOnce = "1";
                var errorString = "";
                var inputRecord = inputRecords[itemIndex];
                this.scope.loadingData = true;
                this.scope.webService.transactionStatus.executeTransactions = true;
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open('POST', 'https://m3prduse1.m3.inforcloudsuite.com/ips/service/PCS_Load', true);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        inputRecord.executionStatus = "success";
                        inputRecord.errorCode = xmlhttp.response;
                        _this.scope.webService.errorText = xmlhttp.responseText;
                        inputRecord.apiResponse = angular.copy(xmlhttp.response);
                        _this.scope.webService.transactionStatus.executeTransactions = false;
                        _this.refreshTransactionStatus();
                        if (xmlhttp.responseText.indexOf("faultstring") > 0) {
                            errorString = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("faultstring") + 12, xmlhttp.responseText.lastIndexOf("faultstring") - 2);
                        }
                        else {
                            errorString = "The Record is processed successfully";
                        }
                        var errorLines = {
                            PRNO: inputRecords[nextItem].W1ITNO, FACI: inputRecords[nextItem].W1FACI, ERRR: errorString
                        };
                        deferred.resolve("G done");
                    }
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 500) {
                        inputRecord.executionStatus = "failure";
                        inputRecord.apiResponse = angular.copy(xmlhttp.response);
                        inputRecord.errorCode = xmlhttp.response;
                        _this.scope.webService.errorText = xmlhttp.responseText;
                        _this.scope.webService.transactionStatus.executeTransactions = false;
                        _this.refreshTransactionStatus();
                        executeOnce = "2";
                        if (xmlhttp.responseText.indexOf("faultstring") > 0) {
                            errorString = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("faultstring") + 12, xmlhttp.responseText.lastIndexOf("faultstring") - 2);
                        }
                        else {
                            errorString = xmlhttp.responseText;
                        }
                        var errorLines = {
                            PRNO: inputRecords[nextItem].W1ITNO, FACI: inputRecords[nextItem].W1FACI, ERRR: errorString
                        };
                        _this.scope.webService.ErrorListGrid.data.push(errorLines);
                        deferred.resolve("G done");
                    }
                };
                xmlhttp.setRequestHeader('Content-Type', 'text/xml');
                xmlhttp.send(strXml);
                return deferred.promise;
            };
            AppController.prototype.executeAsynchronous = function (program, transaction, maxNumberOfRecords, inputRecords, batchSize, index) {
                var _this = this;
                var inputRecordsChunk = inputRecords.slice(index, index + batchSize);
                if (inputRecordsChunk.length > 0) {
                    this.executeAsynchronuslyInBatch(program, transaction, maxNumberOfRecords, inputRecordsChunk).then(function (response) {
                        index = index + batchSize;
                        _this.executeAsynchronous("", "", 0, inputRecords, 10, index);
                    });
                }
                else {
                    this.scope.webService.transactionStatus.executeTransactions = false;
                    this.refreshTransactionStatus();
                    this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
                    this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
                }
            };
            AppController.prototype.executeAsynchronuslyInBatch = function (program, transaction, maxNumberOfRecords, inputRecords) {
                var _this = this;
                var deferred = this.$q.defer();
                var promises = [];
                var itemIndex = 0;
                this.scope.loadingData = true;
                this.scope.webService.transactionStatus.executeTransactions = true;
                inputRecords.forEach(function (record) {
                    record.executionStatus = "";
                    record.errorCode = "";
                    record.apiResponse = "";
                    var promise1 = _this.appService.getPDS001(record.CONO, record.DIVI, record.W1FACI, record.W1ITNO, record.W1PCDT, "100", record.W1PCTP, record.W1RORN, record.W1VASE, record.WWCSU1, record.WWMAUM).then(function (val) {
                        if (!angular.equals("", val.W1ITNO) && !angular.equals("", val.W1PCDT)) {
                            var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>' + val.CONO + '</cred:company><cred:division>' + val.DIVI + '</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>' + val.W1FACI + '</pcs:W1FACI><pcs:W1ITNO>' + val.W1ITNO + '</pcs:W1ITNO><pcs:W1PCDT>' + val.W1PCDT + '</pcs:W1PCDT><pcs:W1PCTP>' + val.W1PCTP + '</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>' + val.W1STRT + '</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>' + val.WWCSU1 + '</pcs:WWCSU1><pcs:WWMAUM>' + val.WWMAUM + '</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                            _this.executeAsynchronouslyXMLHttp(strXml, record).then(function (response) {
                            });
                        }
                    }).finally(function () {
                    });
                    promises.push(promise1);
                });
                this.$q.all(promises).finally(function () {
                    deferred.resolve();
                    _this.scope.webService.transactionStatus.executeTransactions = false;
                    _this.refreshTransactionStatus();
                });
                return deferred.promise;
            };
            AppController.prototype.executeAsynchronouslyXMLHttp = function (strXml, inputRecords) {
                var _this = this;
                var deferred = _this.$q.defer();
                var executeOnce = "1";
                var errorString = "";
                var inputRecord = inputRecords;
                this.scope.loadingData = true;
                this.scope.webService.transactionStatus.executeTransactions = true;
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open('POST', 'https://m3prduse1.m3.inforcloudsuite.com/ips/service/PCS_Load', true);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        inputRecord.executionStatus = "success";
                        inputRecord.errorCode = xmlhttp.response;
                        inputRecord.apiResponse = angular.copy(xmlhttp.response);
                        _this.scope.webService.errorText = xmlhttp.responseText;
                        _this.scope.webService.transactionStatus.executeTransactions = false;
                        _this.refreshTransactionStatus();
                        if (xmlhttp.responseText.indexOf("faultstring") > 0) {
                            errorString = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("faultstring") + 12, xmlhttp.responseText.lastIndexOf("faultstring") - 2);
                        }
                        else {
                            errorString = "The Record is processed successfully";
                        }
                        var errorLines = {
                            PRNO: inputRecord.W1ITNO, FACI: inputRecord.W1FACI, ERRR: errorString
                        };
                        _this.scope.webService.ErrorListGrid.data.push(errorLines);
                    }
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 500) {
                        executeOnce = "2";
                        inputRecord.executionStatus = "failure";
                        inputRecord.errorCode = xmlhttp.response;
                        inputRecord.apiResponse = angular.copy(xmlhttp.response);
                        _this.scope.webService.errorText = xmlhttp.responseText;
                        _this.scope.webService.transactionStatus.executeTransactions = false;
                        _this.refreshTransactionStatus();
                        if (xmlhttp.responseText.indexOf("faultstring") > 0) {
                            errorString = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("faultstring") + 12, xmlhttp.responseText.lastIndexOf("faultstring") - 2);
                        }
                        else {
                            errorString = "The Record is created successfully";
                        }
                        var errorLines = {
                            PRNO: inputRecord.W1ITNO, FACI: inputRecord.W1FACI, ERRR: errorString
                        };
                        _this.scope.webService.ErrorListGrid.data.push(errorLines);
                    }
                };
                xmlhttp.setRequestHeader('Content-Type', 'text/xml');
                xmlhttp.send(strXml);
                deferred.resolve("G done");
                return deferred.promise;
            };
            AppController.prototype.removeBlankInputs = function (requestData) {
                for (var inputName in requestData) {
                    var inputValue = requestData[inputName];
                    if (angular.isString(inputValue) && angular.equals("", inputValue.trim())) {
                        requestData[inputName] = undefined;
                    }
                }
                return requestData;
            };
            AppController.prototype.callWebServiceOne = function () {
                this.scope.webService.inputItems = true;
                this.scope.webService.inputDataGrid.data = [];
            };
            AppController.$inject = ["$scope", "configService", "AppService", "RestService", "StorageService", "GridService", "m3UserService", "languageService", "$uibModal", "$interval", "$timeout", "$filter", "$q", "$window", "m3FormService", "$location", "$http"];
            return AppController;
        }());
        application.AppController = AppController;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
