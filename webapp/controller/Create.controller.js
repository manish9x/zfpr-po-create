sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageBox) => {
    "use strict";

    return Controller.extend("com.intel.fpr.zfprpocreate.controller.Create", {
        onInit() {
            this.initializeData();
        },

        initializeData: function () {
            var Data = {
                "createProjectData": {
                    "items": [
                        {
                            "SrNumber": "1",
                            "ProjectDefinition": "FC00001",
                            "ProjectDefinitionDescription": "ProjectDefinitionFC00001"
                        },
                        {
                            "SrNumber": "2",
                            "ProjectDefinition": "FC00002",
                            "ProjectDefinitionDescription": "ProjectDefinitionFC00002"
                        },
                        {
                            "SrNumber": "3",
                            "ProjectDefinition": "FC00003",
                            "ProjectDefinitionDescription": "ProjectDefinitionFC00003"
                        },
                        {
                            "SrNumber": "4",
                            "ProjectDefinition": "FC00004",
                            "ProjectDefinitionDescription": "ProjectDefinitionFC00004"
                        },
                        {
                            "SrNumber": "5",
                            "ProjectDefinition": "FC00005",
                            "ProjectDefinitionDescription": "ProjectDefinitionFC00005"
                        },
                        {
                            "SrNumber": "6",
                            "ProjectDefinition": "FC00006",
                            "ProjectDefinitionDescription": "ProjectDefinitionFC00006"
                        }
                    ],
                    "businessUnit": [
                        { key: "V1", text: "01" },
                        { key: "V2", text: "02" },
                        { key: "V3", text: "03" },
                        { key: "V4", text: "04" }
                    ]
                },

            };
            var oModel = new JSONModel(Data);
            this.getView().setModel(oModel, "lineItemsModel");
        },

        onRowSelect: function(oEvent) {
            var oSelectedItem = oEvent.getSource().getSelectedItem();
            var oContext = oSelectedItem.getBindingContext();
            var oData = oContext.getObject();
          
 
            // Navigate to the next screen with the selected row data
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo('Detail', {
                data: JSON.stringify(oData)
            });
        },

        onNextSPPress: function () {
            var oTable = this.byId("idSelectProjectTable");
            // resourceBundle = this._getResourceBundle();
            if (oTable.getSelectedIndices().length < 1) {
                // let errorMessage = resourceBundle.getText("NoRowSelected");
                // MessageBox.information(errorMessage, {
                //     title: "Error"
                // });
                MessageBox.error("No Rows Selected");

            } else {
                // this.busyDialog.open();
                this.checkValidation(oTable.getSelectedIndices());

            }
        },

        // Method to do the validation for the selected record

        checkValidation: function (recordSelected) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TargetChangeOrder", {});
            var tableData = this.getView().getModel("lineItemsModel").getProperty("/createProjectData");
            var selectedArray = [];
            for (let i = 0; i < recordSelected.length; i++) {
                let iIndexSelected = recordSelected[i];

                selectedArray.push(tableData.items[iIndexSelected]);

            }
            this.getView().getModel("lineItemsModel").refresh();
            this.getView().getModel("lineItemsModel").setProperty("/ChangeOrderData", selectedArray);
            // this.getView().getModel("lineItemsModel").setProperty("/submitButtonEnabled", noErrorFound);

        },

        businessUnit: function () {
            oModel.callFunction("/demo",

                // function import name
                {
                    method: "Get",
                    // callback function for success
                    success: function (oData, response) {
                        this.getOwnerComponent().getModel("lineItemsModel").setProperty("/businessUnit", oData.businessUnit);
                    }.bind(this),

                    // callback function for error
                    error: function (oError) {
                        try {
                            var errorResponse = JSON.parse(oError.responseText);
                            var errorMessage = errorResponse.error.message.value;

                            MessageBox.error(errorMessage);
                        } catch (e) {
                            MessageBox.error(oError.responseText);

                            //"An error occurred while processing the error message.           } finally {

                        }

                    }.bind(this)
                });
        },

        projectDefinition: function () {
            oModel.callFunction("/projectdemo",

                // function import name
                {
                    method: "Get",
                    // callback function for success
                    success: function (oData, response) {
                        this.getOwnerComponent().getModel("lineItemsModel").setProperty("/projectDefinition", oData.businessUnit);
                    }.bind(this),

                    // callback function for error
                    error: function (oError) {
                        try {
                            var errorResponse = JSON.parse(oError.responseText);
                            var errorMessage = errorResponse.error.message.value;

                            MessageBox.error(errorMessage);
                        } catch (e) {
                            MessageBox.error(oError.responseText);

                            //"An error occurred while processing the error message.

                        }

                    }.bind(this)
                });
        },

    });
});