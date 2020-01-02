Feature('Testing Tasks');

const { I, lgnPg, tskLstPg, inboxPg, tasksPg, testData } = inject();

//TODO For tests: Before keyword codeceptjs
//Autoretry feature for codeceptjs, use on sticky steps.
//Create more scenarios involving multiple users.
//read up on CodeceptJS react locators.

Before((tskLstPg)=> {
    tskLstPg.getToList(1, 1);
});

// Scenario('Make a task, do everything', async(tasksPg) => {
//   tasksPg.openNewTaskSidebar();
//   tasksPg.postTask("Chummy Chimp");
//   tasksPg.flagTask();
//   tasksPg.addDueDate(3,7,1);
//   tasksPg.assignTask(1);
//   tasksPg.attachPatient(1);
//   tasksPg.postComment("Bazinger");
//   //pause();
//   tasksPg.exitTask(0);
// });
  
// Scenario('Make a task, and flag it, check hud', async (I, tasksPg) => {
//   tasksPg.openNewTaskSidebar();
//   tasksPg.postTask("Bimbleton");
//   tasksPg.flagTask();
//   tasksPg.exitTask(0);
//   await tasksPg.checkTasksHUD(1,1,0,0);
// });
  
// Scenario('Make a task, give it an assigned date, check hud.', async (I, tasksPg) => {
//   tasksPg.openNewTaskSidebar();
//   tasksPg.postTask("Aardvark");
//   tasksPg.addDueDate(5,3,1);//Week and day of week...
//   tasksPg.exitTask();
//   await tasksPg.checkTasksHUD(1,0,1,0);
// });

// Scenario('subtask memes', async (I, tasksPg) => {
//   //pause();
//   tasksPg.openNewTaskSidebar();
//   tasksPg.postTask("Dumbledork");
//   // tasksPg.exitTask();
//   // tasksPg.openEditSidebar(1, 1);
//   tasksPg.addSubtask(1, "Bumblefork");
//   tasksPg.assignSubtaskTo(2);
//   tasksPg.saveSubtask();
//   tasksPg.postComment("Regular comments work?");
//   //tasksPg.exitTask(0);
//   tasksPg.exitSubtask();
//   //I.waitForText("Bumblefork");
//   I.see("Bumblefork");

//   //pause();

//   tasksPg.openNewTaskSidebar();
//   tasksPg.postTask("Fimblewimble");
//   tasksPg.exitTask(0);
//   tasksPg.openEditSidebar(1, 0);
//   tasksPg.addSubtask(1, "HumbleSnork");
//   tasksPg.saveSubtask();
//   tasksPg.exitSubtask();
//   I.see("HumbleSnork");

//   tasksPg.openEditSidebar(1, 0);
//   await tasksPg.deleteTask(1);
// });

// Scenario('Make a search', (I, tasksPg) => {
//   const searchKeyword = "Gorgo";
//   tasksPg.openNewTaskSidebar();
//   tasksPg.postTask(searchKeyword);
//   tasksPg.exitTask(0);
//   //Mindlessly create [noise] tasks
//   const noise = 0;
//   for(var i = 0; i < noise; i++) {
//     var noiseText = Math.random().toString(36).replace(/[^a-z]+/g, '');
//     tasksPg.openNewTaskSidebar();
//     tasksPg.postTask(noiseText);
//     tasksPg.exitTask(0);
//   }
//   tasksPg.search(searchKeyword);
//   I.see("Gorgo");
//   I.wait(1);
//   tasksPg.openEditSidebar(1, 0);
//   tasksPg.flagTask();
//   //pause();
//   tasksPg.exitTask(0);
//   tasksPg.search("");
//   tasksPg.clickFilter(2);
//   //pause();
//   tasksPg.openEditSidebar(1, 1);
//   tasksPg.unflagTask();
//   // pause();
//   // tasksPg.addDueDate(1,4,2);
//   tasksPg.exitTask(1);
//   // tasksPg.clickFilter(4);
//   I.see("Gorgo");
//   //tasksPg.exitTask(1);
// });

Scenario('Assign to other user', (I, tasksPg) => {
  tasksPg.openNewTaskSidebar();
  tasksPg.postTask("Aardvark");
  //tasksPg.exitTask(0);
  //tasksPg.openEditSidebar(1, 0);
  //pause();
  //TODO tasksPg.assignTask(2);
  tasksPg.exitTask(0);
  tasksPg.clickForMe();
  //TODO tasksPg.changeAssignedUserNoSidebar(1, 1, 1);
  tasksPg.clickAll();
  tasksPg.search("Aardvark");
  I.see("Aardvark");
  //pause();
  tasksPg.markTaskComplete(1, 1);
  
});

Scenario('Assign to patient', (I, tasksPg) => {
  tasksPg.openNewTaskSidebar();
  tasksPg.postTask("Pringles");
  tasksPg.attachPatient(2);
  tasksPg.exitTask(0);
  I.wait();
  I.see("null, null 126");
});


// Scenario('Click Filters', (I, tasksPg) => {
//   tasksPg.grabShownTasks();
//   tasksPg.clickFilter(2);
//   I.see("Gorgo");
// });


After(async (tasksPg) =>{
  tasksPg.openEditSidebar(1, 0);
  //pause();
  await tasksPg.deleteTask(1, 0);
});
