//Budget Controller
var budgetController = (function () {


})();


//UI Controller
var UIController = (function () {

  var DOMObjects = {
    descriptionBox: document.querySelector('.add__description'),
    addType: document.querySelector('.add__type'),
    valueBox: document.querySelector('.add__value'),
    addBtn: document.querySelector('.add__btn'),
    title: document.querySelector('.budget__title'),
    month: document.querySelector('.budget__title--month'),
    budgetValue: document.querySelector('.budget__value'),
    budgetIncome: document.querySelector('.budget__income--value'),
    budgetExpense: document.querySelector('.budget__expenses--value'),
    expensePercentage: document.querySelector('.budget__expenses--percentage')
  };

  return {
    getInput: function () {
      return {
        type: DOMObjects.addType.value, // Will be either inc or exp
        description: DOMObjects.descriptionBox.value,
        value: DOMObjects.valueBox.value
      };
    },
    getDOMObjects: function () {
      return DOMObjects;
    }
  };

})();


//Global App Controller
var controller = (function (budgetCtrl, UICtrl) {

  var setupEventListeners = function () {
    var DOMobj = UICtrl.getDOMObjects();

    DOMobj.addBtn.addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        ctrlAddItem();
      }
    });
  }


  var ctrlAddItem = function () {
    // 1. Get the field input data
    var input = UICtrl.getInput();

    // 2. Add the itme to the budget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget in the UI
  }

  return {
    init: function () {
      console.log('Application has started');
      setupEventListeners();
    }
  };


})(budgetController, UIController);

controller.init();