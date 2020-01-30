const { I } = inject();
var assert = require('assert');

let container = require('codeceptjs').container;
// get object with all helpers
let helpers = container.helpers();
var puppeteerHelper = helpers['Puppeteer']

module.exports = {
  fields: {
    // Immediately Accessible Buttons.
    logoutButton: {
      css:
        '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(9) > a',
    },

    addTaskButton: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > button > span:nth-child(2)',
    },

    forMeButton: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)'
    },

    allButton: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)'
    },

    notificationsButton: {
      css:
        '#appHome > main > div > div:nth-child(1) > div > div > div > div > header > div > div:nth-child(2) > button > span:nth-child(1) > span:nth-child(3)'
    },

    addUserButton: {
      css:
        '#appHome > main > div > div:nth-child(1) > div > div > div > div > header > div > div:nth-child(3) > div > button:nth-child(1) > div'
    },

    searchBar: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > input'
    },

    taskListContainer: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3)  > div > div > div > div:nth-child(1)'
    },

    taskListContainerElements: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3)  > div > div > div > div:nth-child(1) > div'
    },

    //Add User dropdown
    inviteToListButton: {
      css:
        'body > div:nth-child(6) > div:nth-child(2) > button'
    },

    membershipShield: {
      css:
        '#\31 67 > div > button'
    },

    removeMemberFromList: {
      css:
        '#long-menu > div:nth-child(2) > ul > li:nth-child(1)'
    },

    removeMemberAdminStatus: {
      css:
        '#long-menu > div:nth-child(2) > ul > li:nth-child(2)'
    },



    firstTask: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3)',
    },



    //Subtask Addresses
    addASubtaskWOindex: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(${index+3}) > span',
    },

    subtaskTitle: {
      css:
        `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(1) > div > div > textarea`,
    },

    subtaskAssignedShield: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(1)', //> input
    },

    subtaskAssignedFirstUser: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(1) > span'
    },

    subtaskSaveButton:{
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3)  > div > div > div:nth-child(2) > div:nth-child(4) > button:nth-child(2)'
    },

    subtaskExitButton: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3)  > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)'
    },





    //Task Manipulation addresses.
    taskDescription: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1)  > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(1) > div > div > textarea ',
    },

    commentShield: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
    },

    commentBox: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)',
    },

    exitFreshSidebar: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button',
    },

    exitEditSidebar: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > button > span',
    },

    exitFlaggedFilterSidebar: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(4) > div > div > div:nth-child(2) > form > div:nth-child(1)> div:nth-child(1) > div:nth-child(2)  > div:nth-child(3) > button'
    },

    flag: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > svg > path',
    },

    unFlag: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(4) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > svg > path'
    },

    assignedShield: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(1)',
    },

    assignedFirstUsr: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2)  > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > div > div > div:nth-child(2)',
    },

    assignedUnassignedUsr: {
      css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2)  > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > div > div > div:nth-child(1)',
    },

    patientOptionOne: {
      css:
      `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)`
    },

    patientShield: {
      css:
        `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2)`
    },
      // Comments add two to 4th element from the left. No clue why...


    setDateButtonWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(3) > span',
    },
   
    setDateButton: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span',
    },

    setDateButtonFlaggedFilter: {
      css:
        '#appHome > main > div > div:nth-child(2)  > div > div:nth-child(2) > div:nth-child(4) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span'
    },

    saveDueDate: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > button:nth-child(2)',
    },

    saveDueDateWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > button:nth-child(2)',
    },
  


    //Filter locations
    filtersWrapper:{
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)'
    },

    activeTasks:{
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(1)'
    },

    flaggedTasks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(2)'
    },

    dueTodayTasks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(3)'
    },

    overdueTasks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(4)'
    },




    numberOfActiveTasks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(1) > div:nth-child(1)',
    },

    numberOfFlaggedTasks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(2) > div:nth-child(1)',
    },

    numberOfDueTodayTasks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(3) > div:nth-child(1)',
    },

    numberOfOverdueTasks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(4) > div:nth-child(1)',
    },
    
    

  //Reference Dates.  
    
    dec18NumberWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(4) > div > span',
    },

    dec18ButtonWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(4) > div',
    },

    dec4Button: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4)  > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(4) > div',
    },

  },

  //Task interaction
  openNewTaskSidebar() {
    I.waitForElement(this.fields.addTaskButton, 5);
    I.click(this.fields.addTaskButton);
    I.wait();
  },

  //This path fails to select certain tasks. 
  openEditSidebar(taskIndex, filtered, brokenGarbage) {//Intended filter is the filter thats selected starting with 1 as all active tasks
    //pause();
    taskSidebarLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${3+filtered}) > div > div > div > div:nth-child(1) > div:nth-child(${taskIndex+2}) > div > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(${2-brokenGarbage}) > div > span > span`;
    I.waitForElement({css: taskSidebarLocator}, 11);
    I.scrollPageToTop(); //({css: taskSidebarLocator});
    I.wait(2);
    I.click({css: taskSidebarLocator});
    I.wait();
  },

  postTask(title) {
    //I.waitForText('Add a task', 5);
    I.waitForElement(this.fields.taskDescription, 5);
    I.fillField(this.fields.taskDescription, title);
    I.pressKey('Enter');
    I.wait(2);
  },

  //TODO using postComment screws up the paths, and makes deleting a task impossible.
  postComment(comment) {
    I.waitForElement(this.fields.commentShield, 5);
    I.click(this.fields.commentShield);
    I.wait();
    I.waitForElement(this.fields.commentBox, 5);
    I.fillField(this.fields.commentBox, comment);
    I.pressKey('Enter');
    I.wait();
  },

  attachPatient(index) {
    patientLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2)  > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > div > div > div:nth-child(${index})`
    I.waitForElement(this.fields.patientShield, 4);
    I.wait();
    I.click(this.fields.patientShield);
    I.waitForElement({css: patientLocator}, 4);
    I.wait();
    I.click({css: patientLocator});
    I.wait();
  },

  assignTask(index) { //TODO this method only works 50% of the time... It misses the assignedShield click
    //assignmentLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2)  > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > div > div > div:nth-child(${index + 1})`;
    assignmentLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(${index})`;
    I.waitForElement(this.fields.assignedShield, 3);
    I.wait();
    //pause();
    I.scrollTo(this.fields.assignedShield);
    //pause();
    //I.click(this.fields.assignedShield);
    I.click(this.fields.assignedShield);
    I.waitForElement({css: assignmentLocator}, 4);
    I.wait();
    I.click({css: assignmentLocator});
    I.wait();
  },

  addDueDate(week, day, intendedFilter) {
    const dateButton = {css:
      `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${3+intendedFilter}) > div > div > div:nth-child(2) > form > div:nth-child(1)  > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(${week}) > div:nth-child(${day}) > div`,
    };
    const setDateButton = {css:
      `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${3+intendedFilter}) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span`
      //`#appHome > main > div > div:nth-child(2)  > div > div:nth-child(2) > div:nth-child(${3+intendedFilter}) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span`
    };
    //#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span
    const saveDueDate={css:
      `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${3+intendedFilter}) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > button:nth-child(2)`
    };
    I.wait(2);
    //pause();
    I.waitForElement(setDateButton, 4);
    //pause();
    I.click(setDateButton);
    // I.click("Set a due date");
    I.wait();
    I.waitForElement(dateButton, 4);
    I.click(dateButton);
    I.waitForElement(saveDueDate);
    I.click(saveDueDate); // This div becomes nth-child(5) if the task has comments.
    I.wait(2);
  },

  flagTask() {
    I.waitForElement(this.fields.flag, 2);
    I.click(this.fields.flag);
    I.wait(2);
  },

  unflagTask() {
    I.waitForElement(this.fields.unFlag, 2);
    I.click(this.fields.unFlag);
    I.wait(2);
  },

  markTaskComplete(taskIndex){
    //const Box = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${3 + filtered}) > div > div > div > div:nth-child(1) > div:nth-child(${taskIndex + 2}) > div > div > div:nth-child(2) > div:nth-child(1) > div`}
    const checkBox = {css: `#appHome > main > div > div:nth-child(2)  > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1)  > div:nth-child(${taskIndex + 2}) > div > div > div:nth-child(2) > div:nth-child(1) > div`}
    I.waitForElement(checkBox, 2);
    I.click(checkBox);
    I.wait(2);
  },

  changeAssignedUserNoSidebar(taskIndex, filtered, userIndex){ //Selecting nonsidebar faces is messy.
    const faceBox = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${3 + filtered}) > div > div > div > div:nth-child(1) > div:nth-child(${taskIndex + 2}) > div > div > div:nth-child(2) > div:nth-child(2) > button`}
    //const userChooser = {css: `body > div:nth-child(7) > div:nth-child(2) > div:nth-child(2) > button:nth-child(${userIndex})`}
    const userChooser = {id: '-1'};
    I.waitForElement(faceBox,2);
    I.click(faceBox);
    //pause();
    I.waitForElement(userChooser,2);
    I.click(userChooser);
    I.wait(2);
  },

  exitTask(filtered) {
    const exitEditSidebar = {css: 
      `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${3+filtered}) > div > div > div:nth-child(2) > form > div:nth-child(1)> div:nth-child(1) > div:nth-child(2)  > div:nth-child(3) > button`};
    I.waitForElement(exitEditSidebar, 2);
    I.click(exitEditSidebar);
    I.wait(4);
  },

  clickForMe(){
    I.waitForElement(this.fields.forMeButton,2);
    I.click(this.fields.forMeButton);
    I.wait();
  },

  clickAll(){
    I.waitForElement(this.fields.allButton,2);
    I.click(this.fields.allButton);
    I.wait();
  },



  
  //Subtasks
  addSubtask(index, title) {
    addSubtaskLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(${index+4}) > span`;
    //pause();
    I.waitForElement({css: addSubtaskLocator}, 4);
    I.click({css: addSubtaskLocator});
    //pause();
    I.waitForElement(this.fields.subtaskTitle, 4);
    I.fillField(this.fields.subtaskTitle, title);
    I.wait();
    //this.saveSubtask();
  },

  assignSubtaskTo(userIndex){
    //TODO this method refuses to click assignedLocator. Explitives
    assignedLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(${userIndex})`;
    
    I.scrollPageToTop();
    I.waitForElement(this.fields.subtaskAssignedShield);
    I.wait();
    //pause();
    I.click(this.fields.subtaskAssignedShield);
    //pause();
    //I.wait(4);
    I.waitForElement({css: assignedLocator}, 4);
    I.click({css: assignedLocator});
    //I.click({css: assignedLocator});
    I.wait();
  },

  saveSubtask() {
    I.waitForElement(this.fields.subtaskSaveButton, 3);
    I.click(this.fields.subtaskSaveButton);
    I.wait();
  },

  exitSubtask() {
    I.waitForElement(this.fields.subtaskExitButton);
    I.click(this.fields.subtaskExitButton);
    I.wait(1);
  },


  //Filterss
  clickFilter(index){//Index starts at 1 for all tasks
    //pause();

    I.waitForElement(this.fields.filtersWrapper, 3);
    const address = `${this.fields.filtersWrapper.css} > div:nth-child(${index})`;
    I.wait();
    I.click(address);
    I.wait(3);
  },

  //Searchbar

  search(input){
    I.waitForElement(this.fields.searchBar, 3);
    I.fillField(this.fields.searchBar, input);
    I.wait(1);
  },

  //Fancy Stuff

  async grabShownTasks(){
    I.waitForElement(this.fields.taskListContainer, 3);
    I.seeNumberOfElements(this.fields.taskListContainerElements, 1);
    /*
    const elements = await puppeteerHelper._locate({react: 'TaskContainer'});
    console.log("elements: "+elements.length)
    puppeteerHelper._locate({react: 'TaskContainer'}).then((item)=>{
      console.log(item)
    })
    console.log(JSON.stringify(elements))
    return elements;
    */
    return
  },

  async deleteTask(taskIndex, filtered) { //The path to the delete button is changed if a filter is applied
    //deleteButtonLocatorV2 = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${taskIndex + 2 + filtered}) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1)`;
    const deleteButtonLocator = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${taskIndex+2+filtered}) > div > div > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)`}
    //deleteButtonLocatorFORFIRSTFLAGGEDTSK = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(4) > div > div > div:nth-child(2)  > form > div:nth-child(2) > button:nth-child(1)`;
    I.wait();
    I.waitForElement(deleteButtonLocator, 4);
    //TODO trying to reach the delete button blows up the process...
    // I.scrollTo(deleteButtonLocator);
    // I.wait();
    I.wait(4);
    I.click(deleteButtonLocator);
    I.wait(2);
  },

  async checkTasksHUD(active, flagged, due, overdue) {
    //console.log('Oof ' + await this.grabActiveTasks());
    assert((await this.grabActiveTasks())>=active, `Active tasks lower than target ${active}`);
    assert((await this.grabFlaggedTasks())>=flagged, `Flagged tasks lower than target ${flagged}`);
    assert((await this.grabDueTodayTasks())>=due, `Due today tasks lower than target ${due}`);
    assert((await this.grabOverdueTasks())>=overdue, `Overdue tasks lower than target ${overdue}`);
    I.wait(2);
  },

  async checkFlaggedTasks(target) {
    if(await this.grabFlaggedTasks()<target){
      throw `Flagged Tasks lower than target ${target}`;
    } else {
      //console.log("Yow you passed the flag check!");
    }
  },

  async grabFlaggedTasks() {
    I.waitForElement(this.fields.numberOfFlaggedTasks, 9);
    return await I.grabTextFrom(this.fields.numberOfFlaggedTasks);
  },

  async grabActiveTasks() {
    I.waitForElement(this.fields.numberOfActiveTasks, 9);
    return await I.grabTextFrom(this.fields.numberOfActiveTasks);
  },

  async grabDueTodayTasks() {
    I.waitForElement(this.fields.numberOfDueTodayTasks, 9);
    return await I.grabTextFrom(this.fields.numberOfDueTodayTasks);
  },

  async grabOverdueTasks() {
    I.waitForElement(this.fields.numberOfOverdueTasks, 9);
    return await I.grabTextFrom(this.fields.numberOfOverdueTasks);
  },

};