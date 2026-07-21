let appInitialized = false;

(function initAppNav() {
 
    if (appInitialized) return;
    appInitialized = true;

    // 1. Get all page sections
    const sections = {
        home: document.querySelector('.page-home'),
        shop: document.querySelector('.page-shop'),
        pdp: document.querySelector('.page-pdp'),
        cart: document.querySelector('.page-cart'),
        checkout: document.querySelector('.page-checkout')
    };
    
    const radios = document.querySelectorAll('input[name="page"]');

    // 2. Function to show a specific page
    function showPage(pageId) {

        // 1. Close mobile menu (if open)
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.classList.remove('active');

        // 2. Hide all sections
        Object.values(sections).forEach(section => {

            if (section) section.style.display = 'none';

        });

        // 3. Show the selected section
        const target = sections[pageId];
        if (target) target.style.display = 'block';

        // 4. Update nav label highlighting
        document.querySelectorAll('.nav-links label').forEach(label => {

            label.classList.remove('active-radio');

        });

        document.querySelectorAll('.nav-links label').forEach(label => {

            if (label.getAttribute('for') === 'page-' + pageId) {

                label.classList.add('active-radio');

            }

        });

    }

    // 3. Attach change event to each radio
    radios.forEach(radio => {

        radio.addEventListener('change', function() {

            if (this.checked) {

                const pageId = this.id.replace('page-', '');
                showPage(pageId);

            }

        });
        
    });

    // 4. Set initial state: show Home
    document.getElementById('page-home').checked = true;
    showPage('home');

    // 5. Mobile hamburger toggle (with null check)
    const hamburger = document.querySelector('.mobile-toggle');
    if (hamburger) {

        hamburger.addEventListener('click', function() {

            const nav = document.querySelector('.nav-links');
            if (nav) nav.classList.toggle('active');

        });

    }

})();

// ---- PAGE NAVIGATION CONTROLLER ----
// This runs once when the page loads.
/**
(function initApp() {

    // 1. Get all page sections
    const sections = {
        home: document.querySelector('.page-home'),
        shop: document.querySelector('.page-shop'),
        pdp: document.querySelector('.page-pdp'),
        cart: document.querySelector('.page-cart'),
        checkout: document.querySelector('.page-checkout')
    };

    const radios = document.querySelectorAll('input[name="page"]');

    // 2. Function to show a specific page
    function showPage(pageId) {

        // 2.a. Close mobile menu (if open)
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.classList.remove('active');

        // 2.b. Hide all sections
        Object.values(sections).forEach(section => {
            if (section) section.style.display = 'none';
        });

        // 2.c. Show the selected section
        const target = sections[pageId];
        if (target) target.style.display = 'block';

        // 2.d. Update nav label highlighting
        document.querySelectorAll('.nav-links label').forEach(label => {

            label.classList.remove('active-radio');

        });

        document.querySelectorAll('.nav-links label').forEach(label => {

            if (label.getAttribute('for') === 'page-' + pageId) {

                label.classList.add('active-radio');

            }

        });

    }

    // 3. Attach change event to each radio
    radios.forEach(radio => {

        radio.addEventListener('change', function() {

            if (this.checked) {

                const pageId = this.id.replace('page-', '');
                showPage(pageId);

            }

        });

    });

    // 4. Set initial state: show Home
    document.getElementById('page-home').checked = true;
    showPage('home');

    // 5. Mobile hamburger toggle (with null check)
    const hamburger = document.querySelector('.mobile-toggle');
    if (hamburger) {

        hamburger.addEventListener('click', function() {

            const nav = document.querySelector('.nav-links');
            if (nav) nav.classList.toggle('active');

        });

    }

})(); // <-- This immediately invokes the function
**/
/*
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-links');
    
    if (toggle && nav) {

        toggle.addEventListener('click', function(e) {
            
            if (nav) {
                e.preventDefault();
                nav.classList.toggle('active');
                // Optional: change icon text
                this.textContent = nav.classList.contains('active') ? '✕' : '☰';
                console.log(document.querySelector('.mobile-toggle'));
                console.log('Menu toggled. Active:', nav.classList.contains('active'));

            }
        });
    }
});

(function() {
    const btn = document.getElementById('mobileToggle');
    const nav = document.querySelector('.nav-links');
    
    if (btn && nav) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Explicit toggle (add/remove instead of toggle())
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                this.textContent = '☰';
            } else {
                nav.classList.add('active');
                this.textContent = '✕';
            }
            
            // Debug log (remove after testing)
            console.log('Menu active:', nav.classList.contains('active'));
        });
    }
})();

(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const btn = document.getElementById('mobileToggle');
        const nav = document.querySelector('.nav-links');
        
        if (!btn) {
            console.warn('Mobile toggle button not found!');
            return;
        }
        if (!nav) {
            console.warn('Nav links not found!');
            return;
        }

        // Remove any existing inline onclick to prevent conflicts
        btn.removeAttribute('onclick');

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Explicit toggle (add/remove instead of toggle())
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                this.textContent = '☰';
            } else {
                nav.classList.add('active');
                this.textContent = '✕';
            }
            
            // Debug (remove after testing)
            console.log('Menu toggled. Active:', nav.classList.contains('active'));
        });
    }
})();


(function() {
    function init() {
        const btn = document.getElementById('mobileToggle');
        const nav = document.querySelector('.nav-links');
        if (!btn || !nav) return;

        // Remove any inline onclick (if any)
        btn.removeAttribute('onclick');

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent interference
            nav.classList.toggle('active');
            this.textContent = nav.classList.contains('active') ? '✕' : '☰';
            console.log('Toggled. Active:', nav.classList.contains('active'));
        });

        // Optional: Close menu when clicking a link inside nav (for mobile UX)
        nav.querySelectorAll('a, label').forEach(function(el) {
            el.addEventListener('click', function() {
                nav.classList.remove('active');
                btn.textContent = '☰';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
*/

(function() {

    function init() {

        const btn = document.getElementById('mobileToggle');
        const nav = document.querySelector('.nav-links');
        if (!btn || !nav) return;

        // Remove any inline onclick
        btn.removeAttribute('onclick');

        // Use a state variable
        let isOpen = false;

        btn.addEventListener('click', function(e) {

            e.preventDefault();
            e.stopPropagation(); // Stop click from bubbling
            e.stopImmediatePropagation(); // Stop other listeners on same element

            // Toggle state
            isOpen = !isOpen;

            // Apply class based on state
            if (isOpen) {
                nav.classList.add('active');
                this.textContent = '✕';
            } else {
                nav.classList.remove('active');
                this.textContent = '☰';
            }

            console.log('Menu state:', isOpen);
            console.log('nav classList:', nav.classList.toString());

        });

        // Prevent other clicks inside nav from closing it accidentally
        nav.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Optional: Close menu when clicking outside
        document.addEventListener('click', function(e) {

            if (isOpen && !nav.contains(e.target) && e.target !== btn) {

                isOpen = false;
                nav.classList.remove('active');
                btn.textContent = '☰';
                
            }

        });

    }

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', init);

    } else {

        init();

    }

})();

        (function() {

            const toggleBtns = document.querySelectorAll('.pdp-toggle-btn');
            const retailElements = document.querySelectorAll('.price-retail, .stock-retail, .qty-retail, .wholesale-prompt, .delivery-note-retail');
            const wholesaleElements = document.querySelectorAll('.price-wholesale, .stock-wholesale, .qty-wholesale, .delivery-note-wholesale');

            function setPDPView(view) {
                // Update button styles
                toggleBtns.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.background = 'transparent';
                    btn.style.color = '#475569';
                });
                const activeBtn = document.querySelector(`.pdp-toggle-btn[data-view="${view}"]`);
                if (activeBtn) {
                    activeBtn.classList.add('active');
                    activeBtn.style.background = '#0f172a';
                    activeBtn.style.color = 'white';
                }

                // Show/hide elements
                if (view === 'retail') {
                    retailElements.forEach(el => el.style.display = 'block');
                    wholesaleElements.forEach(el => el.style.display = 'none');
                } else {
                    retailElements.forEach(el => el.style.display = 'none');
                    wholesaleElements.forEach(el => el.style.display = 'block');
                }
            }

            // Attach click events
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    setPDPView(this.dataset.view);
                });
            });

            // Default to Wholesale (since this mockup is for wholesale customer)
            setPDPView('wholesale');
        })();
    
