// App JavaScript - Main functionality
document.addEventListener('DOMContentLoaded', function() {
    init();

    function init() {
        updateCartCount();
        setupMobileMenu();
        renderFeaturedProducts();
        setupHeaderScroll();
        setupBackButton();
    }

    // Hardware back button support
    function setupBackButton() {
        // Push initial state
        history.pushState(null, null, location.href);

        window.addEventListener('popstate', function(event) {
            // Check if age modal is open
            var ageModal = document.getElementById('ageModal');
            if (ageModal && ageModal.style.display !== 'none') {
                // If age modal is open, exit site
                window.location.href = 'https://www.google.com';
                return;
            }

            // Check if cart modal is open
            var cartModal = document.querySelector('.cart-modal.open');
            if (cartModal) {
                cartModal.classList.remove('open');
                history.pushState(null, null, location.href);
                return;
            }

            // Check if mobile menu is open
            var mobileNav = document.getElementById('mobile-nav');
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                history.pushState(null, null, location.href);
                return;
            }

            // Default: go to home page
            var currentPage = window.location.pathname;
            if (currentPage !== '/' && currentPage !== '/index.html' && !currentPage.endsWith('index.html')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Cart count update
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = count;
            cartCountEl.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Mobile menu
    function setupMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        const menuClose = document.getElementById('mobile-menu-close');

        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', function() {
                mobileNav.classList.add('active');
            });
        }

        if (menuClose && mobileNav) {
            menuClose.addEventListener('click', function() {
                mobileNav.classList.remove('active');
            });
        }

        // Close on link click
        if (mobileNav) {
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => mobileNav.classList.remove('active'));
            });
        }
    }

    // Header scroll effect
    function setupHeaderScroll() {
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', () => {
                header.classList.toggle('scrolled', window.scrollY > 50);
            });
        }
    }

    // Render featured products on home page
    function renderFeaturedProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        // Check if product data exists
        if (typeof MEN_PRODUCTS === 'undefined' || typeof WOMEN_PRODUCTS === 'undefined') return;

        // Get 4 men + 4 women products
        const featured = [
            ...MEN_PRODUCTS.slice(0, 4),
            ...WOMEN_PRODUCTS.slice(0, 4)
        ];

        grid.innerHTML = featured.map(product => createProductCard(product)).join('');
    }

    // Create product card HTML
    function createProductCard(product) {
        const discount = Math.round((1 - product.price / product.originalPrice) * 100);
        const stars = renderStars(product.rating);
        const category = product.id.startsWith('m') ? 'men' : 'women';

        return `
            <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}&category=${category}'">
                <div class="product-card__image">
                    <img src="${product.images[0]}" alt="${product.name}" onerror="this.style.display='none'">
                    ${discount > 0 ? `<span class="product-card__badge">${discount}% OFF</span>` : ''}
                </div>
                <div class="product-card__info">
                    <h3 class="product-card__name">${product.name}</h3>
                    <p class="product-card__name-ar">${product.nameAr}</p>
                    <div class="product-card__rating">
                        <span class="stars">${stars}</span>
                        <span>(${product.reviewCount})</span>
                    </div>
                    <div class="product-card__price">
                        <span class="current">${product.price} KD</span>
                        <span class="original">${product.originalPrice} KD</span>
                    </div>
                    <div class="product-card__actions">
                        <button class="btn btn--primary btn--small" onclick="event.stopPropagation(); addToCart('${product.id}', '${product.name}', ${product.price}, '${product.images[0]}', '${category}')">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Render stars
    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - rating < 1 && i - rating > 0) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    // Add to cart function
    window.addToCart = function(id, name, price, image, category) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id, name, price, image, category, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showToast(`${name} added to cart!`);
    };

    // Toast notification
    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    // Expose functions globally
    window.updateCartCount = updateCartCount;
    window.showToast = showToast;
});
