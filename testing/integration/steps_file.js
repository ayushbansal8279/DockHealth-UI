// in this file you can append custom step methods to 'I' object
let container = require('codeceptjs').container;
// get object with all helpers
let helpers = container.helpers();

module.exports = function() {
  return actor({
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    login: function(email, password) {
    },
    dockClick: async function(cssLocator) {
      var browserName = helpers['WebDriver'].browser.capabilities.browserName;
      if(browserName.toLowerCase() === "safari"){
        await this.executeScript(function(cssLocator) {
          $(cssLocator.css).click();
        }, cssLocator);
      }else{
        this.click(cssLocator)
      }
    }

  });
};
