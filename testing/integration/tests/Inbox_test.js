Feature('Inbox');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg } = inject();
const firstTaskPath = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(3)`};
const firstTaskPatient = {css: `#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(4) > a`};

const assignedToEmblem = {css: '#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(2) > form > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(3) > div > div:nth-child(2)'};

Scenario('Make a task, attach it to a dummy list, and then search the dummy list. self cleaning.', async (I, inboxPg, tskLstPg, tasksPg) => {
  lgnPg.fullLogin(1);
  tskLstPg.enterInbox();
  //pause();
  inboxPg.openAddTaskDropdown();
  //pause();
  inboxPg.postNamedTask("Dummy Task");
  //pause();
  I.wait();
  inboxPg.setFiledIn(1);
  I.wait();
  inboxPg.clickTaskListTab();
  I.wait();
  tskLstPg.enterList(1);
  I.wait();
  tasksPg.search("Dummy Task");
  I.wait();
  I.see("Dummy Task");  
  tasksPg.openEditSidebar(1, 0, 0);
  I.wait();
  await tasksPg.deleteTask(1, 0);
});



Scenario('Make a task, assign it to yourself, unassign it. self cleaning', (I, inboxPg, tskLstPg) => {
  lgnPg.fullLogin(1);
  tskLstPg.enterInbox();
  //pause();
  inboxPg.openAddTaskDropdown();
  //pause();
  inboxPg.postNamedTask("Assign and unassign this.");
  I.waitForElement(assignedToEmblem, 10);
  within(assignedToEmblem, ()=>{
    I.see("GH");
  });
  //pause();
  inboxPg.assignUser(1);
  I.wait();
  inboxPg.exitMadeTask();
  I.wait();
  //pause();
  inboxPg.clickTask(1);
  I.waitForElement(assignedToEmblem, 10);
  within(assignedToEmblem, ()=>{
    //pause();
    I.dontSee('GH');
  });
  //pause();
  inboxPg.deleteTask();
});

Scenario('Make a task, assign it to a patient, make sure the initials stay. self cleaning', (I, inboxPg, tskLstPg) => {
  lgnPg.fullLogin(1);
  tskLstPg.enterInbox();
  I.wait();
  inboxPg.openAddTaskDropdown();
  I.wait();
  inboxPg.postNamedTask("This should have a patient attached");
  //These lines get the test to pass when assigning patients is broken.
  I.wait();
  inboxPg.assignUser(2);
  I.wait();
  //pause();
  inboxPg.assignPatient(2);
  inboxPg.exitMadeTask();
  I.wait();
  inboxPg.makeSearch('This should');
  I.waitForElement(firstTaskPath, 8);
  within(firstTaskPath, () =>{
    I.see('1234');
    I.see('GH');
  });
  inboxPg.clickTask(1);
  I.wait();
  inboxPg.deleteTask();
});


Scenario('Check completed tasks', (I, inboxPg, tskLstPg) => {
  lgnPg.fullLogin(2);
  tskLstPg.enterInbox();
  I.wait();
  I.dontSee('Super Salmon Big ol Blast attack');
  I.wait();
  inboxPg.clickShowCompletedTasks();
  I.wait();
  //pause();
  I.see('Super Salmon Big ol Blast attack');
});

Scenario('Search a task', (I, inboxPg, tskLstPg) => {
  lgnPg.fullLogin(1);
  tskLstPg.enterInbox();
  I.wait();
  inboxPg.makeSearch('Florida Snorida');
  I.waitForElement(firstTaskPath, 10);
  within(firstTaskPath, () =>{
    I.see('Florida Snorida');
  });
});

//This test needs to be calibrated every month or so. Change the due date.
Scenario('Make a task, add a due date, make sure its OVERDUE. self cleaning', (I, inboxPg, tskLstPg) => {
  lgnPg.fullLogin(1);
  tskLstPg.enterInbox();
  I.wait();
  inboxPg.openAddTaskDropdown();
  inboxPg.postNamedTask("This is a late task.");

  //These lines get the test to pass when assigning patients is broken.
  // I.wait();
  // inboxPg.assignUser(1);
  // I.wait();
  //pause();
  inboxPg.addDueDate(3,1);
  inboxPg.exitMadeTask();
  //pause();
  inboxPg.pickFilter(4, 11);
  I.wait(3);
  //pause();
  I.see("This is a late task.");
  I.dontSee('Test against this task. Dork.');
  inboxPg.pickFilter(0, 11);
  I.wait(3);
  I.see('Test against this task. Dork.');
  inboxPg.makeSearch('This is a late task.');
  I.wait();
  inboxPg.clickTask(1);
  inboxPg.deleteTask();
});

Scenario('Check flagged filter', (I, inboxPg, tskLstPg) => {
  lgnPg.fullLogin(1);
  tskLstPg.enterInbox();
  I.wait();
  //pause();
  inboxPg.pickFilter(3, 11);
  I.wait(3);
  I.dontSee('This is not a flagged task.');
  I.see('This IS a flagged task.');
  inboxPg.pickFilter(0, 11);
  I.wait(3);
  I.see('This is not a flagged task.');
  I.see('This IS a flagged task.');
});