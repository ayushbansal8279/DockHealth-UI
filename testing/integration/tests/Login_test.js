Feature('Login');

const { I, lgnPg, tskLstPg, inboxPg, taskPg } = inject();

Scenario('Bad Email', I => {
  I.amOnPage('https://docktest.childrensaccelerator.com');
  I.wait();
  I.fillField('username', 'Infinite Dab Emote');
  //pause();
  I.wait();
  I.pressKey('Tab');
  I.see('Please enter a valid email address');
});

Scenario('Login', (I, lgnPg) => {
  lgnPg.fullLogin(1);
  I.waitForText('Lists', 5);
});
