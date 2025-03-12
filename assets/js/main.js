// Performance optimizations
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Cache DOM queries
const DOM = {
    menuButton: document.querySelector(".menu-button"),
    mobileDropdown: document.querySelector(".mobile-dropdown"),
    closeButton: document.querySelector(".close-button"),
    sponsorTabButtons: document.querySelectorAll(".sponsor-tab-button"),
    sponsorTabPanes: document.querySelectorAll(".sponsor-tab-pane"),
    pickleballTrack: document.querySelector(".pickleball-carousel-track"),
    pickleballSlides: Array.from(document.querySelectorAll(".pickleball-carousel-slide")),
    pickleballNextButton: document.querySelector(".pickleball-carousel-button.next"),
    pickleballPrevButton: document.querySelector(".pickleball-carousel-button.prev"),
    pickleballDotsNav: document.querySelector(".pickleball-carousel-dots")
};

// --------------- Header ---------------
if (DOM.menuButton && DOM.mobileDropdown && DOM.closeButton) {
    const toggleMenu = (show) => {
        DOM.mobileDropdown.classList.toggle("active", show);
        DOM.menuButton.style.display = show ? "none" : "block";
        DOM.closeButton.style.display = show ? "block" : "none";
    };

    DOM.menuButton.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu(true);
    });

    DOM.closeButton.addEventListener("click", () => toggleMenu(false));

    // // Event delegation for better performance
    // document.addEventListener("click", (event) => {
    //     if (!event.target.closest(".header-container")) {
    //         toggleMenu(false);
    //     }
    // });

    DOM.mobileDropdown.addEventListener("click", (e) => e.stopPropagation());

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) {
            DOM.menuButton.style.display = "none";
        } else {
            DOM.menuButton.style.display = "block";
        }
    });
}

// --------------- Sponsor tab ---------------
if (DOM.sponsorTabButtons && DOM.sponsorTabPanes) {
    const switchTab = (index) => {
        DOM.sponsorTabButtons.forEach(btn => btn.classList.remove("active"));
        DOM.sponsorTabPanes.forEach(pane => pane.classList.remove("active"));
        DOM.sponsorTabButtons[index].classList.add("active");
        DOM.sponsorTabPanes[index].classList.add("active");
    };

    DOM.sponsorTabButtons.forEach((button, index) => {
        button.addEventListener("click", () => switchTab(index));
    });
}

// --------------- Pickleball carousel ---------------
if (DOM.pickleballTrack && DOM.pickleballSlides.length) {
    let pickleballSlidesPerPage = 3;
    let pickleballCurrentPage = 0;
    let pickleballDots = [];

    // Optimized getSlidesPerPage function
    const getSlidesPerPage = () => {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 3;
    };

    const updateDots = () => {
        if (!DOM.pickleballDotsNav) return;
        
        DOM.pickleballDotsNav.innerHTML = "";
        pickleballDots = [];

        const totalPages = Math.ceil(DOM.pickleballSlides.length / pickleballSlidesPerPage);
        
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement("div");
            dot.className = "pickleball-carousel-dot" + (i === pickleballCurrentPage ? " active" : "");
            fragment.appendChild(dot);
            pickleballDots.push(dot);
        }
        DOM.pickleballDotsNav.appendChild(fragment);

        if (pickleballCurrentPage >= totalPages) {
            pickleballCurrentPage = totalPages - 1;
            moveToPage(pickleballCurrentPage);
        }
    };

    const moveToPage = (page) => {
        const slideWidth = DOM.pickleballSlides[0].getBoundingClientRect().width;
        DOM.pickleballTrack.style.transform = `translateX(-${page * slideWidth * pickleballSlidesPerPage}px)`;
        pickleballCurrentPage = page;

        pickleballDots.forEach((dot, index) => {
            dot.classList.toggle("active", index === pickleballCurrentPage);
        });

        const totalPages = Math.ceil(DOM.pickleballSlides.length / pickleballSlidesPerPage);
        if (DOM.pickleballPrevButton) {
            DOM.pickleballPrevButton.style.opacity = pickleballCurrentPage === 0 ? "0.5" : "1";
        }
        if (DOM.pickleballNextButton) {
            DOM.pickleballNextButton.style.opacity = pickleballCurrentPage === totalPages - 1 ? "0.5" : "1";
        }
    };

    const initializeCarousel = () => {
        pickleballSlidesPerPage = getSlidesPerPage();
        updateDots();
        moveToPage(0);
    };

    // Event Listeners with optimizations
    if (DOM.pickleballNextButton) {
        DOM.pickleballNextButton.addEventListener("click", () => {
            const totalPages = Math.ceil(DOM.pickleballSlides.length / pickleballSlidesPerPage);
            if (pickleballCurrentPage < totalPages - 1) {
                moveToPage(pickleballCurrentPage + 1);
            }
        });
    }

    if (DOM.pickleballPrevButton) {
        DOM.pickleballPrevButton.addEventListener("click", () => {
            if (pickleballCurrentPage > 0) {
                moveToPage(pickleballCurrentPage - 1);
            }
        });
    }

    if (DOM.pickleballDotsNav) {
        DOM.pickleballDotsNav.addEventListener("click", (e) => {
            const targetDot = e.target.closest(".pickleball-carousel-dot");
            if (!targetDot || !DOM.pickleballDotsNav.contains(targetDot)) return;
            const targetIndex = pickleballDots.indexOf(targetDot);
            if (targetIndex !== -1) {
                moveToPage(targetIndex);
            }
        });
    }

    // Optimized resize handler
    window.addEventListener("resize", debounce(() => {
        const newSlidesPerPage = getSlidesPerPage();
        if (newSlidesPerPage !== pickleballSlidesPerPage) {
            pickleballSlidesPerPage = newSlidesPerPage;
            initializeCarousel();
        }
    }, 250));

    // Initialize on load
    initializeCarousel();
}

// --------------- Navigation with performance optimization ---------------
const navigateTo = (path, classname) => {
    const button = document.querySelector(classname);
    if (button) {
        button.addEventListener("click", () => {
            window.location.href = path;
        });
    }
};

// Use requestIdleCallback for non-critical navigation setup
window.requestIdleCallback ? 
    window.requestIdleCallback(() => {
        navigateTo("/auth/signup.html", ".sign-up-button");
        navigateTo("/index.html", ".logo, .logo-mobile");
        navigateTo("/thank-you.html", ".join-waitlist-button");
    }) : 
    (() => {
        navigateTo("/auth/signup.html", ".sign-up-button");
        navigateTo("/index.html", ".logo, .logo-mobile");
        navigateTo("/thank-you.html", ".join-waitlist-button");
    })();
