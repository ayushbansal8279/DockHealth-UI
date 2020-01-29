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

    //addTaskInboxButton: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > form > div > div > input'},
    addTaskInboxButton: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > form > div > div > input'},
    addTaskInboxSaveButton: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > form > div > div > div:nth-child(4) > button'},

    firstTaskCheckbox: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(1) > div'},

    inboxAddress: { css: 'a[href="#/tasks/Inbox"]' },

    showCompletedTasksButton: {css: '#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(3) > button'},
  },
  
  exitPatientPage(){
    I.waitForElement(this.fields.exitPatientPageButton, 2);
    I.click(this.fields.exitPatientPageButton);
    I.wait();
  },

  enterInboxPage(){
    I.waitForElement(this.fields.inboxAddress, 3);
    I.click(this.fields.inboxAddress);
    I.wait(2);
  },

  enterPatientPage(){
    I.waitForElement(this.fields.inboxAddress, 3);
    I.click(this.fields.inboxAddress);
    I.wait(2);
  },

  clickShowCompletedTasks(){
    I.waitForElement(this.fields.showCompletedTasksButton, 4);
    I.click(this.fields.showCompletedTasksButton);
    I.wait(2);
  },

  //Patient editing methods

  
  refillPatient(firstName, middleName, lastName, MRN, birthday, gender, homePhone, mobilePhone, email){
    this.editFirstName(firstName);
    this.editMiddleName(middleName);
    this.editLastName(lastName);
    this.editMRN(MRN);
    I.wait();
    this.editBirthday(birthday);
    this.editGender(gender);
    this.editHomePhone(homePhone);
    this.editMobilePhone(mobilePhone);
    this.editEmail(email);
    this.editSavePatient();
    I.wait();
  },

  editFirstName(name){
    I.waitForElement(this.fields.firstNameBox);
    this.clearBox(this.fields.firstNameBox);
    I.wait();
    I.fillField(this.fields.firstNameBox, name);
    I.wait();
  },

  editMiddleName(name){
    I.waitForElement(this.fields.middleNameBox);
    this.clearBox(this.fields.middleNameBox);
    I.wait();
    I.fillField(this.fields.middleNameBox, name);
    I.wait();
  },

  editLastName(name){
    I.waitForElement(this.fields.lastNameBox);
    this.clearBox(this.fields.lastNameBox);
    I.wait();
    I.fillField(this.fields.lastNameBox, name);
    I.wait();
  },
  
  editMRN(mrn){
    I.waitForElement(this.fields.mrnBox);
    this.clearBox(this.fields.mrnBox);
    I.wait();
    I.fillField(this.fields.mrnBox, mrn);
    I.wait();
  },

  editBirthday(code){
    I.waitForElement(this.fields.birthdayBox);
    this.clearBox(this.fields.birthdayBox);
    I.wait();
    I.fillField(this.fields.birthdayBox, code);
    I.wait();
  },

  editGender(gender){
    I.waitForElement(this.fields.genderShield, 3);
    I.click(this.fields.genderShield);
    I.wait();
    //pause();
    if(gender.toUpperCase()=='MALE'){
      I.waitForElement(this.fields.genderMale, 4);
      I.click(this.fields.genderMale);
    }else if(gender.toUpperCase()=='FEMALE'){
      I.waitForElement(this.fields.genderFemale, 4);
      I.click(this.fields.genderFemale);
    } else {
      I.waitForElement(this.fields.genderOther, 4);
      I.click(this.fields.genderOther);
    }
    I.wait();
  },
  
  editHomePhone(code){
    //pause();
    I.waitForElement(this.fields.homePhoneBox, 4);
    I.scrollPageToTop();
    I.wait(3);
    this.clearBox(this.fields.homePhoneBox);
    I.wait();
    I.fillField(this.fields.homePhoneBox, code);
    I.wait();
  },

  editMobilePhone(code){
    I.waitForElement(this.fields.mobilePhoneBox, 4);
    this.clearBox(this.fields.mobilePhoneBox);
    I.wait();
    I.fillField(this.fields.mobilePhoneBox, code);
    I.wait();
  },

  editEmail(code){
    I.waitForElement(this.fields.emailBox, 4);
    this.clearBox(this.fields.emailBox);
    I.wait();
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
    //pause();
    I.waitForElement(this.fields.addTaskInboxButton, 7);
    I.fillField(this.fields.addTaskInboxButton, taskName);
    I.waitForElement(this.fields.addTaskInboxSaveButton, 7);
    I.click(this.fields.addTaskInboxSaveButton);
    I.wait();
  },

  clickTaskCheckbox(taskNumber){
    const path = `#appHome > main > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(${1+(taskNumber*2)}) > div > div > div:nth-child(2) > div:nth-child(1) > div > span > svg`;
    I.waitForElement({css: path}, 3);
    //pause();
    I.moveCursorTo({css: path});
    I.wait();
    I.doubleClick({css: path});
    I.wait();
  },


  clearBox(path){
    I.waitForElement(path, 5);

    //pause();
    I.click(path);
    //I.pressKey(['CommandOrControl', 'A', 'Backspace']);
    //I.pressKey(['CommandOrControl', 'A']);
    //I.pressKeyDown(['CommandOrControl', 'A']);
    //I.pressKeyUp(['CommandOrControl', 'A']);
    for(n = 0; n<100; n++){
      I.pressKey('Backspace');
    }
    




    // I.doubleClick(path);
    // I.wait();
    // //I.pressKey(['CommandOrControl', 'A']);
    // I.pressKeyDown('CommandOrControl');
    // I.pressKey('A');
    // I.pressKeyUp('CommandOrControl');
    // I.wait();
    // I.pressKey('Backspace');
    // //I.clearField(path);


    I.wait();
  },


}
