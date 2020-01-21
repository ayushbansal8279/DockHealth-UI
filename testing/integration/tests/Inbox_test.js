Feature('Inbox');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg } = inject();

const assignedToEmblem = {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(2)'};

Scenario('Make a task, assign it to dummy list, and then search dummy list', (I, inboxPg, tskLstPg, tasksPg) => {
  lgnPg.fullLogin(1);
  tskLstPg.enterInbox();
  //pause();
  inboxPg.openAddTaskDropdown();
  //pause();
  inboxPg.postNamedTask("Dummy Task");
  //pause();
  inboxPg.setFiledIn(1);
  //pause();
  inboxPg.exitMadeTask();
  //pause();
  inboxPg.clickTaskListTab();
  //pause();
  tskLstPg.enterList(1);
  tasksPg.search("Dummy Task");
  I.wait(3);
  I.see("Dummy Task");  
});



Scenario('Make a task, assign it to yourself, unassign it. SELF CLEAN', (I, inboxPg, tskLstPg) => {
  lgnPg.fullLogin(1);
  tskLstPg.enterInbox();
  //pause();
  inboxPg.openAddTaskDropdown();
  //pause();
  inboxPg.postNamedTask("Assign and unassign this.");
  //pause();
  within(assignedToEmblem, ()=>{
    I.see("GH");
  });
  //pause();
  inboxPg.assignUser(1);
  I.wait();
  inboxPg.exitMadeTask();
  //pause();
  inboxPg.clickTask(1);
  I.wait();
  within(assignedToEmblem, ()=>{
    //pause();
    I.dontSee('GH');
  });
  inboxPg.deleteTask();
});
