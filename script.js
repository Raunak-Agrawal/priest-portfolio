// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("bs5knZUdCSWHXDO2D"); // Replace with your EmailJS public key
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            
            // Reset hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, #FF8C00 0%, #B8860B 100%)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #FF8C00 0%, #B8860B 100%)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });

    // Contact form handling
    const consultationForm = document.getElementById('consultation-form');
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = {};
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // Validate form
            if (validateForm(formValues)) {
                // Show loading message
                showNotification('आपका संदेश भेजा जा रहा है...', 'info');
                
                // Send email using EmailJS
                sendEmailJS(formValues, this);
            }
        });
    }

    // Form validation
    function validateForm(values) {
        const { name, email, phone, service } = values;
        
        if (!name || name.trim().length < 2) {
            showNotification('कृपया एक वैध नाम दर्ज करें।', 'error');
            return false;
        }
        
        if (!email || !isValidEmail(email)) {
            showNotification('कृपया एक वैध ईमेल पता दर्ज करें।', 'error');
            return false;
        }
        
        if (!phone || phone.trim().length < 10) {
            showNotification('कृपया एक वैध मोबाइल नंबर दर्ज करें।', 'error');
            return false;
        }
        
        if (!service) {
            showNotification('कृपया एक सेवा चुनें।', 'error');
            return false;
        }
        
        return true;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Send email using EmailJS
    function sendEmailJS(values, form) {
        const { name, email, phone, service, message } = values;
        
        const serviceNames = {
            'birth-chart': 'जन्म कुंडली',
            'palm-reading': 'हस्त रेखा',
            'marriage-matching': 'विवाह मिलान',
            'vastu': 'वास्तु दोष निवारण',
            'business': 'व्यापार परामर्श',
            'child': 'संतान प्राप्ति',
            'career-guidance': 'करियर मार्गदर्शन',
            'love-problems': 'प्रेम समस्या',
            'tantra-mantra': 'तंत्र मंत्र',
            'yantra': 'यंत्र प्रतिष्ठा',
            'rudra-abhishek': 'रुद्राभिषेक',
            'chandi-anushthan': 'श्रीचंडी अनुष्ठान'
        };
        
        const templateParams = {
            to_email: 'abhishekashishmishra4@gmail.com',
            from_name: name,
            from_email: email,
            phone: phone,
            service: serviceNames[service] || service,
            message: message || 'कोई विशेष संदेश नहीं',
            subject: `नई परामर्श अनुरोध - ${serviceNames[service] || service}`
        };
        
        // Send email using EmailJS
        emailjs.send('service_oi8ajzi', 'template_yeqrd05', templateParams)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                showNotification('आपका संदेश सफलतापूर्वक भेज दिया गया है! हम जल्द ही आपसे संपर्क करेंगे।', 'success');
                form.reset();
            })
            .catch(function(error) {
                console.error('Email sending failed:', error);
                console.error('Error details:', error.text);
                const errorMsg = error.text || error.message || 'अज्ञात त्रुटि';
                
                showNotification(`त्रुटि: ${errorMsg}। कृपया पुनः प्रयास करें।`, 'error');
            });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        const iconClass = type === 'success' ? 'fa-check-circle' : 
                         type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add notification styles
        const bgColor = type === 'success' ? '#4CAF50' : 
                       type === 'info' ? '#2196F3' : '#f44336';
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Add notification animations to CSS
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
            padding: 0.25rem;
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(notificationStyles);

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .feature-card, .contact-item, .gallery-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });



    // Priest image fallback
    const priestImage = document.querySelector('.priest-image');
    if (priestImage) {
        priestImage.addEventListener('error', function() {
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #FF8C00, #B8860B);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                text-align: center;
            `;
            placeholder.innerHTML = `
                <div>
                    <i class="fas fa-user" style="font-size: 4rem; margin-bottom: 1rem; display: block;"></i>
                    <div>श्री ज्योतिष आचार्य</div>
                </div>
            `;
            
            this.parentElement.replaceChild(placeholder, this);
        });
    }

    // Add loading animation
    window.addEventListener('load', function() {
        const loader = document.createElement('div');
        loader.id = 'loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #FF8C00, #B8860B);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s ease;
        `;
        loader.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">ॐ</div>
                <div style="font-size: 1.5rem;">श्री ज्योतिष आचार्य</div>
                <div style="margin-top: 2rem;">
                    <div style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
            </div>
        `;
        
        // Add spin animation
        const spinStyles = document.createElement('style');
        spinStyles.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinStyles);
        
        document.body.appendChild(loader);
        
        // Remove loader after a short delay
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 1000);
    });

    // Add scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #FF8C00, #B8860B);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
}); 