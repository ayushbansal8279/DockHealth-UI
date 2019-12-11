Feature('Basics');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

// Scenario('Bad Email', (I) => {
//     I.amOnPage("https://dockdev-v2.childrensaccelerator.com/");
//     I.fillField('username', 'Infinite Dab Emote');
//     I.pressKey('Tab');
//     I.waitForText('Please enter a valid email address');
// });

// Scenario('Login', (I, lgnPg) => {
//     lgnPg.login();
//     I.waitForText('Lists', 5);
// });

// Scenario('List create and destroy', (I, lgnPg) => {
//     pause();
//     lgnPg.login();
//     tskLstPg.openAddListDropdown();
//     tskLstPg.createDummyList();
//     I.waitForText('Dummy List', 5);
//     //tskLstPg.destroyDummyList();
// });

// Scenario('List create and destroy', (I, lgnPg) => {
//     lgnPg.login();
//     pause();
//     // tskLstPg.openAddListDropdown();
//     // tskLstPg.createDummyList();
//     tskLstPg.openEditListDropdown();
//     I.waitForText('Dummy List', 5);
//     //tskLstPg.destroyDummyList();
// });

// Scenario('Make an inbox task', (I, inboxPg) => {
//     lgnPg.login()
//     I.waitForText("Lists", 4);

//     //The identity of the inbox tab.
//     I.click({css: 'a[href="#/tasks/Inbox"]'});

//     //ToDo Track down the inbox link
//     inboxPg.openAddTaskDropdown;
//     pause();
//     inboxPg.openAddTaskDropdown;

//     //I.waitForText("Filed in", 4);
//     inboxPg.postDummyTask();
//     I.waitForText("Dummy Task", 4);
// });
