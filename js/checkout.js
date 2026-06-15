// Checkout Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // State
    let currentStep = 1;
    let orderData = {
        customer: {},
        address: {},
        payment: {},
        items: [],
        total: 0
    };

    // DOM Elements
    const steps = document.querySelectorAll('.progress-step');
    const stepContents = document.querySelectorAll('.checkout-step');
    const progressLines = document.querySelectorAll('.progress-line');

    // Initialize
    init();

    function init() {
        loadCartItems();
        setupEventListeners();
        initMap();
        updateOrderSummary();
    }

    // Load cart items
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        orderData.items = cart;
        orderData.total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        renderSummaryItems();
    }

    // Render summary items
    function renderSummaryItems() {
        const summaryItems = document.getElementById('summary-items');
        const reviewItems = document.getElementById('review-items');

        if (orderData.items.length === 0) {
            summaryItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            reviewItems.innerHTML = '<p class="empty-cart">No items in order</p>';
            return;
        }

        let html = '';
        orderData.items.forEach(item => {
            html += `
                <div class="summary-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity}</p>
                        <p class="item-price">${item.price.toFixed(3)} KD</p>
                    </div>
                </div>
            `;
        });

        summaryItems.innerHTML = html;
        reviewItems.innerHTML = html;

        updateTotals();
    }

    // Update totals
    function updateTotals() {
        const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const delivery = 0;
        const total = subtotal + delivery;

        document.getElementById('summary-subtotal').textContent = subtotal.toFixed(3) + ' KD';
        document.getElementById('summary-total').textContent = total.toFixed(3) + ' KD';
        document.getElementById('wamd-amount').textContent = total.toFixed(3) + ' KD';
        document.getElementById('modal-amount').textContent = total.toFixed(3) + ' KD';

        orderData.total = total;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Step 1: Customer Form
        document.getElementById('customer-form').addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateCustomerForm()) {
                goToStep(2);
            }
        });

        // Step 2: Address Form
        document.getElementById('address-form').addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateAddressForm()) {
                goToStep(3);
            }
        });

        // Step 3: Payment Form
        document.getElementById('payment-form').addEventListener('submit', function(e) {
            e.preventDefault();
            if (validatePaymentForm()) {
                goToStep(4);
                updateReviewSection();
            }
        });

        // Step 4: Place Order
        document.getElementById('place-order-btn').addEventListener('click', function() {
            if (validateTerms()) {
                placeOrder();
            }
        });

        // Back buttons
        document.querySelectorAll('.btn-back').forEach(btn => {
            btn.addEventListener('click', function() {
                const backStep = parseInt(this.dataset.back);
                goToStep(backStep);
            });
        });

        // File upload
        setupFileUpload();

        // Use My Location
        document.getElementById('use-my-location').addEventListener('click', useMyLocation);

        // Copy WAMD number
        document.getElementById('copy-wamd-number').addEventListener('click', function() {
            copyToClipboard('94091673');
        });

        document.getElementById('copy-modal-number').addEventListener('click', function() {
            copyToClipboard('94091673');
        });

        // Coupon
        document.getElementById('apply-coupon').addEventListener('click', applyCoupon);

        // Modal
        document.getElementById('modal-close').addEventListener('click', closeModal);
        document.getElementById('wamd-modal').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        // Mobile menu
        const menuToggle = document.getElementById('mobile-menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                document.getElementById('mobile-nav').classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    }

    // Go to step
    function goToStep(step) {
        // Save current step data
        saveStepData(currentStep);

        // Update progress bar
        steps.forEach((s, index) => {
            const stepNum = index + 1;
            s.classList.remove('active', 'completed');
            if (stepNum < step) {
                s.classList.add('completed');
            } else if (stepNum === step) {
                s.classList.add('active');
            }
        });

        // Update progress lines
        progressLines.forEach((line, index) => {
            if (index < step - 1) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });

        // Show/hide step content
        stepContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`step-${step}`).classList.add('active');

        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Save step data
    function saveStepData(step) {
        if (step === 1) {
            orderData.customer = {
                name: document.getElementById('full-name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value
            };
        } else if (step === 2) {
            orderData.address = {
                full: document.getElementById('full-address').value,
                area: document.getElementById('area').value,
                block: document.getElementById('block').value,
                coordinates: selectedCoordinates
            };
        } else if (step === 3) {
            orderData.payment = {
                screenshot: localStorage.getItem('paymentScreenshot'),
                transactionId: document.getElementById('transaction-id').value
            };
        }
    }

    // Validation functions
    function validateCustomerForm() {
        let valid = true;
        const name = document.getElementById('full-name');
        const phone = document.getElementById('phone');

        if (!name.value.trim()) {
            showError('name-error', 'Please enter your name');
            name.classList.add('error');
            valid = false;
        } else {
            clearError('name-error');
            name.classList.remove('error');
        }

        if (!phone.value.trim() || phone.value.length !== 8) {
            showError('phone-error', 'Please enter a valid 8-digit phone number');
            phone.classList.add('error');
            valid = false;
        } else {
            clearError('phone-error');
            phone.classList.remove('error');
        }

        return valid;
    }

    function validateAddressForm() {
        let valid = true;
        const address = document.getElementById('full-address');

        if (!address.value.trim()) {
            showError('address-error', 'Please enter your delivery address');
            address.classList.add('error');
            valid = false;
        } else {
            clearError('address-error');
            address.classList.remove('error');
        }

        return valid;
    }

    function validatePaymentForm() {
        let valid = true;
        const screenshot = localStorage.getItem('paymentScreenshot');
        const transactionId = document.getElementById('transaction-id');

        if (!screenshot) {
            showError('screenshot-error', 'Please upload payment screenshot');
            valid = false;
        } else {
            clearError('screenshot-error');
        }

        if (!transactionId.value.trim()) {
            showError('transaction-error', 'Please enter transaction ID');
            transactionId.classList.add('error');
            valid = false;
        } else {
            clearError('transaction-error');
            transactionId.classList.remove('error');
        }

        return valid;
    }

    function validateTerms() {
        const checkbox = document.getElementById('terms-checkbox');
        if (!checkbox.checked) {
            showError('terms-error', 'Please confirm the order details');
            return false;
        }
        clearError('terms-error');
        return true;
    }

    function showError(id, message) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = message;
            el.style.display = 'block';
        }
    }

    function clearError(id) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = '';
            el.style.display = 'none';
        }
    }

    // Update review section
    function updateReviewSection() {
        document.getElementById('review-name').textContent = orderData.customer.name;
        document.getElementById('review-phone').textContent = '+965 ' + orderData.customer.phone;
        document.getElementById('review-email').textContent = orderData.customer.email || 'Not provided';
        document.getElementById('review-address').textContent = orderData.address.full +
            (orderData.address.area ? ', ' + orderData.address.area : '') +
            (orderData.address.block ? ', Block ' + orderData.address.block : '');
        document.getElementById('review-transaction').textContent = orderData.payment.transactionId;

        const screenshot = localStorage.getItem('paymentScreenshot');
        if (screenshot) {
            document.getElementById('review-screenshot').src = screenshot;
        }

        // Map link
        if (orderData.address.coordinates) {
            const mapLink = `https://www.openstreetmap.org/?mlat=${orderData.address.coordinates.lat}&mlon=${orderData.address.coordinates.lng}#map=16/${orderData.address.coordinates.lat}/${orderData.address.coordinates.lng}`;
            document.getElementById('review-map-link').href = mapLink;
        }
    }

    // Place order
    function placeOrder() {
        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 5).toUpperCase();

        const order = {
            id: orderId,
            ...orderData,
            status: 'pending',
            date: new Date().toISOString()
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('paymentScreenshot');

        // Redirect to success page
        window.location.href = `order-success.html?orderId=${orderId}`;
    }

    // File upload
    function setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('payment-screenshot');
        const placeholder = document.getElementById('upload-placeholder');
        const preview = document.getElementById('upload-preview');

        // Click to upload
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            handleFile(file);
        });

        fileInput.addEventListener('change', function() {
            handleFile(this.files[0]);
        });

        function handleFile(file) {
            if (!file || !file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('paymentScreenshot', e.target.result);
                document.getElementById('preview-image').src = e.target.result;
                placeholder.style.display = 'none';
                preview.style.display = 'flex';
                clearError('screenshot-error');
            };
            reader.readAsDataURL(file);
        }

        // Remove image
        document.getElementById('remove-image').addEventListener('click', function(e) {
            e.stopPropagation();
            localStorage.removeItem('paymentScreenshot');
            document.getElementById('preview-image').src = '';
            placeholder.style.display = 'flex';
            preview.style.display = 'none';
            fileInput.value = '';
        });
    }

    // Copy to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('WAMD number copied!');
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('WAMD number copied!');
        });
    }

    // Apply coupon
    function applyCoupon() {
        const couponInput = document.getElementById('coupon-input');
        const couponMessage = document.getElementById('coupon-message');
        const coupon = couponInput.value.trim();

        if (!coupon) {
            couponMessage.textContent = 'Please enter a coupon code';
            couponMessage.className = 'coupon-message error';
            return;
        }

        // Check coupon (example validation)
        if (coupon.toUpperCase() === 'WELCOME10') {
            const discount = orderData.total * 0.1;
            orderData.total -= discount;
            updateTotals();
            couponMessage.textContent = `Coupon applied! Discount: ${discount.toFixed(3)} KD`;
            couponMessage.className = 'coupon-message success';
        } else {
            couponMessage.textContent = 'Invalid coupon code';
            couponMessage.className = 'coupon-message error';
        }
    }

    // Close modal
    function closeModal() {
        document.getElementById('wamd-modal').style.display = 'none';
    }

    // Update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = count;
        }
    }

    updateCartCount();
});
