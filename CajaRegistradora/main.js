const productList = document.getElementById('productList');
const cartTable = document.querySelector('#cart tbody');
const invoiceContainer = document.querySelector('.carrito-factura');
const buyButton = document.getElementById('buyButton');
const clearButton = document.getElementById('clearButton');

let cart = [];
let invoiceCount = 0;

productList.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const product = {
        name: selectedOption.value,
        price: parseFloat(selectedOption.dataset.price),
        quantity: 1 
    };
    addToCart(product);
});

function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }
    updateCart();
}

function updateCart() {
    cartTable.innerHTML = '';

    cart.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td><input type="number" value="${product.quantity}" min="1" data-index="${index}"></td>
            <td><button onclick="removeFromCart(${index})">Eliminar</button></td>
        `;
        cartTable.appendChild(row);
    });

    document.querySelectorAll('#cart input').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value);
            updateProductQuantity(index, newQuantity);
        });
    });
}

function updateProductQuantity(index, quantity) {
    cart[index].quantity = quantity;
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    Swal.fire({
        icon: 'info',
        title: 'Producto Eliminado',
        text: 'El producto ha sido eliminado del carrito.',
    });
}

clearButton.addEventListener('click', () => {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'No hay productos en el carrito para eliminar.',
        });
        return;
    }
    
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esto eliminará todos los productos del carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar todo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cart = [];
            updateCart();
            Swal.fire(
                'Eliminado',
                'Todos los productos han sido eliminados.',
                'success'
            );
        }
    });
});
buyButton.addEventListener('click', () => {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'PARCE NO HAY PRODUCTOS',
            text: 'No hay productos en el carrito para comprar.',
        });
        return;
    }
    invoiceCount++;
    const newInvoiceTable = document.createElement('table');
    newInvoiceTable.classList.add('invoice');
    newInvoiceTable.innerHTML = `
        <thead>
            <tr>
                <th>Factura #${invoiceCount}</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    invoiceContainer.appendChild(newInvoiceTable);
    const invoiceBody = newInvoiceTable.querySelector('tbody');

    let total = 0;

    cart.forEach(product => {
        const row = document.createElement('tr');
        const productTotal = product.price * product.quantity;
        total += productTotal;
        row.innerHTML = `
            <td></td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.quantity}</td>
            <td>$${productTotal}</td>
        `;
        invoiceBody.appendChild(row);
    });

    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td colspan="4">Total</td>
        <td>$${total}</td>
    `;
    invoiceBody.appendChild(totalRow);
    cart = [];
    updateCart();
    productList.selectedIndex = 0;
    Swal.fire({
        icon: 'success',
        title: 'Compra muy chimba',
        text: 'Tu compra ha sido registrada exitosamente.',
    });
});