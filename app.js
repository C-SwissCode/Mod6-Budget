//Budget Controller
var budgetController = (function () {

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function (id, description, value) {
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
    addItem: function (type, des, val) {
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

      return newItem;
    }
  }

})();


//UI Controller
var UIController = (function () {
  var DOMObjects, DOMStrings;

  DOMObjects = {
    descriptionBox: document.querySelector('.add__description'),
    addType: document.querySelector('.add__type'),
    valueBox: document.querySelector('.add__value'),
    addBtn: document.querySelector('.add__btn'),
    title: document.querySelector('.budget__title'),
    month: document.querySelector('.budget__title--month'),
    budgetValue: document.querySelector('.budget__value'),
    budgetIncome: document.querySelector('.budget__income--value'),
    budgetExpense: document.querySelector('.budget__expenses--value'),
    expensePercentage: document.querySelector('.budget__expenses--percentage'),
    incomeContainer: document.querySelector('.income__list'),
    expenseContainer: document.querySelector('.expenses__list')
  };

  DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
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
    },

    addListItem: function (obj, type) {
      var html, newHtml, element;

      if (type === 'inc') {
        element = DOMObjects.incomeContainer;

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      } else if (type === 'exp') {
        element = DOMObjects.expenseContainer;

        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replcae placeholder data with real object data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      //Add new item to the UI/DOM
      element.insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
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
    var newItem;
    newItem = budgetController.addItem(input.type, input.description, input.value);

    // 3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);
    UICtrl.clearFields();

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