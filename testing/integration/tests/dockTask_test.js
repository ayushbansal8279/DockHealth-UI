Feature('Task Manipulation');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg } = inject();

Scenario(
  'Make a task, then click it, post a comment, than delete it...',
  async (I, tasksPg) => {
    tskLstPg.getToList(1);

    // pause();

    tasksPg.openTaskSidebar();

    tasksPg.postTask('Crummy Task');

    I.waitForText('Crummy Task', 3);

    tasksPg.exitOpenedTask();
    // console.log();
    // pause();
    tasksPg.openEditTaskSidebar(1);

    tasksPg.flagOpenedTask();
    tasksPg.addDueDate(1, 4);
    tasksPg.postComment('LazyBonez');

    tasksPg.exitOpenedTask();

    console.log(await tasksPg.grabActiveTsks());
    console.log(await tasksPg.grabFlaggedTsks());
    console.log(await tasksPg.grabDueTodayTsks());
    console.log(await tasksPg.grabOverdueTsks());
    tasksPg.openEditTaskSidebar(1);
    I.waitForText('LazyBonez', 4);
    tasksPg.deleteOpenedTask(1);
  },
);

// Scenario('Make a task, fill it out, than edit it', (I, tasksPg) => {
//     this.getToList(1);
// });

// TODO Add editing suite, add more scenarios that mess with tasks. Create bundles of actions for use in multiple tests.
// TODO Add more scenarios that mess with the filters.
