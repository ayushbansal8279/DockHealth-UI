Feature('Inbox');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg } = inject();

// Scenario('Make, and destroy, inbox task', (I, inboxPg, tskLstPg) => {
//   lgnPg.fullLogin(1);

//   tskLstPg.enterInbox();

//   inboxPg.openAddTaskDropdown();

//   inboxPg.postDummyTask();

//   I.waitForText('Dummy Task', 4);
//   //I.refreshPage();
//   //pause();
//   // Click and destroy dummy task 1.
//   inboxPg.logout();
//   lgnPg.login(1);
//   tskLstPg.enterInbox();
//   inboxPg.clickTask(1);
//   //pause();
//   inboxPg.destroyPickedTask();
// });

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
