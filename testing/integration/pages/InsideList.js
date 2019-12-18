const { I } = inject();

module.exports = {
  fields: {
    // addTskBtn: {css: 'button[type=button][variant=contained]'},
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

    firstTsk: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3)',
    },




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

    exitTskSidebar: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2)  > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button',
    },

    exitEditTskSidebar: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > button',
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
    
    
    
    
    dec18NumberWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(4) > div > span',
    },

    dec18BtnWcomments: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(4) > div',
    },
    // Comments also change a div:nth-child(3) to nth:child(5)
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
    I.waitForElement(this.fields.exitTskSidebar, 4);
    I.click(this.fields.exitTskSidebar);
  },

  openEditTaskSidebar(taskIndex) {
    tskSidebarLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(${taskIndex +
      2}) > div > div > div:nth-child(2) > div:nth-child(3)`;
    I.waitForElement(
      {
        css: tskSidebarLocator,
      },
      5,
    );
    I.click({
      css: tskSidebarLocator,
    });
  },

  postTask(title) {
    I.waitForText('Add a task', 5);
    // this.frustration();
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

  assignOpenedTask(index) {
    assignmentLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2)  > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > div > div > div:nth-child(${index + 1})`;
    I.waitForElement(this.fields.assignedShield, 4);
    I.click(this.fields.assignedShield);
    I.waitForElement({css: assignmentLocator}, 4);
    I.click({css: assignmentLocator});
  },

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
  },

  flagOpenedTask() {
    I.waitForElement(this.fields.flag, 4);
    I.click(this.fields.flag);
  },

  exitOpenedTask() {
    I.waitForElement(this.fields.exitEditTskSidebar, 4);
    I.click(this.fields.exitEditTskSidebar);
  },

  deleteOpenedTask(taskIndex) {
    deleteBtnLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${taskIndex + 2}) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1) > span:nth-child(1)`;
    I.waitForElement({ css: deleteBtnLocator }, 4);
    I.click({ css: deleteBtnLocator });
  },


  clickForMeBtn(){
    I.waitForElement(this.fields.forMeBtn, 3);
    I.click(this.fields.forMeBtn);
  },

  clickAllBtn(){
    I.waitForElement(this.fields.allBtn, 3);
    I.click(this.fields.allBtn);
  },





  async grabFlaggedTsks() {
    I.waitForElement(this.fields.numberOfFlaggedTsks, 4);
    return await I.grabTextFrom(this.fields.numberOfFlaggedTsks);
  },

  async grabActiveTsks() {
    I.waitForElement(this.fields.numberOfActiveTsks, 4);
    return await I.grabTextFrom(this.fields.numberOfActiveTsks);
  },

  async grabDueTodayTsks() {
    I.waitForElement(this.fields.numberOfDueTodayTsks, 4);
    return await I.grabTextFrom(this.fields.numberOfDueTodayTsks);
  },

  async grabOverdueTsks() {
    I.waitForElement(this.fields.numberOfOverdueTsks, 4);
    return await I.grabTextFrom(this.fields.numberOfOverdueTsks);
  },

};
