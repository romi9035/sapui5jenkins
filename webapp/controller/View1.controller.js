sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  (Controller, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    return Controller.extend("sap.btp.sapui5.controller.View1", {
      onInit() {
        // Initialize the data model
        const oModel = new JSONModel({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
        this.getView().setModel(oModel);
      },

      /**
       * Convenience method for accessing the resource bundle.
       * @public
       * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
       */
      getResourceBundle() {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      onSubmitPress() {
        // Get the model data
        const oModel = this.getView().getModel();
        const oData = oModel.getData();
        const oResourceBundle = this.getResourceBundle();

        // Validate required fields
        if (!oData.firstName || !oData.lastName || !oData.email) {
          MessageBox.error(oResourceBundle.getText("errorRequiredFields"));
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(oData.email)) {
          MessageBox.error(oResourceBundle.getText("errorInvalidEmail"));
          return;
        }

        // Create success message with parameters
        const sPhoneText =
          oData.phone || oResourceBundle.getText("phoneNotProvided");
        const sMessage = oResourceBundle.getText("successSubmissionMessage", [
          oData.firstName,
          oData.lastName,
          oData.email,
          sPhoneText,
        ]);

        // Show success popup
        MessageBox.success(sMessage, {
          title: oResourceBundle.getText("successSubmissionTitle"),
          onClose: () => {
            MessageToast.show(
              oResourceBundle.getText("successSubmissionToast")
            );
          },
        });
      },

      onClearPress() {
        const oResourceBundle = this.getResourceBundle();

        // Show confirmation dialog
        MessageBox.confirm(oResourceBundle.getText("confirmClearForm"), {
          title: oResourceBundle.getText("confirmClearFormTitle"),
          onClose: (sAction) => {
            if (sAction === MessageBox.Action.OK) {
              // Clear the model data
              const oModel = this.getView().getModel();
              oModel.setData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
              });

              MessageToast.show(oResourceBundle.getText("successClearToast"));
            }
          },
        });
      },
    });
  }
);
