
Feature('Single Persons Details');

Scenario('add a task', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('George');
    I.wait(2);
    peoplePage.clickPerson(1);
    I.wait(3);
    singlePersonPage.addTask('lets build lego sets');
    I.wait(2);
    I.see('lets build lego sets');
});


//TODO The path required for clickTask(x) is always changing. Plus I need to find how to pick which list im choosing from.
Scenario('open a task, edit it', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('George');
    I.wait(2);
    peoplePage.clickPerson(1);
    I.wait(2);
    singlePersonPage.clickTask(1);
    singlePersonPage.editTaskName("Gazoolgo");
    I.wait(2);
    I.see('Gazoolgo');
});

Scenario('Check archive popup', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('Big');
    I.wait(2);
    peoplePage.clickPerson(1);
    I.wait(2);


    singlePersonPage.clickArchivePerson();
    I.wait();
    pause();
    I.see('This person will no longer have access to Dock Health.');
});

Scenario('Test the task filters.', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('Halfling');
    I.wait();
    peoplePage.clickPerson(1);
    I.wait(2);
    //TODO This crap.
    const targetNumber = parseInt(await ptntsPg.grabNumberOfPatients());
    singlePersonPage.pickFilter(3, 7);
    I.wait();
    I.see('This IS a flagged task.');
    I.dontSee('This is not a flagged task');
    I.wait(2);
    const nmbr = parseInt(await ptntsPg.grabNumberOfPatients());
    I.wait();
    assert(nmbr>=targetNumber, `Failed! # of flagged tasks: ${nmbr} should be less than the # of ALL tasks: ${targetNumber}`);
    //TODO Wait until this feature works.
    //TODO make sure this test tests the number of tasks in a list also.
});

Scenario('Test full view, slim view.', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('Halfling');
    I.wait(2);
    peoplePage.clickPerson(1);
    I.wait(2);
    I.see('MPAL-SU RECON');
    I.see('This task has a lot of subtasks');
    singlePersonPage.clickSlimView();
    I.wait();
    I.see('This task has a lot of subtasks');
    I.dontSee('MPAL-SU RECON');
    singlePersonPage.clickFullView();
    I.wait();
    I.see('MPAL-SU RECON');
});