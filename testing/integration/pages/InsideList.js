const { I } = inject();

module.exports = {
  fields: {
    // addTskBtn: {css: 'button[type=button][variant=contained]'},
    addTskBtn: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > button > span:nth-child(2)',
    },
    // tskDescription: {css: 'textarea[name=description]'},
    tskDescription: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1)  > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(1) > div > div > textarea ',
    },

    commentShield: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
    },

    commentBox: {css:
      '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)',
    },

    firstTsk: {
      css:
        '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(3)',
    },

    

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
    I.waitForText('+ add a subtask', 5);
    I.click(this.fields.commentShield)
    I.fillField(this.fields.commentBox, comment);
    I.pressKey('Enter');
  },



  openEditTaskSidebar(taskIndex) {
    tskSidebarLocator = `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(${taskIndex + 2}) > div > div > div:nth-child(2) > div:nth-child(3)`;
    I.waitForElement({
      css: tskSidebarLocator,
    }, 4);
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
  
};