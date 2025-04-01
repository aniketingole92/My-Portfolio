// Cart functionality
let cart = [];

// Add to cart function
function addToCart(product) {
    cart.push(product);
    updateCartBadge();
    saveCart();
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartBadge();
    saveCart();
}

// Update cart badge
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = cart.length;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }
}

// Quantity input handlers
document.querySelectorAll('.input-group input[type="number"]').forEach(input => {
    const minusBtn = input.previousElementSibling;
    const plusBtn = input.nextElementSibling;

    minusBtn.addEventListener('click', () => {
        if (input.value > 1) {
            input.value = parseInt(input.value) - 1;
            updateCartTotal();
        }
    });

    plusBtn.addEventListener('click', () => {
        input.value = parseInt(input.value) + 1;
        updateCartTotal();
    });
});

// Update cart total
function updateCartTotal() {
    const items = document.querySelectorAll('.cart-item');
    let subtotal = 0;

    items.forEach(item => {
        const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('input[type="number"]').value);
        subtotal += price * quantity;
    });

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.total').textContent = `$${total.toFixed(2)}`;
}

// Form validation
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (form.checkValidity()) {
            // Show success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success alert-dismissible fade show';
            successAlert.innerHTML = `
                <strong>Success!</strong> Your form has been submitted.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            form.insertAdjacentElement('beforebegin', successAlert);
            
            // Reset form
            form.reset();
        }
    });
});

// Product image gallery
document.querySelectorAll('.product-gallery img').forEach(img => {
    img.addEventListener('click', () => {
        const mainImage = document.querySelector('.product-gallery img.img-fluid');
        mainImage.src = img.src;
    });
});

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Load cart when page loads
document.addEventListener('DOMContentLoaded', loadCart);

// Handle coupon code
const couponCheckbox = document.getElementById('coupon');
const couponInput = document.querySelector('.input-group input[type="text"]');

if (couponCheckbox && couponInput) {
    couponCheckbox.addEventListener('change', () => {
        couponInput.disabled = !couponCheckbox.checked;
    });
}

// Handle payment form
const cardInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
if (cardInput) {
    cardInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });
}

// Handle expiry date input
const expiryInput = document.querySelector('input[placeholder="MM/YY"]');
if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });
}

// Handle CVV input
const cvvInput = document.querySelector('input[placeholder="123"]');
if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
} 