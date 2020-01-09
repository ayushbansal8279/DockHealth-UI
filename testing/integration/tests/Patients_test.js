
Feature('The Patient Page');

Scenario('Make a patient', (I, lgnPg, tskLstPg, ptntsPg) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    //pause();
    ptntsPg.openNewPatientSidebar();
    ptntsPg.fillPatient('first', 'middle', 'last', 'MRN', '01/02/0003', 'female', '1234567890', '0987654321', 'email@buttz.com');
});

Scenario('Edit a patient with the sidebar.', (I, lgnPg, tskLstPg, ptntsPg) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    ptntsPg.makeSearch('first');
    ptntsPg.openEditPatientSidebar(1);
    //pause();
    ptntsPg.refillPatient('blursedName', 'widdleName', 'grassName', '69', "12/12/1212", 'bongos', '0000000000', '0000000000', 'fleemail@florp.lol');
});

Scenario('Search a patient', (I, lgnPg, tskLstPg, ptntsPg) =>{
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    ptntsPg.makeSearch('blursedName');
    ptntsPg.openEditPatientSidebar(1);
    ptntsPg.refillPatient('-name', '-a', '', '9001', "12/12/1212", 'bongos', '0000000000', '0000000000', 'fleemail@florp.lol');
});
