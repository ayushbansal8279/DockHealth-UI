Feature('Lists');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

Scenario('List create, edit and destroy', (I, lgnPg, tskLstPg) => {
  lgnPg.fullLogin(1);
  //pause();
  tskLstPg.openAddListDropdown();
  //pause();
  tskLstPg.createList('Crummy List');
  //tskLstPg.enterListsTab();
  //tskLstPg.logout();
  //lgnPg.login(1);

  //Test fails due to weird error clicking on the dropdown of a fresh list.
  tskLstPg.logout();
  lgnPg.login(1);
  //pause();
  tskLstPg.openEditListDropdown(1); // edit the 1st list
  tskLstPg.alterListDetails('Bummy List');

  tskLstPg.destroyDummyList(1);
});
