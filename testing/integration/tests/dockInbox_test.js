Feature('Inbox');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

// Troublesome

Scenario('Make an inbox task', (I, inboxPg) => {
  lgnPg.login();
  I.waitForText('Lists', 4);

  // The identity of the inbox tab.
  I.click({ css: 'a[href="#/tasks/Inbox"]' });

  // pause();

  // TODO open the add task sidebar
  // inboxPg.openAddTaskDropdown;
  // pause();
  inboxPg.openAddTaskDropdown();

  // I.waitForElement({css: "#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > button"}, 6);
  // I.click({css: "#appHome > main > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div > button"});

  // I.waitForText("Filed in", 4);
  inboxPg.postDummyTask();
  I.waitForText('Dummy Task', 4);
});
