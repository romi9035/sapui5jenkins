/*global QUnit*/

sap.ui.define([
	"sap/btp/sapui5/controller/View1.controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	QUnit.module("View1 Controller");

	QUnit.test("I should test the View1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

	QUnit.test("Controller should have refactored helper methods", function (assert) {
		var oController = new Controller();
		
		// Test that the private methods exist (they're part of the controller prototype)
		assert.ok(typeof oController._getInitialModelData === "function", "Should have _getInitialModelData method");
		assert.ok(typeof oController._validateRequiredFields === "function", "Should have _validateRequiredFields method");
		assert.ok(typeof oController._validateEmailFormat === "function", "Should have _validateEmailFormat method");
		assert.ok(typeof oController._showValidationError === "function", "Should have _showValidationError method");
		assert.ok(typeof oController._createSuccessMessage === "function", "Should have _createSuccessMessage method");
		assert.ok(typeof oController._showSuccessDialog === "function", "Should have _showSuccessDialog method");
		assert.ok(typeof oController._clearFormData === "function", "Should have _clearFormData method");
	});

	QUnit.test("_getInitialModelData should return correct structure", function (assert) {
		var oController = new Controller();
		var oInitialData = oController._getInitialModelData();
		
		assert.ok(oInitialData.hasOwnProperty("firstName"), "Should have firstName field");
		assert.ok(oInitialData.hasOwnProperty("lastName"), "Should have lastName field");
		assert.ok(oInitialData.hasOwnProperty("email"), "Should have email field");
		assert.ok(oInitialData.hasOwnProperty("phone"), "Should have phone field");
		
		assert.strictEqual(oInitialData.firstName, "", "firstName should be empty string");
		assert.strictEqual(oInitialData.lastName, "", "lastName should be empty string");
		assert.strictEqual(oInitialData.email, "", "email should be empty string");
		assert.strictEqual(oInitialData.phone, "", "phone should be empty string");
	});

});
