/*******************************************************************************
 *  Code contributed to the webinos project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright 2013 Sony Mobile Communications
 *
 ******************************************************************************/
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
