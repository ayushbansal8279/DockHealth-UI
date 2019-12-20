Feature('Testing Tasks');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg, testData } = inject();

//TODO For tests: Before keyword codeceptjs
//Autoretry feature for codeceptjs, use on sticky steps.
//Create more scenarios involving multiple users.
//read up on CodeceptJS react locators.

Before((tskLstPg)=> {
    tskLstPg.getToList(1, 1);
});

Scenario('Make a task, do everything', async(tasksPg) => {
  tasksPg.openTaskSidebar();
  tasksPg.postTask("Chummy Chimp");
  tasksPg.flagTask();
  tasksPg.addDueDate(3,7);
  tasksPg.assignTask(1);
  tasksPg.attachPatient(1);
  tasksPg.postComment("Bazinger");
  //pause();
  tasksPg.exitTask();
});
  
Scenario('Make a task, and flag it, check hud', async (I, tasksPg) => {
  tasksPg.openTaskSidebar();
  tasksPg.postTask("Bimbleton");
  tasksPg.flagTask();
  tasksPg.exitTask();
  await tasksPg.checkTsksHUD(1,1,0,0);
});
  
Scenario('Make a task, give it an assigned date, check hud.', async (I, tasksPg) => {
  tasksPg.openTaskSidebar();
  tasksPg.postTask("Aardvark");
  tasksPg.addDueDate(3,6);//Week and day of week...
  tasksPg.exitTask();
  await tasksPg.checkTsksHUD(1,0,1,0);
});

After(async (tasksPg) =>{
  tasksPg.openEditSidebar(1);
  await tasksPg.deleteTask(1);
});
