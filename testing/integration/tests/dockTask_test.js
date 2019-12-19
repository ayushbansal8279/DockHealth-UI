Feature('Task Manipulation');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg, testData } = inject();

//TODO For tests: Before keyword codeceptjs
//Autoretry feature for codeceptjs, use on sticky steps.
//Create more scenarios involving multiple users.
//read up on CodeceptJS react locators

Scenario(
  'Make a task, flag, attach a patient, assign to a user, add a due date, post a comment, log the heads up readout, switch to personal hud print and switch back, than delete it...',
  async (I, tasksPg) => {
    //pause();
    tskLstPg.getToList(1, 1);
    // pause();
    tasksPg.openTaskSidebar();
    tasksPg.postTask('Crummy Task');
    I.waitForText('Crummy Task', 3);
    tasksPg.exitTask();

    tasksPg.openEditSidebar(1);
    tasksPg.flagTask();
    tasksPg.assignTask(1);
    tasksPg.exitTask();

    tasksPg.openEditSidebar(1);
    tasksPg.attachPatient(1);
    tasksPg.addDueDate(1, 4);
    //Theset two steps slow the whole process down enough to avoid race conditions.
    tasksPg.exitTask();
    
    tasksPg.openEditSidebar(1);
    //pause();
    tasksPg.postComment('LazyBonez');
    //pause();
    tasksPg.exitTask();

    // console.log("All")
    // console.log(await tasksPg.grabActiveTsks());
    // console.log(await tasksPg.grabFlaggedTsks());
    // console.log(await tasksPg.grabDueTodayTsks());
    // console.log(await tasksPg.grabOverdueTsks());
    // console.log("For Me");

    // I.click(tasksPg.fields.forMeBtn);
    // console.log(await tasksPg.grabActiveTsks());
    // console.log(await tasksPg.grabFlaggedTsks());
    // console.log(await tasksPg.grabDueTodayTsks());
    // console.log(await tasksPg.grabOverdueTsks());
    // I.click(tasksPg.fields.allBtn);


    tasksPg.openEditSidebar(1);
    //pause();

    I.waitForText('LazyBonez', 4);
    tasksPg.deleteTask(1);
  },
);

Scenario('Make a task, and flag it, and clean up.', async (I, tasksPg) => {
  tskLstPg.getToList(1, 1);
    
  tasksPg.openTaskSidebar();
  tasksPg.postTask("Bimbleton");
  tasksPg.flagTask();
  tasksPg.exitTask();

  //pause();

  await tasksPg.checkFlaggedTsks(1);
  tasksPg.openEditSidebar(1);
  //console.log("Yow");
  tasksPg.deleteTask(1);
});

Scenario('Make a task, give it an assigned date, check date, clean up.', async (I, tasksPg) => {
  tskLstPg.getToList(1, 1);
  tasksPg.openTaskSidebar();
  tasksPg.postTask("Aardvark");
  tasksPg.addDueDate(3,5);//Week and day of week...
  tasksPg.exitTask();
  await tasksPg.checkTsksHUD(1,0,1,0);
  //pause();
  tasksPg.openEditSidebar(1);
  tasksPg.deleteTask(1);

});

// TODO Organize the names of each test function. Give a consistent naming scheme.

