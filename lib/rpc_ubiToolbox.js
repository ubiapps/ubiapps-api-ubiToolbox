(function () {
  var _impl = require("./ubiToolbox_impl");

  var RPCWebinosService = require('webinos-jsonrpc2').RPCWebinosService;

  var UbiToolboxService = function (rpcHandler, params) {
    // inherit from RPCWebinosService
    this.base = RPCWebinosService;
    this.base({
      api: 'http://ubiapps.com/api/ubitoolbox',
      displayName: "ubiToolbox",
      description: 'UbiApps UbiToolbox API.'
    });

    this.rpcHandler = rpcHandler;
  };

  UbiToolboxService.prototype = new RPCWebinosService;

  UbiToolboxService.prototype.getAppStore = function (params, successCB, errorCB) {
    return _impl.getAppStore(params[0], successCB, errorCB);
  };

  UbiToolboxService.prototype.buildApp = function (params, successCB, errorCB) {
    return _impl.buildApp(params[0], successCB, errorCB);
  };

  UbiToolboxService.prototype.getDataSets = function (params, successCB, errorCB) {
    return _impl.getDataSets(successCB, errorCB);
  };

  UbiToolboxService.prototype.getDataSet = function (params, successCB, errorCB) {
    return _impl.getDataSet(params[0], successCB, errorCB);
  };

  UbiToolboxService.prototype.addDataService = function (params, successCB, errorCB) {
    return _impl.addDataService(params[0], successCB, errorCB);
  };

  UbiToolboxService.prototype.addCKANService = function (params, successCB, errorCB) {
    return _impl.addCKANService(params[0], params[1], successCB, errorCB);
  };

  UbiToolboxService.prototype.removeService = function (params, successCB, errorCB) {
    return _impl.removeService(params[0], successCB, errorCB);
  };

  UbiToolboxService.prototype.getURL = function (params, successCB, errorCB) {
    return _impl.getURL(params[0], successCB, errorCB);
  };

  UbiToolboxService.prototype.postURL = function (params, successCB, errorCB) {
    return _impl.postURL(params[0], params[1], successCB, errorCB);
  };

  UbiToolboxService.prototype.listSheets = function (params, successCB, errorCB) {
    return _impl.listSheets(successCB, errorCB);
  };

  UbiToolboxService.prototype.getSheet = function (params, successCB, errorCB) {
    return _impl.getSheet(params[0], successCB, errorCB);
  };

  UbiToolboxService.prototype.saveSheet = function (params, successCB, errorCB) {
    return _impl.saveSheet(params[0], successCB, errorCB);
  };

  UbiToolboxService.prototype.deleteSheet = function (params, successCB, errorCB) {
    return _impl.deleteSheet(params[0], successCB, errorCB);
  };

  // export our object
  exports.Service = UbiToolboxService;
})();
