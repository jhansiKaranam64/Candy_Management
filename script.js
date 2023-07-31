form = document.getElementById('my-form');
itemList = document.getElementById('items');
const msg=document.querySelector('.msg');

form.addEventListener('submit',addItem);

// Add details
function addItem(e){
    e.preventDefault();

    var newName = document.getElementById('name');
    var newDes = document.getElementById('description');
    var newPrice = document.getElementById('Price');
    var newQuantity = document.getElementById('Quantity');

    if(newName.value===''||newDes.value===''||newPrice.value===''||newQuantity.value===''){
        msg.classList.add('error');
        msg.innerHTML='Please enter all fields';

        // remove error after 3 sec
        setTimeout(()=>msg.remove(),3000);
    }else{

        var newUser={
            name : newName.value,
            des : newDes.value,
            price : newPrice.value,
            quantity : newQuantity.value
        }

        axios.post("https://crudcrud.com/api/bf0c266f5460483c90d771f9064a2671/details",newUser)
            .then(response => {
                console.log(response);
                showNewUserOnScreen(response.data)
            })
            .catch(err => {
                console.log(err);
            })

        //clear fields
        newName.value='';
        newDes.value='';
        newPrice.value='';
        newQuantity.value='';
    }
}
//display function
function showNewUserOnScreen(obj){

    var li =document.createElement('li');
    li.dataset.id = obj._id;
    li.className = "list-group-item";

    const nameElement = document.createElement('span');
    nameElement.classList = "name";
    nameElement.textContent = obj.name+": ";

    const desElement = document.createElement('span');
    desElement.classList = "describe";
    desElement.textContent = obj.des+": ";
    
    const priceElement = document.createElement('span');
    priceElement.classList = "price";
    priceElement.textContent = obj.price+": ";

    const quantityElement = document.createElement('span');
    quantityElement.classList = "quantity";
    quantityElement.textContent = obj.quantity;
    

    var firstBtn = document.createElement('button');
    firstBtn.className ="btn btn-primary btn-sm float-right buy1";
    firstBtn.appendChild(document.createTextNode('Buy 3'));
    firstBtn.setAttribute('onclick', `buyCandy('${obj._id}', 3)`);

    li.appendChild(nameElement);
    li.appendChild(desElement);
    li.appendChild(priceElement);
    li.appendChild(quantityElement);
        
    var secondBtn = document.createElement('button');
    secondBtn.classList = "btn btn-success btn-sm float-right buy2";
    secondBtn.appendChild(document.createTextNode('Buy 2'));
    secondBtn.setAttribute('onclick', `buyCandy('${obj._id}', 2)`);

    var thirdBtn = document.createElement('button');
    thirdBtn.classList = "btn btn-primary btn-sm float-right buy3";
    thirdBtn.appendChild(document.createTextNode('Buy 1'));
    thirdBtn.setAttribute('onclick', `buyCandy('${obj._id}', 1)`);
    
    li.appendChild(firstBtn);
    li.appendChild(secondBtn); 
    li.appendChild(thirdBtn);
    itemList.appendChild(li);

}
// loading data with is already stored in server
window.addEventListener("DOMContentLoaded",() => {
    axios.get("https://crudcrud.com/api/bf0c266f5460483c90d771f9064a2671/details")
    .then(res=>{
        const data = res.data;
        data.forEach(item =>{
            showNewUserOnScreen(item);
        });
        
    })
    .catch(err=>{
        console.log(err);
    })
})
//Buy 1 
function buyCandy(itemId, quantityToBuy) {
    const itemToUpdate = document.querySelector(`li[data-id="${itemId}"]`);
    const quantityElement = itemToUpdate.querySelector(".quantity");
    const currentQuantity = parseInt(quantityElement.textContent, 10);

    if (currentQuantity >= quantityToBuy) {
        const newQuantity = currentQuantity - quantityToBuy;
        quantityElement.textContent = newQuantity;

        // Get the existing candy item details from the list item
        const itemName = itemToUpdate.querySelector(".name").textContent;
        const itemDescription = itemToUpdate.querySelector(".describe").textContent;
        const itemPrice = parseFloat(itemToUpdate.querySelector(".price").textContent);

        // Create the updated candy item
        const updatedCandy = {
            name: itemName,
            des: itemDescription,
            price: itemPrice,
            quantity: newQuantity,
        };
        // Update the quantity on the server
        axios.put(`https://crudcrud.com/api/bf0c266f5460483c90d771f9064a2671/details/${itemId}`,updatedCandy)
            .then(response => {
                console.log("Quantity updated on the server:", response.data);
            })
            .catch(err => {
                console.log("Error updating quantity on the server:", err);
            });
        if(newQuantity===0){
            axios.delete(`https://crudcrud.com/api/bf0c266f5460483c90d771f9064a2671/details/${itemId}`)
            .then(res =>{
                itemToUpdate.remove();
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }else{
        msg.classList.add('error');
        msg.innerHTML='No sufficient quantity';

        // remove error after 3 sec
        setTimeout(()=>msg.remove(),3000);
    }
}
