Feature('Inbox');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

Scenario('Make, and destroy, inbox task', (I, inboxPg, tskLstPg) => {
  lgnPg.login();

  tskLstPg.enterInbox();

  inboxPg.openAddTaskDropdown();

  inboxPg.postDummyTask();

  I.waitForText('Dummy Task', 4);
  I.refreshPage();
  // pause();
  // Click and destroy dummy task 1.
  inboxPg.clickTask(1);
  inboxPg.destroyPickedTask();
});
