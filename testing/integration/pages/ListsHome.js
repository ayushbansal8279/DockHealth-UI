const { I, lgnPg } = inject();

module.exports = {
  fields: {
    addListBtn: { css: 'button[type=button]' },
    listNameFld: { name: 'listName' },
    saveListBtn: { id: 'addTaskListButton' },
    inboxTab: { css: 'a[href="#/tasks/Inbox"]' },
    patientsTab: {css: 'a[href="#/patients"]'},
  },

  // Functions

  openAddListDropdown() {
    // I.amOnPage("https://dockdev-v2.childrensaccelerator.com/#/tasks");
    // I.waitForClickable({css: "button[type=button]"}, 10);
    // pause();
    I.waitForText('Add a list', 3);
    // I.click({css: "button[type=button]"});
    I.click(this.fields.addListBtn);
  },

  createList(title) {
    // I.click(this.fields.addListBtn);
    I.waitForText('List name');
    I.fillField(this.fields.listNameFld, title);
    I.click({ css: 'input[id=addTaskListButton]' });
  },

  openEditListDropdown(listIndex) {
    I.refreshPage(); // Because the wrong box comes up when a list is fresh.
    // I.amOnPage("https://dockdev-v2.childrensaccelerator.com/#/tasks");
    I.waitForText('Add a list', 3);
    // Grab list entry.

    // pause();
    I.click({
      css: `.list-wrapper > div > span:nth-child(2) > div:nth-child(${listIndex}) > div.more-options-wrapper > svg`,
    });
    I.click({
      css: `.list-wrapper > div > span:nth-child(2) > div:nth-child(${listIndex}) > div.more-options-wrapper > div > ul > li:nth-child(1)`,
    });
  },

  alterListDetails(listName) {
    I.waitForText('Add/Edit a list', 2);
    I.fillField(this.fields.listNameFld, listName);
    I.pressKey(['CommandOrControl', 'A']);
    I.pressKey('Backspace');
    I.fillField(this.fields.listNameFld, listName);
    // pause();
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

  enterInbox(){
    I.waitForText('Lists', 4);
    I.click(this.fields.inboxTab);
  },

  enterPatients(){
    I.waitForText('Lists', 4);
    I.click(this.fields.patientsTab);
  },

  getToList(index){
    lgnPg.login();
    this.enterList(index);
  },

  enterList(listIndex) {
    I.waitForText('Lists', 4);
    I.click({css: 
      `html > body > #app > #appHome > main > div > div:nth-child(2) > div > div:nth-child(4) > div:nth-child(2) > div > div > span:nth-child(2) > div:nth-child(${listIndex}) > div:nth-child(2) > a > h6`});
  },

};