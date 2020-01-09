const { I } = inject();

module.exports = {
  // insert your locators and methods here
  fields: {
    //leave Patient
    exitPatientPageButton: {css:
      '#appHome > main > div > div:nth-child(2)  > div > div > div > div:nth-child(1) > a > button > span:nth-child(1) > img'
    },

    //Patient Details
    firstNameBox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > input'},
    middleNameBox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > div > input'},
    lastNameBox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div > input'},

    mrnBox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > input'},
    
    birthdayBox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > input'},
    
    genderShield: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)'},
    genderFemale: {css: '#menu-gender > div:nth-child(2) > ul > li:nth-child(1)'},
    genderMale: {css: '#menu-gender > div:nth-child(2) > ul > li:nth-child(2)'},
    genderOther: {css: '#menu-gender > div:nth-child(2) > ul > li:nth-child(3)'},

    homePhoneBox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > input'},

    mobilePhoneBox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > input'},

    emailBox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > input'},

    saveButton: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > button:nth-child(2)'},
    
    //Notes
    addANoteButton: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > button'},
    noteTextBox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > textarea'},
    
    addTaskButton: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(2) > form > div > div > input'},
    saveTaskButton: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(2) > form > div > div > div:nth-child(4) > button'},

    firstTaskCheckbox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(1) > div'},
  },
  
  exitPatientPage(){
    I.waitForElement(this.fields.exitPatientPageButton, 2);
    I.click(this.fields.exitPatientPageButton);
    I.wait();
  },

  //Patient editing methods

  

  refillPatient(firstName, middleName, lastName, MRN, birthday, gender, homePhone, mobilePhone, email){
    this.editFirstName(firstName);
    this.editMiddleName(middleName);
    this.editLastName(lastName);
    this.editMRN(MRN);
    I.wait(2);
    this.editBirthday(birthday);
    this.editGender(gender);
    this.editHomePhone(homePhone);
    this.editMobilePhone(mobilePhone);
    this.editEmail(email);
    this.editSavePatient();
    I.wait(2);
  },

  editFirstName(name){
    I.waitForElement(this.fields.firstNameBox);
    I.wait(3);
    I.clearField(this.fields.firstNameBox);
    I.fillField(this.fields.firstNameBox, name);
    I.wait();
  },

  editMiddleName(name){
    I.waitForElement(this.fields.middleNameBox);
    I.clearField(this.fields.middleNameBox);
    I.fillField(this.fields.middleNameBox, name);
    I.wait();
  },

  editLastName(name){
    I.waitForElement(this.fields.lastNameBox);
    I.clearField(this.fields.lastNameBox);
    I.fillField(this.fields.lastNameBox, name);
    I.wait();
  },
  
  editMRN(mrn){
    I.waitForElement(this.fields.mrnBox);
    I.clearField(this.fields.mrnBox);
    I.fillField(this.fields.mrnBox, mrn);
    I.wait();
  },

  editBirthday(code){
    I.waitForElement(this.fields.birthdayBox);
    I.clearField(this.fields.birthdayBox);
    I.wait();
    I.fillField(this.fields.birthdayBox, code);
    I.wait();
  },

  editGender(gender){
    I.waitForElement(this.fields.genderShield, 3);
    I.click(this.fields.genderShield);
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
    I.waitForElement(this.fields.homePhoneBox);
    I.clearField(this.fields.homePhoneBox);
    I.fillField(this.fields.homePhoneBox, code);
    I.wait();
  },

  editMobilePhone(code){
    I.waitForElement(this.fields.mobilePhoneBox);
    I.clearField(this.fields.mobilePhoneBox);
    I.fillField(this.fields.mobilePhoneBox, code);
    I.wait();
  },

  editEmail(code){
    I.waitForElement(this.fields.emailBox);
    I.clearField(this.fields.emailBox);
    I.fillField(this.fields.emailBox, code);
    I.wait();
  },

  editSavePatient(){
    I.waitForElement(this.fields.saveButton, 4);
    I.click(this.fields.saveButton);
    I.wait();
  },

  //Task methods
  addPatientTask(taskName){
    I.waitForElement(this.fields.addTaskButton, 4);
    I.fillField(this.fields.addTaskButton, taskName);
    I.waitForElement(this.fields.saveTaskButton, 2);
    I.click(this.fields.saveTaskButton);
    I.wait(1);
  },

  clickTaskCheckbox(taskNumber){
    const path = `#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(${taskNumber*3}) > div > div > div:nth-child(2) > div:nth-child(1) > div`;
    I.waitForElement({css: path}, 3);
    I.click(path);
    I.wait(2);
  },
}
