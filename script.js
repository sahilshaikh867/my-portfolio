// active hamburger menu 
let menuIcon = document.querySelector(".menu-icon");
let navlist = document.querySelector(".navlist");

if (menuIcon && navlist) {
    menuIcon.addEventListener("click", () => {
        menuIcon.classList.toggle("active");
        navlist.classList.toggle("active");
        document.body.classList.toggle("open");
    });

    // remove navlist on click
    navlist.addEventListener("click", () => {
        navlist.classList.remove("active");
        menuIcon.classList.remove("active");
        document.body.classList.remove("open");
    });
}

// rotate text js code 
let text = document.querySelector(".text p");
if (text) {
    text.innerHTML = text.innerHTML.split("").map((char, i) =>
        `<b style="transform:rotate(${i * 6.3}deg)">${char}</b>`
    ).join("");
}

// switch between about buttons 
const buttons = document.querySelectorAll('.about-btn button');
const contents = document.querySelectorAll('.content');

if (buttons.length > 0 && contents.length > 0) {
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            contents.forEach(content => content.style.display = 'none');
            if (contents[index]) contents[index].style.display = 'block';
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

// portfolio filter 
if (document.querySelector('.portfolio-gallery') && typeof mixitup !== 'undefined') {
    var mixer = mixitup('.portfolio-gallery', {
        selectors: {
            target: '.portfolio-box'
        },
        animation: {
            duration: 500
        }
    });
}

// Initialize swiperjs 
if (document.querySelector('.mySwiper') && typeof Swiper !== 'undefined') {
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        }
    });
}

// skill Progress bar 
const first_skill = document.querySelector(".skill:first-child");
const sk_counters = document.querySelectorAll(".counter span");
const progress_bars = document.querySelectorAll(".skills svg circle");
let skillsPlayed = false;

function hasReached(el) {
    if (!el) return false;
    let topPosition = el.getBoundingClientRect().top;
    if (window.innerHeight >= topPosition + el.offsetHeight) return true;
    return false;
}

function updateCount(num, maxNum) {
    let currentNum = +num.innerText;
    if (currentNum < maxNum) {
        num.innerText = currentNum + 1;
        setTimeout(() => {
            updateCount(num, maxNum);
        }, 12);
    }
}

function skillsCounter() {
    if (!first_skill || !hasReached(first_skill)) return;
    skillsPlayed = true;
    sk_counters.forEach((counter, i) => {
        let target = +counter.dataset.target;
        let strokeValue = 465 - 465 * (target / 100);

        if (progress_bars[i]) {
            progress_bars[i].style.setProperty("--target", strokeValue);
        }

        setTimeout(() => {
            updateCount(counter, target);
        }, 400);
    });

    progress_bars.forEach(p => p.style.animation = "progress 2s ease-in-out forwards");
}

if (first_skill) {
    window.addEventListener("scroll", () => {
        if (!skillsPlayed) skillsCounter();
    });
}

// side progress bar 
const scrollProgress = document.getElementById("progress");

if (scrollProgress) {
    scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
    });

    const calcScrollValue = () => {
        let pos = document.documentElement.scrollTop;
        let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrollValue = calcHeight > 0 ? Math.round((pos * 100) / calcHeight) : 0;

        if (pos > 100) {
            scrollProgress.style.display = "grid";
        } else {
            scrollProgress.style.display = "none";
        }

        scrollProgress.style.background = `conic-gradient(#fff ${scrollValue}%,#e6006d ${scrollValue}%)`;
    };

    window.addEventListener("scroll", calcScrollValue);
    window.addEventListener("load", calcScrollValue);
}

// active menu 
const menuLi = document.querySelectorAll("header ul.navlist li a");
const sections = document.querySelectorAll("section[id]");

function activeMenu() {
    let currentId = "";
    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) {
            currentId = sec.getAttribute("id");
        }
    });

    if (currentId) {
        menuLi.forEach(link => {
            const href = link.getAttribute("href");
            if (href === `#${currentId}`) {
                link.classList.add("active");
            } else if (href && href.startsWith("#")) {
                link.classList.remove("active");
            }
        });
    }
}

if (sections.length > 0 && menuLi.length > 0) {
    activeMenu();
    window.addEventListener("scroll", activeMenu);
}

// scroll reveal
if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal({
        distance: "90px",
        duration: 2000,
        delay: 200,
    });

    ScrollReveal().reveal('.hero-info,.main-text,.proposal,.heading', { origin: "top" });
    ScrollReveal().reveal('.about-img,.fillter-buttons,.contact-info', { origin: "left" });
    ScrollReveal().reveal('.about-content,.skills', { origin: "right" });
    ScrollReveal().reveal('.allServices,.portfolio-gallery,.blog-box,footer,.img-hero', { origin: "bottom" });
}

// dark / light mode toggle
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    const icon = themeToggle.querySelector("img");
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (icon) icon.src = "img/sun.png";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        if (icon) icon.src = isDark ? "img/sun.png" : "img/moon.png";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}
