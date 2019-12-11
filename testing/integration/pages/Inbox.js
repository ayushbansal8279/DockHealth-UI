const { I } = inject();

module.exports = {
  fields: {
    // addTskBtn: {css: "button[type=button]"},
    // addTskBtn: {css: "button[variant=contained]"},
    addTskBtn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > button',
    },
    // tskDescription: {name: "description"},
    tskDescription: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(1) > div > div > textarea',
    },

    // #appHome > main > div > div.Drawer__ContentContainer-jv03u8-1.kbqaaS > div > div.TaskViewstyled__TaskViewContainer-boeb28-16.jYkSMq > div.jss120.jss126.TaskViewstyled__TaskViewGrid-boeb28-3.daWlKe > div > div > div.NewTaskDrawerstyled__NewTaskDrawerContainer-sc-14co2q0-0.dFASeN > form > div.jss120.NewTaskDrawerstyled__NewTaskDrawerInnerContainer-sc-14co2q0-15.khWAms > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(1) > div > div > textarea
    // commentShield: {},
    // commentField: {contenteditable: "true"},
  },

  // Functions

  // TODO in custom_steps turn this into a universal open dropdown.
  openAddTaskDropdown() {
    // I.amOnPage("https://dockdev-v2.childrensaccelerator.com/#/tasks/Inbox");
    I.waitForElement(this.fields.addTskBtn, 6);
    I.click(this.fields.addTskBtn);
    // console.log("Yow!");
  },

  postDummyTask() {
    // I.waitForText("Add a task", 3);
    // I.click("add a comment");
    // I.fillField({contenteditable: "true"}, "Dummy Comment");
    I.waitForElement(this.fields.tskDescription, 3);
    I.fillField(this.fields.tskDescription, 'Dummy Task');
    I.pressKey('Enter');
  },
};
