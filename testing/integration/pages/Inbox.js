const { I } = inject();

module.exports = {
  fields: {
    // addTskBtn: {css: "button[type=button]"},
    // addTskBtn: {css: "button[variant=contained]"},
    addTskBtn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > button',
    },
    // tskDescription: {name: "description"},
    tskDescription: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(1) > div > div > textarea',
    },

    firstTsk: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3)',
    },

    tskDelete: {
      css:
        //'#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1)'
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1)'
    },

    exitUnmadeTaskButton: {
      css:
        "#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button"
    },

    exitNewTaskButton: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > button',
    },

    exitMadeTaskButton: {
      css:
        "#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > button"
    },

    //firstList: {css: "#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > ul > div"},
    filedInShield: {css: "#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > span"},

    //taskListTab: {css:'#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(4) > a'},
    taskListTab: {css: 'a[href="#/tasks"]'},

    inboxTab: { css: 'a[href="#/tasks/Inbox"]' },

    patientTab: {css: '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(5) > a'},

    userTab: {css: '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(6) > a'},

    logoutBtn: {css: '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(9) > a'},

    patientShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(2) > div > div > input'},
    patientSelector: {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(1)`},//Change out the last div:nth-child number

    assignedToShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(3) > div > div:nth-child(1)'},//Change the x in assignedToUnassign's last div:nth-child(x), to whichever user you want to assign.
    assignedToUnassigned: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(1)'},
  },


  // Functions

  logout(){
    I.waitForElement(this.fields.logoutBtn, 4);
    I.click(this.fields.logoutBtn);
    I.wait(2);
  },

  // TODO in custom_steps turn this into a universal open dropdown.
  openAddTaskDropdown() {
    I.waitForElement(this.fields.addTskBtn, 4);
    I.click(this.fields.addTskBtn);
    I.wait(2);
  },

  postNamedTask(name) {
    I.waitForElement(this.fields.tskDescription, 4);
    I.fillField(this.fields.tskDescription, name);
    I.pressKey('Enter');
    I.wait(2);
  },

  assignPatient(index){
    //pause()
    const path = `div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(${index})`;
    I.waitForElement(this.fields.patientShield, 5);
    I.click(this.fields.patientShield);
    I.wait(2);
    I.waitForElement(path, 2);
    I.click(path);
    I.wait(2);
  },

  clickTask(index) {
    index += 2;
    const taskTileLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(${index}) > div > div > div:nth-child(2) > div:nth-child(3)`;
    I.waitForElement(
      {css: taskTileLocator},4);
    I.click(
      {css: taskTileLocator});
    I.wait();
  },

  setFiledIn(index) {
    I.waitForElement(this.fields.filedInShield, 3);
    I.click(this.fields.filedInShield);
    I.wait(2);
    const path = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > ul > div:nth-child(${index})`};
    I.waitForElement(path, 3);
    I.click(path);
    I.wait(2);
  },

  exitMadeTask() {
    I.waitForElement(this.fields.exitMadeTaskButton, 3);
    I.click(this.fields.exitTaskButton);
    I.wait(2);
  },

  exitNewTask(){
    I.waitForElement(this.fields.exitNewTaskButton, 3);
    I.click(this.fields.exitNewTaskButton);
    I.wait(2);
  },

  exitFreshTask(){
    I.waitForElement(this.fields.exitUnmadeTaskButton, 3);
    I.click(this.fields.exitUnmadeTaskButton);
    I.wait();
  },

  clickInboxTab(){
    I.waitForElement(this.fields.inboxTab,4);
    I.click(this.fields.inboxTab);
    I.wait();
  },

  clickTaskListTab(){
    I.waitForElement(this.fields.taskListTab, 3);
    I.click(this.fields.taskListTab);
    I.wait(2);
  },

  clickPatientTab(){
    I.waitForElement(this.fields.patientTab);
    I.click(this.fields.patientTab);
    I.wait(2);
  },

  clickPeopleTab(){
    I.waitForElement(this.fields.userTab, 4);
    I.click(this.fields.userTab);
    I.wait(2);
  },

  destroyPickedTask() {
    I.waitForElement(this.fields.tskDelete, 5);
    I.click(this.fields.tskDelete);
    I.wait(2);
  },
};
