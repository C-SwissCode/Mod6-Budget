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
    this.percentage = -1;
  };

  Expense.prototype.calcPercentages = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    };
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }

  var data = {
    allItems: {
      inc: [],
      exp: [],
      prevIncs: [],
      prevExps: []
    },
    totals: {
      inc: 0,
      exp: 0
    },
    budget: 0,
    percentage: -1
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
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
    },

    deleteItem: function (type, id) {
      var ids, index;

      var ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      };
    },

    calculateItemPercentages: function () {
      data.allItems.exp.forEach(function (current) {
        current.calcPercentages(data.totals.inc);
      });
    },

    getBudget: function () {
      return {
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        budget: data.budget,
        percentage: data.percentage
      };
    },

    getItemPercentages: function () {
      return data.allItems.exp.map(function (current) {
        return current.getPercentage();
      });
    },

    getItems: function () {
      return data.allItems;
    },

    clearAll: function (type) {
      if (type === 'exp') {
        data.allItems[type] = [];
      } else if (type === 'inc') {
        data.allItems[type] = [];
      } else if (type === 'all') {
        data.allItems.inc = [];
        data.allItems.exp = [];
      };
    },

    recordPreviousItms: function (previousButton) {
      if (previousButton === 'inc') {
        data.allItems.prevIncs = data.allItems.inc;
      } else if (previousButton === 'exp') {
        data.allItems.prevExps = data.allItems.exp;
      } else if (previousButton === 'all') {
        data.allItems.prevIncs = data.allItems.inc;
        data.allItems.prevExps = data.allItems.exp;
      };
    },

    restoreItms: function (previousButton) {
      if (previousButton === 'inc') {
        data.allItems.inc = data.allItems.prevIncs;
      } else if (previousButton === 'exp') {
        data.allItems.exp = data.allItems.prevExps;
      } else if (previousButton === 'all') {
        data.allItems.inc = data.allItems.prevIncs;
        data.allItems.exp = data.allItems.prevExps;
      };
    },

    testing: function () {
      console.log(data);
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
    expenseContainer: document.querySelector('.expenses__list'),
    container: document.querySelector('.container'),
    dateElement: document.querySelector('.budget__title--month'),
    addContainer: document.querySelector('.add__container'),
    clearIncBtn: document.querySelector('.clear_inc'),
    clearExpBtn: document.querySelector('.clear_exp'),
    clearAllBtn: document.querySelector('.clear_all'),
    undoBtn: document.querySelector('.undo')
  };

  DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
  };

  var addIncItem = function (incObj) {
    var html, newHtml, element;

    element = DOMObjects.incomeContainer;

    html = '<div class="item incitm clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

    newHtml = html.replace('%id%', incObj.id);
    newHtml = newHtml.replace('%description%', incObj.description);
    newHtml = newHtml.replace('%value%', formatNumbers(incObj.value, 'inc'));
    //Add new item to the UI/DOM
    element.insertAdjacentHTML('beforeend', newHtml);
  };

  var addExpItem = function (expObj) {
    var html, newHtml, element;

    element = DOMObjects.expenseContainer;

    html = '<div class="item expitm clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

    newHtml = html.replace('%id%', expObj.id);
    newHtml = newHtml.replace('%description%', expObj.description);
    newHtml = newHtml.replace('%value%', formatNumbers(expObj.value, 'exp'));
    //Add new item to the UI/DOM
    element.insertAdjacentHTML('beforeend', newHtml);
  }

  var formatNumbers = function (num, type) {
    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3 && int.length < 7) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    } else if (int.length >= 7) {
      int = int.substr(0, int.length - 6) + ',' + int.substr(int.length - 6, 3) + ',' + int.substr(int.length - 3, 3);
    }

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    };
  };

  var removeIncs = function () {
    var incElms = document.querySelectorAll('.incitm');

    nodeListForEach(incElms, function (cur, index) {
      cur.parentNode.removeChild(document.getElementById('inc-' + index));
    });
  };

  var removeExps = function () {
    var expElms = document.querySelectorAll('.expitm');

    nodeListForEach(expElms, function (cur, index) {
      cur.parentNode.removeChild(document.getElementById('exp-' + index))
    });
  };

  return {
    getInput: function () {
      return {
        type: DOMObjects.addType.value, // Will be either inc or exp
        description: DOMObjects.descriptionBox.value,
        value: parseFloat(DOMObjects.valueBox.value)
      };
    },

    getDOMObjects: function () {
      return DOMObjects;
    },

    addListItem: function (obj, type) {
      var itemObject = obj;

      if (type === 'inc') {
        addIncItem(itemObject);

      } else if (type === 'exp') {
        addExpItem(itemObject);
      };
    },

    restore: function (obj) {

    },

    deleteListItem: function (selectorID) {
      var el;
      el = document.getElementById(selectorID);

      el.parentElement.removeChild(el);
    },

    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      var type;
      type = obj.budget > 0 ? 'inc' : 'exp';

      DOMObjects.budgetIncome.textContent = formatNumbers(obj.totalInc, 'inc');
      DOMObjects.budgetExpense.textContent = formatNumbers(obj.totalExp, 'exp');
      DOMObjects.budgetValue.textContent = formatNumbers(obj.budget, type);
      if (obj.percentage > 0) {
        DOMObjects.expensePercentage.textContent = obj.percentage + '%';
      } else {
        DOMObjects.expensePercentage.textContent = '---';
      }
    },

    displayItemPercentages: function (objPercentages) {
      //****** One way of doing it */
      // for (var i = 0; i < objPercentages.length; i++) {
      //   var childrenPercentEl = document.getElementById('exp-' + i).children[1].children[1];
      //   if (objPercentages[i] !== -1) {
      //     childrenPercentEl.textContent = objPercentages[i] + '%';
      //   } else {
      //     childrenPercentEl.textContent = '---';
      //   }
      // };

      // The BEST way of doing it
      var fields = document.querySelectorAll('.item__percentage');

      nodeListForEach(fields, function (current, index) {
        if (objPercentages[index] !== -1 && objPercentages[index] > 0) {
          current.textContent = objPercentages[index] + '%';
        } else {
          current.textContent = '---';
        };
      });
    },

    displayDate: function () {
      var now, year, month, months;
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      now = new Date();
      year = now.getFullYear();
      month = months[now.getMonth()];

      DOMObjects.dateElement.textContent = month + ' of ' + year;
    },

    changedType: function () {
      var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

      nodeListForEach(fields, function (cur) {
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
    },

    clearDisplay: function (type) {
      if (type === 'inc') {
        removeIncs();
      } else if (type === 'exp') {
        removeExps();
      } else if (type === 'all') {
        removeIncs();
        removeExps();
      };
    },

    undoClearing: function (items, type) {
      var dataItems = items;
      if (type === 'inc') {
        nodeListForEach(dataItems.inc, function (cur, index) {
          addIncItem(dataItems.inc[index]);
        });
      } else if (type === 'exp') {
        nodeListForEach(dataItems.exp, function (cur, index) {
          addExpItem(dataItems.exp[index]);
          console.log(type);
        });
      } else if (type === 'all') {
        nodeListForEach(dataItems.inc, function (cur, index) {
          addIncItem(dataItems.inc[index]);
        });
        nodeListForEach(dataItems.exp, function (cur, index) {
          addExpItem(dataItems.exp[index]);
        });
      };
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

    DOMobj.container.addEventListener('click', ctrlDeleteItem);
    DOMobj.addType.addEventListener('change', UICtrl.changedType);
    DOMobj.undoBtn.addEventListener('click', ctrlUndo);
    DOMobj.clearIncBtn.addEventListener('click', ctrlClearIncs);
    DOMobj.clearExpBtn.addEventListener('click', ctrlClearExps);
    DOMobj.clearAllBtn.addEventListener('click', ctrlClearAll);
  }

  var previousClearType;

  var ctrlUndo = function () {
    if (previousClearType !== -1) {
      // push previous original items back into the data structure
      budgetCtrl.restoreItms(previousClearType);

      // update the UI back to the original by displaying the reseted data structure into the UI
      var dataItems = budgetCtrl.getItems();
      UICtrl.undoClearing(dataItems, previousClearType);
      updateBudget();
      updateItemPercentages();

      previousClearType = -1;
    }
  }

  var ctrlClearIncs = function () {
    // Record previous data structure and clear new data structure
    budgetCtrl.recordPreviousItms('inc');
    budgetCtrl.clearAll('inc');
    previousClearType = 'inc';

    // clear incs from UI
    UICtrl.clearDisplay('inc');

    // update budget and item percentages
    updateBudget();
    updateItemPercentages();
  };

  var ctrlClearExps = function () {
    // Record previous data structure and clear new data structure
    budgetCtrl.recordPreviousItms('exp');
    budgetCtrl.clearAll('exp');
    previousClearType = 'exp';

    // clear exps from UI
    UICtrl.clearDisplay('exp');

    // update budget and item percentages
    updateBudget();
    updateItemPercentages();
  };

  var ctrlClearAll = function () {
    budgetCtrl.recordPreviousItms('all');
    budgetCtrl.clearAll('all');
    previousClearType = 'all';

    //clear all from UI
    UICtrl.clearDisplay('all');

    // update budget and item percentages
    updateBudget();
    updateItemPercentages();
  }

  var ctrlDeleteItem = function (e) {
    var itemID, splitID, type, ID;

    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    splitID = itemID.split('-');
    type = splitID[0];
    ID = parseInt(splitID[1]);

    // 1. Delete item from the data structure
    budgetCtrl.deleteItem(type, ID);

    // 2. Delete item from the UI
    UICtrl.deleteListItem(itemID);

    // 3. Update budget
    updateBudget();

    // 4. Update expense item percentages
    updateItemPercentages();
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget in the UI
    UICtrl.displayBudget(budget);
  };

  var updateItemPercentages = function () {
    // 1. Calculate percentages
    budgetCtrl.calculateItemPercentages();

    // 2. Return percentages
    var percentages = budgetCtrl.getItemPercentages();

    // 3. Display the item percentages
    UICtrl.displayItemPercentages(percentages);
  };

  var ctrlAddItem = function () {
    // 1. Get the field input data
    var input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

      // 2. Add the itme to the budget controller
      var newItem;
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudget();

      // 6. Update individual exp percentages
      updateItemPercentages();

    } else {
      alert('WARNING! You must enter a real number that\'s not 0, and you must enter a description. If you fail you will be terminated');
    }
  }

  return {
    init: function () {
      console.log('Application has started');
      setupEventListeners();
      UICtrl.displayBudget({
        totalInc: 0,
        totalExp: 0,
        budget: 0,
        percentage: 0
      });
      UICtrl.displayDate();
    }
  };


})(budgetController, UIController);

controller.init();