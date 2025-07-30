sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",

], (Controller, JSONModel, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("com.intel.fpr.zfprpocreate.controller.Create", {
        onInit() {
            this.initializeData();
            this.initializeData2();
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


        onAddRowPress: function(){
            var oModel = this.getView().getModel("lineItemsModel");
            var aItems = oModel.getProperty("/ChangeOrderData/items");
            
            // Add a new row
            aItems.push({ "CR_Grouping": "",
                            "WBS_Element": "",
                            "WBS Element Description": "",
                            "Project Definition": "",
                            "Change Request Type": "",
                            "Change Request Title": "",
                            "Status": "",
                            "Impact": "",
                            "Existing Purchase Order": "",
                            "Refernce CR": "",
                            "Material Commit": 0,
                            "Labor Commit": 0,
                            "Equipment Commit": 0,
                            "Proposed Total Commit": "",
                            "Trans Currency": "",
                            "Proposed Commit": ""});

            // Update the model
            oModel.setProperty("/ChangeOrderData/items", aItems);
            MessageToast.show("New row added.");
        },

        onDeleteRowPress: function(oEvent) {
            // Get the table and model
            var oTable = this.byId("myTable1");
            var oModel = this.getView().getModel("lineItemsModel");
         
            // Get the selected index
            var iSelectedIndex = oTable.getSelectedIndex();
            if (iSelectedIndex > -1) {
                var oContext = oTable.getContextByIndex(iSelectedIndex);
                var sPath = oContext.getPath(); 
                var aItems = oModel.getProperty("/ChangeOrderData/items");
                var iIndex = parseInt(sPath.split("/").pop(), 10);
                aItems.splice(iIndex, 1);
                oModel.setProperty("/ChangeOrderData/items", aItems);
                oTable.clearSelection();
                MessageToast.show("Row deleted.");
            } else {
                MessageToast.show("Please select a row to delete.");
            }
        },


        //Value Help for Project Definition
        onVHRequestedProjectDefinition: function(oEvent) {
            var that = this;
            if (!this.f4DepartmentIdFrag) {
                this.f4DepartmentIdFrag = sap.ui.xmlfragment(this.getView().createId("idF4MPMFamilyHelpList"), "com.intel.fpr.zfprpocreate.view.fragments.ProjectDefinition", this);
                this.f4DepartmentIdFrag.addStyleClass("sapUiSizeCompact");
                this.getView().addDependent(this.f4DepartmentIdFrag);
            }
            this.f4DepartmentIdFrag.open();
        },

        //Method to search  Project Definition
        handleVHProjectDefinitionSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter("DepartmentId", sap.ui.model.FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**                               
         * Method triggered when Project Definition is selected from F4 Fragment.
         * @public
         * @param {oEvent}
         */
        onProjectDefinitionVHSelected: function (oEvent) {
            var oObjectSelected = oEvent.getParameter("selectedItem").getBindingContext().getObject();
            this.getView().getModel("UITPRModel").setProperty("/DepartmentId", oObjectSelected.DepartmentId);
            // this.checkExecuteBtnEnabled();   
        },

        //Value Help for WBS Element
        onVHWBSElementId: function(oEvent) {
            var that = this;
            if (!this.f4DepartmentIdFrag) {
                this.f4DepartmentIdFrag = sap.ui.xmlfragment(this.getView().createId("idF4MPMFamilyHelpList"), "com.intel.fpr.zfprpocreate.view.fragments.WBSElement", this);
                this.f4DepartmentIdFrag.addStyleClass("sapUiSizeCompact");
                this.getView().addDependent(this.f4DepartmentIdFrag);
            }
            this.f4DepartmentIdFrag.open();
        },

        //Method to search  Existing Purchase Order
        handleVHBSElementSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter("DepartmentId", sap.ui.model.FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**                               
         * Method triggered when  Existing Purchase Order is selected from F4 Fragment.
         * @public
         * @param {oEvent}
         */
        onWBSElementIdVHSelected: function (oEvent) {
            var oObjectSelected = oEvent.getParameter("selectedItem").getBindingContext().getObject();
            this.getView().getModel("UITPRModel").setProperty("/DepartmentId", oObjectSelected.DepartmentId);
            // this.checkExecuteBtnEnabled();   
        },

        //Value Help for  Existing Purchase Order
        onVHExistPODefinition(oEvent) {
            var that = this;
            if (!this.f4DepartmentIdFrag) {
                this.f4DepartmentIdFrag = sap.ui.xmlfragment(this.getView().createId("idF4MPMFamilyHelpList"), "com.intel.fpr.zfprpocreate.view.fragments.ExistPurchaseOrder", this);
                this.f4DepartmentIdFrag.addStyleClass("sapUiSizeCompact");
                this.getView().addDependent(this.f4DepartmentIdFrag);
            }
            this.f4DepartmentIdFrag.open();
        },

        //Method to search   Existing Purchase Order
        handleVHExistPOSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter("DepartmentId", sap.ui.model.FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**                               
         * Method triggered when Project Definition is selected from F4 Fragment.
         * @public
         * @param {oEvent}
         */
        onExistPOVHSelected: function (oEvent) {
            var oObjectSelected = oEvent.getParameter("selectedItem").getBindingContext().getObject();
            this.getView().getModel("UITPRModel").setProperty("/DepartmentId", oObjectSelected.DepartmentId);
            // this.checkExecuteBtnEnabled();   
        },

        initializeData2: function () {
            var dropDown = {
                Impact: [{ key: "DHL", text: "DHL" },
                { key: "UPS", text: "UPS" },
                { key: "FedEx", text: "FedEx" }],
            };
            var Data = {
                "ChangeOrderData": {
                    "items": [
                        {
                            "CR_Grouping": "1",
                            "WBS_Element": "C2",
                            "WBS Element Description": "Office",
                            "Project Definition": "FC2",
                            "Change Request Type": "CO",
                            "Change Request Title": "CPM CO",
                            "Status": "Pending",
                            "Impact": "",
                            "Existing Purchase Order": "6200",
                            "Refernce CR": "",
                            "Material Commit": 200,
                            "Labor Commit": 200,
                            "Equipment Commit": 222,
                            "Proposed Total Commit": "600",
                            "Trans Currency": "CAP",
                            "Proposed Commit": "400"
                        },
                        {
                            "CR Grouping": "2",
                            "WBS Element": "C2",
                            "WBS Element Description": "Office",
                            "Project Definition": "FC2",
                            "Change Request Type": "CO",
                            "Change Request Title": "CPM CO",
                            "Status": "Pending",
                            "Impact": [{ key: "DHL", text: "DHL" },
                            { key: "UPS", text: "UPS" },
                            { key: "FedEx", text: "FedEx" }],
                            "Existing Purchase Order": "6200",
                            "Refernce CR": "",
                            "Material Commit": 300,
                            "Labor Commit": 300,
                            "Equipment Commit": 333,
                            "Proposed Total Commit": "600",
                            "Trans Currency": "CAP",
                            "Proposed Commit": "400"
                        },
                        {
                            "CR Grouping": "3",
                            "WBS Element": "C2",
                            "WBS Element Description": "Office",
                            "Project Definition": "FC2",
                            "Change Request Type": "CO",
                            "Change Request Title": "CPM CO",
                            "Status": "Pending",
                            "Impact": "",
                            "Existing Purchase Order": "6200",
                            "Refernce CR": "",
                            "Material Commit": 400,
                            "Labor Commit": 400,
                            "Equipment Commit": 444,
                            "Proposed Total Commit": "600",
                            "Trans Currency": "CAP",
                            "Proposed Commit": "400"
                        },
                        {
                            "CR Grouping": "4",
                            "WBS Element": "C2",
                            "WBS Element Description": "Office",
                            "Project Definition": "FC2",
                            "Change Request Type": "CO",
                            "Change Request Title": "CPM CO",
                            "Status": "Pending",
                            "Impact": "",
                            "Existing Purchase Order": "6200",
                            "Refernce CR": "",
                            "Material Commit": 500,
                            "Labor Commit": 500,
                            "Equipment Commit": 555,
                            "Proposed Total Commit": "600",
                            "Trans Currency": "CAP",
                            "Proposed Commit": "400"
                        }
                    ],
                },

            };

            Data.ChangeOrderData.items.forEach(function (row) { row["Proposed Total Commit"] = row["Material Commit"] + row["Labor Commit"] + row["Equipment Commit"]; });
            console.log(Data)

            var oModel = new JSONModel(Data);
            this.getView().setModel(oModel, "lineItemsModel");

            var odropDownModel = new JSONModel(dropDown);
            this.getView().setModel(odropDownModel, "dropDownModel");
        },

        onValueChange: function (oEvent) {
            var ValueChange = oEvent.getParameter("value");
            var oObject = oEvent.getSource().getBindingContext("lineItemsModel").getObject();
            var sPath = oEvent.getSource().getBindingInfo("value").binding.getPath();

            // if (!Number.isInteger(ValueChange)) {

            if (ValueChange.includes('.')) {
                MessageBox.error("Only Integer Values are allowed");
                oObject[sPath] = parseInt(ValueChange);
                this.getView().getModel("lineItemsModel").refresh();
                return;
            }

            if (sPath === "Material Commit") {
                oObject["Proposed Total Commit"] = parseInt(ValueChange) + parseInt(oObject["Labor Commit"]) + parseInt(oObject["Equipment Commit"])
            }
            if (sPath === "Labor Commit") {
                oObject["Proposed Total Commit"] = parseInt(ValueChange) + parseInt(oObject["Material Commit"]) + parseInt(oObject["Equipment Commit"])
            }
            if (sPath === "Equipment Commit") {
                oObject["Proposed Total Commit"] = parseInt(ValueChange) + parseInt(oObject["Labor Commit"]) + parseInt(oObject["Material Commit"])
            }
            this.getView().getModel("lineItemsModel").refresh();

        },

        onPressBulkUpload: function () {

            if (!this.bulkUploadDialogFrag) {
                this.bulkUploadDialogFrag = sap.ui.xmlfragment(this.getView().createId("idBulkUploadDialog"), "com.intel.fpr.zfprpocreate.view.fragments.BulkUploadDialog", this);
                this.bulkUploadDialogFrag.addStyleClass("sapUiSizeCompact");
                this.getView().addDependent(this.bulkUploadDialogFrag);
            }
            this.bulkUploadDialogFrag.open();

        },

        /*On Close of Bulk Upload Dialog*/
        onCloseBulkUploadDialog: function () {
            // this.byId("bulkUploadDialog").close();
            this.bulkUploadDialogFrag.close();
        },

        /*Method triggered when USER browse file to Upload*/
        onFileChange: function (oEvent) {
            var file = oEvent.getParameter("files")[0];
            this.FileName = oEvent.getParameter("files")[0].name;
            // oObject.fileType = oEvent.getParameter("files")[0].type;
            var fileReader = new FileReader();
            var readFile = function onReadFile(file) {
                return new Promise(function (resolve) {
                    fileReader.onload = function (loadEvent) {
                        resolve(loadEvent.target.result.match(/,(.*)$/)[1]);
                    };
                    fileReader.readAsDataURL(file);
                });
            };
            var readContent = readFile(file);
            readContent.then((result) => {
                this.Value = result;
            });

        },

        // Function triggered when Upload button is clicked in BulkUpload Fragment.
        onPressUpload: 
        function () {

            this.getView().setBusy(true);
 
            let oFileContent = this.getView().getModel("FileContentModel").getData();
            let oModel = this.getOwnerComponent().getModel("uploadService");
            let oContext = oModel.bindContext("/ApprovalHierarchy/com.sap.gateway.srvd_a2x.zsd_tms_apv_matrix.v0001.UploadFile(...)");
            oContext.setParameter("MimeType", oFileContent.MimeType);
            oContext.setParameter("FileName", oFileContent.FileName);
            oContext.setParameter("Attachment", oFileContent.Attachment);
            oContext.execute().then(function () {
                let oResult = oContext.getBoundContext().getObject();
                this.getView().setBusy(false);
                // if (oResult.MessageText) {
                MessageBox.information(oResult.MessageText);
                // } else {
                oModel.refresh();
                //     MessageToast.show("uploadtemp");
                // }
            }.bind(this), function (oError, oResponse) {
                let aSplitMsg = [];
                
                MessageBox.error(oError.error.message);
                let aExcelUploadErrorMsg = [];
                for (let index = oError.error.details.length - 1; index > 0; index--) {
                    aSplitMsg = oError.error.details[index].message.split(",");
                    aExcelUploadErrorMsg.push(this._prepareMessageViewData(aSplitMsg));
                }
                aSplitMsg = oError.error.message.split(",");;
                aExcelUploadErrorMsg.push(this._prepareMessageViewData(aSplitMsg));
                oModel.refresh();
                this.getView().setBusy(false);
                this._showErrorMessagesDialog(aExcelUploadErrorMsg);
            }.bind(this));
        },
        

        _getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        onDownloadTemplate: function (oEvent) {
            var nameExportFile = this._getResourceBundle().getText("templateName"),
                nameSheetName = this._getResourceBundle().getText("SheetName");
 
            var aRows = [{
                Autopopulated: "Autopopulated",
                Required: "Required",
                Required2: "Required in case Transfer budget type",
                Display: "Display",
                Optional: "Optional"
            }
            ];
 
            const aCols = [
                { label: "CR Grouping", property: "1" },
                { label: "WBS Element", property: "C2" },
                {label: "WBS Element Description", property: "Office" },
                { label: "Project Definition", property: "Required" },
                { label: "Change Request Type", property: "Autopopulated" },
                { label: "Change Request Title", property: "Required2" },
                { label: "Status", property: "Display" },
                { label: "Impact", property: "Autopopulated" },
                { label: "Existing Purchase Order", property: "Autopopulated" },
                { label: "Refernce CR", property: "Autopopulated" },
                { label: "Material Commit", property: "Required" },
                { label: "Labor Commit", property: "Autopopulated" },
                { label: "Equipment Commit", property: "Optional" },
                { label: "Proposed Total Commit", property: "Autopopulated" },
                { label: "Trans Currency", property: "Autopopulated" },
                { label: "Proposed Commit", property: "Autopopulated" }
            ];
 
 
            const oSettings = {
                workbook: {
                    columns: aCols,
                    context: {
                        sheetName: nameSheetName
                    }
                },
                dataSource: aRows,
                fileName: nameExportFile,
                worker: false
            };
            const oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },

    });
});