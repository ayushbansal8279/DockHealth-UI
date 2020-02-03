
Feature('Patient details page');

Scenario('PATIENT101 - Testing the editing suite', (I, lgnPg, tskLstPg, ptntsPg, onePatientPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPatients();

    ptntsPg.openNewPatientSidebar();
    //You can automatically generate whichever patient you'd like right here!
    ptntsPg.fillPatient('First', 'Middle', 'Last', 'Shmevninty twelve', '01/02/2003', 'female', '1223334444', '1234567890', 'email@buttz.com');
    //pause();
    ptntsPg.closeNewPatientSidebar();

    I.refreshPage();
    I.wait();


    ptntsPg.setFilterTo(1);
    ptntsPg.makeSearch('first');
    ptntsPg.openPatientPage(1);
    //pause();
    onePatientPage.editFirstName('Worst');
    onePatientPage.editMiddleName('Blank');
    onePatientPage.editLastName('Somethin');
    onePatientPage.editMRN('32');
    onePatientPage.editBirthday('01/23/1945');
    onePatientPage.editGender('male');
    onePatientPage.editHomePhone('1-111-123-1234');
    onePatientPage.editMobilePhone('1-111-123-1234');
    onePatientPage.editEmail("doink@boink.com");
    //pause();
    onePatientPage.editSavePatient();
    I.wait(3);
    I.see('Worst');
    I.wait();
    //pause();
    onePatientPage.refillPatient('-', 'Blank', 'oof', '1234', '02/22/1982', 'other', '1-111-111-1111', '1-111-111-1111', 'doink@boink.com', 'dadsf');
    I.wait();
    onePatientPage.exitPatientPage();
});

Scenario('PATIENT102 - Add a task to patient Big Bubba, complete the task.', (I, lgnPg, tskLstPg, ptntsPg, inboxPg, onePatientPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    I.wait(3);
    ptntsPg.makeSearch('Big');
    I.wait(3);
    ptntsPg.openPatientPage(1);
    I.wait(3);
    //pause();
    onePatientPage.addPatientTask('This is a task I added on the patient page.');
    I.wait(7);
    I.see('This is a task I added on the patient page.');
    onePatientPage.enterInboxPage();
    I.wait(3);
    inboxPg.makeSearch('This is a task I added on the patient page.');
    I.wait(3);
    I.see('This is a task I added on the patient page.');
    //pause();
    inboxPg.clickTaskCheckbox(1);
    I.wait(3);
    inboxPg.clickPatientTab();
    I.wait(3);
    //pause();
    ptntsPg.makeSearch('Big');
    I.wait(3);
    //pause();
    ptntsPg.openPatientPage(1);
    I.wait(3);
    I.dontSee('This is a task I added on the patient page.');
    onePatientPage.clickShowCompletedTasks();
    I.wait(5);
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

Scenario('PATIENT103 - Add a task to patient, from the inbox! Click task cleanup broken', (I, lgnPg, tskLstPg, ptntsPg, inboxPg, onePatientPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterInbox();
    inboxPg.openAddTaskDropdown();
    //pause();
    inboxPg.postNamedTask('star wars sux');
    inboxPg.assignPatient(4);
    inboxPg.clickPatientTab();
    I.wait(2);
    ptntsPg.setFilterTo(1);
    I.wait(2);
    //pause();
    ptntsPg.makeSearch('A');
    I.wait();
    ptntsPg.openPatientPage(2);
    I.scrollPageToBottom();
    I.wait(2);
    I.see('star wars sux');
    //pause();
    onePatientPage.clickTaskCheckbox(1); //THIS FUNCITON IS ONLY BROKEN FOR CHROMIUM
    I.refreshPage();
    I.wait(2);
    I.dontSee('star wars sux');
});