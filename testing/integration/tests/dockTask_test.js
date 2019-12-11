Feature('Task Manipulation');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg } = inject();

Scenario('Make a task, then click it, than delete it...', (I, tasksPg) => {
  lgnPg.login();

  I.waitForText('Lists', 4);

  I.click({
    css:
      'html > body > #app > #appHome > main > div > div:nth-child(2) > div > div:nth-child(4) > div:nth-child(2) > div > div > span:nth-child(2) > div > div:nth-child(2) > a > h6',
  });

  tasksPg.openTaskSidebar();

  tasksPg.postTask('Dummy Task');

  I.waitForText('Dummy Task', 3);

  pause();

  I.refreshPage();

  tasksPg.openEditTaskSidebar(1);

  I.waitForText('+ add a subtask', 5);

  tasksPg.deleteOpenedTask(1);
});
