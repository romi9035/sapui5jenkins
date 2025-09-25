sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "View1";
	
	Opa5.createPageObjects({
		onTheViewPage: {

			actions: {
				iPressTheGoToDummyViewButton: function () {
					return this.waitFor({
						id: "dummyViewButton",
						viewName: sViewName,
						success: function (oButton) {
							oButton.$().trigger("tap");
						},
						errorMessage: "Did not find the Go to Dummy View button on the " + sViewName + " view"
					});
				}
			},

			assertions: {

				iShouldSeeThePageView: function () {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The " + sViewName + " view is displayed");
						},
						errorMessage: "Did not find the " + sViewName + " view"
					});
				}
			}
		}
	});

});
