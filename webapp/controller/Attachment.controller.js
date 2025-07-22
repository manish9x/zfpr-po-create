sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("com.intel.fpr.zfprpocreate.controller.Attachment", {
        onInit() {
            this.initializeData();
        },

        initializeData: function(){
            var Data = {
                "SelectAttachmentData": {
                    "items": [
                        {
                            "CR":"1",
                            "Name":"Attachment1",
                            "URL":"Local PM",
                        },
                        {
                            "CR":"1",
                            "Name":"Attachment2",
                            "URL":"Local PM",
                        },
                        {
                            "CR":"1",
                            "Name":"Attachment3",
                            "URL":"Local PM",
                        },
                        {
                            "CR":"1",
                            "Name":"Attachment4",
                            "URL":"Local PM",
                        },
                        {
                            "CR":"2",
                            "Name":"Attachment5",
                            "URL":"Local PM",
                        },
                        {
                            "CR":"3",
                            "Name":"Attachment6",
                            "URL":"Local PM",
                        },
                        {
                            "CR":"4",
                            "Name":"Attachment7",
                            "URL":"Local PM",
                        }                              
                    ]
                },

            };
 
            var oModel = new JSONModel(Data);
            this.getView().setModel(oModel, "lineItemsModel");
        },
        
        onPressUpload: function () {

            if (!this.bulkUploadDialogFrag) {
                this.bulkUploadDialogFrag = sap.ui.xmlfragment(this.getView().createId("idBulkUploadDialog"), "com.intel.fpr.zfprpocreate.view.fragments.AttachUploadDialog", this);
                this.bulkUploadDialogFrag.addStyleClass("sapUiSizeCompact");
                this.getView().addDependent(this.bulkUploadDialogFrag);
            }
            this.bulkUploadDialogFrag.open();

        },

        /*On Close of Bulk Upload Dialog*/
        onCloseAttachUploadDialog: function () {
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
        onPressAttachUpload: function () {

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


        onPressNextPODetails: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);          
                oRouter.navTo("", {});            
        },
        onPressBackSelectApprover: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);          
                oRouter.navTo("TargetSelectApprover", {});            
        }
    });
});