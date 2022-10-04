/*
* budget CONTROLLER
*/
const budgetController = (function () {

    const Expense = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    const Income = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }


    //Calculate total incomes and expense and sum the total of expense or income
    const calculateTotal = function(type) {
        sum = 0

        data.allItems[type].forEach(function(current) {
            sum += current.value
        })

        data.totals[type] = sum

        
    }

    /* Data structure to store all about expenses and incoms */
    const data = {
        
        //items
        allItems: {
            exp: [] , //expense
            inc: [] //income
        },

        totals: {
            exp :  0,
            inc: 0
        },

        budget: 0,
        percentage: -1

    }

  
    return {

        addItem: function(type, desc, val ) {
            let newItem, ID;
            
            //Generating the ID for the items
            if(data.allItems[type].length  > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id  + 1
            } else  {
                ID = 0
            }
        
             /*
             *if the type of the item is 'exp' then create a new Expense item else
             *if the type of the item is 'in' then create a new Income item 
             */
            if(type === 'exp') {
                newItem = new Expense(ID, desc, val)
            } else if(type === 'inc') {
                newItem = new Income(ID, desc, val)
            }

            //Store the new item into the data structure
            data.allItems[type].push(newItem)

            return newItem
        }, 


        deleteItem: function(type, id) {

            //variables
            let ids, index

            // create an array with ids and store them in the ids variable
            ids = data.allItems[type].map(function(current) {
                return current.id
            })

            //get the index of the item that will be deleted from the data structure
            index = ids.indexOf(id)
            
            
            if(index !== -1) {
                //remove the item from the data structure
                data.allItems[type].splice(index, 1)
            }    

        },

        //calculate the budget
        calculateBudget: function() {
            //1.calculate total incomes and expenses
            calculateTotal('exp')
            calculateTotal('inc')

            //2. calculate budget(income - expense)
            data.budget = data.totals.inc - data.totals.exp

            //3. calculate percentage(since we can't divide by zero we have to verify if the total incomes is greater than zero)
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc)  * 100)
            }else {
                data.percentage = -1
            }

        },


        /*
        *@returns {Object}  
        */
        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percentage: data.percentage
            }
        },

         test: function() {
            console.log(data)
         }
    } 

 })()


 
/*
*User Interface CONTROLLER
*/
const UIController = (function () {
    

    return {

        /*
        *@return {Object} - returns an object containing the values of the input fields 
        */
        getIpuntValue: function() {
            return {
                budgetType: document.querySelector('.add-type').value, //will be either inc or exp
                budgetDescription: document.querySelector('.add-description').value,
                budgetValue: parseFloat(document.querySelector('.add-value').value)
            }
        },

        /*
        *@params - object and type... object(Expense or Income), type(type of the object) 
        */
        addListItem: function(object, type) {

            let html, element, newHtml

            //1. Create a string with a placeholder text
            if(type === 'inc') {
                element = document.querySelector('.income-list')

                html =  '<div class="item clearfix" id="inc-%id%"> <div class="item-description">%description%</div> <div class="right clearfix"> <div class="item-value">%value%</div> <div class="item-delete"> <button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div> '

            } else if(type==='exp') {
                element = document.querySelector('.expenses-list')

                html = ' <div class="item clearfix" id="exp-%id%"> <div class="item-description">%description%</div> <div class="right clearfix"> <div class="item-value">%value%</div> <div class="item-percentage">21%</div> <div class="item-delete"> <button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div> '
            }
            
            //Replace the placeholder with some actual data
            newHtml = html.replace('%id%', object.id)
            newHtml = newHtml.replace('%description%', object.description)
            newHtml = newHtml.replace('%value%', object.value)
            
            //insert the HTML into the DOM
            element.insertAdjacentHTML('beforeend', newHtml)

        },


        deleteListItem: function(id) {

            let element = document.getElementById(id)

            //remove the element from the DOM
            element.parentNode.removeChild(element)
            

        },

        //Function to clear the input fields 
        clearFields: function() {
            //get the input fields
            const fields = document.querySelectorAll('.add-description, .add-value') 

            //since the querySelctor all returns a list, convert this into array using the slice method
            const fieldsArray = Array.prototype.slice.call(fields)

            //clear the current value from the input field
            fieldsArray.forEach(function(current) {
                current.value = ''
            })

            fieldsArray[0].focus()
        },
        
       
        displayBudget: function(object) {

            document.querySelector('.budget-value').textContent = object.budget
            document.querySelector('.budget-income-value').textContent = object.totalIncome
            document.querySelector('.budget-expenses-value').textContent = object.totalExpense
            
            if(object.percentage > 0) {
                document.querySelector('.budget-expenses-percentage').textContent = object.percentage + '%'
            } else {
                document.querySelector('.budget-expenses-percentage').textContent = '...'
            }
        }
    }

})()

 

/*
* Global APP CONTROLLER  
*/
const controller = (function (budgetCtrl, UICtrl) {
    
    // function to handle the events 
    const setupEventLinsteners = () => {
        //When the add button is clicked invoke the controlAddItem function
        document.querySelector('.add-btn').addEventListener('click', controlAddItem)
    

        //When the 'Enter' key is pressed, invoke the controlAddItem function.
        document.addEventListener('keypress', (e) => {
        
            if(e.keyCode === 13 || e.which === 13) {
                controlAddItem()
            }

        })

         //When the add button is clicked invoke the controlDeleteItem function
        document.querySelector('.container').addEventListener('click', ctrlDeleteItem)

    }


 
    const updateBudget = () => {
        //1. calculate the budget
        budgetCtrl.calculateBudget()

        //2.return the budget
        const budget = budgetCtrl.getBudget()

        //3. display the budget into the UI
        UIController.displayBudget(budget)

    }


    /*
    * function to add a item 
    */
    const controlAddItem = () => {


        //1. Get the field input value
        const inputValues  =  UICtrl.getIpuntValue()

        if(inputValues.budgetDescription !== '' && !isNaN(inputValues.budgetValue) && inputValues.budgetValue > 0 ) {

            //2. Add the item to the budget controller
            const newItem =  budgetCtrl.addItem(inputValues.budgetType, inputValues.budgetDescription, inputValues.budgetValue)

            //3. Add the item to the UI
            UIController.addListItem(newItem, inputValues.budgetType)  
            UIController.clearFields()      
            
            //4. Calculate and the budget
            updateBudget()

            //5. Display the item on the UI     
            

        }else {
            alert('Please fill all fields')
        }

        
         
    }

    /*
    *@params {event} - the object to get the target of the event 
    */
    const ctrlDeleteItem = (event) => {
        
        //get the id of the budget item(it will be something like "inc-1" or "exp-1")
        const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        //If the item id exists then 
        if(itemID) {

            //split the item id by "-"(it will create a new arry with something like ['inc', '1'] ord ['exp', '1'])
            const splitID = itemID.split('-')

            //type is "exp" or "inc"
            const type = splitID[0]

            const ID = parseInt(splitID[1])


            //1. Delete the item from the data sctructure
             budgetCtrl.deleteItem(type, ID)

            //2. Delete the item from the UI
            UICtrl.deleteListItem(itemID)

            //3. Update the budget
            updateBudget()
        }
    }


    return {

        // initialize the app
        init: function() {
            setupEventLinsteners()
            UIController.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1
            })
        }
    }

})(budgetController, UIController)

controller.init()
