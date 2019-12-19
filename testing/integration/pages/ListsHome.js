const { I, lgnPg } = inject();

module.exports = {
  fields: {
    addListBtn: { css: 'button[type=button]' },
    listNameShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > form > div:nth-child(3) > div > div'},
    listNameFld: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > form > div:nth-child(3) > div > div > input'},
    //listNameFld: { name: 'listName' },
    saveListBtn: '#addTaskListButton',
    listsTab: { css: 'a[href="#/tasks"]' },
    inboxTab: { css: 'a[href="#/tasks/Inbox"]' },
    patientsTab: { css: 'a[href="#/patients"]' },
    logoutBtn: {css: '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(9) > a'},
  },

  // Functions
  logout() {
    I.waitForElement(this.fields.logoutBtn, 2);
    I.click(this.fields.logoutBtn);
  },


  openAddListDropdown() {
    // I.amOnPage("https://dockdev-v2.childrensaccelerator.com/#/tasks");
    // I.waitForClickable({css: "button[type=button]"}, 10);
    // pause();
    //I.waitForText('Add a list', 3);
    // I.click({css: "button[type=button]"});
    I.waitForElement(this.fields.addListBtn, 4);
    I.click(this.fields.addListBtn);
  },

  createList(title) {
    // I.click(this.fields.addListBtn);
    //I.waitForText('List name');
    I.waitForElement(this.fields.listNameShield, 4);
    I.click(this.fields.listNameShield);
    I.waitForElement(this.fields.listNameFld, 4);
    I.fillField(this.fields.listNameFld, title);
    I.click({ css: 'input[id=addTaskListButton]' });
  },

  openEditListDropdown(listIndex) {
    I.waitForElement({
      css: `.list-wrapper > div > span:nth-child(2) > div:nth-child(${listIndex}) > div.more-options-wrapper > svg`,
    },4);
    I.click({
      css: `.list-wrapper > div > span:nth-child(2) > div:nth-child(${listIndex}) > div.more-options-wrapper > svg`,
    });
    I.click({
      css: `.list-wrapper > div > span:nth-child(2) > div:nth-child(${listIndex}) > div.more-options-wrapper > div > ul > li:nth-child(1)`,
    });
  },

  alterListDetails(listName) {
    //I.waitForText('Add/Edit a list', 2);
    I.waitForElement(this.fields.listNameFld, 4);
    I.fillField(this.fields.listNameFld, listName);
    I.pressKey(['CommandOrControl', 'A']);
    I.pressKey('Backspace');
    I.fillField(this.fields.listNameFld, listName);
    // pause();
    I.waitForElement(this.fields.saveListBtn);
    I.click(this.fields.saveListBtn);
  },

  destroyDummyList(listIndex) {
    I.waitForText('Bummy List', 5);
    I.click({
      css: `.list-wrapper > div > span:nth-child(2) > div:nth-child(${listIndex}) > div.more-options-wrapper > svg`,
    });
    I.click({
      css: `.list-wrapper > div > span:nth-child(2) > div:nth-child(${listIndex}) > div.more-options-wrapper > div > ul > li:nth-child(2)`,
    });
    // I.click("Delete");
    I.click({ css: 'body > div:nth-child(3) > div > div > span' });
  },

  enterInbox() {
    I.waitForText('Lists', 4);
    I.click(this.fields.inboxTab);
  },

  enterPatients() {
    I.waitForText('Lists', 4);
    I.click(this.fields.patientsTab);
  },
  
  //Log into account and get to a list in one method. Account than list # from the top.
  getToList(acc, index) {
    lgnPg.fullLogin(acc);
    this.enterList(index);
  },

  enterList(listIndex) {
    const listPath = {css: `html > body > #app > #appHome > main > div > div:nth-child(2) > div > div:nth-child(4) > div:nth-child(2) > div > div > span:nth-child(2) > div:nth-child(${listIndex}) > div:nth-child(2) > a > h6`};
    I.waitForElement(listPath, 4);
    I.click(listPath);
  },

  enterListsTab(){
    I.waitForElement(this.fields.listsTab, 4);
    I.click(this.fields.listsTab);
  },
};
