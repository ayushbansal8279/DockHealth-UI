
Feature('People list test');

Scenario('Try to make a user, get shut out', (I, lgnPg, tskLstPg, peoplePage) => {
    lgnPg.fullLogin(3);
    tskLstPg.enterPeople(); 
    peoplePage.disarmNavigationSidebar();
    I.wait();
    peoplePage.clickAddPersonButton();
    I.wait();
    I.see('Because you are not an administrator');
});

Scenario('Make a user succesfully', (I, lgnPg, tskLstPg, peoplePage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.clickAddPersonButton();
    I.wait(3);
    //pause();
    peoplePage.fillInvite('Hapless', 'Harry', 'george+a4@dock.health')
    peoplePage.sendInvite();
    //I.amOnPage('https://mail.google.com/mail/u/0/#inbox');

}); 

Scenario('Enter user check name', (I, lgnPg, tskLstPg, peoplePage) => {
    lgnPg.fullLogin(1);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.clickPerson(4);
    I.wait(5);
    I.see("George Bousvaros");
});

Scenario('Search for a user', (I, lgnPg, tskLstPg, peoplePage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.makeSearch("Dig");
    I.wait(3);
    peoplePage.clickPerson(1);
    I.wait(3);
    I.see('Dig Dug');
});

Scenario('Give Bart admin, then take it away.', (I, lgnPg, tskLstPg, peoplePage) => {
    lgnPg.fullLogin(2);
    I.wait();
    tskLstPg.enterPeople();
    I.wait();
    peoplePage.disarmNavigationSidebar();
    I.wait();
    peoplePage.makeSearch("Bart");
    I.wait();
    peoplePage.switchAdminStatus(1);
    I.wait(2);
    I.see('Admin');
    peoplePage.switchAdminStatus(1);
});