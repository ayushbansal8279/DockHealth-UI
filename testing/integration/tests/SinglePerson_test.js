
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
    I.wait(5);
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
    I.wait(3);
    singlePersonPage.clickTask(1);
    singlePersonPage.editTaskName("Gazoolgo");
    I.wait(2);
    I.see('Gazoolgo');
});
