
Feature('The Patient Page');
var assert = require('assert');

Scenario('Make a patient', (I, lgnPg, tskLstPg, ptntsPg) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    //pause();
    ptntsPg.openNewPatientSidebar();
    //You can automatically generate whichever patient you'd like right here!
    ptntsPg.fillPatient('First', 'Middle', 'Last', 'MRN', '01/02/2003', 'female', '1234567890', '0987654321', 'email@buttz.com');
    //pause();
    ptntsPg.closeNewPatientSidebar();
    I.wait();
    //pause();
    I.see("Last");
});

Scenario('Edit a patient using the sidebar.', (I, lgnPg, tskLstPg, ptntsPg) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    ptntsPg.makeSearch('First');
    //pause();
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

Scenario('Check that the dropdown filter works', async (I, lgnPg, tskLstPg, ptntsPg) =>{
    const targetNumber = 1; //Change this to compare against a different number of patients
    pause();
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(3); //Decide which filter you want to check.
    I.wait();
    const nmbr = parseInt(await ptntsPg.grabNumberOfPatients());
    assert(nmbr>=targetNumber, `Number of patients ${nmbr} is less than ${targetNumber}`);
});
