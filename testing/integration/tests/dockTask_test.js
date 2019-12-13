Feature('Task Manipulation');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg } = inject();

Scenario('Make a task, then click it, post a comment, than delete it...', (I, tasksPg) => {
  tskLstPg.getToList(1);

  tasksPg.openTaskSidebar();

  tasksPg.postTask('Dummy Task');

  I.waitForText('Dummy Task', 3);

  I.refreshPage();
  
  tasksPg.openEditTaskSidebar(1);

  tasksPg.postComment("LazyBonez");
  I.refreshPage();
  tasksPg.openEditTaskSidebar(1);
  I.waitForText("LazyBonez",4);
  tasksPg.deleteOpenedTask(1);
});

// Scenario('Make a task, fill it out, than edit it', (I, tasksPg) => {
//     this.getToList(1);
// });

//TODO Add editing suite, add more scenarios that mess with tasks. Create bundles of actions for use in multiple tests. 
//TODO Add more scenarios that mess with the filters.
