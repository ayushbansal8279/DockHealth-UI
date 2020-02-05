
Feature('The list of all patients');
var assert = require('assert');

Scenario('PATIENTS101 - Make a patient', (I, lgnPg, tskLstPg, ptntsPg) => {
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    //pause();
    ptntsPg.openNewPatientSidebar();
    //You can automatically generate whichever patient you'd like right here!
    ptntsPg.fillPatient('First', 'Middle', 'Last', 'MRN', '01/02/2003', 'male', '1234567890', '0987654321', 'email@buttz.com');
    //pause();
    ptntsPg.closeNewPatientSidebar();
    I.wait();
    //pause();
    I.see("Last");
});

//TODO Broken in Webdriver due to REFILL PATIENT LINE
Scenario('PATIENTS102 - Edit a patient using the sidebar.', (I, lgnPg, tskLstPg, ptntsPg) => { //TODO Clearfield/Fillfield are broken NOT THE TEST
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    ptntsPg.makeSearch('First');
    //pause();
    ptntsPg.openEditPatientSidebar(1);
    //pause();
    ptntsPg.refillPatient('blursedName', 'widdleName', 'grassName', '66', "12/12/1212", 'bongos', '0000000000', '0000000000', 'fleemail@florp.lol');
    I.wait(2);
    I.see('66');
});

Scenario('PATIENTS103 - Search a patient', (I, lgnPg, tskLstPg, ptntsPg) =>{
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    ptntsPg.setFilterTo(1);
    ptntsPg.makeSearch('blursedName');
    //pause();
    I.see('GrassName,'); 
    //ptntsPg.openEditPatientSidebar(1);
    //ptntsPg.refillPatient('-name', '-a', '', '9001', "12/12/1212", 'female', '0000000000', '0000000000', 'fleemail@florp.lol');
});

//TODO Make the filters check how many patients you have under MY PATIENTS, and compare it to the ALL PATIENTS filter.
Scenario('PATIENTS104 - Check that the dropdown filter works', async (I, lgnPg, tskLstPg, ptntsPg) =>{
    lgnPg.fullLogin(2);
    tskLstPg.enterPatients();
    I.wait();
    const targetNumber = parseInt(await ptntsPg.grabNumberOfPatients());
    ptntsPg.setFilterTo(1); //Decide which filter you want to check.
    I.wait();
    const nmbr = parseInt(await ptntsPg.grabNumberOfPatients()); //Change this to compare against a different number of patients
    I.wait();
    //pause();
    assert(nmbr>=targetNumber, `Failed! # of MY patients: ${nmbr} should be less than (or equal to) the # of ALL patients: ${targetNumber}`);
});
