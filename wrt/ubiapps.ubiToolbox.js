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
    this.listSheets = listSheets;
    this.getSheet = getSheet;
    this.saveSheet = saveSheet;

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

  var listSheets = function(successCB, errorCB) {
    doRPC.call(this,"listSheets", [], successCB, errorCB);
  };

  var getSheet = function(id, successCB, errorCB) {
    doRPC.call(this,"getSheet", [id], successCB, errorCB);
  };

  var saveSheet = function(json, successCB, errorCB) {
    doRPC.call(this,"saveSheet",[json], successCB, errorCB);
  };
}());
