sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/intel/fpr/zfprpocreate/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.intel.fpr.zfprpocreate.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            this.setModel(models.createCommonModel(), "Common");

            // enable routing
            this.getRouter().initialize();
            sap.ui.core.routing.HashChanger.getInstance().replaceHash("");
        }
    });
});