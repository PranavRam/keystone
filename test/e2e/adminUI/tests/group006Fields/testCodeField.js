var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/CodeModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Code field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Code' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', },
			],
		});

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Code field can be filled via the initial modal': function (browser) {
		browser.adminUIApp.openList({ section: 'fields', list: 'Code' });

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Code Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'Some test code for field A' }, },
			],
		});

		browser.adminUIInitialFormScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Code Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'Some test code for field A' }, },
			],
		});

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Code field should show correctly in the edit form': function (browser) {
		browser.adminUIItemScreen.assertFieldUIVisible({
			fields: [
				{ name: 'name', },
				{ name: 'fieldA', },
				{ name: 'fieldB', },
			],
		});

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Code Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'Some test code for field A' }, },
			],
		});
	},
	'Code field can be filled via the edit form': function (browser) {
		browser.adminUIItemScreen.fillFieldInputs({
			fields: [
				{ name: 'fieldB', input: { value: 'Some test code for field B' }, },
			],
		});

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals({ element: '@flashMessage', text: 'Your changes have been saved successfully' });

		browser.adminUIItemScreen.assertFieldInputs({
			fields: [
				{ name: 'name', input: { value: 'Code Field Test 1' }, },
				{ name: 'fieldA', input: { value: 'Some test code for field A' }, },
				{ name: 'fieldB', input: { value: 'Some test code for field B' }, },
			],
		});
	},
	'restoring test state': function (browser) {
	},
};
