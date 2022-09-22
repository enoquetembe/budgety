/*
* budget CONTROLLER
*/
const budgetController = (function () {
    
 })()


 
/*
*User Interface CONTROLLER
*/
const UIController = (function () {

})()

 

/*
* Global APP CONTROLLER  
*/
const controller = (function (budgetCtrl, UICtrl) {

    const controlAddItem = () => {
        //1. Get the field input value

        //2. Add the item to the budget controller

        //3. Add the item to the U
        
        //4. Calculate the budget
        
        //5. Display the item on the UI

        console.log('ok')
    }


    //When the add button is clicked invoke the controlAddItem function
    document.querySelector('.add-btn').addEventListener('click', controlAddItem)
    

    //When the 'Enter' key is pressed, invoke the controlAddItem function.
    document.addEventListener('keypress', (e) => {
        
        if(e.keyCode === 13 || e.which === 13) {
            controlAddItem()
        }

    })

})(budgetController,UIController)

