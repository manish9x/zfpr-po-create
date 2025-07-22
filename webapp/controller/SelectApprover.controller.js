sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("com.intel.fpr.zfprpocreate.controller.SelectApprover", {
        onInit() {
            this.initializeData();
        },

        initializeData: function(){
            var Data = {
                "SelectApproverData": {
                    "items": [
                        {
                            "CR":"1",
                            "Approver Type":"Finance",
                            "ApproverRole":"PM JB Joe Brown"
                        },
                        {
                            "CR":"1",
                            "Approver Type":"Finance",
                            "ApproverRole":"CW Finance Tom Green"
                        },
                        {
                            "CR":"1",
                            "Approver Type":"Finance",
                            "ApproverRole":"PM JB Joe Brown"
                        },
                        {
                            "CR":"1",
                            "Approver Type":"Finance",
                            "ApproverRole":"Local PM Fill Black"
                        },
                        {
                            "CR":"2",
                            "Approver Type":"Finance",
                            "ApproverRole":"Local PM"
                        },
                        {
                            "CR":"3",
                            "Approver Type":"Finance",
                            "ApproverRole":"Local PM"
                        },
                        {
                            "CR":"4",
                            "Approver Type":"Finance",
                            "ApproverRole":"Local PM"
                        }                          
                    ]
                },

            };
 
            var oModel = new JSONModel(Data);
            this.getView().setModel(oModel, "lineItemsModel");
        },
        
        onPressSaveSelectApprover: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);          
                oRouter.navTo("TargetAttachment", {});            
        },
        onPressBackSelectApprover: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);          
                oRouter.navTo("TargetPODetails", {});            
        }
    });
});