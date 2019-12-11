const { I } = inject();

module.exports = {
  fields: {
    // addTskBtn: {css: 'button[type=button][variant=contained]'},
    addTskBtn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > button > span:nth-child(2)',
    },
    // tskDescription: {css: 'textarea[name=description]'},
    tskDescription: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1)  > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(1) > div > div > textarea ',
    },

    // Wrong? firstTsk: {css: "#appHome > main > div > div > div > div:nth-child(3) > div:nth-child(3) > div > div > div:nth-child(1) > div:nth-child(1)  > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3) "},

    firstTsk: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3)',
    },
  },

  openTaskSidebar() {
    I.waitForElement(this.fields.addTskBtn, 5);
    I.click(this.fields.addTskBtn);
  },

  postTask(title) {
    I.waitForText('Add a task', 5);
    this.frustration();
    // I.fillField(this.fields.tskDescription, title);

    I.pressKey('Enter');
  },

  openEditTaskSidebar(taskIndex) {
    // I.waitForElement(this.fields.firstTsk, 5);
    // I.click(this.fields.firstTsk);
    I.waitForElement({
      css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(${taskIndex +
        2}) > div > div > div:nth-child(2) > div:nth-child(3)`,
    }),
      4;
    I.click({
      css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(${taskIndex +
        2}) > div > div > div:nth-child(2) > div:nth-child(3)`,
    });
  },

  deleteOpenedTask(taskIndex) {
    I.waitForElement(
      {
        css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${taskIndex +
          2}) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1) > span:nth-child(1)`,
      },
      4,
    );
    I.click({
      css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${taskIndex +
        2}) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1) > span:nth-child(1)`,
    });
  },

  frustration() {
    I.pressKey('D');
    I.pressKey('u');
    I.pressKey('m');
    I.pressKey('m');
    I.pressKey('y');
    I.pressKey('Space');
    I.pressKey('T');
    I.pressKey('a');
    I.pressKey('s');
    I.pressKey('k');
  },
};
