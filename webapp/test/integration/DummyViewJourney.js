/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/App",
	"./pages/View1",
	"./pages/DummyView"
], function (opaTest) {
	"use strict";

	QUnit.module("Dummy View Journey");

	opaTest("Should navigate to dummy view and interact with it", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		Then.onTheAppPage.iShouldSeeTheApp();
		Then.onTheViewPage.iShouldSeeThePageView();
		
		// Navigate to dummy view by pressing the button (assuming we'll add this action to View1 page object)
		
		// For now, let's directly navigate using hash
		Given.iStartMyAppInAFrame("../../index.html#/dummy");
		
		// Assertions for dummy view
		Then.onTheDummyViewPage.iShouldSeeTheDummyPageView();
		Then.onTheDummyViewPage.iShouldSeeTheDummyTitle();
		Then.onTheDummyViewPage.iShouldSeeTheDummyInput();

		//Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should be able to enter text and show message in dummy view", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame("../../index.html#/dummy");

		// Actions
		When.onTheDummyViewPage.iEnterTextInDummyInput("Test Message");
		When.onTheDummyViewPage.iPressTheShowMessageButton();

		// Assertions
		Then.onTheDummyViewPage.iShouldSeeTheDummyPageView();

		//Cleanup
		Then.iTeardownMyApp();
	});
});