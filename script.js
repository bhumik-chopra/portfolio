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
    let lastScrollY = window.scrollY;

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
            entry.target.classList.toggle("revealed", entry.isIntersecting);
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
        const scrollingDown = scrollY > lastScrollY;
        const shouldHideHeader = scrollingDown && scrollY > 140 && !(navPanel?.classList.contains("active"));
        header?.classList.toggle("nav-hidden", shouldHideHeader);
        lastScrollY = scrollY;

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
            const submitButton = contactForm.querySelector(".submit-btn");
            const submitLabel = submitButton?.querySelector(".submit-label");
            const submitIcon = submitButton?.querySelector(".submit-icon");

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                subject: contactForm.subject.value,
                message: contactForm.message.value
            };

            try {
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.classList.add("is-sending");
                }
                if (submitLabel) {
                    submitLabel.textContent = "Sending Message";
                }
                if (submitIcon) {
                    submitIcon.className = "fas fa-satellite-dish submit-icon";
                }

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
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.classList.remove("is-sending");
                }
                if (submitLabel) {
                    submitLabel.textContent = "Send Message";
                }
                if (submitIcon) {
                    submitIcon.className = "fas fa-paper-plane submit-icon";
                }
            }
        });
    }

    function initStarfield() {
        if (!starCanvas) return;
        const context = starCanvas.getContext("2d");
        if (!context) return;

        const stars = [];
        const ships = [];
        const lasers = [];
        const explosions = [];
        const starCount = prefersReducedMotion ? 80 : 180;
        const shipCount = prefersReducedMotion ? 0 : 6;
        let width = 0;
        let height = 0;
        let animationId = null;

        function createShip(index) {
            const fromLeft = index % 2 === 0;
            return {
                x: fromLeft ? -140 - Math.random() * 220 : width + 140 + Math.random() * 220,
                y: height * (0.16 + Math.random() * 0.42),
                vx: fromLeft ? 1.9 + Math.random() * 1.2 : -(1.9 + Math.random() * 1.2),
                vy: (Math.random() - 0.5) * 0.2,
                size: 16 + Math.random() * 9,
                tilt: fromLeft ? 1 : -1,
                hue: fromLeft ? "rgba(114, 230, 255, 0.95)" : "rgba(255, 216, 90, 0.95)",
                fireCooldown: 20 + Math.random() * 70
            };
        }

        function resetShip(ship, index) {
            Object.assign(ship, createShip(index));
        }

        function drawShip(ship) {
            context.save();
            context.translate(ship.x, ship.y);
            context.rotate(ship.vx > 0 ? 0.18 : -0.18);
            context.scale(ship.tilt, 1);
            context.fillStyle = "rgba(220, 235, 255, 0.9)";
            context.strokeStyle = ship.hue;
            context.lineWidth = 1.1;
            context.shadowBlur = 14;
            context.shadowColor = ship.hue;

            context.beginPath();
            context.moveTo(ship.size, 0);
            context.lineTo(-ship.size * 0.7, ship.size * 0.34);
            context.lineTo(-ship.size * 0.22, 0);
            context.lineTo(-ship.size * 0.7, -ship.size * 0.34);
            context.closePath();
            context.fill();
            context.stroke();

            context.beginPath();
            context.moveTo(-ship.size * 0.16, 0);
            context.lineTo(-ship.size * 0.96, ship.size * 0.82);
            context.lineTo(-ship.size * 0.62, ship.size * 0.14);
            context.moveTo(-ship.size * 0.16, 0);
            context.lineTo(-ship.size * 0.96, -ship.size * 0.82);
            context.lineTo(-ship.size * 0.62, -ship.size * 0.14);
            context.stroke();

            context.restore();
        }

        function spawnLaser(ship) {
            lasers.push({
                x: ship.x + ship.vx * 8,
                y: ship.y,
                vx: ship.vx > 0 ? 8.5 : -8.5,
                vy: ship.vy * 0.35,
                life: 42,
                color: ship.hue
            });
        }

        function drawLaser(laser) {
            context.save();
            context.strokeStyle = laser.color;
            context.lineWidth = 2;
            context.shadowBlur = 12;
            context.shadowColor = laser.color;
            context.beginPath();
            context.moveTo(laser.x, laser.y);
            context.lineTo(laser.x - laser.vx * 1.7, laser.y - laser.vy * 1.7);
            context.stroke();
            context.restore();
        }

        function spawnExplosion(x, y, color) {
            explosions.push({
                x,
                y,
                color,
                life: 24,
                maxLife: 24,
                radius: 10 + Math.random() * 10,
                sparks: Array.from({ length: 9 + Math.floor(Math.random() * 5) }, () => {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 1.4 + Math.random() * 2.6;
                    return {
                        x,
                        y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size: 1.8 + Math.random() * 2.8
                    };
                })
            });
        }

        function drawExplosion(explosion) {
            const alpha = explosion.life / explosion.maxLife;
            context.save();

            const outerGlow = context.createRadialGradient(
                explosion.x,
                explosion.y,
                0,
                explosion.x,
                explosion.y,
                explosion.radius * 2.8
            );
            outerGlow.addColorStop(0, `rgba(255, 245, 210, ${Math.min(0.95, alpha + 0.2)})`);
            outerGlow.addColorStop(0.2, `rgba(255, 176, 66, ${Math.max(0.55, alpha)})`);
            outerGlow.addColorStop(0.55, `rgba(255, 82, 24, ${Math.max(0.28, alpha * 0.8)})`);
            outerGlow.addColorStop(1, "rgba(255, 32, 0, 0)");

            context.fillStyle = outerGlow;
            context.beginPath();
            context.arc(explosion.x, explosion.y, explosion.radius * 2.8, 0, Math.PI * 2);
            context.fill();

            context.shadowBlur = 26;
            context.shadowColor = "rgba(255, 120, 40, 0.9)";
            context.fillStyle = `rgba(255, 236, 160, ${Math.max(alpha, 0.2)})`;
            context.beginPath();
            context.arc(explosion.x, explosion.y, explosion.radius * (0.55 + (1 - alpha) * 0.65), 0, Math.PI * 2);
            context.fill();

            context.fillStyle = `rgba(255, 92, 18, ${Math.max(alpha * 0.95, 0.18)})`;
            context.beginPath();
            context.arc(explosion.x, explosion.y, explosion.radius * (1.05 + (1 - alpha) * 0.9), 0, Math.PI * 2);
            context.fill();

            explosion.sparks.forEach((spark) => {
                context.fillStyle = `rgba(255, 208, 118, ${Math.max(alpha * 0.9, 0.18)})`;
                context.beginPath();
                context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
                context.fill();
            });

            context.restore();
        }

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
            ships.length = 0;
            lasers.length = 0;
            explosions.length = 0;

            for (let i = 0; i < starCount; i += 1) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z: Math.random() * 1.2 + 0.2,
                    radius: Math.random() * 1.8 + 0.2,
                    alpha: Math.random() * 0.6 + 0.25,
                    speed: Math.random() * 0.34 + 0.1
                });
            }

            for (let i = 0; i < shipCount; i += 1) {
                ships.push(createShip(i));
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

            ships.forEach((ship, index) => {
                drawShip(ship);

                if (!prefersReducedMotion) {
                    ship.x += ship.vx;
                    ship.y += ship.vy + Math.sin((ship.x + index * 45) * 0.01) * 0.35;
                    ship.fireCooldown -= 1;

                    if (ship.fireCooldown <= 0) {
                        spawnLaser(ship);
                        ship.fireCooldown = 18 + Math.random() * 55;
                    }

                    if (ship.x < -220 || ship.x > width + 220 || ship.y < -80 || ship.y > height + 80) {
                        resetShip(ship, index);
                    }
                }
            });

            for (let i = lasers.length - 1; i >= 0; i -= 1) {
                const laser = lasers[i];
                drawLaser(laser);

                if (!prefersReducedMotion) {
                    laser.x += laser.vx;
                    laser.y += laser.vy;
                    laser.life -= 1;

                    const hitShip = ships.find((ship) => (
                        Math.sign(ship.vx) !== Math.sign(laser.vx) &&
                        Math.hypot(ship.x - laser.x, ship.y - laser.y) < ship.size * 0.95
                    ));

                    if (hitShip) {
                        spawnExplosion(laser.x, laser.y, laser.color);
                        spawnExplosion(hitShip.x, hitShip.y, hitShip.hue);
                        resetShip(hitShip, ships.indexOf(hitShip));
                        lasers.splice(i, 1);
                        continue;
                    }
                }

                if (
                    laser.life <= 0 ||
                    laser.x < -120 ||
                    laser.x > width + 120 ||
                    laser.y < -120 ||
                    laser.y > height + 120
                ) {
                    lasers.splice(i, 1);
                }
            }

            for (let i = explosions.length - 1; i >= 0; i -= 1) {
                const explosion = explosions[i];
                drawExplosion(explosion);
                explosion.life -= 1;
                explosion.radius += 0.75;
                explosion.sparks.forEach((spark) => {
                    spark.x += spark.vx;
                    spark.y += spark.vy;
                    spark.vx *= 0.98;
                    spark.vy *= 0.98;
                    spark.size *= 0.96;
                });

                if (explosion.life <= 0) {
                    explosions.splice(i, 1);
                }
            }

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
