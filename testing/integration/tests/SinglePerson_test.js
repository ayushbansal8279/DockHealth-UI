
Feature('Single Persons Details');

Scenario('PERSON101 - add a task', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('George');
    I.wait(2);
    peoplePage.clickPerson(4);
    I.wait(3);
    singlePersonPage.addTask('lets build lego sets');
    I.wait(2);
    I.see('lets build lego sets');
    
});

//TODO The path required for clickTask(x, y) is always changing. Plus I need to find how to pick which list im choosing from.
Scenario('PERSON102 - open a task, edit it', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('George');
    I.wait(2);
    peoplePage.clickPerson(4);
    I.wait(2);
    singlePersonPage.clickTask(1, 2);
    singlePersonPage.editTaskName("Gazoolgo");
    I.wait(2);
    I.see('Gazoolgo');
});

Scenario('PERSON103 - Check archive popup', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('Big');
    I.wait(2);
    peoplePage.clickPerson(1);
    I.wait(2);


    singlePersonPage.clickArchivePerson();
    I.wait();
    I.see('This person will no longer have access to Dock Health.');
});

//This test fails because the filter doesnt work for users.
Scenario('PERSON104 - Test the task filters.', async (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('Halfling');
    I.wait(2);
    peoplePage.clickPerson(1);
    I.wait(4);
    const targetNumber = parseInt(await singlePersonPage.grabNumberOfTasks());
    singlePersonPage.pickFilter(3, 11);
    I.wait(3);

    //pause();
    
    I.see('This IS a flagged task.');
    I.dontSee('This is not a flagged task');
    I.wait(2);

    const nmbr = parseInt(await singlePersonPage.grabNumberOfTasks());

    I.wait(2);
    assert(nmbr>=targetNumber, `Failed! # of flagged tasks: ${nmbr} should be less than the # of ALL tasks: ${targetNumber}`);
    //TODO Wait until this feature works.
    //TODO make sure this test tests the number of tasks in a list also.
});


Scenario('PERSON105 - Test full view, slim view.', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPeople();
    I.wait(2);
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