
/*----------  DOM Selection ----------*/
let formEl = document.querySelector('form');
let productName = document.querySelector('.product-name');
let productPrice = document.querySelector('.product-price');
let addProductBtn = document.querySelector('.add-product');
let listGroup = document.querySelector('.list-group');
let listItem = document.querySelector('.collection-item');
let filterEl = document.querySelector('#filter');
let messege = document.querySelector('.msg');

let products = [];

/*----------  Form Button Submission  ----------*/
formEl.addEventListener('submit', function(e){
    e.preventDefault();
    
    let {nameInput, priceInput} = getInput();
    let isError = validateInput(nameInput, priceInput);
    
    if(!isError){
        let id = uuidv4();
        let product = {
            id: id,
            name: nameInput,
            price: priceInput,
        }
        //add item to the product array as object.
        products.push(product)
        messege.innerText = '';
        // add item to the collection
        addCollectionItem(products);

        // add item to localstorage
        addItemToLocalStorage(product);
        resetInput();
    }
})
/*----------  UUID Generate Function  ----------*/
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
/*----------  Check Input Validation  ----------*/
function validateInput(name, price){
    let isError = false;
    if((!name || name <= 0) && (!price || price <= 0 )){
        isError = true;
        messege.innerText = 'Please Input Product Name And Price.';
        console.log(true)
    }else if(!name || name <= 0 ){
        isError = true;
        messege.innerText = 'Please Input Product Name.';
        console.log("name")
    }else if(!price || price <= 0 ){
        isError = true;
        messege.innerText = 'Please Input Product Price.';
        console.log('price')
    }


    return isError;
}


/*----------  Get Input Value  ----------*/
function getInput(){
    let nameInput = productName.value;
    let priceInput = productPrice.value;
    return {
        nameInput,
        priceInput,
    }
}


/*----------  Add Collection To The UI  ----------*/
function addCollectionItem(items){
    listGroup.innerHTML = '';
    items.forEach(item => {
        let listElement = `<li class="list-group-item collection-item id-${item.id}">
                            <strong>${item.name}</strong> - <span class="price">$${item.price}</span>
                            <i class="fa fa-trash float-right delete-item"></i>
                            <i class="fa fa-pencil-alt float-right edit-item"></i>
                      </li>`;
        listGroup.insertAdjacentHTML("afterbegin", listElement);
    })
}


/*----------  Add item To LocalStotage  ----------*/
function addItemToLocalStorage(product){

    if(localStorage.getItem('storeProduct')){
        let products =  JSON.parse(localStorage.getItem('storeProduct'));
        products.push(product);
        localStorage.setItem('storeProduct', JSON.stringify(products));
    }else{
        let products = [];
        products.push(product);
        localStorage.setItem('storeProduct', JSON.stringify(products));
    }

}


/*----------  Show Products on DOM Content Loaded  ----------*/

document.addEventListener('DOMContentLoaded', function(){
    if(localStorage.getItem('storeProduct')){
        products = JSON.parse(localStorage.getItem('storeProduct'));
        addCollectionItem(products);
    }
})

/*----------  Reset Input After Submit  ----------*/
function resetInput(){
    productName.value = '';
    productPrice.value = '';
}


/*----------  Filter elemnets from collections  ----------*/
filterEl.addEventListener('keyup', (e) => {
    const filtervalue = e.target.value;
    let filterResult = products.filter(product => product.name.toLowerCase().includes(filtervalue.toLowerCase()));

    console.log(filterResult)
    showFilterItemToUI(filterResult);

    if(localStorage.getItem('storeProduct')){
        let products = JSON.parse(localStorage.getItem('storeProduct'));
        let filterResult = products.filter(product => product.name.toLowerCase().includes(filtervalue.toLowerCase()));
        showFilterItemToUIFromLocalStorage(filterResult);
    }

})

function showFilterItemToUI(filterResult){
    listGroup.innerHTML = '';
    filterResult.forEach(item => {
        let listElement = `<li class="list-group-item collection-item id-${item.id}">
                            <strong>${item.name}</strong> - <span class="price">$${item.price}</span>
                            <i class="fa fa-trash float-right delete-item"></i>
                            <i class="fa fa-pencil-alt float-right edit-item"></i>
                          </li>`;
        listGroup.insertAdjacentHTML("afterbegin", listElement);
    })
}

function showFilterItemToUIFromLocalStorage(filterResult){
    listGroup.innerHTML = '';
    filterResult.forEach(item => {
        let listElement = `<li class="list-group-item collection-item id-${item.id}">
                            <strong>${item.name}</strong> - <span class="price">$${item.price}</span>
                            <i class="fa fa-trash float-right delete-item"></i>
                            <i class="fa fa-pencil-alt float-right edit-item"></i>
                          </li>`;
        listGroup.insertAdjacentHTML("afterbegin", listElement);
    })
}

let updatedID;
/*----------  Delete Item From Collected Product list  ----------*/
listGroup.addEventListener('click', function(e){
    let currentDeleteItem = e.target.classList.contains('delete-item');
    let currentEditeItem = e.target.classList.contains('edit-item');
    if(currentDeleteItem){
        /*----------  Delete Current Item With Target Id  ----------*/
        updatedID = getItemID(e.target);
        removeItemFromUI(updatedID);
        removeItemFromDataStore(updatedID);
        //e.target.parentElement.remove(); /*----------  One line Solution To Delete Current Item  ----------*/
        removeItemFromLocalStorage(updatedID);
    }else if(currentEditeItem){
        updatedID = getItemID(e.target);
        let foundProduct = products.find(product => product.id == updatedID);
        populateUIInEditeState(foundProduct);
        if(!document.querySelector('.update-product')){
            showUpdateBtn();
        }
    }
})

/*----------  Populate UI In Edit State  ----------*/
function populateUIInEditeState(product){
    productName.value = product.name;
    productPrice.value = product.price;
}
/*----------  Show update Button  ----------*/
function showUpdateBtn(){
    const updateBtn = `<button type="button" class="btn mt-3 btn-block btn-primary update-product">Update</button>`;
    addProductBtn.style.display = 'none';
    formEl.insertAdjacentHTML('beforeend', updateBtn);
}


/*=============================================
=            Product Update Functions            =
=============================================*/

formEl.addEventListener('click', function(e){
    if(e.target.classList.contains('update-product')){
        let {nameInput, priceInput} = getInput();
        let isError = validateInput(nameInput, priceInput);
        if(!isError){
            products = products.map(product => {
                if(product.id === updatedID){
                    return {
                        id: product.id,
                        name: nameInput,
                        price: priceInput,
                    }
                }else{
                    return product;
                }
            })
            /*----------  Show Updated Items To UI  ----------*/
            addCollectionItem(products);
        }
        addProductBtn.style.display = 'block';
        document.querySelector('.update-product').remove();
        updateItemToLocalStorage();
        /*----------  Reset Input Fields After item added.  ----------*/
        resetInput();
    }
})  


/*----------  Update Item From Local Storage  ----------*/
function updateItemToLocalStorage(){
    if(localStorage.getItem('storeProduct')){
        localStorage.setItem('storeProduct', JSON.stringify(products));
    }
}

/*----------  Remove Item From UI  ----------*/
function removeItemFromUI(id){
    document.querySelector(`.id-${id}`).remove();
}
/*----------  Remove Item From Data Store  ----------*/
function removeItemFromDataStore(id){
    products = products.filter(prodcut => prodcut.id !== id);
}
/*----------  Remove Item From LocaleStorage  ----------*/
function removeItemFromLocalStorage(id){
    let products = JSON.parse(localStorage.getItem('storeProduct'))
    productsAfterFilter = products.filter(prodcut => prodcut.id !== id);
    localStorage.setItem('storeProduct', JSON.stringify(productsAfterFilter))
}

/*----------  Get Item ID  ----------*/
function getItemID(elem){
    return elem.parentElement.classList[2].split('-').splice(1).join('-'))
}









