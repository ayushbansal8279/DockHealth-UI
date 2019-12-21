const { I } = inject();
var assert = require('assert');


module.exports = {
  fields: {
    // Immediately Accessible Buttons.
    logoutBtn: {
      css:
        '#appHome > main > div > div:nth-child(1) > div > ul > div:nth-child(9) > a',
    },

    addTskBtn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > button > span:nth-child(2)',
    },

    forMeBtn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)'
    },

    allBtn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)'
    },

    notificationsBtn: {
      css:
        '#appHome > main > div > div:nth-child(1) > div > div > div > div > header > div > div:nth-child(2) > button > span:nth-child(1) > span:nth-child(3)'
    },

    addUserBtn: {
      css:
        '#appHome > main > div > div:nth-child(1) > div > div > div > div > header > div > div:nth-child(3) > div > button:nth-child(1) > div'
    },



    //Add User dropdown
    inviteToListBtn: {
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



    firstTsk: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3)',
    },



    //Task Manipulation addresses.
    tskDescription: {
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

    flag: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3)  > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > svg > path',
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

    setDateBtnWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(3) > span',
    },
    // Comments add two to 4th element from the left. No clue why...
    setDateBtn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span',
    },

    saveDueDate: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > button:nth-child(2)',
    },

    saveDueDateWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > button:nth-child(2)',
    },
    




    numberOfActiveTsks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(1) > div:nth-child(1)',
    },

    numberOfFlaggedTsks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(2) > div:nth-child(1)',
    },

    numberOfDueTodayTsks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(3) > div:nth-child(1)',
    },

    numberOfOverdueTsks: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(4) > div:nth-child(1)',
    },
    
    

  //Reference Dates.  
    
    dec18NumberWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(4) > div > span',
    },

    dec18BtnWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(4) > div',
    },

    dec4Btn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4)  > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(4) > div',
    },

  },

  openTaskSidebar() {
    I.waitForElement(this.fields.addTskBtn, 5);
    I.click(this.fields.addTskBtn);
  },

  exitFreshTask() {
    I.waitForElement(this.fields.exitFreshSidebar, 4);
    I.click(this.fields.exitFreshSidebar);
    I.wait(2);
  },

  openEditSidebar(taskIndex) {
    tskSidebarLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(${taskIndex + 2}) > div > div > div:nth-child(2) > div:nth-child(3)`;
    I.waitForElement({css: tskSidebarLocator}, 10);
    I.click({css: tskSidebarLocator});
  },

  postTask(title) {
    //I.waitForText('Add a task', 5);
    I.waitForElement(this.fields.tskDescription, 5);
    I.fillField(this.fields.tskDescription, title);
    I.pressKey('Enter');
  },

  postComment(comment) {
    I.waitForElement(this.fields.commentShield, 5);
    I.click(this.fields.commentShield);
    I.waitForElement(this.fields.commentBox, 5);
    I.fillField(this.fields.commentBox, comment);
    I.pressKey('Enter');
  },

  attachPatient(index) {
    patientLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2)  > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > div > div > div:nth-child(${index + 1})`
    I.waitForElement(this.fields.patientShield, 4);
    I.click(this.fields.patientShield);
    I.waitForElement({css: patientLocator}, 4);
    I.click({css: patientLocator});
  },

  assignTask(index) {
    assignmentLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2)  > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > div > div > div:nth-child(${index + 1})`;
    I.waitForElement(this.fields.assignedShield, 4);
    I.click(this.fields.assignedShield);
    I.waitForElement({css: assignmentLocator}, 4);
    I.click({css: assignmentLocator});
  },

  //TODO Check if the task has a comment on it, and adapt to the different path.
  addDueDate(week, day) {
    const dateBtn = {css:
      `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1)  > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(${week}) > div:nth-child(${day}) > div`,
    };
    I.waitForElement(this.fields.setDateBtn, 4);
    I.click(this.fields.setDateBtn);
    // I.click("Set a due date");
    I.waitForElement(dateBtn, 4);
    I.click(dateBtn);
    I.waitForElement(this.fields.saveDueDate);
    I.click(this.fields.saveDueDate); // This div becomes nth-child(5) if the task has comments.
    I.wait(2);
  },

  flagTask() {
    I.waitForElement(this.fields.flag, 4);
    I.click(this.fields.flag);
  },

  exitTask() {
    I.waitForElement(this.fields.exitEditSidebar, 4);
    I.click(this.fields.exitEditSidebar);
    I.wait(2);
  },

  async deleteTask(taskIndex) {
    deleteBtnLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${taskIndex + 2}) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1)`;
    I.waitForElement({ css: deleteBtnLocator }, 4);
    I.click({ css: deleteBtnLocator });
    I.wait(2);
  },


  //The HUD is fucky, tell Nitin tommorow. It registers stuff due today as overdue.
  //It also registers stuff due tommorow as stuff due today, so someone missed a +1 somewhere.
  //
  async checkTsksHUD(active, flagged, due, overdue) {
    //console.log('Oof ' + await this.grabActiveTsks());
    assert((await this.grabActiveTsks())>=active, `Active tasks lower than target ${active}`);
    assert((await this.grabFlaggedTsks())>=flagged, `Flagged tasks lower than target ${flagged}`);
    assert((await this.grabDueTodayTsks())>=due, `Due today tasks lower than target ${due}`);
    assert((await this.grabOverdueTsks())>=overdue, `Overdue tasks lower than target ${overdue}`);
    I.wait(2);
  },


  async checkFlaggedTsks(target) {
    if(await this.grabFlaggedTsks()<target){
      throw `Flagged Tasks lower than target ${target}`;
    } else {
      //console.log("Yow you passed the flag check!");
    }
  },

  async grabFlaggedTsks() {
    I.waitForElement(this.fields.numberOfFlaggedTsks, 9);
    return await I.grabTextFrom(this.fields.numberOfFlaggedTsks);
  },

  async grabActiveTsks() {
    I.waitForElement(this.fields.numberOfActiveTsks, 9);
    return await I.grabTextFrom(this.fields.numberOfActiveTsks);
  },

  async grabDueTodayTsks() {
    I.waitForElement(this.fields.numberOfDueTodayTsks, 9);
    return await I.grabTextFrom(this.fields.numberOfDueTodayTsks);
  },

  async grabOverdueTsks() {
    I.waitForElement(this.fields.numberOfOverdueTsks, 9);
    return await I.grabTextFrom(this.fields.numberOfOverdueTsks);
  },

};