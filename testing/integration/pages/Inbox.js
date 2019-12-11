const { I } = inject();

module.exports = {
  fields: {
    // addTskBtn: {css: "button[type=button]"},
    // addTskBtn: {css: "button[variant=contained]"},
    addTskBtn: { css: 'div > div > div > div > div > div > button' },
    tskDescription: { name: 'description' },

    // commentShield: {},
    // commentField: {contenteditable: "true"},
  },

  // Functions

  // TODO in custom_steps turn this into a universal open dropdown.
  openAddTaskDropdown() {
    // I.amOnPage("https://dockdev-v2.childrensaccelerator.com/#/tasks/Inbox");
    I.waitForText('Add a task', 4);
    I.click(this.fields.addTskBtn);
    // console.log("Yow!");
  },

  postDummyTask() {
    // I.waitForText("Add a task", 3);
    // I.click("add a comment");
    // I.fillField({contenteditable: "true"}, "Dummy Comment");
    I.fillField(this.fields.tskDescription, 'Dummy Task');
    I.pressKey('Enter');
  },
};
