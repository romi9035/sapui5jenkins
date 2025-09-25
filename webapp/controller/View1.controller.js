sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  (Controller, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    // Form field configuration
    const INITIAL_FORM_DATA = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    };

    // Email validation regex
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return Controller.extend("sap.btp.sapui5.controller.View1", {
      onInit() {
        this._initializeModel();
      },

      /**
       * Initialize the data model with default values
       * @private
       */
      _initializeModel() {
        const oModel = new JSONModel(INITIAL_FORM_DATA);
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

      /**
       * Validates form data
       * @param {Object} oData - Form data to validate
       * @returns {Object} Validation result with isValid flag and error message
       * @private
       */
      _validateFormData(oData) {
        const oResourceBundle = this.getResourceBundle();

        // Check required fields
        if (!oData.firstName || !oData.lastName || !oData.email) {
          return {
            isValid: false,
            message: oResourceBundle.getText("errorRequiredFields")
          };
        }

        // Validate email format
        if (!EMAIL_REGEX.test(oData.email)) {
          return {
            isValid: false,
            message: oResourceBundle.getText("errorInvalidEmail")
          };
        }

        return { isValid: true };
      },

      onSubmitPress() {
        const oModel = this.getView().getModel();
        const oData = oModel.getData();
        const oResourceBundle = this.getResourceBundle();

        // Validate form data
        const validationResult = this._validateFormData(oData);
        if (!validationResult.isValid) {
          MessageBox.error(validationResult.message);
          return;
        }

        // Create success message with parameters
        const sPhoneText = oData.phone || oResourceBundle.getText("phoneNotProvided");
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
            MessageToast.show(oResourceBundle.getText("successSubmissionToast"));
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
              this._clearFormData();
              MessageToast.show(oResourceBundle.getText("successClearToast"));
            }
          },
        });
      },

      /**
       * Clears the form data by resetting to initial values
       * @private
       */
      _clearFormData() {
        const oModel = this.getView().getModel();
        oModel.setData({ ...INITIAL_FORM_DATA });
      },
    });
  }
);
