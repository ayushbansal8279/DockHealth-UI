const { I } = inject();

module.exports = {
  fields: {
    // addTskBtn: {css: 'button[type=button][variant=contained]'},
    addTskBtn: {css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > button > span:nth-child(2)'},

    tskDescription: {css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1)  > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(1) > div > div > textarea '},

    commentShield: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)'},

    commentBox: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)'},

    exitTskSidebar: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2)  > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button'},

    exitEditTskSidebar: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > button'},

    firstTsk: {css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3)'},

    flag: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3)  > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > svg > path'},

    numberOfActiveTsks: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(1) > div:nth-child(1)'},

    numberOfFlaggedTsks: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(2) > div:nth-child(1)'},

    numberOfDueTodayTsks: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(3) > div:nth-child(1)'},

    numberOfOverdueTsks: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2)  > div:nth-child(4) > div:nth-child(1)'},

    setDateBtnWcomments: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(3) > span'},
      //Comments add two to 4th element from the left. No clue why...
    setDateBtn: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > span'},

    dec18NumberWcomments: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(4) > div > span'},

    dec18BtnWcomments: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(4) > div'},
      //Comments also change a div:nth-child(3) to nth:child(5)
    dec4Btn: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4)  > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(4) > div'},
      
    saveDueDate: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > button:nth-child(2)'},
    //Without comments.
    saveDueDateWcomments: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(5) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > button:nth-child(2)'},
  },

  openTaskSidebar() {
    I.waitForElement(this.fields.addTskBtn, 5);
    I.click(this.fields.addTskBtn);
  },

  postTask(title) {
    I.waitForText('Add a task', 5);
    //this.frustration();
    I.fillField(this.fields.tskDescription, title);
    I.pressKey('Enter');
  },

  postComment(comment){
    I.waitForElement(this.fields.commentShield, 5);
    I.click(this.fields.commentShield);
    I.waitForElement(this.fields.commentBox, 5);
    I.fillField(this.fields.commentBox, comment);
    I.pressKey('Enter');
  },

  exitFreshTask(){
    I.waitForElement(this.fields.exitTskSidebar, 4);
    I.click(this.fields.exitTskSidebar);
  },




  openEditTaskSidebar(taskIndex) {
    tskSidebarLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(${taskIndex + 2}) > div > div > div:nth-child(2) > div:nth-child(3)`;
    I.waitForElement({
      css: tskSidebarLocator,
    }, 5);
    I.click({
      css: tskSidebarLocator,
    });
  },

  deleteOpenedTask(taskIndex) {
    deleteBtnLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(${taskIndex + 2}) > div > div > div:nth-child(2) > form > div:nth-child(2) > button:nth-child(1) > span:nth-child(1)`;
    I.waitForElement({css:
      deleteBtnLocator,
    },4);
    I.click({css: 
      deleteBtnLocator,
    });
  },
  
  flagOpenedTask(){
    I.waitForElement(this.fields.flag, 4);
    I.click(this.fields.flag);
  },

  exitOpenedTask(){
    I.waitForElement(this.fields.exitEditTskSidebar, 4);
    I.click(this.fields.exitEditTskSidebar);
  },

  async grabFlaggedTsks(){
    I.waitForElement(this.fields.numberOfFlaggedTsks, 4);
    return await I.grabTextFrom(this.fields.numberOfFlaggedTsks);
  },

  async grabActiveTsks(){
    I.waitForElement(this.fields.numberOfActiveTsks, 4);
    return await I.grabTextFrom(this.fields.numberOfActiveTsks);
  },

  async grabDueTodayTsks(){
    I.waitForElement(this.fields.numberOfDueTodayTsks, 4);
    return await I.grabTextFrom(this.fields.numberOfDueTodayTsks);
  },

  async grabOverdueTsks(){
    I.waitForElement(this.fields.numberOfOverdueTsks, 4);
    return await I.grabTextFrom(this.fields.numberOfOverdueTsks);
  },

  addDueDate(week, day){
    I.waitForElement(this.fields.setDateBtn, 4);
    I.click(this.fields.setDateBtn);
    //I.click("Set a due date");
    I.click(`#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1)  > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(${week}) > div:nth-child(${day}) > div`);
    I.click(this.fields.saveDueDate);                                                                                                                                        //This div becomes nth-child(5) if the task has comments.
  }


};