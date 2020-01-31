Feature('Lists');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

Scenario('1 - List create, edit and destroy. self cleaning', (I, lgnPg, tskLstPg) => {
  lgnPg.fullLogin(1);
  // pause();
  tskLstPg.openAddListDropdown();
  //pause();
  tskLstPg.createList('Crummy List');
  //tskLstPg.enterListsTab();
  //tskLstPg.logout();
  //lgnPg.login(1);
  I.refreshPage();

  I.wait(3);

  // tskLstPg.openEditListDropdown(1); // edit the 1st list
  // tskLstPg.alterListDetails('Bummy List');
  tskLstPg.destroyList(1);
  I.wait();
  I.dontSee('Crummy List');
});

/*

Scenario('Add some goon to a list. Make sure he got the invite.', (I, lgnPg, tskLstPg) => {
  lgnPg.fullLogin(2);

  I.openNewTab();
  I.wait(2);
  pause();
  lgnPg.fullLogin(1);
  pause();
  tskLstPg.openAddListDropdown();
  tskLstPg.addAdmin('Giant');
  tskLstPg.createList('Stupid dumb good for nothing list');

  pause();
});

*/