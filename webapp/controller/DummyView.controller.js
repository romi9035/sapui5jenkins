sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
    "use strict";

    return Controller.extend("sap.btp.sapui5.controller.DummyView", {
        /**
         * Called when the view is initialized.
         * Initializes the data model with dummy data.
         * @public
         */
        onInit() {
            // Initialize the data model with dummy data
            const oModel = new JSONModel({
                dummyText: ""
            });
            this.getView().setModel(oModel);
        },

        /**
         * Handles navigation back to the previous view.
         * @public
         */
        onNavBack() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView1");
        },

        /**
         * Handles navigation to View1.
         * @public
         */
        onGoToView1() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView1");
        },

        /**
         * Shows a message with the current input value.
         * @public
         */
        onShowMessage() {
            const oModel = this.getView().getModel();
            const sDummyText = oModel.getProperty("/dummyText");
            
            if (sDummyText && sDummyText.trim()) {
                MessageToast.show("You entered: " + sDummyText);
            } else {
                MessageToast.show("Please enter some text first!");
            }
        }
    });
});