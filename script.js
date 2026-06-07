document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navigation on Scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100; // when to trigger the reveal

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    // Trigger once on load
    revealOnScroll();
    
    // Trigger on scroll
    window.addEventListener('scroll', revealOnScroll);

    // 3. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 4. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when a link is clicked
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 5. Before & After Sliders
    const sliders = document.querySelectorAll('.ba-slider');
    
    sliders.forEach(slider => {
        const handle = slider.querySelector('.handle');
        const resizeElement = slider.querySelector('.resize');
        const resizeImg = resizeElement.querySelector('img');
        let isDragging = false;
        
        // Function to set the explicit width of the foreground image
        // so it matches the container, allowing object-fit: cover to perfectly overlap
        const setImgWidth = () => {
            resizeImg.style.width = `${slider.offsetWidth}px`;
        };
        
        // Call it once on load and on window resize
        setImgWidth();
        window.addEventListener('resize', setImgWidth);

        const slideMove = (e) => {
            if (!isDragging) return;
            
            // Get mouse/touch X relative to slider
            let clientX = e.clientX;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
            }
            
            let rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;
            
            // Constrain between 0 and 100%
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            let percent = (x / rect.width) * 100;
            
            // Update handle and resize element
            handle.style.left = percent + "%";
            resizeElement.style.width = percent + "%";
        };

        // Mouse Events
        handle.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', slideMove);
        
        // Touch Events
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
        }, {passive: true});
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', slideMove, {passive: true});
    });

});
