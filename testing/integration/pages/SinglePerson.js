const { I } = inject();

module.exports = {

  fields:{
    inboxAddTaskField:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > form > div > div > input'},
    inboxAddTaskButton:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > form > div > div > div:nth-child(4) > button'},

    archiveThisPersonButton:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > button'},
    exitArchivePopup:{css: 'body > div.jss271.jss620  > div:nth-child(2) > div > div > button'},
    acceptArchivePopup:{css: 'body > div.jss271.jss620  > div:nth-child(2) > div > div > div:nth-child(5) > button'},
    
    filterShield:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > button:nth-child(2)'},
    fullView:{css:'#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > button:nth-child(1) > div:nth-child(1)'},
    slimView:{css:'#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > button:nth-child(1) > div:nth-child(2)'},
    
    searchBar:{css:'#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div > div > div > div > input'},


    inboxNumOfTasks:{css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(2)'},



    //Editing Tasks
    editBarExitButton: {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > button'},

    //xthTaskPath: #appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1+${xth*2})
    editBarTaskName: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(2)',

    editBarPatientInformation: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div > div',
    //editBarPatientInfoX: #appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(X)
  
    editBarPersonShield: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(1)',
    //editBarUnassignedPerson: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div',
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

  grabNumberOfTasks(){
    I.waitForElement(this.fields.inboxNumOfTasks, 4);
    var numba = I.grabTextFrom(this.fields.inboxNumOfTasks);
    return parseInt(numba);
  },
  //NEW MEMES

  clickArchivePerson(){
    I.waitForElement(this.fields.archiveThisPersonButton, 4);
    I.click(this.fields.archiveThisPersonButton);
    I.wait(2);
  },

  clickSlimView(){
    I.waitForElement(this.fields.slimView,4);
    I.click(this.fields.slimView);
    I.wait();
  },

  clickFullView(){
    I.waitForElement(this.fields.slimView, 4);
    I.click(this.fields.slimView);
    I.wait();
  },


  addTask(taskName){
    I.waitForElement(this.fields.inboxAddTaskField, 5);
    I.fillField(this.fields.inboxAddTaskField, taskName);
    I.wait(2);
    I.waitForElement(this.fields.inboxAddTaskButton, 5);
    I.scrollTo(this.fields.inboxAddTaskButton);
    I.wait();
    I.click(this.fields.inboxAddTaskButton);
    I.wait(2);
  },

  clickTask(number){
    //The path to an individual task in the inbox list is changing between tests. Its the first div with an nth:child
    const path = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(${1+(2*number)}) > div > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div > span > span`};
    I.waitForElement(path, 5);
    I.click(path);
    I.wait();
  },

  exitEditTaskBar(){
    I.waitForElement(this.fields.editBarExitButton, 4);
    I.click(path);
    I.wait();
  },

  editTaskName(name){
    I.waitForElement(this.fields.editBarTaskName, 5);
    I.click(this.fields.editBarTaskName);
    I.wait();
    I.clearField(this.fields.editBarTaskName); //This line never fires.
    I.wait();
    I.fillField(this.fields.editBarTaskName, name);
    I.wait();
    I.pressKey('Enter');
  },

  editTaskPatient(index){
    const path = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(${index})`}
    I.waitForElement(this.fields.editBarPatientInformation, 5);
    I.click(this.fields.editBarPatientInformation);
    I.waitForElement(path, 4);
    I.click(path);
    I.wait();
  },

  
  // insert your locators and methods here
}
