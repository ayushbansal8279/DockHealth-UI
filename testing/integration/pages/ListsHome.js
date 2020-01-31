const { I, lgnPg } = inject();

module.exports = {
  fields: {
    addListBtn: { css: 'button[type=button]' },
    listNameFld: {css: 'input[name="listName"]'},
    adminShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div > form > div:nth-child(5) > div > div > ul'},
    addAdminSearchBar: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div > form > div:nth-child(5) > div:nth-child(2) > div > div:nth-child(1) > div > input'},
    addAdminFirstResult: {css: '#react-autowhatever-1--item-0'},
    saveListBtn: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div > div > form > div:nth-child(13) > button:nth-child(2)'},
    



    listsTab: { css: 'a[href="#/tasks"]' },
    inboxTab: { css: 'a[href="#/tasks/Inbox"]' },
    //inboxTab: { css: "svg.icon-header:nth-child(1)"},
    patientsTab: { css: 'a[href="#/patients"]' },
    peopleTab: {css: 'a[href="#/people"]'},
    logoutBtn: {css: 'a[href="#/logout"]'},
  },

  // Functions
  logout() {
    I.waitForElement(this.fields.logoutBtn, 2);
    I.click(this.fields.logoutBtn);
    I.wait();
  },

  openAddListDropdown() {
    I.waitForElement(this.fields.addListBtn, 4);
    I.click(this.fields.addListBtn);
    I.wait();
  },

  addAdmin(name) {
    I.waitForElement(this.fields.adminShield, 3);
    I.click(this.fields.adminShield);
    I.waitForElement(this.fields.addAdminSearchBar, 5);
    I.fillField(this.fields.addAdminSearchBar, name);
    I.wait();
    I.click(this.fields.addAdminFirstResult);
    I.wait();
  },

  createList(title) {
    I.waitForElement(this.fields.listNameFld, 4);
    I.fillField(this.fields.listNameFld, title);
    //pause();
    I.waitForElement(this.fields.saveListBtn);
    I.click(this.fields.saveListBtn);
    I.wait();

    /*
    I.refreshPage();
    const listPathContextMenu = {css: `.item-list-wrapper div.item:nth-child(1) .more-options-wrapper`};
    I.waitForElement(listPathContextMenu, 4);
    */
  },

  openListDropdown(listIndex) {
    const listPathContextMenu = {css: `.item-list-wrapper div.item:nth-child(${listIndex}) .more-options-wrapper`};
    I.waitForElement(listPathContextMenu, 4);
    I.click(listPathContextMenu);
    I.wait(1);
    return listPathContextMenu;
  },

  openEditListDropdown(listIndex) {
    const listPathContextMenu = this.openListDropdown(listIndex)
    within(listPathContextMenu, () => {
      I.click({css: 'li:nth-child(1)'});
      I.wait(1);
    })
  },

  alterListDetails(listName) {
    I.waitForElement(this.fields.listNameFld, 4);
    I.clearField(this.fields.listNameFld);
    I.wait(1);
    I.fillField(this.fields.listNameFld, listName);
    I.waitForElement(this.fields.saveListBtn, 4);
    I.click(this.fields.saveListBtn);
    I.wait(2);
  },

  //Something still not
  destroyList(listIndex) {
    const listPathContextMenu = this.openListDropdown(listIndex);
    within(listPathContextMenu, async () => {
      let popupId = await I.grabAttributeFrom({css: 'li:nth-child(2) > div '}, 'data-open');
      I.wait(1);
      I.click({css: 'li:nth-child(2)'});
      const deleteBtnInPopup = `#${popupId} > div > span.confirm`
      I.waitForElement(deleteBtnInPopup, 5);
      var buttonLabel = await I.executeScript(function(el) {
        $(el).click();
        return $(el).text();
      }, deleteBtnInPopup);
      console.log("Clicked "+buttonLabel)
      // I.click(deleteBtnInPopup); //doesn't work
      I.wait(2);
    })
  },

  enterInbox() {
    I.waitForElement(this.fields.inboxTab, 4);
    I.click(this.fields.inboxTab);
    I.wait(2);
  },

  enterPatients() {
    I.waitForElement(this.fields.patientsTab, 4);
    I.click(this.fields.patientsTab);
    I.wait();
    I.click(this.fields.patientsTab);
    I.wait(2);
  },

  enterPeople(){
    I.waitForElement(this.fields.peopleTab, 4);
    //I.scrollTo(this.fields.peopleTab);
    I.click(this.fields.peopleTab);
    I.click(this.fields.peopleTab);
    I.wait(3);
  },
  
  //Log into account and get to a list in one method. Account than list # from the top.
  getToList(acc, index) {
    lgnPg.fullLogin(acc);
    this.enterList(index);
    I.wait(2);
  },

  enterList(listIndex) {
    const listPathForName = {css: `.item-list-wrapper  div.item:nth-child(${listIndex}) h6`};
    I.waitForElement(listPathForName, 4);
    I.click(listPathForName);
    I.wait(2);
  },

  enterListsTab(){
    I.waitForElement(this.fields.listsTab, 4);
    I.click(this.fields.listsTab);
    I.wait(2);
  },
};
