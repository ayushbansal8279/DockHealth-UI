const { I } = inject();

module.exports = {
  fields: {
    // addTskBtn: {css: "button[type=button]"},
    // addTskBtn: {css: "button[variant=contained]"},
    addTskBtn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > button',
    },
    // tskDescription: {name: "description"},
    tskDescription: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(1) > div > div > textarea',
    },

    firstTsk: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3)',
    },

    tskDelete: {css:'#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)'},

    exitUnmadeTaskButton: {
      css:
        "#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button"
    },

    exitMadeTaskButton: {
      css:
        "#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > button"
    },

    filedInShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > span'},

    //taskListTab: {css:'#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(4) > a'},
    taskListTab: {css: 'a[href="#/tasks"]'},

    inboxTab: { css: 'a[href="#/tasks/Inbox"]' },

    patientTab: {css: '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(5) > a'},

    userTab: {css: '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(6) > a'},

    logoutBtn: {css: '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(9) > a'},

    //patientShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div > div > div > span'},
    //patientShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(2) > div > div > div > span'},
    patientShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div > div > div > span'},
    patientSelector: {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(1)`},//Change out the last div:nth-child number

    assignedToEmblem: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(2)'},
    assignedToShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(1) > input'},
    //OLDassignedToUnassigned: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(1)'}, //Change the x in assignedToUnassign's last div:nth-child(x), to whichever user you want to assign.
    assignedToUnassigned: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(1)'},
 
 
 
    //NEW STUFF
    searchBar: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div > input'},
    
    showCompletedTasksButton: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(2) > button'},
    //indexTaskPath: {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(${1+(2*index)}) > div > div > div:nth-child(2) > div:nth-child(4) > a`}, 
    flagTaskButton: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > svg > path'},
    setADueDateShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span'},
    
    filterShield: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div > button:nth-child(2)'},
    filterOptionOne: {css: 'body > div.jss2100 > div:nth-child(2) > ul > div:nth-child(1)'},

    firstTaskCheckbox:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(1) > div > span > svg'},
  },

  addDueDate(week, day) {
    const targetDate = {css:
      `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(${week}) > div:nth-child(${day}) > div > span`,
    };
    const saveDueDate={css:
      `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > button:nth-child(2)`
    };
    I.wait();
    //pause();
    I.waitForElement(this.fields.setADueDateShield, 4);
    //pause();
    I.click(this.fields.setADueDateShield);
    // I.click("Set a due date");
    I.wait();
    I.waitForElement(targetDate, 4);
    I.click(targetDate);
    I.wait();
    I.waitForElement(saveDueDate);
    I.click(saveDueDate); // This div becomes nth-child(5) if the task has comments.
    I.wait();
  },

  pickFilter(index, stupidbullshit){//0 Resets the filter. stupidbullshit is an unknown variable for now.
    I.waitForElement(this.fields.filterShield, 3);
    I.click(this.fields.filterShield);
    I.wait();
    if(index<1){
      //Empty if blocks arent very ca$h money of me.
    } else {
      const path = {css: `body > div:nth-child(${stupidbullshit}) > div:nth-child(2) > ul > div:nth-child(${index})`};
      I.waitForElement(path, 3);
      I.click(path);
      I.wait();
    }
  },

  // Functions
  makeSearch(search){
    I.waitForElement(this.fields.searchBar, 5);
    I.fillField(this.fields.searchBar, search);
    I.wait(2);
  },

  logout(){
    I.waitForElement(this.fields.logoutBtn, 4);
    I.click(this.fields.logoutBtn);
    I.wait(2);
  },

  // TODO in custom_steps turn this into a universal open dropdown.
  openAddTaskDropdown() {
    I.waitForElement(this.fields.addTskBtn, 14);
    I.click(this.fields.addTskBtn);
    I.wait(2);
  },

  clickTaskCheckbox(index) {
    const checkBoxLocator = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(${1+(2*index)}) > div > div > div:nth-child(2) > div:nth-child(1) > div > span > svg`};
    I.waitForElement(checkBoxLocator, 4);
    I.click(checkBoxLocator);
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

  deleteTask(){
    I.waitForElement(this.fields.tskDelete, 3);
    I.click(this.fields.tskDelete);
    I.wait();
  },

  postNamedTask(name) {
    I.waitForElement(this.fields.tskDescription, 43);
    I.fillField(this.fields.tskDescription, name);
    I.wait();
    I.pressKey('Enter');
    I.wait();
  },

  assignPatient(index){
    //pause()
    const path = `div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(${index})`;
    I.waitForElement(this.fields.patientShield, 5);
    I.click(this.fields.patientShield);
    I.wait(1);
    I.waitForElement(path, 4);
    I.click(path);
    I.wait(1);
  },

  assignUser(index){
    I.waitForElement(this.fields.assignedToShield, 4);
    I.click(this.fields.assignedToShield);
    I.wait();
    const path = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(${index})`};
    I.waitForElement(path, 3);
    I.click(path);
  },

  setFiledIn(index) {
    I.waitForElement(this.fields.filedInShield, 3);
    I.click(this.fields.filedInShield);
    I.wait(2);
    //const path = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > ul > div:nth-child(${index})`};
    const path = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > ul > div:nth-child(${index})`};
    I.waitForElement(path, 3);
    I.click(path);
    I.wait(2);
  },

  exitMadeTask() {
    I.waitForElement(this.fields.exitMadeTaskButton, 3);
    I.click(this.fields.exitMadeTaskButton);
    I.wait(2);
  },

  exitUnmadeTask(){
    I.waitForElement(this.fields.exitUnmadeTaskButton, 3);
    I.click(this.fields.exitUnmadeTaskButton);
    I.wait();
  },


  clickShowCompletedTasks(){
    I.waitForElement(this.fields.showCompletedTasksButton, 4);
    I.click(this.fields.showCompletedTasksButton);
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

};
