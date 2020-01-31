
Feature('People list tests');

Scenario('1 - Try to invite a user, get shut out', (I, lgnPg, tskLstPg, peoplePage) => {
    lgnPg.fullLogin(3);
    tskLstPg.enterPeople(); 
    peoplePage.disarmNavigationSidebar();
    I.wait();
    peoplePage.clickAddPersonButton();
    I.wait(4);
    //pause();
    I.see('Because you are not an administrator');
});

Scenario('2 - Invite a user succesfully', (I, lgnPg, tskLstPg, peoplePage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.clickAddPersonButton();
    I.wait(3);
    //pause();
    peoplePage.fillInvite('Heroic', 'Helen', 'george+a8@dock.health');
    peoplePage.sendInvite();
    //I.amOnPage('https://mail.google.com/mail/u/0/#inbox');

}); 

Scenario('3 - Enter user details, check name', (I, lgnPg, tskLstPg, peoplePage) => {
    const name = 'Aleksander Krawiel'//The person in the 4th slot goes here.
    lgnPg.fullLogin(1);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    peoplePage.clickPerson(4);
    I.wait(3);
    I.see(name);
});

Scenario('4 - Search for a user', (I, lgnPg, tskLstPg, peoplePage) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPeople();
    peoplePage.disarmNavigationSidebar();
    I.wait(4);
    //pause();
    peoplePage.makeSearch("Dig");
    I.wait(3);
    peoplePage.clickPerson(1);
    I.wait(3);
    I.see('Dig Dug');
});


//Broken due to Un-Admin not being finished.
Scenario('5 - Give Bart admin, then take it away.', (I, lgnPg, tskLstPg, peoplePage) => {
    lgnPg.fullLogin(2);
    I.wait();
    tskLstPg.enterPeople();
    I.wait();
    peoplePage.disarmNavigationSidebar();
    I.wait();
    peoplePage.makeSearch("Bart");
    I.wait();
    peoplePage.switchAdminStatus(1);
    I.wait(3);
    I.see('Admin');
    peoplePage.switchAdminStatus(1);
    I.wait(3);
    //pause();
    //It's broke
    I.dontSee('Admin')
});