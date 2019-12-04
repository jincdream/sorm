if(!self.__appxInited) {
self.__appxInited = 1;
require('@alipay/appx-compiler/lib/sjsEnvInit');

require('./config$');


var AFAppX = self.AFAppX.getAppContext
  ? self.AFAppX.getAppContext().AFAppX
  : self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;
self.requirePlugin = AFAppX.requirePlugin;
        

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}

if(AFAppX.compilerConfig){ AFAppX.compilerConfig.component2 = true; }

function success() {
require('../../app');
require('../../demo/dist/field/field?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../demo/dist/sorm/sorm?hash=c4b0edf8c04b652d90eb3e0e4bcb8eb1dcbcd9f8');
require('../../demo/fields/fields?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../demo/index/index?hash=af81ae0f40e619a2515574e6c6ac1378e304639f');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}