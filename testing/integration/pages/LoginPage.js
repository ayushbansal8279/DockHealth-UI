const { I } = inject();

module.exports = {
  fields: {
    //usrnm: 'input[name=username]',
    usrnm: {css: '#appHome > main > div > div > div > div:nth-child(2) > div:nth-child(2) > form > div:nth-child(3) > div:nth-child(1) > div > input'},
    //psswrd: 'input[type=password]',
    psswrd: {css: '#appHome > main > div > div > div > div:nth-child(2) > div:nth-child(2) > form > div:nth-child(3) > div:nth-child(2) > div > input'},

    eml2: 'gbousvaros2015@gmail.com',
    eml: 'george@dock.health',
    pw: '753951Gb!',
  },

  fullLogin(user){
    // I.amOnPage('http://localhost:3000/#/login');
    I.amOnPage('/');
    this.login(user);
  },

  // Functions
  login(user) {
    I.waitForElement(this.fields.usrnm, 10);
    if(user==1){
      I.fillField(this.fields.usrnm, this.fields.eml);
    } if (user==2){
      I.fillField(this.fields.usrnm, this.fields.eml2);
    }
    I.pressKey('Enter');
    I.waitForElement(this.fields.psswrd, 10);
    I.fillField(this.fields.psswrd, this.fields.pw);
    I.pressKey('Enter');
  },
};
