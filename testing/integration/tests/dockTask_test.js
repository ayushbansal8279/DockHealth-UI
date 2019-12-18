Feature('Task Manipulation');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg } = inject();

Scenario(
  'Make a task, flag, attach a patient, assign to a user, add a due date, post a comment, log the heads up readout, switch to personal hud print and switch back, than delete it...',
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
    tasksPg.assignOpenedTask(1);

    tasksPg.exitOpenedTask();
    tasksPg.openEditTaskSidebar(1);

    tasksPg.attachPatient(1);
    tasksPg.addDueDate(1, 4);

    //Theset two steps slow the whole process down enough to avoid race conditions.
    tasksPg.exitOpenedTask();
    tasksPg.openEditTaskSidebar(1);
    //pause();
    tasksPg.postComment('LazyBonez');

    //pause();

    tasksPg.exitOpenedTask();

    console.log("All")
    console.log(await tasksPg.grabActiveTsks());
    console.log(await tasksPg.grabFlaggedTsks());
    console.log(await tasksPg.grabDueTodayTsks());
    console.log(await tasksPg.grabOverdueTsks());
    console.log("For Me");

    tasksPg.clickForMeBtn();
    console.log(await tasksPg.grabActiveTsks());
    console.log(await tasksPg.grabFlaggedTsks());
    console.log(await tasksPg.grabDueTodayTsks());
    console.log(await tasksPg.grabOverdueTsks());
    tasksPg.clickAllBtn();


    tasksPg.openEditTaskSidebar(1);
    //pause();

    I.waitForText('LazyBonez', 4);
    tasksPg.deleteOpenedTask(1);
  },
);

// Scenario('Make a task, fill it out, than edit it', (I, tasksPg) => {
//     this.getToList(1);
// });

// TODO Add editing suite, add more scenarios that mess with tasks. Create bundles of actions for use in multiple tests.
// TODO Add more scenarios that mess with the filters.
