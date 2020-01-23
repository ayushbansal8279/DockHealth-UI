const { I } = inject();

module.exports = {
  fields: {
    addPersonButton: {css: '#appHome > main > div > div:nth-child(1) > div > div > div > div > div > div > div:nth-child(2) > button'},
    //addPersonFirstNameBox: {css: 'body > div.jss271 > div:nth-child(2) > div > form > div:nth-child(1) > div:nth-child(1) > div > input'},
    addPersonFirstNameBox: {css: 'div.jss166.jss176.jss167.jss270 > div > form > div:nth-child(1) > div:nth-child(1) > div > input'},
    addPersonLastNameBox:{css: 'div.jss166.jss176.jss167.jss270 > div > form > div:nth-child(1) > div:nth-child(2) > div > input'},
    addPersonEmailBox:{css: 'div.jss166.jss176.jss167.jss270 > div > form > div:nth-child(1) > div:nth-child(3) > div > input'},
    addPersonSendInvite:{css: 'div.jss166.jss176.jss167.jss270 > div > form > div:nth-child(2) > div > button:nth-child(2)'},


    searchBar: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div > div > input'},

    numberOfPeople: {css: '#appHome > main > div > div:nth-child(1) > div > div > div > div > div > div > div:nth-child(1) > div:nth-child(2)'},

    pathToFirstPersonsSidebarShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div:nth-child(1) > div > div:nth-child(4) > button'},
    
    changeAdminButton: {css: '#simple-menu > div:nth-child(2) > ul > li'},
    //XthPerson:{css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div:nth-child(${Xth}) > div > div:nth-child(2) > div > a`}
  },
  async grabNumberOfPeople(){
    I.waitForElement(this.fields.numberOfPeople, 5);
    return await I.grabTextFrom(this.fields.numberOfPeople);
  },

  disarmNavigationSidebar(){
    I.waitForElement(this.fields.searchBar, 5);
    I.click(this.fields.searchBar);
    I.wait();
  },

  clickAddPersonButton(){
    I.waitForElement(this.fields.addPersonButton, 7);
    I.wait();
    I.scrollTo(this.fields.addPersonButton);
    I.wait();
    I.click(this.fields.addPersonButton);
    I.wait();
  },

  fillInvite(first, last, email){
    I.waitForText('Invite to list', 5);
    I.fillField(this.fields.addPersonFirstNameBox, first);
    I.wait();
    I.fillField(this.fields.addPersonLastNameBox, last);
    I.wait();
    I.fillField(this.fields.addPersonEmailBox, email);
    I.wait();
  },

  sendInvite(){
    I.waitForElement(this.fields.addPersonSendInvite, 5);
    I.click(this.fields.addPersonSendInvite);
    I.wait();
  },

  clickPerson(index){
    const path = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div:nth-child(${index}) > div > div:nth-child(2) > div > a`
    I.waitForElement({css: path}, 3);
    I.click({css: path});
    I.wait();
  },

  makeSearch(searchTerm){
    I.waitForElement(this.fields.searchBar, 5);
    I.fillField(this.fields.searchBar, searchTerm);
    I.wait();
  },

  switchAdminStatus(index){
    const pathToShield = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div:nth-child(${index}) > div > div:nth-child(4) > button`}
    I.waitForElement(pathToShield, 3);
    I.click(pathToShield);
    I.waitForElement(this.fields.changeAdminButton, 2);
    I.click(this.fields.changeAdminButton);
    I.wait();
  },

  

  
  // insert your locators and methods here
}
