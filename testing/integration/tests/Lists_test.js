Feature('Lists');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

Scenario('List create, edit and destroy. self cleaning', (I, lgnPg, tskLstPg) => {
  lgnPg.fullLogin(1);
  // pause();
  tskLstPg.openAddListDropdown();
  tskLstPg.createList('Crummy List');
  //tskLstPg.enterListsTab();
  //tskLstPg.logout();
  //lgnPg.login(1);

  // tskLstPg.openEditListDropdown(1); // edit the 1st list
  // tskLstPg.alterListDetails('Bummy List');
  tskLstPg.destroyList(1);
});
