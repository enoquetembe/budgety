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


    /* Data structure to store all about expenses and incoms */
    const data = {
        
        //items
        allItems: {
            exp: [] , //expense
            inc: [] //income
        },

        totals: {
            expense :  0,
            income: 0
        }

    }

    return {

        addItem: function(type, desc, val ) {
            let newItem, ID;
            
            //Generating the ID for the items
            if(data.allItems[type][data.allItems[type].length] > 0) {
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
                budgetValue: document.querySelector('.add-value').value
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

                html = '<div class="item clearfix" id="income-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-delete"><button class="item__delete--btn"><i class="ion-ios-clos-outline"></i></button></div></div> </div> '

            } else if(type==='exp') {
                element = document.querySelector('.expenses-list')

                html = ' <div class="item clearfix" id="expense-%id%"> <div class="item-description">%description%</div> <div class="right clearfix"> <div class="item-value">%value%</div> <div class="item-percentage">21%</div> <div class="item-delete"> <button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div> '
            }
            
            //Replace the placeholder with some actual data
            newHtml = html.replace('%id%', object.id)
            newHtml = newHtml.replace('%description%', object.description)
            newHtml = newHtml.replace('%value%', object.value)
            
            //insert the HTML into the DOM
            element.insertAdjacentHTML('beforeend', newHtml)

        },

        //Function to clear the input fields 
        clearFields: function() {
            //get the input fields
            const fields = document.querySelectorAll('.add-description, .add-value') 

            //since the querySelctor all returns a list, convert this into array using the slice method
            const fieldsArray = Array.prototype.slice.call(fields)

            //clear the current value from the input field
            fieldsArray.forEach(function(current, index, array) {
                current.value = ''
            })

            fieldsArray[0].focus()
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

    }


    /*
    * function to add a item 
    */
    const controlAddItem = () => {
        //1. Get the field input value
        const inputValues  =  UICtrl.getIpuntValue()

        //2. Add the item to the budget controller
        const newItem =  budgetCtrl.addItem(inputValues.budgetType, inputValues.budgetDescription, inputValues.budgetValue)

        //3. Add the item to the UI
        UIController.addListItem(newItem, inputValues.budgetType)  
        UIController.clearFields()      
        
        //4. Calculate the budget

        //5. Display the item on the UI
         
    }


    return {

        // initialize the app
        init: function() {
            setupEventLinsteners()
        }
    }

})(budgetController, UIController)

controller.init()
