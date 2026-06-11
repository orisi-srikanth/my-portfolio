document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 2. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const body = document.body;

    function toggleMenu() {
        mobileMenu.classList.toggle('open');
        const icon = menuBtn.querySelector('i');
        if (mobileMenu.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            body.style.overflow = '';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // 3. Navbar Scroll Effect & Scroll-to-top visibility
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.querySelector('.scroll-top');

    // Initial check
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
    if (window.scrollY > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
        }
    });

    // 4. Smooth Scrolling for anchor links (fallback/custom behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active link
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }
            }
        });
    });

    // 5. Active Link Highlight on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - navbar.offsetHeight - 50)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 6. Typing Animation Effect for Hero
    const roles = ["Data Analyst", "Data Scientist", "AI Engineer", "ML Engineer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.querySelector('.hero-subtitle');
    const cursorHTML = '<span class="cursor">|</span>';

    // Set initial structural content
    typingElement.innerHTML = `${roles[0]}${cursorHTML}`;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        const displayedText = currentRole.substring(0, charIndex);
        typingElement.innerHTML = `${displayedText}${cursorHTML}`;

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Start typing effect after a short delay
    setTimeout(typeEffect, 1500);

    // 7. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll('.fade-in, .fade-in-delay, .slide-in-left, .slide-in-right, .fade-up');

    // Initial check - if elements are already in view on load
    animateElements.forEach(el => {
        animationObserver.observe(el);
    });

    // 8. Set dynamic Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 9. Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            const originalBackground = btn.style.background;

            // Show loading state
            btn.disabled = true;
            btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            fetch("https://formsubmit.co/ajax/srikanthorisi62@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    btn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
                    btn.style.background = '#10b981';
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            })
            .catch(error => {
                console.error("Error sending email:", error);
                btn.innerHTML = '<span>Error! Try again</span> <i class="fas fa-exclamation-triangle"></i>';
                btn.style.background = '#ef4444';
            })
            .finally(() => {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.style.background = originalBackground;
                }, 3000);
            });
        });
    }

    // 10. Image Upload Feature with Cropping
    const imageUpload = document.getElementById('image-upload');
    const profilePic = document.getElementById('profile-pic');

    // Modal elements
    const cropModal = document.getElementById('crop-modal');
    const imageToCrop = document.getElementById('image-to-crop');
    const applyCropBtn = document.getElementById('apply-crop');
    const cancelCropBtn = document.getElementById('cancel-crop');
    const closeCropModalBtn = document.getElementById('close-crop-modal');
    let cropper; // Variable to hold the Cropper instance

    // Check if there is a saved image in localStorage
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profilePic.src = savedImage;
    }

    // Function to close modal and cleanup
    function closeCropModal() {
        cropModal.style.display = 'none';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        if (imageUpload) imageUpload.value = ''; // Reset file input
    }

    // Event listeners for closing the modal
    if (closeCropModalBtn) closeCropModalBtn.addEventListener('click', closeCropModal);
    if (cancelCropBtn) cancelCropBtn.addEventListener('click', closeCropModal);

    if (imageUpload) {
        imageUpload.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    // Set the image source in the modal
                    imageToCrop.src = e.target.result;

                    // Show the modal
                    cropModal.style.display = 'block';

                    // Initialize Cropper after the image has loaded
                    imageToCrop.onload = () => {
                        // Destroy existing cropper if it exists
                        if (cropper) {
                            cropper.destroy();
                        }
                        cropper = new Cropper(imageToCrop, {
                            aspectRatio: 1, // Force square crop
                            viewMode: 1, // Restrict the crop box to not exceed the size of the canvas.
                            dragMode: 'move', // Allow moving the image within the crop box
                            autoCropArea: 0.8,
                            restore: false,
                            guides: true,
                            center: true,
                            highlight: false,
                            cropBoxMovable: true,
                            cropBoxResizable: true,
                            toggleDragModeOnDblclick: false,
                        });
                    };
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Apply Crop Event
    if (applyCropBtn) {
        applyCropBtn.addEventListener('click', () => {
            if (cropper) {
                // Get the cropped canvas
                const canvas = cropper.getCroppedCanvas({
                    width: 300, // Desired output width
                    height: 300, // Desired output height
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: 'high',
                });

                // Convert canvas to Data URL (base64string)
                const croppedImageDataURL = canvas.toDataURL('image/png');

                // Update the profile picture on the page
                profilePic.src = croppedImageDataURL;

                // Save to local storage
                try {
                    localStorage.setItem('profileImage', croppedImageDataURL);
                } catch (e) {
                    console.warn("Image too large to save in localStorage");
                }

                // Close modal
                closeCropModal();
            }
        });
    }

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target == cropModal) {
            closeCropModal();
        }
    });

    // 11. Interactive Skills Grid
    const skillsGrid = document.getElementById('skills-grid');
    
    // Default skills categorized
    const defaultSkills = [
        // Programming Languages
        { name: "Python", category: "Programming Languages", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "Java", category: "Programming Languages", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
        { name: "C++", category: "Programming Languages", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
        { name: "JavaScript", category: "Programming Languages", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },

        // Data Structures & Algorithms
        { name: "Arrays", category: "Data Structures & Algorithms", faIcon: "fas fa-layer-group" },
        { name: "Strings", category: "Data Structures & Algorithms", faIcon: "fas fa-font" },
        { name: "Linked List", category: "Data Structures & Algorithms", faIcon: "fas fa-link" },
        { name: "Stack", category: "Data Structures & Algorithms", faIcon: "fas fa-align-justify" },
        { name: "Queue", category: "Data Structures & Algorithms", faIcon: "fas fa-exchange-alt" },
        { name: "Trees", category: "Data Structures & Algorithms", faIcon: "fas fa-tree" },
        { name: "Graphs", category: "Data Structures & Algorithms", faIcon: "fas fa-project-diagram" },
        { name: "Recursion", category: "Data Structures & Algorithms", faIcon: "fas fa-undo" },
        { name: "Backtracking", category: "Data Structures & Algorithms", faIcon: "fas fa-history" },
        { name: "Dynamic Programming", category: "Data Structures & Algorithms", faIcon: "fas fa-table" },
        { name: "Sorting", category: "Data Structures & Algorithms", faIcon: "fas fa-sort-amount-down" },
        { name: "Searching", category: "Data Structures & Algorithms", faIcon: "fas fa-search" },

        // Web Development
        { name: "HTML", category: "Web Development", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { name: "CSS", category: "Web Development", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { name: "React.js", category: "Web Development", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "REST APIs", category: "Web Development", faIcon: "fas fa-network-wired" },
        { name: "Responsive Web Design", category: "Web Development", faIcon: "fas fa-mobile-alt" },

        // Backend Development
        { name: "Django", category: "Backend Development", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
        { name: "Spring Boot", category: "Backend Development", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
        { name: "Node.js", category: "Backend Development", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Express.js", category: "Backend Development", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
        { name: "JWT Authentication", category: "Backend Development", faIcon: "fas fa-key" },
        { name: "Microservices Basics", category: "Backend Development", faIcon: "fas fa-cubes" },

        // Databases
        { name: "MySQL", category: "Databases", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        { name: "PostgreSQL", category: "Databases", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { name: "MongoDB", category: "Databases", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "SQL", category: "Databases", faIcon: "fas fa-database" },
        { name: "Joins", category: "Databases", faIcon: "fas fa-vector-square" },
        { name: "Aggregations", category: "Databases", faIcon: "fas fa-compress-arrows-alt" },
        { name: "Database Design", category: "Databases", faIcon: "fas fa-sitemap" },

        // Data Science / Analytics
        { name: "Pandas", category: "Data Science / Analytics", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
        { name: "NumPy", category: "Data Science / Analytics", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
        { name: "Data Cleaning", category: "Data Science / Analytics", faIcon: "fas fa-broom" },
        { name: "Data Preprocessing", category: "Data Science / Analytics", faIcon: "fas fa-cogs" },
        { name: "Data Visualization", category: "Data Science / Analytics", faIcon: "fas fa-chart-bar" },
        { name: "Matplotlib", category: "Data Science / Analytics", faIcon: "fas fa-chart-line" },
        { name: "Seaborn", category: "Data Science / Analytics", faIcon: "fas fa-chart-area" },
        { name: "Excel (Advanced)", category: "Data Science / Analytics", logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg" },
        { name: "Power BI", category: "Data Science / Analytics", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" },
        { name: "Tableau", category: "Data Science / Analytics", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Tableau_Logo.png" },
        { name: "Statistics", category: "Data Science / Analytics", faIcon: "fas fa-calculator" },

        // Machine Learning / AI
        { name: "Supervised Learning", category: "Machine Learning / AI", faIcon: "fas fa-chalkboard-teacher" },
        { name: "Unsupervised Learning", category: "Machine Learning / AI", faIcon: "fas fa-brain" },
        { name: "Scikit-learn", category: "Machine Learning / AI", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" },
        { name: "Model Evaluation", category: "Machine Learning / AI", faIcon: "fas fa-clipboard-check" },
        { name: "Feature Engineering", category: "Machine Learning / AI", faIcon: "fas fa-wrench" },
        { name: "TensorFlow", category: "Machine Learning / AI", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-line.svg" },
        { name: "PyTorch", category: "Machine Learning / AI", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
        { name: "NLP Basics", category: "Machine Learning / AI", faIcon: "fas fa-language" },

        // Tools & Platforms
        { name: "Git", category: "Tools & Platforms", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        { name: "GitHub", category: "Tools & Platforms", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
        { name: "VS Code", category: "Tools & Platforms", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
        { name: "Postman", category: "Tools & Platforms", logo: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
        { name: "Linux", category: "Tools & Platforms", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
        { name: "Docker", category: "Tools & Platforms", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },

        // Computer Science Fundamentals
        { name: "Object-Oriented Programming (OOPs)", category: "Computer Science Fundamentals", faIcon: "fas fa-cube" },
        { name: "Operating Systems", category: "Computer Science Fundamentals", faIcon: "fas fa-desktop" },
        { name: "Computer Networks", category: "Computer Science Fundamentals", faIcon: "fas fa-network-wired" },
        { name: "DBMS", category: "Computer Science Fundamentals", faIcon: "fas fa-database" },

        // Soft Skills
        { name: "Problem Solving", category: "Soft Skills", faIcon: "fas fa-lightbulb" },
        { name: "Communication Skills", category: "Soft Skills", faIcon: "fas fa-comments" },
        { name: "Team Collaboration", category: "Soft Skills", faIcon: "fas fa-users" },
        { name: "Time Management", category: "Soft Skills", faIcon: "fas fa-hourglass-half" },
        { name: "Analytical Thinking", category: "Soft Skills", faIcon: "fas fa-puzzle-piece" },

        // Bonus / Advanced
        { name: "Kaggle", category: "Bonus / Advanced", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Kaggle_logo.svg" },
        { name: "LeetCode", category: "Bonus / Advanced", logo: "https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/leet-code.svg" },
        { name: "AWS", category: "Bonus / Advanced", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
        { name: "Azure", category: "Bonus / Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
        { name: "GCP", category: "Bonus / Advanced", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
        { name: "Vercel", category: "Bonus / Advanced", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg" },
        { name: "Netlify", category: "Bonus / Advanced", logo: "https://www.vectorlogo.zone/logos/netlify/netlify-icon.svg" },
        { name: "System Design Basics", category: "Bonus / Advanced", faIcon: "fas fa-sitemap" }
    ];

    const categoriesOrder = [
        "Programming Languages",
        "Data Structures & Algorithms",
        "Web Development",
        "Backend Development",
        "Databases",
        "Data Science / Analytics",
        "Machine Learning / AI",
        "Tools & Platforms",
        "Computer Science Fundamentals",
        "Soft Skills",
        "Bonus / Advanced"
    ];

    const categoryIcons = {
        "Programming Languages": "fas fa-code",
        "Data Structures & Algorithms": "fas fa-project-diagram",
        "Web Development": "fas fa-laptop-code",
        "Backend Development": "fas fa-server",
        "Databases": "fas fa-database",
        "Data Science / Analytics": "fas fa-chart-line",
        "Machine Learning / AI": "fas fa-brain",
        "Tools & Platforms": "fas fa-tools",
        "Computer Science Fundamentals": "fas fa-graduation-cap",
        "Soft Skills": "fas fa-user-friends",
        "Bonus / Advanced": "fas fa-star"
    };

    const SKILLS_VERSION = 'v2';
    let mySkills = [];
    try {
        const stored = localStorage.getItem('mySkills');
        const storedVer = localStorage.getItem('mySkills_version');
        if (stored && storedVer === SKILLS_VERSION) {
            mySkills = JSON.parse(stored);
        } else {
            mySkills = JSON.parse(JSON.stringify(defaultSkills));
            localStorage.setItem('mySkills', JSON.stringify(mySkills));
            localStorage.setItem('mySkills_version', SKILLS_VERSION);
        }
    } catch(e) {
        mySkills = JSON.parse(JSON.stringify(defaultSkills));
    }

    function saveSkills() {
        localStorage.setItem('mySkills', JSON.stringify(mySkills));
    }

    function renderSkills() {
        if (!skillsGrid) return;
        skillsGrid.innerHTML = '';

        mySkills.forEach(skillObj => {
            if (!skillObj.name) return;
            
            const card = document.createElement('div');
            card.className = 'skill-card fade-in';
            card.style.opacity = '1';

            const textSpan = document.createElement('span');
            textSpan.className = 'skill-text';
            textSpan.textContent = skillObj.name;

            card.appendChild(textSpan);
            skillsGrid.appendChild(card);
        });

        // Re-observe dynamic nodes
        if (typeof animationObserver !== 'undefined') {
            const animateElements = skillsGrid.querySelectorAll('.fade-in, .fade-up');
            animateElements.forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    if (skillsGrid) {
        renderSkills();
    }

    // 11.5 Projects Carousel Controls
    const projContainer = document.getElementById('projects-carousel-container');
    const projPrevBtn = document.getElementById('projects-prev-btn');
    const projNextBtn = document.getElementById('projects-next-btn');
    if (projContainer && projPrevBtn && projNextBtn) {
        projPrevBtn.addEventListener('click', () => {
            const card = projContainer.querySelector('.project-card');
            const scrollAmount = card ? card.offsetWidth + 32 : 370;
            projContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        projNextBtn.addEventListener('click', () => {
            const card = projContainer.querySelector('.project-card');
            const scrollAmount = card ? card.offsetWidth + 32 : 370;
            projContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // 12. Interactive Certifications Grid
    const certsGrid = document.getElementById('certifications-grid');
    const certsViewport = document.getElementById('cert-slider-viewport');
    let activePageIndex = 0;
    
    // Default certifications
    const defaultCerts = [
        {
            name: "Alteryx Auto Insights Micro-Credential",
            issuer: "Alteryx",
            link: "https://drive.google.com/file/d/1k4e-4LFkNLQ-Zj8JVaihws4L_ohiUU8k/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1k4e-4LFkNLQ-Zj8JVaihws4L_ohiUU8k",
            isDefault: true
        },
        {
            name: "Alteryx Data Preparation",
            issuer: "Alteryx",
            link: "https://drive.google.com/file/d/1DRTFycsSw6_jIDm4eiZfzJ7T8slToPlT/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1DRTFycsSw6_jIDm4eiZfzJ7T8slToPlT",
            isDefault: true
        },
        {
            name: "Alteryx Data Transformation",
            issuer: "Alteryx",
            link: "https://drive.google.com/file/d/1lbH0zPkZb6YoVwBSYLjBFI4AA6hSuCyy/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1lbH0zPkZb6YoVwBSYLjBFI4AA6hSuCyy",
            isDefault: true
        },
        {
            name: "Alteryx Foundational Micro-Credential",
            issuer: "Alteryx",
            link: "https://drive.google.com/file/d/1yaal2D2ejCyDO5_whVdBXoohjEHYiP8D/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1yaal2D2ejCyDO5_whVdBXoohjEHYiP8D",
            isDefault: true
        },
        {
            name: "Alteryx General Knowledge",
            issuer: "Alteryx",
            link: "https://drive.google.com/file/d/1vaQVkiTHsAPDzlKiobVva_cQw05TEjpW/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1vaQVkiTHsAPDzlKiobVva_cQw05TEjpW",
            isDefault: true
        },
        {
            name: "Python for Data Analysis",
            issuer: "Coursera",
            link: "https://drive.google.com/file/d/1aPnko4ox4leDqRUzxp0vEACKECACucEk/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1aPnko4ox4leDqRUzxp0vEACKECACucEk",
            isDefault: true
        },
        {
            name: "Data Analysis using Pandas Dataframes",
            issuer: "Coursera",
            link: "https://drive.google.com/file/d/1tyikZrc3mIq5HSBRNEvaLo5wmReASwsb/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1tyikZrc3mIq5HSBRNEvaLo5wmReASwsb",
            isDefault: true
        },
        {
            name: "Infosys Springboard Certification",
            issuer: "Infosys Springboard",
            link: "https://drive.google.com/file/d/1jTqH_M1lFQQaGKzy-cevC9s4C8GyuGuq/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1jTqH_M1lFQQaGKzy-cevC9s4C8GyuGuq",
            isDefault: true
        },
        {
            name: "Introduction to Data Analytics",
            issuer: "Coursera",
            link: "https://drive.google.com/file/d/1v7GheS9BPhZVxIg8miwC7ZYdgaygS5gQ/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1v7GheS9BPhZVxIg8miwC7ZYdgaygS5gQ",
            isDefault: true
        },
        {
            name: "JavaScript Programming",
            issuer: "Coursera",
            link: "https://drive.google.com/file/d/1MHBB6lX0KxCDtpr444bphHxuZB6mYCmf/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1MHBB6lX0KxCDtpr444bphHxuZB6mYCmf",
            isDefault: true
        },
        {
            name: "Python Basic Certification",
            issuer: "HackerRank",
            link: "https://drive.google.com/file/d/1065p87fC-bGsM9iCLyvyXR_q2K6ubn6G/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1065p87fC-bGsM9iCLyvyXR_q2K6ubn6G",
            isDefault: true
        },
        {
            name: "Raptor Flowchart Certificate",
            issuer: "Raptor",
            link: "https://drive.google.com/file/d/1WSHCUtwZwab9WehLdbR5gJMHPaZCvhX0/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1WSHCUtwZwab9WehLdbR5gJMHPaZCvhX0",
            isDefault: true
        },
        {
            name: "Raptor Programming Certificate",
            issuer: "Raptor",
            link: "https://drive.google.com/file/d/1h-B3MNrEGlEKAdivzglCylM7vT4zr0e6/view?usp=sharing",
            downloadLink: "https://drive.google.com/uc?export=download&id=1h-B3MNrEGlEKAdivzglCylM7vT4zr0e6",
            isDefault: true
        }
    ];

    const CERTS_VERSION = 'v3';
    let myCerts = [];
    try {
        const storedCerts = localStorage.getItem('myCerts');
        const storedCertsVer = localStorage.getItem('myCerts_version');
        if (storedCerts && storedCertsVer === CERTS_VERSION) {
            myCerts = JSON.parse(storedCerts);
        } else {
            myCerts = JSON.parse(JSON.stringify(defaultCerts));
            localStorage.setItem('myCerts', JSON.stringify(myCerts));
            localStorage.setItem('myCerts_version', CERTS_VERSION);
        }
    } catch(e) {
        myCerts = JSON.parse(JSON.stringify(defaultCerts));
    }

    function saveCerts() {
        localStorage.setItem('myCerts', JSON.stringify(myCerts));
    }

    function updateCertCounter() {
        const counterEl = document.getElementById('cert-slider-counter');
        if (counterEl) {
            const totalPages = myCerts.length + 1; // including the "Add" card
            const currentPage = Math.min(activePageIndex + 1, totalPages);
            counterEl.textContent = `${currentPage.toString().padStart(2, '0')} / ${totalPages.toString().padStart(2, '0')}`;
        }
    }

    // Scroll listener on viewport to capture manual swipes and snap offsets
    if (certsViewport) {
        certsViewport.addEventListener('scroll', () => {
            const index = Math.round(certsViewport.scrollTop / 224);
            const totalPages = myCerts.length + 1;
            if (index !== activePageIndex && index >= 0 && index < totalPages) {
                activePageIndex = index;
                updateCertCounter();
            }
        });
    }

    // Listen to resize events to sync counter calculations instantly
    window.addEventListener('resize', () => {
        updateCertCounter();
    });

    // Custom orange lasso curve rope animation
    function animateRope(direction) {
        const path = document.getElementById('rope-path');
        if (!path || !certsViewport) return;
        
        const width = certsViewport.clientWidth;
        const height = certsViewport.clientHeight;
        const center = width / 2;
        
        const start = performance.now();
        const duration = 600; // 600ms lasso animation
        
        function drawFrame(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            let d = '';
            if (direction === 'down') {
                // Whipping rope comes from bottom, grabs and pulls down
                let peakY;
                if (progress < 0.4) {
                    const p = progress / 0.4;
                    peakY = height - (height - height * 0.25) * p; // Shoots up to top 25% height
                } else {
                    const p = (progress - 0.4) / 0.6;
                    peakY = (height * 0.25) + (height - height * 0.25) * p; // Pulls down back to bottom
                }
                const cpWidth = width * 0.3 * (1 - Math.abs(progress - 0.4));
                const cpX1 = center - cpWidth;
                const cpX2 = center + cpWidth;
                d = `M ${center},${height} Q ${cpX1},${(peakY + height)/2} ${center},${peakY} Q ${cpX2},${(peakY + height)/2} ${center},${height}`;
            } else {
                // Whipping rope comes from top, grabs and pushes down
                let peakY;
                if (progress < 0.4) {
                    const p = progress / 0.4;
                    peakY = (height * 0.75) * p; // Shoots down to bottom 75% height
                } else {
                    const p = (progress - 0.4) / 0.6;
                    peakY = (height * 0.75) - (height * 0.75) * p; // Pulls back to top
                }
                const cpWidth = width * 0.3 * (1 - Math.abs(progress - 0.4));
                const cpX1 = center - cpWidth;
                const cpX2 = center + cpWidth;
                d = `M ${center},0 Q ${cpX1},${peakY/2} ${center},${peakY} Q ${cpX2},${peakY/2} ${center},0`;
            }
            
            path.setAttribute('d', d);
            
            if (progress < 1) {
                requestAnimationFrame(drawFrame);
            } else {
                path.setAttribute('d', '');
            }
        }
        requestAnimationFrame(drawFrame);
    }

    // Trigger elastic scale stretch animation on rows/cards
    function triggerElasticAnimation(direction) {
        const selector = window.innerWidth > 768 ? '.cert-row' : '.cert-card';
        const elements = certsGrid.querySelectorAll(selector);
        const targetElement = elements[activePageIndex];
        if (targetElement) {
            const className = direction === 'down' ? 'elastic-pull' : 'elastic-push';
            targetElement.classList.add(className);
            setTimeout(() => {
                targetElement.classList.remove(className);
            }, 650);
        }
    }

    // Navigation buttons for Certifications (scrolling by pages)
    const certsUpBtn = document.getElementById('certs-up-btn');
    const certsDownBtn = document.getElementById('certs-down-btn');
    if (certsUpBtn && certsDownBtn && certsViewport) {
        certsUpBtn.addEventListener('click', () => {
            if (activePageIndex > 0) {
                activePageIndex--;
                certsViewport.scrollTo({ top: activePageIndex * 224, behavior: 'smooth' });
                updateCertCounter();
            }
        });
        certsDownBtn.addEventListener('click', () => {
            const totalPages = myCerts.length + 1;
            if (activePageIndex < totalPages - 1) {
                activePageIndex++;
                certsViewport.scrollTo({ top: activePageIndex * 224, behavior: 'smooth' });
                updateCertCounter();
            }
        });
    }

    function renderCerts() {
        if (!certsGrid) return;
        certsGrid.innerHTML = '';

        const totalPages = myCerts.length + 1;
        if (activePageIndex >= totalPages) {
            activePageIndex = totalPages - 1;
        }
        if (activePageIndex < 0) {
            activePageIndex = 0;
        }
        updateCertCounter();

        const cardElements = [];

        myCerts.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = 'cert-card fade-up';
            card.style.opacity = '1';
            
            // Hover Actions (only for non-default certifications)
            let actions = null;
            if (!cert.isDefault) {
                actions = document.createElement('div');
                actions.className = 'cert-actions';
                
                const editBtn = document.createElement('button');
                editBtn.className = 'cert-action-btn';
                editBtn.innerHTML = '<i class="fas fa-pen"></i>';
                editBtn.title = 'Edit Certificate';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    enterCertEditMode(index, card);
                };
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'cert-action-btn delete';
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBtn.title = 'Delete Certificate';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    myCerts.splice(index, 1);
                    saveCerts();
                    renderCerts();
                    if (certsViewport) {
                        certsViewport.scrollTo({ top: activePageIndex * 224, behavior: 'smooth' });
                    }
                };
                
                actions.appendChild(editBtn);
                actions.appendChild(deleteBtn);
            }
            
            // Card Content Wrap
            const contentWrap = document.createElement('div');
            contentWrap.className = 'cert-content';
            
            const issuerEl = document.createElement('span');
            issuerEl.className = 'cert-issuer';
            issuerEl.textContent = cert.issuer || 'Unknown Issuer';
            
            const titleH3 = document.createElement('h3');
            titleH3.className = 'cert-card-title';
            titleH3.textContent = cert.name || 'Unnamed Certification';
            
            contentWrap.appendChild(issuerEl);
            contentWrap.appendChild(titleH3);
            
            // Footer (View & Download Buttons)
            const footer = document.createElement('div');
            footer.className = 'cert-footer';
            footer.style.display = 'flex';
            footer.style.gap = '1rem';
            footer.style.width = '100%';
            
            const viewBtn = document.createElement('a');
            viewBtn.className = 'btn btn-secondary cert-btn';
            viewBtn.style.padding = '0.5rem 1rem';
            viewBtn.style.fontSize = '0.85rem';
            viewBtn.style.flex = '1';
            viewBtn.style.justifyContent = 'center';
            viewBtn.href = cert.link || '#';
            viewBtn.target = '_blank';
            viewBtn.rel = 'noopener noreferrer';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i> View';
            
            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'btn btn-primary cert-btn';
            downloadBtn.style.padding = '0.5rem 1rem';
            downloadBtn.style.fontSize = '0.85rem';
            downloadBtn.style.flex = '1';
            downloadBtn.style.justifyContent = 'center';
            downloadBtn.href = cert.downloadLink || '#';
            downloadBtn.target = '_blank';
            downloadBtn.rel = 'noopener noreferrer';
            downloadBtn.setAttribute('download', '');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
            
            footer.appendChild(viewBtn);
            footer.appendChild(downloadBtn);
            
            if (actions) {
                card.appendChild(actions);
            }
            card.appendChild(contentWrap);
            card.appendChild(footer);
            
            cardElements.push(card);
        });

        // Add Certificate Button Card
        const addCard = document.createElement('div');
        addCard.className = 'cert-card add-cert-card fade-up';
        addCard.style.opacity = '1';
        
        const addIcon = document.createElement('div');
        addIcon.className = 'add-cert-icon';
        addIcon.innerHTML = '<i class="fas fa-plus"></i>';
        
        const addText = document.createElement('div');
        addText.className = 'add-cert-text';
        addText.textContent = 'Add Certificate';
        
        addCard.appendChild(addIcon);
        addCard.appendChild(addText);
        
        addCard.onclick = () => {
            myCerts.push({
                name: '',
                issuer: '',
                link: '',
                downloadLink: ''
            });
            saveCerts();
            
            activePageIndex = myCerts.length - 1;
            renderCerts();
            if (certsViewport) {
                certsViewport.scrollTo({ top: activePageIndex * 224, behavior: 'smooth' });
            }
            
            // Focus editing on the newly added certificate card
            const allCardsInGrid = certsGrid.querySelectorAll('.cert-card');
            const targetCardElement = allCardsInGrid[myCerts.length - 1];
            if (targetCardElement) {
                enterCertEditMode(myCerts.length - 1, targetCardElement);
            }
        };
        
        cardElements.push(addCard);

        // Render directly in grid for all screen sizes
        cardElements.forEach(card => certsGrid.appendChild(card));
    }

    function enterCertEditMode(index, cardElement) {
        const cert = myCerts[index];
        cardElement.innerHTML = ''; // Clear card for editing
        
        const form = document.createElement('div');
        form.className = 'cert-edit-form';
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'cert-input';
        nameInput.placeholder = 'Certification Name';
        nameInput.value = cert.name || '';
        
        const issuerInput = document.createElement('input');
        issuerInput.type = 'text';
        issuerInput.className = 'cert-input';
        issuerInput.placeholder = 'Issuing Organization (e.g. Google)';
        issuerInput.value = cert.issuer || '';
        
        const linkInput = document.createElement('input');
        linkInput.type = 'text';
        linkInput.className = 'cert-input';
        linkInput.placeholder = 'Verification URL';
        linkInput.value = cert.link || '';
        
        const downloadInput = document.createElement('input');
        downloadInput.type = 'text';
        downloadInput.className = 'cert-input';
        downloadInput.placeholder = 'Download PDF / File URL';
        downloadInput.value = cert.downloadLink || '';

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'cert-edit-buttons';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cert-edit-btn cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = (e) => {
            e.stopPropagation();
            if (!cert.name && !cert.issuer) {
                myCerts.splice(index, 1);
                saveCerts();
            }
            renderCerts();
            if (certsViewport) {
                certsViewport.scrollTo({ top: activePageIndex * 224, behavior: 'smooth' });
            }
        };
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'cert-edit-btn save';
        saveBtn.textContent = 'Save';
        saveBtn.onclick = (e) => {
            e.stopPropagation();
            
            const nameVal = nameInput.value.trim();
            const issuerVal = issuerInput.value.trim();
            
            if (nameVal || issuerVal) {
                myCerts[index] = {
                    name: nameVal || 'Unnamed Certificate',
                    issuer: issuerVal || 'Unknown Issuer',
                    link: linkInput.value.trim(),
                    downloadLink: downloadInput.value.trim()
                };
                saveCerts();
            } else {
                myCerts.splice(index, 1);
                saveCerts();
            }
            renderCerts();
            if (certsViewport) {
                certsViewport.scrollTo({ top: activePageIndex * 224, behavior: 'smooth' });
            }
        };
        
        buttonsDiv.appendChild(cancelBtn);
        buttonsDiv.appendChild(saveBtn);
        
        form.appendChild(nameInput);
        form.appendChild(issuerInput);
        form.appendChild(linkInput);
        form.appendChild(downloadInput);
        form.appendChild(buttonsDiv);
        
        cardElement.appendChild(form);
        nameInput.focus();
    }

    if (certsGrid) {
        renderCerts();
    }

    // 13. Dynamic Experience Section Tabs Controller
    const expTabsContainer = document.getElementById('experience-tabs');
    const expPanels = document.querySelectorAll('.panel-content');
    const tabIndicator = document.getElementById('tab-indicator');
    
    if (expTabsContainer && tabIndicator) {
        const tabButtons = expTabsContainer.querySelectorAll('.tab-btn');
        
        function updateTabIndicator(activeBtn) {
            if (window.innerWidth > 768) {
                // Desktop: vertical indicator
                tabIndicator.style.transform = `translateY(${activeBtn.offsetTop}px)`;
                tabIndicator.style.height = `${activeBtn.offsetHeight}px`;
                tabIndicator.style.width = '2px';
            } else {
                // Mobile: horizontal indicator
                tabIndicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
                tabIndicator.style.width = `${activeBtn.offsetWidth}px`;
                tabIndicator.style.height = '2px';
            }
        }
        
        // Sync indicator on resize
        window.addEventListener('resize', () => {
            const activeBtn = expTabsContainer.querySelector('.tab-btn.active');
            if (activeBtn) {
                updateTabIndicator(activeBtn);
            }
        });
        
        // Initial sync on load after font rendering/layout stabilizes
        setTimeout(() => {
            const activeBtn = expTabsContainer.querySelector('.tab-btn.active');
            if (activeBtn) {
                updateTabIndicator(activeBtn);
            }
        }, 300);
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetIndex = btn.getAttribute('data-index');
                
                // Set active tab button
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Set active panel content
                expPanels.forEach(panel => {
                    if (panel.getAttribute('data-index') === targetIndex) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
                
                updateTabIndicator(btn);
            });
        });
    }
});
