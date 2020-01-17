Feature('Inbox');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg } = inject();

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
  inboxPg.exitNewTask();
  //pause();
  inboxPg.clickTaskListTab();
  //pause();
  tskLstPg.enterList(1);
  tasksPg.search("Dummy Task");
  I.see("Dummy Task");  
});
