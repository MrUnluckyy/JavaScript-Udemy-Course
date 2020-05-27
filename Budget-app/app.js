/*
* Budget app mechanics
* Document layout: 
*   1. Budget controller module
*   2. UI controller module
*   3. Global app controller which combines the interaction between 1 and 2.
*/


/**************************** 
 **** Budget Controller **** 
 ****************************/
var budgetController = (function () {

    var Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calcTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            var dataType = data.allItems[type];
            //create new ID based on array lenght
            if (dataType.length > 0) { 
                ID = dataType[dataType.length-1].id + 1;
            } else {
                ID = 0;
            }

            //create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //push new item into data structure
            dataType.push(newItem);

            //return new element
            return newItem;

        }, 

        calcBudget: function() {
            //calc total income and expenses
            calcTotal('exp');
            calcTotal('inc');
            
            //calc budget
            data.budget = data.totals.inc - data.totals.exp;

            //calc percentage

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            }
        }, 

        testing: function () { 
            console.log(data);
        }
    }


})();


/**************************** 
 **** UI Controller **** 
 ****************************/
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description', 
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContaier: '.income__list',
        expensesContaier: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'

    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        }, 

        addListItem: function (obj, type) {
            var html, newHtml, element;

            //add HTML string with placeholder - %%
            if (type === 'inc') {

                element = DOMstrings.incomeContaier;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
            } else if (type === 'exp') {

                element = DOMstrings.expensesContaier;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace placeholder - %% with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function () {
           var fields, fieldsArray;

            fields =  document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();

        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExpenses;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();


/***************************** 
 *** Global app controller *** 
 *****************************/
var controller = (function (budgetCtrl, UIctrl) {
    var setupEventListneres = function () {
        var DOM = UIController.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function () {
        //1. Calculate the budget
        budgetCtrl.calcBudget();

        //2. Return the budget
        var budget = budgetCtrl.getBudget();

        //3. Display the budget on the UI.
        UIctrl.displayBudget(budget);
    }

    var ctrlAddItem = function () {
        var input, newItem;

        //1. Get the field input data
        input = UIctrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            //3. Add the item to the UI
            UIctrl.addListItem(newItem, input.type);

            //4. Clear the fields
            UIctrl.clearFields();

            //5. calculate and update budget
            updateBudget();        
        }


    };

    return {
        init: function () {
            setupEventListneres();
            UIctrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
        }
    }

})(budgetController, UIController);

controller.init();

