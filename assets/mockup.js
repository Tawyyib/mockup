// ============================================
// 1. MOBILE MENU TOGGLE (Clean & Dynamic)
// ============================================
(function() {

    let initialized = false;

    function initMobileMenu() {

        if (initialized) return;
        initialized = true;

        console.log('📱 Mobile menu script initializing...');

        // Single event listener for all click handling
        document.addEventListener('click', function(e) {

            const toggleBtn = e.target.closest('#mobileToggle');
            const nav = document.querySelector('.nav-links');

            // Case 1: Click on the toggle button
            if (toggleBtn && nav) {

                nav.classList.toggle('active');
                toggleBtn.textContent = nav.classList.contains('active') ? '✕' : '☰';
                console.log('Menu toggled:', nav.classList.contains('active'));
                return; // Stop further processing for this click

            }

            // Case 2: Click outside the nav (when open) – close it
            if (nav && nav.classList.contains('active')) {

                // Check if click is outside the nav
                if (!e.target.closest('.nav-links')) {

                    nav.classList.remove('active');
                    // Also update the toggle button text if it exists
                    const btn = document.getElementById('mobileToggle');
                    if (btn) btn.textContent = '☰';
                    console.log('Menu closed by outside click');

                }

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
// 2. AUTO-HIGHLIGHT ACTIVE NAV LINK (Dynamic)
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
// 3. PROFILE DROPDOWN TOGGLE (Dynamic)
// ============================================
(function() {

    console.log('🔍 Profile dropdown script loaded.');

    let profileInitialized = false;

    function initProfileDropdown() {

        // Prevent duplicate initialization
        if (profileInitialized) return;
        
        const profile = document.getElementById('user-profile');
        if (!profile) {

            console.warn('👤 #user-profile not found yet. Will retry.');
            return false; // Indicate failure

        }

        console.log('👤 Profile element found. Attaching listeners...');

        // Toggle dropdown on click
        profile.addEventListener('click', function(e) {

            e.stopPropagation();
            this.classList.toggle('active');
            console.log('Profile dropdown toggled:', this.classList.contains('active'));

        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {

            if (profile && !profile.contains(e.target)) {
                profile.classList.remove('active');
            }

        });

        profileInitialized = true;
        return true; // Success

    }

    // 1. Try immediately (in case profile is already in DOM)
    if (document.readyState !== 'loading') {

        if (!initProfileDropdown()) {
            watchForProfile();
        }

    } else {

        document.addEventListener('DOMContentLoaded', function() {
            if (!initProfileDropdown()) {
                watchForProfile();
            }
        });

    }

    // 2. Use MutationObserver to watch for injected profile
    function watchForProfile() {

        console.log('👀 Watching for #user-profile injection...');

        const observer = new MutationObserver(function(mutations) {
            const profile = document.getElementById('user-profile');
            if (profile) {

                console.log('✅ Profile detected! Initializing dropdown.');
                initProfileDropdown();
                observer.disconnect(); // Stop watching once we have the profile

            }

        });

        // Start observing the document body
        observer.observe(document.body, {

            childList: true,
            subtree: true

        });

        // Fallback: try again after a short delay
        setTimeout(function() {

            const profile = document.getElementById('user-profile');
            if (profile) {

                console.log('⏱️ Profile found via timeout.');
                initProfileDropdown();
                observer.disconnect();

            } else {

                console.warn('⏱️ Profile not detected after timeout.');

            }

        }, 3000);

    }

})();

// ============================================
// 4. AUTH OVERLAY – MUTATION OBSERVER (Safe)
// ============================================
(function() {

    console.log('🔍 Auth overlay controller loading...');

    let initialized = false;

    function initOverlay(backdropEl, closeBtnEl, contentEl) {

        if (initialized) return;
        initialized = true;

        console.log('✅ Initializing overlay...');

        function openAuthOverlay() {

            console.log('📂 Opening auth overlay...');
            backdropEl.classList.add('show');
            document.body.style.overflow = 'hidden';

        }

        function closeAuthOverlay() {

            console.log('📂 Closing auth overlay...');
            backdropEl.classList.remove('show');
            document.body.style.overflow = '';

        }

        window.openAuthOverlay = openAuthOverlay;
        window.closeAuthOverlay = closeAuthOverlay;

        closeBtnEl.addEventListener('click', closeAuthOverlay);
        backdropEl.addEventListener('click', function(e) {

            if (e.target === backdropEl) closeAuthOverlay();

        });

        document.addEventListener('keydown', function(e) {

            if (e.key === 'Escape' && backdropEl.classList.contains('show')) {

                closeAuthOverlay();

            }

        });

        document.addEventListener('click', function(e) {

            console.log('🖱️ Click detected on:', e.target);

            const link = e.target.closest('a[href*="login.html"], a[href*="register.html"]');

            if (!link) {
                console.log('   → Not a login/register link.');
                return;
            }    

            e.preventDefault();
            e.stopPropagation();
            openAuthOverlay();

        }, true);

        console.log('✅ Auth overlay ready.');

    }

    // ---- Try immediately ----
    function tryInit() {

        const backdrop = document.getElementById('authBackdrop') || document.querySelector('.auth-backdrop, #authBackdrop');
        const closeBtn = document.getElementById('authCloseBtn') || document.querySelector('.auth-close-btn, #authCloseBtn');
        const content = document.getElementById('authContent') || document.querySelector('.auth-content, #authContent');

        if (backdrop && closeBtn && content) {
            initOverlay(backdrop, closeBtn, content);
            return true;
        }

        return false;

    }

    if (!tryInit()) {

        console.log('⏳ Overlay not found yet. Setting up observer...');

        // ---- Wait for DOM to be ready before observing ----
        function startObserver() {

            if (!document.body) {

                // If body doesn't exist yet, wait for DOMContentLoaded
                document.addEventListener('DOMContentLoaded', startObserver);
                return;

            }

            const observer = new MutationObserver(function() {
                const backdrop = document.getElementById('authBackdrop') || document.querySelector('.auth-backdrop, #authBackdrop');
                const closeBtn = document.getElementById('authCloseBtn') || document.querySelector('.auth-close-btn, #authCloseBtn');
                const content = document.getElementById('authContent') || document.querySelector('.auth-content, #authContent');

                if (backdrop && closeBtn && content && !initialized) {

                    console.log('✅ Overlay detected via MutationObserver.');
                    observer.disconnect();
                    initOverlay(backdrop, closeBtn, content);

                }

            });

            // Safely observe the body
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('👀 MutationObserver watching for overlay...');

            // Fallback timeout
            setTimeout(function() {
                
                if (!initialized) {
                    console.warn('⏱️ Overlay not found after timeout. Retrying...');
                    tryInit();
                    observer.disconnect();
                }

            }, 5000);

        }

        startObserver();

    }

})();

// ============================================
// 5. VIEW MANAGER – Supports Login/Register Success
// ============================================
(function() {

    console.log('🔍 View manager loading...');

    function showAuthView(view, authStatus, businessName) {

        console.log(`📄 Showing view: ${view} (${authStatus || 'default'})`);

        const allViews = document.querySelectorAll('.auth-view');
        
        if (allViews.length === 0) {

            console.warn('⚠️ No .auth-view elements found. Retrying...');
            setTimeout(() => showAuthView(view, authStatus, businessName), 500);
            return;

        }

        // Hide all views
        allViews.forEach(el => {

            el.style.display = 'none';

        });

        // Show the target view
        const viewMap = {

            login: 'authViewLogin',
            register: 'authViewRegister',
            success: 'authViewSuccess'

        };

        const target = document.getElementById(viewMap[view]);
        if (target) {

            target.style.display = 'flex';
            console.log(`✅ Showing: ${target.id}`);

        } else {

            console.warn(`⚠️ View "${view}" not found.`);
            return;

        }

        // ---- If success view, show appropriate message ----
        if (view === 'success') {

            const loginElements = target.querySelectorAll('.login');
            const registerElements = target.querySelectorAll('.register');

            if (authStatus === 'login') {

                // Show login messages, hide register messages
                loginElements.forEach(el => el.style.display = 'flex');
                registerElements.forEach(el => el.style.display = 'none');
                console.log('✅ Showing login success message.');

            } else if (authStatus === 'register') {

                // Show register messages, hide login messages
                loginElements.forEach(el => el.style.display = 'none');
                registerElements.forEach(el => el.style.display = 'flex');
                console.log('✅ Showing registration success message.');

            }

            // Update business name
            if (businessName) {

                const nameEls = target.querySelectorAll('#successBusinessName');
                nameEls.forEach(el => {

                    el.innerHTML = `Welcome, <strong>${businessName}</strong>!`;

                });

                console.log(`✅ Updated business name to: ${businessName}`);

            }

            // Activate wholesale mode
            if (typeof window.toggleWholesaleMode === 'function') {

                window.toggleWholesaleMode(true);

            }

            localStorage.setItem('wholesaleMode', 'true');
            localStorage.setItem('businessName', businessName || 'Retailer');

        }

        // Open the overlay
        if (typeof window.openAuthOverlay === 'function') {

            window.openAuthOverlay();

        }

    }

    window.showAuthView = showAuthView;
    console.log('✅ View manager ready.');
    console.log('👉 Use showAuthView("login"), showAuthView("register"), or showAuthView("success", "login", "Adeola Foods")');

})();

// ============================================
// 6. UNIFIED CLICK HANDLER – Intercept all login/register links
// ============================================
(function() {

    console.log('🔍 Unified click handler loading...');

    document.addEventListener('click', function(e) {

        // 1. Check if the clicked element (or parent) is a login/register link
        const link = e.target.closest('a[href*="login"], a[href*="register"], .login-btn, .register-btn, .switch-view, [data-auth="login"], [data-auth="register"]');
        if (!link) return;

        // 2. Determine which view to show
        let view = null;
        if (link.dataset.view) {

            view = link.dataset.view; // .switch-view or data-view

        } else if (link.getAttribute('href') && link.getAttribute('href').includes('login')) {

            view = 'login';

        } else if (link.getAttribute('href') && link.getAttribute('href').includes('register')) {

            view = 'register';

        } else if (link.classList.contains('login-btn') || link.id === 'simulateLoginBtn') {

            view = 'login';

        } else if (link.classList.contains('register-btn') || link.id === 'simulateRegisterBtn') {

            view = 'register';

        }

        if (!view) return;

        // 3. Prevent navigation
        e.preventDefault();
        e.stopPropagation();

        // 4. Show the view
        console.log(`🔗 Intercepted link (${view}):`, link);
        if (typeof window.showAuthView === 'function') {

            window.showAuthView(view);

        } else {

            console.warn('⚠️ showAuthView not defined!');

        }

    }, true); // <-- Capturing phase ensures this runs before other handlers

    console.log('✅ Unified click handler ready.');
    console.log('👉 All login/register links will now open the overlay with the correct view.');

})();

// ============================================
// 7. FORM HANDLER – Updated
// ============================================
(function() {

    console.log('🔍 Form handler loading...');

    // ---- Form Submissions ----
    document.addEventListener('submit', function(e) {
        console.log('🖱️ Submit event captured:', e.target.id);
        if (e.target.id === 'auth-login-form') {
            e.preventDefault();
            console.log('🔐 Login submitted.');
            if (typeof window.showAuthView === 'function') {
                window.showAuthView('success', 'login', 'Adeola Foods');
            }
        } else if (e.target.id === 'auth-register-form') {
            e.preventDefault();
            const bizInput = e.target.querySelector('input[placeholder*="Business Name"]');
            const bizName = bizInput ? bizInput.value : 'Retailer';
            console.log('📝 Registration submitted.');
            if (typeof window.showAuthView === 'function') {
                window.showAuthView('success', 'register', bizName);
            }
        }
    }, true);

    // ---- View Switching ----
    document.addEventListener('click', function(e) {
        const switchLink = e.target.closest('.switch-view');
        if (switchLink) {
            e.preventDefault();
            e.stopPropagation();
            const view = switchLink.dataset.view;
            console.log(`🔄 Switch link clicked → view: ${view}`);
            if (view && typeof window.showAuthView === 'function') {
                window.showAuthView(view);
            }
        }
    }, true);

    console.log('✅ Form handler ready.');

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
// WHOLESALE MODE TOGGLE (Dynamic – Works with Injected Header)
// ============================================
(function() {

    console.log('🔍 Wholesale mode controller loading...');

    let isWholesale = false;

    // ---- Helper to get elements dynamically ----
    function getElements() {
        return {
            logoutDisplay: document.getElementById('logoutDisplay'),
            businessNameDisplay: document.getElementById('businessNameDisplay'),
            logoutBtn: document.getElementById('logoutBtn'),
            profile: document.getElementById('user-profile')
        };
    }

    window.handleLogout = function() {

        console.log('🔓 Logout called (inline fallback).');
        // Toggle wholesale mode off
        if (typeof window.toggleWholesaleMode === 'function') {
            window.toggleWholesaleMode(false);
        }
        // Show the profile dropdown again
        const profile = document.getElementById('user-profile');
        if (profile) profile.style.display = 'block';
        // Close overlay if open
        if (typeof window.closeAuthOverlay === 'function') {
            window.closeAuthOverlay();
        }
        // Reset UI without reload
        console.log('✅ Logout complete – retail mode restored.');

    };

    // ---- Toggle wholesale mode (exposed globally) ----
    window.toggleWholesaleMode = function(enable, businessName) {
        isWholesale = enable;
        window.isWholesaleActive = enable;

        console.log(`🔄 ${enable ? 'ENABLING' : 'DISABLING'} wholesale mode...`);

        const els = getElements();

        // 1. Toggle price displays
        document.querySelectorAll('.price-retail, .wholesale-prompt, .delivery-note-retail, .qty-retail, .stock-retail')
            .forEach(el => el.style.display = enable ? 'none' : 'block');

        document.querySelectorAll('.price-wholesale, .delivery-note-wholesale, .qty-wholesale, .stock-wholesale')
            .forEach(el => el.style.display = enable ? 'block' : 'none');

        // 2. Toggle wholesale badges
        document.querySelectorAll('.badge-orange').forEach(el => {
            el.textContent = enable ? '📦 Wholesale Price' : '🔒 Login for Wholesale';
            el.className = enable ? 'badge-green' : 'badge-orange';
        });

        // 3. Toggle logout display
        if (els.logoutDisplay) {
            els.logoutDisplay.style.display = enable ? 'flex' : 'none';
            console.log(`   logoutDisplay display set to: ${enable ? 'flex' : 'none'}`);
        } else {
            console.warn('⚠️ logoutDisplay not found in DOM.');
        }

        // 4. Toggle profile dropdown
        if (els.profile) {
            els.profile.style.display = enable ? 'none' : 'block';
        }

        // 5. Update cart badge
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = enable ? 'W' : '2';
            cartBadge.style.background = enable ? '#16a34a' : '#f59e0b';
        }

        // 6. Update hero tags
        const heroCols = document.querySelectorAll('.hero-col .tag');
        if (heroCols.length >= 2) {
            if (enable) {
                heroCols[0].textContent = '👋 WELCOME BACK';
                heroCols[0].style.background = '#16a34a';
                heroCols[1].textContent = '📦 WHOLESALE ACTIVE';
                heroCols[1].style.background = '#f59e0b';
                heroCols[1].style.color = '#0f172a';
            } else {
                heroCols[0].textContent = 'RETAIL';
                heroCols[0].style.background = '#16a34a';
                heroCols[1].textContent = 'B2B WHOLESALE';
                heroCols[1].style.background = '#f59e0b';
                heroCols[1].style.color = '#0f172a';
            }
        }

        // 7. Update business name
        if (enable && els.businessNameDisplay) {
            const name = businessName || localStorage.getItem('businessName') || 'Retailer';
            els.businessNameDisplay.textContent = name;
        } else if (!enable && els.businessNameDisplay) {
            els.businessNameDisplay.textContent = 'Retailer';
        }

        // 8. Store state in localStorage
        if (enable) {
            localStorage.setItem('wholesaleMode', 'true');
            if (businessName) {
                localStorage.setItem('businessName', businessName);
            }
        } else {
            localStorage.removeItem('wholesaleMode');
            localStorage.removeItem('businessName');
        }

        console.log(`✅ Switched to ${enable ? 'WHOLESALE' : 'RETAIL'} mode.`);
    };

    // ---- Restore wholesale mode from localStorage ----
    if (localStorage.getItem('wholesaleMode') === 'true') {
        const name = localStorage.getItem('businessName') || 'Retailer';
        // Wait for elements to be injected before toggling
        function applyRestore() {
            const els = getElements();
            if (els.businessNameDisplay) {
                els.businessNameDisplay.textContent = name;
                window.toggleWholesaleMode(true);
                console.log('✅ Restored wholesale mode from localStorage.');
            } else {
                console.log('⏳ Waiting for header to be injected...');
                setTimeout(applyRestore, 200);
            }
        }
        applyRestore();
    }

    // ---- Watch for logout button to appear and attach listener ----
    function attachLogoutListener() {
        const els = getElements();
        if (els.logoutBtn && !els.logoutBtn._listenerAttached) {
            els.logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🔓 Logout button clicked.');
                window.toggleWholesaleMode(false);
                // Show profile dropdown again
                const profile = document.getElementById('user-profile');
                if (profile) profile.style.display = 'block';
                // Close overlay if open
                if (typeof window.closeAuthOverlay === 'function') {
                    window.closeAuthOverlay();
                }
                // Reload to reset UI
                window.location.reload();
            });
            els.logoutBtn._listenerAttached = true;
            console.log('✅ Logout button handler attached.');
            return true;
        }
        return false;
    }

    // Try to attach immediately
    if (!attachLogoutListener()) {
        // Use MutationObserver to watch for the header injection
        const observer = new MutationObserver(function() {
            if (attachLogoutListener()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('👀 Watching for logout button to appear...');
    }

    // ---- Expose helper ----
    window.isWholesaleActive = function() {
        return isWholesale;
    };

    console.log('✅ Wholesale mode controller ready.');
    console.log('👉 Use toggleWholesaleMode(true/false, "BusinessName") to control it.');

})();

console.log('✅ mockup.js loaded successfully.');