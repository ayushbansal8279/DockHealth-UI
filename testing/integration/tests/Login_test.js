Feature('Login');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

Scenario('LOGIN101 - Bad Email', I => {
  I.amOnPage('https://docktest.childrensaccelerator.com');
  I.wait();
  I.fillField('username', 'Infinite');
  //pause();
  //I.click('username');
  I.wait(2);
  I.pressKey('Tab');
  I.wait(2);
  //pause();
  I.see('Please enter a valid email address');
});

Scenario('LOGIN102 - Login', (I, lgnPg) => {
  lgnPg.fullLogin(1);
  I.waitForText('Lists', 5);
});
