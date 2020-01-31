
Feature('Single Persons Details');

Scenario('1 - add a task', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
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
Scenario('2 - open a task, edit it', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
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

Scenario('3 - Check archive popup', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
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
Scenario('4 - Test the task filters.', async (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch('Halfling');
    I.wait(2);
    peoplePage.clickPerson(1);
    I.wait(2);
    //TODO This crap.

    const targetNumber = parseInt(await singlePersonPage.grabNumberOfTasks());
    
    I.wait(2);
    singlePersonPage.pickFilter(3, 12);
    I.wait(4);

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


Scenario('5 - Test full view, slim view.', (I, lgnPg, tskLstPg, peoplePage, singlePersonPage) => {
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