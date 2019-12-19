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

    firstTsk: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3)',
    },

    tskDelete: {
      css:
        //'#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1)'
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1)'
    },

    inboxTab: { css: 'a[href="#/tasks/Inbox"]' },

    logoutBtn: {css: '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(9) > a'}
  },

  // Functions

  logout(){
    I.waitForElement(this.fields.logoutBtn, 4);
    I.click(this.fields.logoutBtn);
  },

  // TODO in custom_steps turn this into a universal open dropdown.
  openAddTaskDropdown() {
    I.waitForElement(this.fields.addTskBtn, 4);
    I.click(this.fields.addTskBtn);
  },

  postDummyTask() {
    I.waitForElement(this.fields.tskDescription, 4);
    I.fillField(this.fields.tskDescription, 'Dummy Task');
    I.pressKey('Enter');
  },

  clickTask(index) {
    index += 2;
    const taskTileLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(${index}) > div > div > div:nth-child(2) > div:nth-child(3)`;
    I.waitForElement(
      {
        css: taskTileLocator,
      },
      4,
    );
    I.click({
      css: taskTileLocator,
    });
  },

  clickInboxTab(){
    I.waitForElement(this.fields.inboxTab,4);
    I.click(this.fields.inboxTab);
  },

  destroyPickedTask() {
    I.waitForElement(this.fields.tskDelete, 5);
    I.click(this.fields.tskDelete);
  },
};
