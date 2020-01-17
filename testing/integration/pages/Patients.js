const { I } = inject();
var assert = require('assert');

let container = require('codeceptjs').container;
// get object with all helpers
let helpers = container.helpers();
var puppeteerHelper = helpers['Puppeteer']

module.exports = {
  fields: {
    numberOfPatients: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(1) > div > span:nth-child(2)'},

    //Immediately accessible Buttons
    addPatientButton: {css:'#appHome > main > div > div:nth-child(2) > div > div:nth-child(1) > button'},

    searchBar: {css: '#search'},

    filterShield: {css: '#select-filter > div > div'},
    filterAllPatients: {css: '#menu-filter > div:nth-child(2) > ul > li:nth-child(1)'},
    filterMyPatients: {css: '#menu-filter > div:nth-child(2) > ul > li:nth-child(2)'},
    filterMyPatientsWithActiveTasks: {css: '#menu-filter > div:nth-child(2) > ul > li:nth-child(3)'},

    firstPatient: {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a`}, //Just change the last digit out for the desired patients corrisponding TR number (from the top of the wrapper).

    //PatientCreation Addresses
    firstNameBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > div > input'},
    middleNameBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div > div > input'},
    lastNameBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div > div > input'},

    mrnBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > input'},

    birthdayBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div > input'},

    genderShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(5) > div:nth-child(2)'},
    genderFemale: {css: '#menu-gender > div:nth-child(2) > ul > li:nth-child(1)'},
    genderMale: {css: '#menu-gender > div:nth-child(2) > ul > li:nth-child(2)'},
    genderOther: {css: '#menu-gender > div:nth-child(2) > ul > li:nth-child(3)'},

    homePhoneBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(6) > div:nth-child(2) > input'},

    mobilePhoneBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(7) > div:nth-child(2) > input'},

    emailBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(8) > div:nth-child(2) > input'},

    notesBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > textarea'},

    saveButton: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > button'},

    exitPatientButton: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button'},

    //Editting patient number 1 Addresses
    patientDetailsWrapper: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)'},

    editFirstNameBox:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > input'},
    editMiddleNameBox:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div > input'},
    editLastNameBox:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div > input'},

    editmrnBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > input'},

    editBirthdayBox: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > input'},

    editGenderShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)'},
    // genderFemale: {css: '#menu-gender > div:nth-child(2) > ul > li:nth-child(1)'},
    // genderMale: {css: '#menu-gender > div:nth-child(2) > ul > li:nth-child(2)'},
    // genderOther: {css: '#menu-gender > div:nth-child(2) > ul > li:nth-child(3)'},

    editHomePhoneBox:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > input'},

    editMobilePhoneBox:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > input'},

    editEmailBox:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > input'},

    editSaveButton:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(1)  > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > button:nth-child(2)'},
  },


  //Non patient creation features
  makeSearch(keyword){
    I.waitForElement(this.fields.searchBar);
    I.fillField(this.fields.searchBar, keyword);
    I.wait(2);
  },
  //Set Filter command
  setFilterTo(index){
    I.waitForElement(this.fields.filterShield, 7);
    I.click(this.fields.filterShield);
    I.wait();
    const path = {css: `#menu-filter > div:nth-child(2) > ul > li:nth-child(${index})`};
    I.waitForElement(path, 2);
    I.click(path);
    I.wait();
  },

  async grabNumberOfPatients(){
    I.waitForElement(this.fields.numberOfPatients, 5);
    return await I.grabTextFrom(this.fields.numberOfPatients);
  },


  //Patient creation features
  openNewPatientSidebar(){
    I.waitForElement(this.fields.addPatientButton, 3);
    I.click(this.fields.addPatientButton);
    I.wait();
  },

  closeNewPatientSidebar(){
    I.waitForElement(this.fields.exitPatientButton, 3);
    I.click(this.fields.exitPatientButton);
    I.wait();
  },

  postComment(comment){
    //TODO is there a shield for this comment box?
    I.waitForElement(this.fields.notesBox, 3);
    I.fillField(this.fields.notesBox, comment);
    I.pressKey('Enter');
    I.wait();
  },

  fillPatient(firstName, middleName, lastName, MRN, birthday, gender, homePhone, mobilePhone, email){
    this.fillFirstName(firstName);
    this.fillMiddleName(middleName);
    this.fillLastName(lastName);
    this.fillMRN(MRN);
    //pause();
    this.fillBirthday(birthday);
    this.fillGender(gender);
    I.wait();
    this.fillHomePhone(homePhone);
    this.fillMobilePhone(mobilePhone);
    this.fillEmail(email);
    this.savePatient();
    I.wait(2);
  },

  savePatient(){
    I.waitForElement(this.fields.saveButton, 4);
    I.scrollTo(this.fields.saveButton);
    I.click(this.fields.saveButton);
    I.wait();
  },

  fillFirstName(name){
    I.waitForElement(this.fields.firstNameBox, 3);
    I.fillField(this.fields.firstNameBox, name);
    I.wait();
  },

  fillMiddleName(name){
    I.waitForElement(this.fields.middleNameBox, 3);
    I.fillField(this.fields.middleNameBox, name);
    I.wait();
  },

  fillLastName(name){
    I.waitForElement(this.fields.lastNameBox, 3);
    I.fillField(this.fields.lastNameBox, name);
    I.wait();
  },

  fillMRN(MRN){
    I.waitForElement(this.fields.mrnBox, 3);
    I.fillField(this.fields.mrnBox, MRN);
    I.wait();
  },

  fillBirthday(bday){
      I.waitForElement(this.fields.birthdayBox, 3);
      I.fillField(this.fields.birthdayBox, bday);
      I.wait(); 
  },

  fillGender(gender){
    I.waitForElement(this.fields.genderShield, 3);
    I.click(this.fields.genderShield);
    I.wait();
    if(gender.toUpperCase()=='MALE'){
      I.waitForElement(this.fields.genderMale, 2);
      I.click(this.fields.genderMale);
    }else if(gender.toUpperCase()=='FEMALE'){
      I.waitForElement(this.fields.genderFemale, 2);
      I.click(this.fields.genderFemale);
    } else {
      I.waitForElement(this.fields.genderOther, 2);
      I.click(this.fields.genderOther);
    }
    I.wait();
  },

  fillHomePhone(number){
    I.waitForElement(this.fields.homePhoneBox, 3);
    I.fillField(this.fields.homePhoneBox, number);
    I.wait(); 
  },

  fillMobilePhone(number){
    I.waitForElement(this.fields.mobilePhoneBox, 3);
    I.fillField(this.fields.mobilePhoneBox, number);
    I.wait();
  },

  fillEmail(email){
    I.waitForElement(this.fields.emailBox, 3);
    I.fillField(this.fields.emailBox, email);
    I.wait();
  },




  //opening patient page 
  openPatientPage(index){
    const path = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > table > tbody > tr:nth-child(${index}) > td:nth-child(1) > a`;
    I.waitForElement({css: path}, 5);
    I.click({css: path});
    I.wait(3);
  },



  //Manipulating edit sidebar
  openEditPatientSidebar(index){
    const path = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(3) > div > table > tbody > tr:nth-child(${index}) > td:nth-child(6)`;
    I.waitForElement({css: path}, 5);
    I.click({css: path});
    I.wait(3);
  },

  refillPatient(firstName, middleName, lastName, MRN, birthday, gender, homePhone, mobilePhone, email){
    this.editFirstName(firstName);
    this.editMiddleName(middleName);
    this.editLastName(lastName);
    this.editMRN(MRN);
    //pause();
    this.editBirthday(birthday);
    this.editGender(gender);
    this.editHomePhone(homePhone);
    this.editMobilePhone(mobilePhone);
    this.editEmail(email);
    this.editSavePatient();
    I.wait(2);
  },

  editSavePatient(){
    I.waitForElement(this.fields.editSaveButton, 2);
    I.click(this.fields.editSaveButton);
    I.wait();
  },

  editFirstName(name){
    I.waitForElement(this.fields.editFirstNameBox);
    I.clearField(this.fields.editFirstNameBox);
    I.fillField(this.fields.editFirstNameBox, name);
    I.wait();
  },

  editMiddleName(name){
    I.waitForElement(this.fields.editMiddleNameBox);
    I.clearField(this.fields.editMiddleNameBox);
    I.fillField(this.fields.editMiddleNameBox, name);
    I.wait();
  },

  editLastName(name){
    I.waitForElement(this.fields.editLastNameBox);
    I.clearField(this.fields.editLastNameBox);
    I.fillField(this.fields.editLastNameBox, name);
    I.wait();
  },
  
  editMRN(mrn){
    I.waitForElement(this.fields.editmrnBox);
    I.clearField(this.fields.editmrnBox);
    I.fillField(this.fields.editmrnBox, mrn);
    I.wait();
  },

  editBirthday(code){
    I.waitForElement(this.fields.editBirthdayBox);
    I.clearField(this.fields.editBirthdayBox);
    I.fillField(this.fields.editBirthdayBox, code);
    I.wait();
  },

  editGender(gender){
    I.waitForElement(this.fields.editGenderShield);
    I.click(this.fields.editGenderShield);
    I.wait();
    if(gender.toUpperCase()=='MALE'){
      I.waitForElement(this.fields.genderMale);
      I.click(this.fields.genderMale);
    } if(gender.toUpperCase()=='FEMALE'){
      I.waitForElement(this.fields.genderFemale);
      I.click(this.fields.genderFemale);
    } else {
      I.waitForElement(this.fields.genderOther);
      I.click(this.fields.genderOther);
    }
    I.wait();
  },
  
  editHomePhone(code){
    I.waitForElement(this.fields.editHomePhoneBox);
    I.clearField(this.fields.editHomePhoneBox);
    I.fillField(this.fields.editHomePhoneBox, code);
    I.wait();
  },

  editMobilePhone(code){
    I.waitForElement(this.fields.editMobilePhoneBox);
    I.clearField(this.fields.editMobilePhoneBox);
    I.fillField(this.fields.editMobilePhoneBox, code);
    I.wait();
  },

  editEmail(code){
    I.waitForElement(this.fields.editEmailBox);
    I.clearField(this.fields.editEmailBox);
    I.fillField(this.fields.editEmailBox, code);
    I.wait();
  },

  








  // insert your locators and methods here
};
