Feature('Inbox');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

// Troublesome

// Scenario('Make an inbox task', (I, inboxPg) => {
//     lgnPg.login()
//     I.waitForText("Lists", 4);

//     //The identity of the inbox tab.
//     I.click({css: 'a[href="#/tasks/Inbox"]'});

//     //TODO open the add task sidebar
//     inboxPg.openAddTaskDropdown;
//     pause();

//     //I.waitForText("Filed in", 4);
//     inboxPg.postDummyTask();
//     I.waitForText("Dummy Task", 4);
// });
