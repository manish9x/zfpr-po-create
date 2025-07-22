sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("com.intel.fpr.zfprpocreate.controller.PODetails", {
        onInit() {
            this.initializeData();
        },

        initializeData: function(){
            var Data = {
                "PODetailsData": {
                    "items": [
                        {
                            "CR":"1",
                            "Doc Type":"C2",
                            "Supplier ID":"Office",
                            "Plant":"FC2",
                            "Currency":"CO",
                            "Purchasing Group":"CPM CO",
                            "Company Code":"Pending",
                            "Purchase Org":"",
                            "Currency":"6200",
                            "Storage Location":"",
                            "Item Category":"300",
                            "AAC":"300",
                            "Limit":"333",
                            "Overall Limit":"600",
                            "Material Group":"CAP",
                            "AAC":"400",
                            "GL":""
                        },
                        {
                            "CR":"2",
                            "Doc Type":"C3",
                            "Supplier ID":"Office",
                            "Plant":"FC3",
                            "Currency":"CO",
                            "Purchasing Group":"CPM CO",
                            "Company Code":"Pending",
                            "Purchase Org":"",
                            "Currency":"6200",
                            "Storage Location":"",
                            "Item Category":"300",
                            "AAC":"300",
                            "Limit":"333",
                            "Overall Limit":"600",
                            "Material Group":"CAP",
                            "AAC":"400",
                            "GL":""
                        },
                        {
                            "CR":"3",
                            "Doc Type":"C4",
                            "Supplier ID":"Office",
                            "Plant":"FC3",
                            "Currency":"CO",
                            "Purchasing Group":"CPM CO",
                            "Company Code":"Pending",
                            "Purchase Org":"",
                            "Currency":"6200",
                            "Storage Location":"",
                            "Item Category":"300",
                            "AAC":"300",
                            "Limit":"333",
                            "Overall Limit":"600",
                            "Material Group":"CAP",
                            "AAC":"400",
                            "GL":""
                        }                                
                    ]
                },

            };
 
            var oModel = new JSONModel(Data);
            this.getView().setModel(oModel, "lineItemsModel");
        },
        
        onPressNextPODetails: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);          
                oRouter.navTo("TargetSelectApprover", {});            
        },
        onPressBackPODetails: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);          
                oRouter.navTo("TargetChangeOrder", {});            
        }
    });
});