// ============================================
// GLOBAL APPLICATION CONTROLLER
// ============================================

/**
 * 1. GLOBAL PRODUCT CATALOG DATA STRUCTURE
 * Acts as the central single source of truth for item pricing and details.
 */
window.productCatalog = {
    'RICE-5KG':    { name: 'NutraGold Rice (5kg)', retailPrice: 7000, wholesalePrice: 6800 },
    'RICE-10KG':   { name: 'NutraGold Rice (10kg)', retailPrice: 13000, wholesalePrice: 12000 },
    'RICE-25KG':   { name: 'NutraGold Rice (25kg)', retailPrice: 29000, wholesalePrice: 26000 },
    'RICE-50KG':   { name: 'NutraGold Rice (50kg)', retailPrice: 59000, wholesalePrice: 52000 },
    'BEANS-HONEY-5KG': { name: 'Honey Beans (5kg)', retailPrice: 11000, wholesalePrice: 10000 },
    'BEANS-HONEY-10KG': { name: 'Honey Beans (10kg)', retailPrice: 21000, wholesalePrice: 19000 },
    'BEANS-HONEY-25KG': { name: 'Honey Beans (25kg)', retailPrice: 49000, wholesalePrice: 45000 },
    'GARRI-PREMIUM-5KG': { name: 'Premium Garri (5kg)', retailPrice: 7000, wholesalePrice: 6500 }
};

/**
 * Global Helper Function: Lookup Product by SKU
 * @param {string} sku - Unique product identifier
 * @returns {Object|null} - Returns product object or null if not found
 */
window.getProductBySku = function(sku) {
    return window.productCatalog[sku] || null;
};

// ============================================
// 2. MOBILE MENU TOGGLE (Clean & Dynamic)
// ============================================
(function() {

    let initialized = false;

    function initMobileMenu() {

        if (initialized) return;
        initialized = true;

        // Event Listener: Delegated handler for mobile navbar toggle (#mobileToggle)
        document.addEventListener('click', function(e) {

            const toggleBtn = e.target.closest('#mobileToggle');
            const nav = document.querySelector('.nav-links');

            // Toggle mobile drawer open/close
            if (toggleBtn && nav) {

                nav.classList.toggle('active');

                const isActive = nav.classList.contains('active');
                toggleBtn.textContent = isActive ? '✕' : '☰';
                return;

            }

            // Close mobile menu when clicking anywhere outside of the menu
            if (nav && nav.classList.contains('active') && !e.target.closest('.nav-links')) {

                nav.classList.remove('active');
                const btn = document.getElementById('mobileToggle');
                if (btn) btn.textContent = '☰';

            }

        });

        console.log('✅ Mobile menu event listener attached.');

    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', initMobileMenu);

    } else {

        initMobileMenu();

    }

})();

// ============================================
// 3. AUTO-HIGHLIGHT ACTIVE NAV LINK (Dynamic)
// ============================================
(function() {

    let initialized = false;

    function applyNavHighlight() {

        // Prevent multiple runs
        if (initialized) return;
        initialized = true;

        console.log('🔍 Applying nav highlight...');

        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        // Remove query strings
        const cleanCurrentPage = currentPage.split('?')[0];
        console.log('📄 Current page:', cleanCurrentPage);

        const links = document.querySelectorAll('.nav-link a');
        console.log('🔗 Links found:', links.length);

        if (links.length === 0) {

            console.warn('⚠️ No .nav-link a elements found yet. Will retry.');
            initialized = false; // Reset so we can try again
            return false; // Indicate failure

        }

        links.forEach(link => {

            let href = link.getAttribute('href');
            if (!href) return;

            // Remove query strings and fragments
            href = href.split('?')[0].split('#')[0];
            const hrefFile = href.split('/').pop() || href;

            if (hrefFile === cleanCurrentPage) {

                link.classList.add('active');
                console.log('  ✅ Active added to:', hrefFile);

            } else {

                link.classList.remove('active');

            }

        });

        return true; // Success
    }

    // 2. Use MutationObserver to watch for injected nav
    function watchForNav() {

        console.log('👀 Watching for nav injection...');

        const observer = new MutationObserver(function(mutations) {

            // Check if any .nav-link a elements have been added
            const links = document.querySelectorAll('.nav-link a');
            if (links.length > 0) {

                console.log('✅ Nav detected! Applying highlight.');
                applyNavHighlight();
                observer.disconnect(); // Stop watching once we have the nav

            }

        });

        // Start observing the entire document for child additions
        observer.observe(document.body, {

            childList: true,
            subtree: true

        });

        // Fallback: try again after a short delay if observer doesn't fire
        setTimeout(function() {

            const links = document.querySelectorAll('.nav-link a');
            if (links.length === 0) {

                console.warn('⏱️ Nav not detected after timeout. Please check your injection script.');

            } else {

                applyNavHighlight();
                observer.disconnect();

            }

        }, 3000); // 3 second fallback

    }

    // 1. Try immediately (in case nav is already in DOM)
    if (document.readyState !== 'loading') {

        if (!applyNavHighlight()) {

            // If failed, wait for DOM changes
            watchForNav();

        }

    } else {

        document.addEventListener('DOMContentLoaded', function() {

            if (!applyNavHighlight()) {

                watchForNav();

            }

        });

    }

})();

// ============================================
// 4. PROFILE DROPDOWN MODULE
// ============================================
(function() {

    /**
     * Event Listener: Handles user profile dropdown menu open/close toggling.
     */
    document.addEventListener('click', function(e) {

        const profile = document.getElementById('user-profile');
        if (!profile) return;

        // Toggle active class if clicking on profile, close if clicking outside
        if (profile.contains(e.target)) {

            profile.classList.toggle('active');

        } else {

            profile.classList.remove('active');

        }

    });

})();

// ============================================
// 5. AUTH OVERLAY & VIEW MANAGER MODULE
// ============================================
(function() {

    /**
     * Helper Function: Retrieve key modal backdrop & content DOM elements
     */
    function getOverlayElements() {

        return {
            backdrop: document.getElementById('authBackdrop') || document.querySelector('.auth-backdrop'),
            closeBtn: document.getElementById('authCloseBtn') || document.querySelector('.auth-close-btn'),
            content: document.getElementById('authContent') || document.querySelector('.auth-content')
        };

    }

    /**
     * Global Function: Open authentication overlay backdrop
     */
    window.openAuthOverlay = function() {

        const { backdrop } = getOverlayElements();
        if (backdrop) {
            backdrop.classList.add('show');
            document.body.classList.add('no-scroll'); // Prevent background body scroll
        }

    };

    /**
     * Global Function: Close authentication overlay backdrop
     */
    window.closeAuthOverlay = function() {
        const { backdrop } = getOverlayElements();
        if (backdrop) {
            backdrop.classList.remove('show');
            document.body.classList.remove('no-scroll'); // Re-enable background body scroll
        }
    };

    /**
     * Global Function: Switch active view inside the authentication modal
     * @param {string} view - Target view name ('login', 'register', 'success', 'orderSuccess', 'orderError')
     * @param {string} [authStatus] - Optional status flag ('login' or 'register')
     * @param {string} [businessName] - User/Business name for personalization
     */
    window.showAuthView = function(view, authStatus, businessName) {

        const allViews = document.querySelectorAll('.auth-view');

        if (allViews.length === 0) return;

        // Hide all modal views
        allViews.forEach(el => {
            el.classList.remove('show');
            el.classList.add('hide');
        });

        const viewMap = {
            login: 'authViewLogin',
            register: 'authViewRegister',
            success: 'authViewSuccess',
            orderSuccess: 'authViewOrderSuccess',
            orderError: 'authViewOrderError'
        };

        const target = document.getElementById(viewMap[view]);
        if (target) {

            target.classList.remove('hide');
            target.classList.add('show'); // Reveal target view

        } else {

            return;

        }

        // Custom logic for auth success view
        if (view === 'success') {

            const loginEls = target.querySelectorAll('.login');
            const regEls = target.querySelectorAll('.register');

            loginEls.forEach(el => {

                if (authStatus === 'login') {

                    el.classList.remove('hide');
                    el.classList.add('show');

                } else {

                    el.classList.remove('show');
                    el.classList.add('hide');

                }

            });

            regEls.forEach(el => {

                if (authStatus === 'register') {

                    el.classList.remove('hide');
                    el.classList.add('show');

                } else {

                    el.classList.remove('show');
                    el.classList.add('hide');

                }

            });

            if (businessName) {

                target.querySelectorAll('#successBusinessName').forEach(el => {
                    el.innerHTML = `Welcome, <strong>${businessName}</strong>!`;
                });

            }

            // Automatically transition customer to wholesale B2B pricing upon login/register
            if (typeof window.toggleWholesaleMode === 'function') {
                window.toggleWholesaleMode(true, businessName);
            }

        }

        window.openAuthOverlay();

    };

    /**
     * Global Function: Populate and display Order Success View
     * @param {Object} orderData - Order payload (number, total, delivery, eta, customerName)
     */
    window.showOrderSuccess = function(orderData) {

        const els = {
            number: document.getElementById('orderNumber'),
            total: document.getElementById('orderTotal'),
            delivery: document.getElementById('orderDelivery'),
            eta: document.getElementById('orderETA'),
            name: document.getElementById('orderCustomerName')
        };

        if (els.number) els.number.textContent = orderData.orderNumber || '#ORD-2026-001';
        if (els.total) els.total.textContent = orderData.total || '₦0';
        if (els.delivery) els.delivery.textContent = orderData.delivery || 'Express Delivery';
        if (els.eta) els.eta.textContent = orderData.eta || 'Today, 5:00 PM';
        if (els.name) els.name.textContent = orderData.customerName || 'Retailer';

        window.showAuthView('orderSuccess');

    };

    /**
     * Global Function: Populate and display Order Error View
     * @param {string} errorMessage - Message explaining the failure
     */
    window.showOrderError = function(errorMessage) {

        const msgEl = document.getElementById('orderErrorMessage');
        if (msgEl) msgEl.textContent = errorMessage || 'Payment verification failed.';
        window.showAuthView('orderError');

    };

    /**
     * Event Listener: Global delegated click handler for overlay controls and triggers
     */
    document.addEventListener('click', function(e) {

        // Intercept close button clicks
        const closeBtn = e.target.closest('#authCloseBtn, .auth-close-btn');
        if (closeBtn) {

            window.closeAuthOverlay();
            return;

        }

        // Close modal when clicking directly on backdrop background
        const backdrop = e.target;
        if (backdrop && backdrop.id === 'authBackdrop') {

            window.closeAuthOverlay();
            return;

        }

        // Intercept login/register link clicks to open overlay instead of navigating
        const link = e.target.closest('a[href*="login"], a[href*="register"], .login-btn, .register-btn, .switch-view, [data-auth="login"], [data-auth="register"]');
        if (link) {

            e.preventDefault();
            let view = link.dataset.view || link.dataset.auth;

            if (!view) {

                const href = link.getAttribute('href') || '';
                view = href.includes('login') ? 'login' : href.includes('register') ? 'register' : null;

            }

            if (view) window.showAuthView(view);

        }

    });

    /**
     * Event Listener: Handles submit actions on Auth Forms (Login / Register)
     */
    document.addEventListener('submit', function(e) {

        if (e.target.id === 'auth-login-form') {

            e.preventDefault();
            window.showAuthView('success', 'login', 'Adeola Foods');

        } else if (e.target.id === 'auth-register-form') {

            e.preventDefault();
            const input = e.target.querySelector('input[placeholder*="Business Name"]');
            const name = input && input.value.trim() ? input.value.trim() : 'Retailer';
            window.showAuthView('success', 'register', name);

        }

    });

})();


// ============================================
// 8. SUCCESS HANDLERS – Updated
// ============================================
(function() {

    console.log('🔍 Success handlers loading...');

    window.handleSuccessStartShopping = function() {
        if (typeof window.closeAuthOverlay === 'function') {
            window.closeAuthOverlay();
        }
        window.location.href = 'shop.html';
    };

    window.handleSuccessDashboard = function() {
        if (typeof window.closeAuthOverlay === 'function') {
            window.closeAuthOverlay();
        }
        alert('📊 Dashboard page coming soon!');
        window.location.href = 'index.html';
    };

    window.handleSuccessRedirect = function() {

        // Stay on the current page
        if (typeof window.closeAuthOverlay === 'function') {
            window.closeAuthOverlay();
        }
        
        // No reload needed – wholesale mode is already active
        console.log('✅ Redirect complete – staying on current page with wholesale prices.');

    };

    window.handleSuccessLogout = function() {

        if (typeof window.closeAuthOverlay === 'function') {
            window.closeAuthOverlay();
        }
        if (typeof window.toggleWholesaleMode === 'function') {
            window.toggleWholesaleMode(false);
        }
        localStorage.removeItem('wholesaleMode');
        localStorage.removeItem('businessName');
        window.location.href = 'index.html';

    };

    console.log('✅ Success handlers ready.');

})();

// ============================================
// 9. ORDER HANDLERS
// ============================================
(function() {

    window.handleOrderContinueShopping = function() {

        if (typeof window.closeAuthOverlay === 'function') {

            window.closeAuthOverlay();

        }

        window.location.href = 'shop.html';

    };

    window.handleOrderViewHistory = function() {

        if (typeof window.closeAuthOverlay === 'function') {

            window.closeAuthOverlay();

        }

        alert('📊 Orders page coming soon!');
        window.location.href = 'index.html';

    };

    window.handleOrderDownloadInvoice = function() {

        alert('📄 Invoice download coming soon!');

    };

    window.handleOrderRetry = function() {

        if (typeof window.closeAuthOverlay === 'function') {

            window.closeAuthOverlay();

        }

        // Return to checkout
        window.location.href = 'checkout.html';

    };

    window.handleOrderContactSupport = function() {

        alert('📞 Support: support@foodcart.com | +234 800 123 4567');

    };

    window.handleOrderReturnToCart = function() {

        if (typeof window.closeAuthOverlay === 'function') {

            window.closeAuthOverlay();

        }

        window.location.href = 'cart.html';

    };

    console.log('✅ Order handlers ready.');

})();

// ============================================
// 5. WHOLESALE MODE CONTROLLER (Class-Based)
// ============================================
(function() {

    let isWholesale = false; // Internal private state variable

    /**
     * Global Function: Safe boolean getter returning active wholesale mode state
     * @returns {boolean}
     */
    window.isWholesaleActive = function() {
        return isWholesale;
    };

    /**
     * Global Function: Toggles interface between Retail and Wholesale (B2B) pricing views
     * @param {boolean} enable - True to activate wholesale, false for retail
     * @param {string} [businessName] - Registered business account name
     */
    window.toggleWholesaleMode = function(enable, businessName) {
        // 1. Update module scope boolean state
        isWholesale = Boolean(enable);

        // 2. Toggle central body class to let CSS automatically handle view swapping
        document.body.classList.toggle('wholesale-mode-active', isWholesale);

        // 3. Swap Price Badges text dynamically
        document.querySelectorAll('.badge-orange, .badge-green').forEach(el => {
            el.textContent = isWholesale ? 'Wholesale Price' : 'Retail Price';
            if (isWholesale) {
                el.classList.remove('badge-orange');
                el.classList.add('badge-green');
            } else {
                el.classList.remove('badge-green');
                el.classList.add('badge-orange');
            }
        });

        // 4. Update header Business Name label
        const name = businessName || localStorage.getItem('businessName') || 'Retailer';
        const businessNameDisplay = document.getElementById('businessNameDisplay');
        if (businessNameDisplay) {
            businessNameDisplay.textContent = isWholesale ? name : 'Retailer';
        }

        // 5. Persist wholesale preference to LocalStorage
        if (isWholesale) {
            localStorage.setItem('wholesaleMode', 'true');
            localStorage.setItem('businessName', name);
        } else {
            localStorage.removeItem('wholesaleMode');
            localStorage.removeItem('businessName');
        }

        // 6. Dispatch global custom event for reactive UI updates (e.g. updating cart totals)
        document.dispatchEvent(new CustomEvent('wholesaleModeChanged', {
            detail: { enabled: isWholesale, businessName: name }
        }));
    };

    /**
     * Global Function: Handle user logout reset
     */
    window.handleLogout = function() {
        window.toggleWholesaleMode(false);
        if (typeof window.closeAuthOverlay === 'function') {
            window.closeAuthOverlay();
        }
        window.location.reload();
    };

    /**
     * Helper Function: Restore state on initial page load if saved in local storage
     */
    function restoreState() {
        if (localStorage.getItem('wholesaleMode') === 'true') {
            const name = localStorage.getItem('businessName') || 'Retailer';
            window.toggleWholesaleMode(true, name);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', restoreState);
    } else {
        restoreState();
    }
    
})();

// ============================================
// 6. CART CONTROLLER MODULE
// ============================================
(function() {
    let cart = []; // Private cart array

    /**
     * Helper Function: Load cart state from localStorage
     */
    function loadCart() {
        try {
            cart = JSON.parse(localStorage.getItem('foodcart_cart')) || [];
        } catch (e) {
            cart = [];
        }
    }

    /**
     * Helper Function: Save cart state to localStorage and refresh badges
     */
    function saveCart() {
        localStorage.setItem('foodcart_cart', JSON.stringify(cart));
        updateCartBadge();
    }

    // Global Getters
    window.getCart = () => cart;
    window.getCartCount = () => cart.reduce((total, i) => total + i.quantity, 0);

    /**
     * Global Function: Calculate cart total dynamically considering Retail vs Wholesale price mode
     * @returns {number} Total monetary sum of cart items
     */
    window.getCartTotal = function() {
        const isWholesale = window.isWholesaleActive();
        return cart.reduce((total, item) => {
            const price = isWholesale ? (item.wholesalePrice || item.retailPrice) : item.retailPrice;
            return total + (price * item.quantity);
        }, 0);
    };

    /**
     * Global Function: Add product item to cart
     */
    window.addToCart = function(sku, name, retailPrice, wholesalePrice, quantity, image) {
        quantity = parseInt(quantity, 10) || 1;
        const existing = cart.find(i => i.sku === sku);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                sku: sku,
                name: name,
                retailPrice: parseFloat(retailPrice),
                wholesalePrice: parseFloat(wholesalePrice || retailPrice),
                quantity: quantity,
                image: image || ''
            });
        }
        saveCart();
    };

    /**
     * Global Function: Remove specific SKU item completely from cart
     */
    window.removeFromCart = function(sku) {
        cart = cart.filter(i => i.sku !== sku);
        saveCart();
    };

    /**
     * Global Function: Modify quantity of a specific SKU in cart
     */
    window.updateCartQuantity = function(sku, quantity) {
        if (quantity <= 0) {
            window.removeFromCart(sku);
            return;
        }
        const item = cart.find(i => i.sku === sku);
        if (item) {
            item.quantity = quantity;
            saveCart();
        }
    };

    /**
     * Global Function: Empty entire cart contents
     */
    window.clearCart = function() {
        cart = [];
        saveCart();
    };

    /**
     * Helper Function: Update header cart badge counter and background styling
     */
    function updateCartBadge() {

        const count = window.getCartCount();
        const badge = document.querySelector('.cart-badge');
        
        if (badge) {

            badge.textContent = count;

            if (window.isWholesaleActive()) {

                badge.classList.remove('bg-amber');
                badge.classList.add('bg-green');

            } else {

                badge.classList.remove('bg-green');
                badge.classList.add('bg-amber');

            }

        }

    }

    /**
     * Event Listener: Re-render cart and update badge whenever pricing mode switches
     */
    document.addEventListener('wholesaleModeChanged', function() {
        updateCartBadge();
        if (document.getElementById('cart-items')) {
            window.renderCartPage();
        }
    });

    /**
     * Global Function: Dynamically build and render Cart Page HTML table
     */
    window.renderCartPage = function() {
        const container = document.getElementById('cart-items');
        if (!container) return;

        const isWholesale = window.isWholesaleActive();
        const items = window.getCart();
        const total = window.getCartTotal();

        if (items.length === 0) {
            container.innerHTML = `<p style="text-align:center; padding:40px;">🛒 Your cart is empty.</p>`;
            return;
        }

        let html = `
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:2px solid #e2e8f0;">
                        <th style="text-align:left; padding:8px;">Product</th>
                        <th style="text-align:left; padding:8px;">Price</th>
                        <th style="text-align:left; padding:8px;">Qty</th>
                        <th style="text-align:left; padding:8px;">Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>`;

        items.forEach(item => {
            const price = isWholesale ? item.wholesalePrice : item.retailPrice;
            const subtotal = price * item.quantity;
            html += `
                <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:12px 8px;">${item.name}</td>
                    <td style="padding:12px 8px;">₦${price.toLocaleString()}</td>
                    <td style="padding:12px 8px;">
                        <button onclick="window.updateCartQuantity('${item.sku}', ${item.quantity - 1}); window.renderCartPage();">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="window.updateCartQuantity('${item.sku}', ${item.quantity + 1}); window.renderCartPage();">+</button>
                    </td>
                    <td style="padding:12px 8px;">₦${subtotal.toLocaleString()}</td>
                    <td><button onclick="window.removeFromCart('${item.sku}'); window.renderCartPage();">✕</button></td>
                </tr>`;
        });

        html += `
                </tbody>
            </table>
            <div style="text-align:right; margin-top:20px; font-weight:700;">
                Total: ₦${total.toLocaleString()}
            </div>`;

        container.innerHTML = html;
    };

    // Initialize cart state load
    loadCart();
    updateCartBadge();
})();

// ============================================
// 7. CHECKOUT PROCESSOR MODULE
// ============================================
(function() {
    /**
     * Event Listener: Handle checkout form submission, field validation, and order processing
     */
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.id !== 'checkout-form') return;

        e.preventDefault();

        // Extract input values safely
        const name = (document.getElementById('checkout-name')?.value || '').trim();
        const phone = (document.getElementById('checkout-phone')?.value || '').trim();
        const email = (document.getElementById('checkout-email')?.value || '').trim();
        const address = (document.getElementById('checkout-address')?.value || '').trim();
        const lga = document.getElementById('checkout-lga')?.value || '';
        const payment = document.getElementById('checkout-payment')?.value || '';

        // Validate form inputs
        const errors = [];
        if (!name) errors.push('Full Name is required.');
        if (!phone || !/^0[789][01]\d{8}$/.test(phone)) errors.push('Valid Nigerian phone number required.');
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email required.');
        if (!address) errors.push('Delivery address required.');
        if (!lga) errors.push('LGA selection required.');

        // Trigger error modal if validation fails
        if (errors.length > 0) {
            window.showOrderError(errors[0]);
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        // Process order with dynamic live cart calculations
        setTimeout(function() {
            const calculatedTotal = window.getCartTotal(); // Live cart sum calculation
            const orderData = {
                orderNumber: '#ORD-' + Date.now(),
                total: '₦' + calculatedTotal.toLocaleString(),
                delivery: `${lga} – ${payment === 'cod' ? 'Cash on Delivery' : 'Prepaid'}`,
                eta: 'Today, 5:00 PM',
                customerName: name
            };

            if (submitBtn) submitBtn.disabled = false;

            // Trigger success modal
            window.showOrderSuccess(orderData);
            
            // Automatically upgrade buyer account to Wholesale mode
            if (typeof window.toggleWholesaleMode === 'function' && !window.isWholesaleActive()) {
                window.toggleWholesaleMode(true, name);
            }

            // Flush cart after order completion
            window.clearCart();
        }, 1200);
    });
})();