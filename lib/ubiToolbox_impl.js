(function() {
  var http = require("http");
  var qs = require("querystring");
  var url = require("url");
  var fs = require("fs");
  var path = require("path");
  var existsSync = fs.existsSync || path.existsSync;
  var pzpAPI = require(path.join(require.main.paths[0], "..", "lib", "pzp_sessionHandling.js"));
  var webinosUtilities = require("webinos-utilities");
  var _ckanInstance = "http://datahub.ubiapps.com/";
  var _sheetData;

  // Not sure why this is needed - copied it from messageProcessing.js
  var concatBufferAndroid = function(list, length) {
    // from v0.8/lib/buffer.js
    if (!Array.isArray(list)) {
      throw new Error('Usage: Buffer.concat(list, [length])');
    }

    if (list.length === 0) {
      return new Buffer(0);
    } else if (list.length === 1) {
      return list[0];
    }

    if (typeof length !== 'number') {
      length = 0;
      for (var i = 0; i < list.length; i++) {
        var buf = list[i];
        length += buf.length;
      }
    }

    var buffer = new Buffer(length);
    var pos = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      buf.copy(buffer, pos);
      pos += buf.length;
    }
    return buffer;
  };

  var concatBuffer = process.platform === 'android' ? concatBufferAndroid : Buffer.concat;

  var getJSONRequest = function(endpoint, successCB, errorCB) {
    http.get(endpoint, function(res) {
      var chunks = [];
      res.on('data', function(chunk) {
        chunks.push(chunk);
      }).on('end', function() {
          var body = Buffer.concat(chunks).toString();
          try {
            var jsonBody = JSON.parse(body);
            successCB(jsonBody);
          } catch (e) {
            errorCB(e);
          }
        });
    }).on("error", errorCB);
  };

  var getAppStore = function(storeURL, successCB, errorCB) {
    getJSONRequest(storeURL,successCB,errorCB);
  };

  var buildApp = function(options, successCB, errorCB) {
    var builderLookup = "ubiapps-appbuilder-" + options.appType;
    try {
      var builder = require(builderLookup);
      builder.buildApp(options, function(res,err) {
        if (err !== null) {
          errorCB(err);
        } else {
          successCB(res);
        }
      });
    } catch(e) {
      errorCB(new Error("failed to load builder for app type " + options.appType));
    }
  };

  var getDataSets = function(successCB, errorCB) {
    var packageListEndpoint = _ckanInstance + "api/3/action/package_list";
    getJSONRequest(packageListEndpoint,successCB,errorCB);
  };

  var getDataSet = function(dataSet,successCB, errorCB) {
    var packageShowEndpoint = _ckanInstance + "api/3/action/package_show?id=" + dataSet;
    getJSONRequest(packageShowEndpoint,successCB,errorCB);
  };

  var doAddDataService = function(params, successCB, errorCB) {
    var configFilePath = path.join(pzpAPI.getMetaData("webinosRoot"), "userData", "ubiapps-api-ckanAdapter", "config.json");
    var currentConfig = JSON.parse(fs.readFileSync(configFilePath)).params.instances;
    var found = false;
    for (var cfg in currentConfig) {
      if (currentConfig[cfg].params.resourceName === params.resourceName) {
        console.log("ignoring new data service as already exists: " + params.resourceName);
        found = true;
        break;
      }
    }
    if (!found) {
      var lst = currentConfig.concat([ { params: params }]);
      pzpAPI.setServiceConfiguration(null, "http://ubiapps.com/api/ckanadapter", lst);
      successCB();
    } else {
      errorCB(new Error("service already exists for resource '" + params.resourceName + "'"));
    }
  };

  var addCKANService = function(name, resourceId, successCB, errorCB) {
    var resourceShowEndpoint = _ckanInstance + "api/3/action/resource_show?id=" + resourceId;
    var resourceDetails = function(resp) {
      if (resp.success === true) {
        doAddDataService({ resourceName: name, resourceId: resourceId, datastore: resp.result.datastore_active, format: resp.result.format }, successCB, errorCB);
      } else {
        errorCB(resp.error);
      }
    };
    getJSONRequest(resourceShowEndpoint,resourceDetails,errorCB);
  };

  var addDataService = function(dataSet, successCB, errorCB) {
    doAddDataService({ resourceName: dataSet }, successCB, errorCB);
  };

  var removeService = function(serviceDef, successCB, errorCB) {
    var configFilePath = path.join(pzpAPI.getMetaData("webinosRoot"), "userData", "ubiapps-api-ckanAdapter", "config.json");
    var currentConfig = JSON.parse(fs.readFileSync(configFilePath)).params.instances;
    var found = false;
    for (var i = 0, len = currentConfig.length; i < len; i++) {
      if (currentConfig[i].id === serviceDef.id) {
        found = true;
        break;
      }
    }
    if (found) {
      currentConfig.splice(i,1);
      pzpAPI.setServiceConfiguration(null, "http://ubiapps.com/api/ckanadapter", currentConfig);
      successCB();
    } else {
      errorCB(new Error("service not found " + JSON.stringify(serviceDef)));
    }
  }

  var getURL = function(endpoint, successCB, errorCB) {
    http.get(endpoint, function(res) {
      var chunks = [];
      res.on('data', function(chunk) {
        chunks.push(chunk);
      }).on('end', function() {
          var body = Buffer.concat(chunks).toString();
          successCB(body);
        });
    }).on("error", errorCB);
  };

  var postURL = function(endpoint, data, successCB, errorCB) {
    var postData = JSON.stringify(data);
    var urlParsed = url.parse(endpoint);
    var postOptions = {
      host: urlParsed.hostname,
      port: urlParsed.port,
      path: urlParsed.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    var postReq = http.request(postOptions, function(res) {
      var chunks = [];
      res.on('data', function(chunk) {
        chunks.push(chunk);
      });
      res.on('end', function() {
        var body = concatBuffer(chunks).toString();
        if (typeof successCB === "function") {
          successCB(body);
        }
      });
    });
    postReq.on("error", errorCB || function() {});

    // post the data
    postReq.write(postData);
    postReq.end();
  };

  var loadSheets = function() {
    if (typeof _sheetData === "undefined") {
      var sheetFile = path.join(webinosUtilities.webinosPath.webinosPath(),"userData","sheets.json");
      if (!existsSync(sheetFile)) {
        _sheetData = {};
      } else {
        _sheetData = JSON.parse(fs.readFileSync(sheetFile));
      }
    }
    return _sheetData;
  };

  var saveSheets = function() {
    var sheetFile = path.join(webinosUtilities.webinosPath.webinosPath(),"userData","sheets.json");
    fs.writeFileSync(sheetFile,JSON.stringify(_sheetData,null,2));
  };

  var listSheets = function(successCB, errorCB) {
    var sheets = loadSheets();
    var sheetList = [];
    for (var sheet in sheets) {
      if (sheets.hasOwnProperty(sheet)) {
        sheetList.push({
          id: sheets[sheet].id,
          classId: sheets[sheet].classId,
          title: sheets[sheet].title
        });
      }
    }
    process.nextTick(function() {
      successCB(sheetList);
    });
  };

  var getSheet = function(id, successCB, errorCB) {
    var sheets = loadSheets();
    if (sheets.hasOwnProperty(id)) {
      process.nextTick(function() {
        successCB(sheets[id]);
      });
    } else {
      process.nextTick(function() {
        errorCB(new Error("no sheet found with id " + id));
      })
    }
  };

  var saveSheet = function(sheetData, successCB, errorCB) {
    var sheets = loadSheets();
    if (sheets.hasOwnProperty(sheetData.id)) {
      console.log("overwriting sheet " + sheetData.id);
    }
    sheets[sheetData.id] = sheetData;
    saveSheets();
    process.nextTick(function() {
      successCB();
    });
  };

  var deleteSheet = function(sheetId, successCB, errorCB) {
    var sheets = loadSheets();
    if (sheets.hasOwnProperty(sheetId)) {
      console.log("deleting sheet " + sheetId);
    }
    delete sheets[sheetId];
    saveSheets();
    process.nextTick(function() {
      successCB();
    });
  };

  module.exports = {
    getAppStore: getAppStore,
    buildApp: buildApp,
    getDataSets: getDataSets,
    getDataSet: getDataSet,
    addDataService: addDataService,
    addCKANService: addCKANService,
    removeService: removeService,
    getURL: getURL,
    postURL: postURL,
    listSheets: listSheets,
    getSheet: getSheet,
    saveSheet: saveSheet,
    deleteSheet: deleteSheet
  };
}());