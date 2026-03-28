document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const navLinks = [...document.querySelectorAll(".nav-link")];
    const hamburger = document.querySelector(".hamburger");
    const navPanel = document.querySelector(".nav-panel");
    const heroSubtitle = document.getElementById("rotating-profession");
    const contactForm = document.getElementById("contactForm");
    const systemBars = document.querySelectorAll(".system-bar");
    const revealElements = document.querySelectorAll("[data-reveal]");
    const buttons = document.querySelectorAll(".hire-btn, .about-btn, .nav-cta");
    const starCanvas = document.getElementById("starfield");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const titles = [
        "DRONACHARYA COLLEGE OF ENGINEERING "
    ];

    let currentTitleIndex = 0;
    let currentCharacter = 0;
    let deleting = false;

    function setNavState(open) {
        if (!hamburger || !navPanel) return;
        hamburger.classList.toggle("active", open);
        hamburger.setAttribute("aria-expanded", String(open));
        navPanel.classList.toggle("active", open);
        document.body.classList.toggle("nav-open", open);
    }

    function updateActiveNav(id) {
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === id);
        });
    }

    function scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;
        const offset = (header?.offsetHeight || 0) + 18;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }

    function typeTitles() {
        if (!heroSubtitle) return;

        const fullText = titles[currentTitleIndex];
        const nextText = deleting
            ? fullText.slice(0, currentCharacter--)
            : fullText.slice(0, currentCharacter++);

        heroSubtitle.innerHTML = `${nextText}<span class="cursor">|</span>`;

        let timeout = deleting ? 45 : 95;
        if (!deleting && currentCharacter > fullText.length) {
            deleting = true;
            timeout = 1500;
        } else if (deleting && currentCharacter < 0) {
            deleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            currentCharacter = 0;
            timeout = 300;
        }

        window.setTimeout(typeTitles, prefersReducedMotion ? 1200 : timeout);
    }

    function showNotification(message, type = "info") {
        const note = document.createElement("div");
        note.className = `notification notification-${type}`;
        note.innerHTML = `
            <div class="notification-inner">
                <i class="fas ${type === "success" ? "fa-circle-check" : "fa-satellite-dish"}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(note);
        requestAnimationFrame(() => note.classList.add("visible"));

        window.setTimeout(() => {
            note.classList.remove("visible");
            window.setTimeout(() => note.remove(), 320);
        }, 3200);
    }

    function animateBars(entries) {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            const fill = bar.querySelector(".bar-track span");
            const level = bar.dataset.level || "0";
            if (fill) {
                fill.style.width = `${level}%`;
            }
            barObserver.unobserve(bar);
        });
    }

    function revealOnScroll(entries) {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
        });
    }

    const revealObserver = new IntersectionObserver(revealOnScroll, {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px"
    });

    const barObserver = new IntersectionObserver(animateBars, {
        threshold: 0.35
    });

    revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
        if (!prefersReducedMotion) {
            revealObserver.observe(element);
        } else {
            element.classList.add("revealed");
        }
    });

    systemBars.forEach((bar) => {
        if (!prefersReducedMotion) {
            barObserver.observe(bar);
        } else {
            const fill = bar.querySelector(".bar-track span");
            if (fill) fill.style.width = `${bar.dataset.level || "0"}%`;
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href");
            if (!targetId) return;
            updateActiveNav(targetId);
            scrollToSection(targetId);
            setNavState(false);
            history.replaceState(null, "", targetId);
        });
    });

    hamburger?.addEventListener("click", () => {
        const open = !hamburger.classList.contains("active");
        setNavState(open);
    });

    document.addEventListener("click", (event) => {
        if (!navPanel || !hamburger) return;
        if (!navPanel.classList.contains("active")) return;
        if (navPanel.contains(event.target) || hamburger.contains(event.target)) return;
        setNavState(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setNavState(false);
        }
    });

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const text = button.textContent?.trim() || "";
            if (text.includes("Download") || text.includes("Resume")) {
                const link = document.createElement("a");
                link.href = "./bhumik_cv.pdf";
                link.download = "bhumik_cv.pdf";
                document.body.appendChild(link);
                link.click();
                link.remove();
                return;
            }

            if (button.classList.contains("nav-cta") || text.includes("Mission")) {
                event.preventDefault();
                updateActiveNav("#contact");
                scrollToSection("#contact");
            }
        });
    });

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        header?.classList.toggle("scrolled", scrollY > 30);

        const offset = (header?.offsetHeight || 0) + 120;
        let activeId = "#home";
        document.querySelectorAll("section[id]").forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollY + offset >= top && scrollY + offset < bottom) {
                activeId = `#${section.id}`;
            }
        });
        updateActiveNav(activeId);
    }, { passive: true });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 920) {
            setNavState(false);
        }
    });

    if (window.location.hash) {
        updateActiveNav(window.location.hash);
        window.setTimeout(() => scrollToSection(window.location.hash), 120);
    }

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                subject: contactForm.subject.value,
                message: contactForm.message.value
            };

            try {
                const response = await fetch("https://portfolio-backend-ykzu.onrender.com/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                if (result.success) {
                    showNotification("Transmission received. I will get back to you soon.", "success");
                    contactForm.reset();
                } else {
                    showNotification("Transmission failed. Please try again.");
                }
            } catch (error) {
                showNotification("Unable to reach the contact server right now.");
            }
        });
    }

    function initStarfield() {
        if (!starCanvas) return;
        const context = starCanvas.getContext("2d");
        if (!context) return;

        const stars = [];
        const starCount = prefersReducedMotion ? 80 : 180;
        let width = 0;
        let height = 0;
        let animationId = null;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            const ratio = window.devicePixelRatio || 1;
            starCanvas.width = width * ratio;
            starCanvas.height = height * ratio;
            starCanvas.style.width = `${width}px`;
            starCanvas.style.height = `${height}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            stars.length = 0;

            for (let i = 0; i < starCount; i += 1) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z: Math.random() * 1.2 + 0.2,
                    radius: Math.random() * 1.8 + 0.2,
                    alpha: Math.random() * 0.6 + 0.25,
                    speed: Math.random() * 0.22 + 0.04
                });
            }
        }

        function draw() {
            context.clearRect(0, 0, width, height);

            stars.forEach((star) => {
                context.beginPath();
                context.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                context.shadowBlur = 10 * star.z;
                context.shadowColor = star.z > 1 ? "rgba(255, 216, 90, 0.65)" : "rgba(114, 230, 255, 0.55)";
                context.arc(star.x, star.y, star.radius * star.z, 0, Math.PI * 2);
                context.fill();

                if (!prefersReducedMotion) {
                    star.y += star.speed * star.z;
                    if (star.y > height + 5) {
                        star.y = -5;
                        star.x = Math.random() * width;
                    }
                }
            });

            context.shadowBlur = 0;
            animationId = requestAnimationFrame(draw);
        }

        resize();
        draw();
        window.addEventListener("resize", resize);
        window.addEventListener("beforeunload", () => cancelAnimationFrame(animationId));
    }

    typeTitles();
    initStarfield();
});
