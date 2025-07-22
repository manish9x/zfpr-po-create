sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
], (Controller, JSONModel, MessageToast, MessageBox, Spreadsheet) => {
    "use strict";

    return Controller.extend("com.intel.fpr.zfprpocreate.controller.ChangeOrder", {
        onInit() {
            this.initializeData();
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

        initializeData: function () {
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


        onBackCOPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCreate", {});
        },
        onPressCONext: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TargetPODetails", {});
        }
    });
});