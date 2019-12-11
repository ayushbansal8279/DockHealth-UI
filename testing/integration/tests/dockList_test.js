Feature('Lists');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

Scenario('List create, edit and destroy', (I, lgnPg, tskLstPg) => {
  lgnPg.login();
  // pause();
  tskLstPg.openAddListDropdown();
  tskLstPg.createList('Dummy List');

  tskLstPg.openEditListDropdown(1); // edit the 1st list
  tskLstPg.alterListDetails('Bummy List');

  tskLstPg.destroyDummyList(1);
});
