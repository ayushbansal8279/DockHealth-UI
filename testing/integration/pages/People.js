const { I } = inject();

module.exports = {
  fields: {
    addPersonButton: {css: '#appHome > main > div > div:nth-child(1) > div > div > div > div > div > div > div:nth-child(2) > button'},
    //addPersonFirstNameBox: {css: 'body > div.jss271 > div:nth-child(2) > div > form > div:nth-child(1) > div:nth-child(1) > div > input'},
    addPersonFirstNameBox: {css: 'body > div:nth-child(15) > div:nth-child(2) > div > form > div:nth-child(1) > div:nth-child(1) > div > input'},
    addPersonLastNameBox:{css: 'body > div:nth-child(15) > div:nth-child(2) > div > form > div:nth-child(1) > div:nth-child(2) > div > input'},
    addPersonEmailBox:{css: 'body > div:nth-child(15) > div:nth-child(2) > div > form > div:nth-child(1) > div:nth-child(3) > div > input'},
    addPersonSendInvite:{css: 'body > div:nth-child(15) > div:nth-child(2) > div > form > div:nth-child(2) > div > button:nth-child(2)'},


    searchBar: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div > div > input'},

    numberOfPeopleText: {css: '#appHome > main > div > div:nth-child(1) > div > div > div > div > div > div > div:nth-child(1) > div:nth-child(2)'},

    //XthPerson:{css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div:nth-child(${Xth}) > div > div:nth-child(2) > div > a`}
  },

  disarmNavigationSidebar(){
    I.waitForElement(this.fields.searchBar, 5);
    I.click(this.fields.searchBar);
    I.wait(3);
  },

  clickAddPersonButton(){
    I.waitForElement(this.fields.addPersonButton, 7);
    I.wait();
    I.scrollTo(this.fields.addPersonButton);
    I.wait();
    I.click(this.fields.addPersonButton);
    I.wait(2);
  },

  fillInvite(first, last, email){
    I.waitForText('Invite to list', 5);
    I.fillField(this.fields.addPersonFirstNameBox, first);
    I.wait();
    I.fillField(this.fields.addPersonLastNameBox, last);
    I.wait();
    I.fillField(this.fields.addPersonEmailBox, email);
    I.wait(2);
  },

  sendInvite(){
    I.waitForElement(this.fields.addPersonSendInvite, 5);
    I.click(this.fields.addPersonSendInvite);
    I.wait(3);
  },

  clickPerson(index){
    const path = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div:nth-child(${index}) > div > div:nth-child(2) > div > a`
    I.waitForElement({css: path}, 3);
    I.click({css: path});
    I.wait(3);
  },

  makeSearch(searchTerm){
    I.waitForElement(this.fields.searchBar, 5);
    I.fillField(this.fields.searchBar, searchTerm);
    I.wait(3);
  },

  

  
  // insert your locators and methods here
}
