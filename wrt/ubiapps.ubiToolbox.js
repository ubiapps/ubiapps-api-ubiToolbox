(function () {

  function UbiToolboxModule(obj) {
    WebinosService.call(this,obj);
  };

  UbiToolboxModule.prototype = Object.create(WebinosService.prototype);
  UbiToolboxModule.prototype.constructor = UbiToolboxModule;

  // Register to the service discovery
  _webinos.registerServiceConstructor("http://ubiapps.com/api/ubitoolbox", UbiToolboxModule);

  UbiToolboxModule.prototype.bindService = function (bindCB, serviceId) {
    this.getAppStore = getAppStore;
    this.buildApp = buildApp;
    this.getDataSets = getDataSets;
    this.getDataSet = getDataSet;
    this.addDataService = addDataService;
    this.addCKANService = addCKANService;
    this.removeService = removeService;
    this.getURL = getURL;
    this.postURL = postURL;
    this.listSheets = listSheets;
    this.getSheet = getSheet;
    this.saveSheet = saveSheet;
    this.deleteSheet = deleteSheet;

    if (typeof bindCB.onBind === 'function') {
      bindCB.onBind(this);
    }
  };

  var doRPC = function(method,params,successCB,errorCB) {
    var rpc = webinos.rpcHandler.createRPC(this, method, params);
    webinos.rpcHandler.executeRPC(rpc,
      function (res) {
        if (typeof successCB !== 'undefined') {
          successCB(res);
        }
      },
      function (err) {
        if (typeof errorCB !== 'undefined') {
          errorCB(err);
        }
      }
    );
  };

  var getAppStore = function(storeURL, successCB, errorCB) {
    doRPC.call(this,"getAppStore",[storeURL],successCB,errorCB);
  };

  var buildApp = function(options, successCB, errorCB) {
    doRPC.call(this,"buildApp",[options],successCB,errorCB);
  };

  var getDataSets = function(successCB, errorCB) {
    doRPC.call(this,"getDataSets",[],successCB,errorCB);
  };

  var getDataSet = function(dataSet, successCB, errorCB) {
    doRPC.call(this,"getDataSet",[dataSet],successCB,errorCB);
  };

  var addDataService = function(dataSet, successCB, errorCB) {
    doRPC.call(this,"addDataService",[dataSet],successCB,errorCB);
  };

  var addCKANService = function(name, resourceId, successCB, errorCB) {
    doRPC.call(this,"addCKANService",[name, resourceId],successCB,errorCB);
  };

  var removeService = function(serviceDef, successCB, errorCB) {
    doRPC.call(this,"removeService",[serviceDef], successCB, errorCB);
  };

  var getURL = function(url, successCB, errorCB) {
    doRPC.call(this,"getURL",[url], successCB, errorCB);
  };

  var postURL = function(url, data, successCB, errorCB) {
    doRPC.call(this,"postURL",[url, data], successCB, errorCB);
  };

  var listSheets = function(successCB, errorCB) {
    doRPC.call(this,"listSheets", [], successCB, errorCB);
  };

  var getSheet = function(id, successCB, errorCB) {
    doRPC.call(this,"getSheet", [id], successCB, errorCB);
  };

  var saveSheet = function(json, successCB, errorCB) {
    doRPC.call(this,"saveSheet",[json], successCB, errorCB);
  };

  var deleteSheet = function(id, successCB, errorCB) {
    doRPC.call(this,"deleteSheet",[id], successCB, errorCB);
  };
}());
