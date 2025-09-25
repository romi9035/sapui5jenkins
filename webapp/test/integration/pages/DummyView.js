sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "DummyView";
	
	Opa5.createPageObjects({
		onTheDummyViewPage: {

			actions: {
				iPressTheShowMessageButton: function () {
					return this.waitFor({
						id: "dummyButton",
						viewName: sViewName,
						success: function (oButton) {
							oButton.$().trigger("tap");
						},
						errorMessage: "Did not find the show message button on the " + sViewName + " view"
					});
				},

				iPressTheBackToView1Button: function () {
					return this.waitFor({
						id: "backToView1Button",
						viewName: sViewName,
						success: function (oButton) {
							oButton.$().trigger("tap");
						},
						errorMessage: "Did not find the back to View1 button on the " + sViewName + " view"
					});
				},

				iEnterTextInDummyInput: function (sText) {
					return this.waitFor({
						id: "dummyInput",
						viewName: sViewName,
						success: function (oInput) {
							oInput.$("inner").val(sText);
							oInput.$("inner").trigger("input");
						},
						errorMessage: "Did not find the dummy input on the " + sViewName + " view"
					});
				}
			},

			assertions: {

				iShouldSeeTheDummyPageView: function () {
					return this.waitFor({
						id: "dummyPage",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
						},
						errorMessage: "Did not find the " + sViewName + " view"
					});
				},

				iShouldSeeTheDummyTitle: function () {
					return this.waitFor({
						id: "dummyTitle",
						viewName: sViewName,
						success: function (oTitle) {
							Opa5.assert.ok(oTitle.getText(), "The dummy title is displayed");
						},
						errorMessage: "Did not find the dummy title on the " + sViewName + " view"
					});
				},

				iShouldSeeTheDummyInput: function () {
					return this.waitFor({
						id: "dummyInput",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The dummy input is displayed");
						},
						errorMessage: "Did not find the dummy input on the " + sViewName + " view"
					});
				}
			}
		}
	});

});