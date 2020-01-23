
Feature('Patient details page');

Scenario('Testing the editing suite', (I, lgnPg, tskLstPg, ptntsPg, onePatientPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    ptntsPg.makeSearch('first');
    //pause();
    ptntsPg.openPatientPage(1);
    onePatientPage.editFirstName('Worst');
    onePatientPage.editMiddleName('Blank');
    onePatientPage.editLastName('Somethin');
    onePatientPage.editMRN('32');
    onePatientPage.editBirthday('01/23/1945');
    onePatientPage.editGender('female');
    onePatientPage.editHomePhone('1-111-123-1234');
    onePatientPage.editMobilePhone('1-111-123-1234');
    onePatientPage.editEmail("doink@boink.com");
    //pause();
    onePatientPage.editSavePatient();
    I.wait(3);
    I.see('Worst');
    I.wait();
    //I.pause();
    onePatientPage.refillPatient('-', 'Blank', 'oof', '1234', '02/22/1982', 'other', '1-111-111-1111', '1-111-111-1111', 'doink@boink.com', 'dadsf');
    I.wait();
    onePatientPage.exitPatientPage();
});

Scenario('Add a task to patient Big Bubba, complete the task.', (I, lgnPg, tskLstPg, ptntsPg, inboxPg, onePatientPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    I.wait(2);
    ptntsPg.makeSearch('Big');
    I.wait(2);
    ptntsPg.openPatientPage(1);
    I.wait(2);
    //pause();
    onePatientPage.addPatientTask('This is a task I added on the patient page.');
    I.wait();
    I.see('This is a task I added on the patient page.');
    onePatientPage.enterInboxPage();
    I.wait();
    inboxPg.makeSearch('This is a task I added on the patient page.');
    I.wait(2);
    I.see('This is a task I added on the patient page.');
    //pause();
    inboxPg.clickTaskCheckbox(1);
    I.wait();
    inboxPg.clickPatientTab();
    I.wait(5);
    //pause();
    ptntsPg.makeSearch('Big');
    I.wait(2);
    //pause();
    ptntsPg.openPatientPage(1);
    I.wait(2);
    I.dontSee('This is a task I added on the patient page.');
    onePatientPage.clickShowCompletedTasks();
    I.wait(2);
    I.see('This is a task I added on the patient page.');
 

    // This stuff is useful.

    // I.openNewTab('/');
    // I.wait(10);
    // lgnPg.Login(1);
    // tskLstPg.enterInbox();
    // inboxPg.makeSearch('This is a task I added on the patient page.');
    // I.wait();
    // I.see('This is a task I added on the patient page.');
    // inboxPg.clickTaskCheckbox();
    // I.wait();
    // I.closeCurrentTab();
});

Scenario('Add a task to patient, from the inbox!', (I, lgnPg, tskLstPg, ptntsPg, inboxPg, onePatientPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterInbox();
    inboxPg.openAddTaskDropdown();
    //pause();
    inboxPg.assignPatient(4);
    inboxPg.postNamedTask('star wars sux');
    inboxPg.clickPatientTab();
    I.wait(2);
    ptntsPg.setFilterTo(1);
    I.wait(2);
    //pause();
    ptntsPg.makeSearch('A');
    I.wait();
    ptntsPg.openPatientPage(2);
    
    //onePatientPage.clickTaskCheckBox(1);
    I.scrollPageToBottom();
    I.wait(3);
    I.see('star wars sux');
});