//Budget Controller
var budgetController = (function () {
  
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var data = {
    allItems: {
      inc: [],
      exp: []
    },
    totals: {
      inc: [],
      exp: []
    }
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      ID = 0;

      //Create new id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item
      if (type === 'inc') {
        newItem = new Income(ID, des, val);
      } else if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      }

      //Add new item to data structure
      data.allItems[type].push(newItem);
    },
    testing: function() {
      console.log(data);
    }
  }

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
    budgetController.addItem(input.type, input.description, input.value);
    budgetController.testing();
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