
Feature('Patient details page');

Scenario('Testing the editing suite', (I, lgnPg, tskLstPg, ptntsPg, onePatientPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    ptntsPg.makeSearch('first');
    ptntsPg.openPatientPage(1);
    
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
    onePatientPage.refillPatient('-', 'Blank', 'oof', '1234', '02/22/1982', 'male', '1-111-111-1111', '1-111-111-1111', 'doink@boink.com', 'dadsf');
    I.wait();
    onePatientPage.exitPatientPage();
});

Scenario('Add a task to patient', (I, lgnPg, tskLstPg, ptntsPg, onePatientPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    I.wait();
    ptntsPg.makeSearch('-');
    ptntsPg.openPatientPage(1);

    onePatientPage.addPatientTask('This is a task I added on the patient page.');
    I.wait(3);
    onePatientPage.clickTaskCheckbox(1);
});

Scenario('Add a task to patient, from the inbox!', (I, lgnPg, tskLstPg, ptntsPg, inboxPg, onePatientPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterInbox();
    inboxPg.openAddTaskDropdown();
    inboxPg.assignPatient(3);
    inboxPg.postNamedTask('star wars sux');
    inboxPg.clickPatientTab();
    I.wait(2);
    ptntsPg.setFilterTo(1);
    I.wait(5);
    //pause();
    ptntsPg.openPatientPage(2);
    
    //onePatientPage.clickTaskCheckBox(1);
    I.scrollPageToBottom();
    I.wait(3);
    I.see('star wars sux');
    
    
});