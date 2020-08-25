var budgetController = (function() {
  var x = 25;
  var add = function(a) {
    return x + a;
  };

  return {
    publicTest: function(b) {
      return add(b);
    }
  }

})();

var UIController = (function() {
  // some code for the user interface

})();

var controller = (function(budgetCtrl, UICtrl) {
  //code for the controller
  var z = budgetCtrl.publicTest(5);

  return {
    anotherPublic: function() {
      console.log(z);
    }
  }

})(budgetController, UIController);