// Cart JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Cart functions
    window.cart = {
        getCart: function() {
            return JSON.parse(localStorage.getItem('cart')) || [];
        },

        saveCart: function(cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCount();
        },

        addItem: function(product) {
            const cart = this.getCart();
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            this.saveCart(cart);
            this.showNotification('Item added to cart');
        },

        removeItem: function(productId) {
            let cart = this.getCart();
            cart = cart.filter(item => item.id !== productId);
            this.saveCart(cart);
        },

        updateQuantity: function(productId, quantity) {
            const cart = this.getCart();
            const item = cart.find(item => item.id === productId);

            if (item) {
                if (quantity <= 0) {
                    this.removeItem(productId);
                } else {
                    item.quantity = quantity;
                    this.saveCart(cart);
                }
            }
        },

        getTotal: function() {
            const cart = this.getCart();
            return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        getCount: function() {
            const cart = this.getCart();
            return cart.reduce((sum, item) => sum + item.quantity, 0);
        },

        clearCart: function() {
            localStorage.removeItem('cart');
            this.updateCount();
        },

        updateCount: function() {
            const count = this.getCount();
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) {
                cartCountEl.textContent = count;
                if (count > 0) {
                    cartCountEl.style.display = 'flex';
                } else {
                    cartCountEl.style.display = 'none';
                }
            }
        },

        showNotification: function(message) {
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    };

    // Initialize cart count
    window.cart.updateCount();
});

// Cart notification styles
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
    }
    .cart-notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);
