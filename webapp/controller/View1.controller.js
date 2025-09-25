sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  (Controller, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    // Constants
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const MODEL_FIELDS = {
      FIRST_NAME: "firstName",
      LAST_NAME: "lastName",
      EMAIL: "email",
      PHONE: "phone"
    };

    return Controller.extend("sap.btp.sapui5.controller.View1", {
      /**
       * Called when the view is initialized.
       * Initializes the data model with empty form fields.
       * @public
       */
      onInit() {
        // Initialize the data model
        const oModel = new JSONModel(this._getInitialModelData());
        this.getView().setModel(oModel);
      },

      /**
       * Returns initial model data structure.
       * @private
       * @returns {Object} Initial model data
       */
      _getInitialModelData() {
        return {
          [MODEL_FIELDS.FIRST_NAME]: "",
          [MODEL_FIELDS.LAST_NAME]: "",
          [MODEL_FIELDS.EMAIL]: "",
          [MODEL_FIELDS.PHONE]: ""
        };
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
       * Validates if all required fields are filled.
       * @private
       * @param {Object} oData - Form data object
       * @returns {boolean} True if all required fields are valid
       */
      _validateRequiredFields(oData) {
        return !!(oData[MODEL_FIELDS.FIRST_NAME] && 
                  oData[MODEL_FIELDS.LAST_NAME] && 
                  oData[MODEL_FIELDS.EMAIL]);
      },

      /**
       * Validates email format using regex pattern.
       * @private
       * @param {string} sEmail - Email address to validate
       * @returns {boolean} True if email format is valid
       */
      _validateEmailFormat(sEmail) {
        return EMAIL_REGEX.test(sEmail);
      },

      /**
       * Shows validation error message.
       * @private
       * @param {string} sMessageKey - Message key from i18n bundle
       */
      _showValidationError(sMessageKey) {
        const oResourceBundle = this.getResourceBundle();
        MessageBox.error(oResourceBundle.getText(sMessageKey));
      },

      /**
       * Creates and formats the success message for form submission.
       * @private
       * @param {Object} oData - Form data object
       * @returns {string} Formatted success message
       */
      _createSuccessMessage(oData) {
        const oResourceBundle = this.getResourceBundle();
        const sPhoneText = oData[MODEL_FIELDS.PHONE] || 
                          oResourceBundle.getText("phoneNotProvided");
        
        return oResourceBundle.getText("successSubmissionMessage", [
          oData[MODEL_FIELDS.FIRST_NAME],
          oData[MODEL_FIELDS.LAST_NAME],
          oData[MODEL_FIELDS.EMAIL],
          sPhoneText,
        ]);
      },

      /**
       * Handles form submission with validation and success feedback.
       * @public
       */
      onSubmitPress() {
        const oModel = this.getView().getModel();
        const oData = oModel.getData();
        const oResourceBundle = this.getResourceBundle();

        // Validate required fields
        if (!this._validateRequiredFields(oData)) {
          this._showValidationError("errorRequiredFields");
          return;
        }

        // Validate email format
        if (!this._validateEmailFormat(oData[MODEL_FIELDS.EMAIL])) {
          this._showValidationError("errorInvalidEmail");
          return;
        }

        // Show success message
        this._showSuccessDialog(oData, oResourceBundle);
      },

      /**
       * Shows success dialog after successful form submission.
       * @private
       * @param {Object} oData - Form data object
       * @param {Object} oResourceBundle - Resource bundle for i18n texts
       */
      _showSuccessDialog(oData, oResourceBundle) {
        const sMessage = this._createSuccessMessage(oData);

        MessageBox.success(sMessage, {
          title: oResourceBundle.getText("successSubmissionTitle"),
          onClose: () => {
            MessageToast.show(
              oResourceBundle.getText("successSubmissionToast")
            );
          },
        });
      },

      /**
       * Handles form clearing with user confirmation.
       * @public
       */
      onClearPress() {
        const oResourceBundle = this.getResourceBundle();

        MessageBox.confirm(oResourceBundle.getText("confirmClearForm"), {
          title: oResourceBundle.getText("confirmClearFormTitle"),
          onClose: (sAction) => {
            if (sAction === MessageBox.Action.OK) {
              this._clearFormData();
            }
          },
        });
      },

      /**
       * Clears the form data and shows success message.
       * @private
       */
      _clearFormData() {
        const oModel = this.getView().getModel();
        const oResourceBundle = this.getResourceBundle();
        
        oModel.setData(this._getInitialModelData());
        MessageToast.show(oResourceBundle.getText("successClearToast"));
      },

      /**
       * Handles navigation to dummy view.
       * @public
       */
      onGoToDummyView() {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteDummyView");
      }
    });
  }
);
