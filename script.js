// Función para formatear números con puntos como separadores de miles
function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

// Función para agregar productos al carrito
function addToCart(name, price, images) {
    // Obtiene el carrito actual (si existe) o crea un array vacío si está vacío
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Verifica si el producto ya está en el carrito
    let productIndex = cart.findIndex(item => item.name === name);
    
    // Si el producto ya está en el carrito, aumenta la cantidad
    if (productIndex > -1) {
        cart[productIndex].quantity++;
    } else {
        // Si no está en el carrito, lo agrega como nuevo
        cart.push({ name, price, quantity: 1, images }); // Añadir imagen
    }

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualiza el contador de productos en el carrito
    updateCartCount();
}


// Función para actualizar el contador de productos en el carrito
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Función para mostrar los productos en el carrito
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary-items');
    const totalPriceElement = document.getElementById('total-price');
    const finalTotalElement = document.getElementById('final-total');
    
    let total = 0;
    cartItemsContainer.innerHTML = ""; // Limpiar los elementos del carrito
    cartSummaryContainer.innerHTML = ""; // Limpiar el resumen del pedido

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Tu carrito está vacío. Agrega productos para comenzar a comprar.</p>";
    } else {
        cart.forEach((item, index) => {
            // Crear el producto en el carrito
            const productDiv = document.createElement('div');
            productDiv.classList.add('cart-item');
            productDiv.innerHTML = `
                <img src="${item.images}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <p class="product-name">${item.name}</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Precio unitario: $${formatNumber(item.price)}</p>
                    <p><strong>Total: $${formatNumber(item.price * item.quantity)}</strong></p>
                    <button onclick="removeFromCart(${index})" class="remove-btn">Eliminar</button>
                </div>
            `;
            cartItemsContainer.appendChild(productDiv);

            // Agregar al resumen del pedido
            const summaryItem = document.createElement('div');
            summaryItem.classList.add('summary-item');
            summaryItem.innerHTML = ` 
                <span><strong>${item.name}</strong> x${item.quantity}</span>
                <span>$${formatNumber(item.price * item.quantity)}</span>
            `;
            cartSummaryContainer.appendChild(summaryItem);

            total += item.price * item.quantity;
        });
    }

    // Mostrar el total
    totalPriceElement.textContent = `$${formatNumber(total)}`;
    finalTotalElement.textContent = `$${formatNumber(total.toFixed(2))}`;
}


// Llamar a la función para mostrar el carrito al cargar la página
window.onload = displayCart;

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // Eliminar el producto en la posición 'index'
    localStorage.setItem('cart', JSON.stringify(cart)); // Guardar el carrito actualizado
    displayCart(); // Volver a mostrar el carrito actualizado
}


// Función para limpiar el carrito
function clearCart() {
    localStorage.removeItem('cart');
    displayCart();
}


// Mostrar formulario de pago cuando el usuario hace clic en "Revisar compra"
document.getElementById('review-btn').onclick = function () {
    document.querySelector('.cart-summary').style.display = 'none';
    document.getElementById('payment-form-container').style.display = 'block';
};

// Manejar el envío del formulario de pago
document.getElementById('payment-form').onsubmit = function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        address: formData.get('address'),
        card: formData.get('card') // Si usas un formulario de pago, deberías implementar este campo
    };

    // Validar los campos
    if (!userData.name || !userData.email || !userData.address) {
        alert('Por favor, complete todos los campos del formulario.');
        return;
    }

    // Llamar a la función para generar y abrir el enlace de WhatsApp
    sendOrderWhatsApp(userData.name, userData.email, userData.address);
};

// Función para enviar el pedido por WhatsApp
function sendOrderWhatsApp(fullName, email, address) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let orderSummary = '';
    let total = 0;

    // Crear el resumen del pedido
    cart.forEach(item => {
        orderSummary += `${item.name} - Cantidad: ${item.quantity} - Precio Total: $${formatNumber(item.price * item.quantity)}\n`; // Usar salto de línea limpio
        total += item.price * item.quantity;
    });

    // Crear el mensaje que se enviará por WhatsApp
    const message = `*Nuevo Pedido*\n\n` +
                    `*Nombre:* ${fullName}\n` +
                    `*Correo:* ${email}\n` +
                    `*Localidad:* ${address}\n\n` +
                    `*Detalles del pedido:*\n${orderSummary}` +
                    `*Total:* $${formatNumber(total.toFixed(2))}`;

    // Número de WhatsApp (sin el +, incluye el código de país)
    const phoneNumber = '5491140838075';  // Cambia esto por el número de WhatsApp al que deseas enviar el mensaje

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Crear el enlace de WhatsApp
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Redirigir al usuario a WhatsApp
    window.open(whatsappLink, '_blank');
};




