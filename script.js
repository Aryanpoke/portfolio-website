"use strict";
// 1. MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

function closeMenu() {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
        closeMenu();
    } else {
        navMenu.classList.add("open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        document.body.classList.add("menu-open");
    }
});

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
        closeMenu();
    }
});

// 2. ACTIVE NAVIGATION LINK

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${currentId}`;

                    link.classList.toggle("active", isActive);

                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}

// 3. CURRENT FOOTER YEAR

const currentYear = document.getElementById("currentYear");

currentYear.textContent = new Date().getFullYear();

// 4. BACK TO TOP BUTTON

const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
    backToTop.classList.toggle("visible", window.scrollY > 450);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });

updateBackToTop();

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth"
    });
});

// 5. CONTACT FORM VALIDATION

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const fields = {
    name: {
        input: document.getElementById("name"),
        error: document.getElementById("nameError")
    },
    email: {
        input: document.getElementById("email"),
        error: document.getElementById("emailError")
    },
    subject: {
        input: document.getElementById("subject"),
        error: document.getElementById("subjectError")
    },
    message: {
        input: document.getElementById("message"),
        error: document.getElementById("messageError")
    }
};

function setFieldError(field, message) {
    field.error.textContent = message;

    field.input.classList.toggle("invalid", Boolean(message));

    if (message) {
        field.input.setAttribute("aria-invalid", "true");
    } else {
        field.input.removeAttribute("aria-invalid");
    }
}

function validateName(value) {
    const name = value.trim();

    if (name.length < 2) {
        return "Please enter at least 2 characters.";
    }

    if (name.length > 80) {
        return "Name must be 80 characters or fewer.";
    }

    return "";
}

function validateEmail(value) {
    const email = value.trim();

    if (!email) {
        return "Please enter your email address.";
    }

    if (email.length > 254) {
        return "Email address is too long.";
    }

    // Practical format check for this front-end demonstration.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return "Please enter a valid email address.";
    }

    return "";
}

function validateSubject(value) {
    const subject = value.trim();

    if (subject.length < 3) {
        return "Subject must contain at least 3 characters.";
    }

    if (subject.length > 120) {
        return "Subject must be 120 characters or fewer.";
    }

    return "";
}

function validateMessage(value) {
    const message = value.trim();

    if (message.length < 10) {
        return "Message must contain at least 10 characters.";
    }

    if (message.length > 2000) {
        return "Message must be 2000 characters or fewer.";
    }

    return "";
}

const validators = {
    name: validateName,
    email: validateEmail,
    subject: validateSubject,
    message: validateMessage
};

function validateField(fieldName) {
    const field = fields[fieldName];
    const error = validators[fieldName](field.input.value);

    setFieldError(field, error);

    return !error;
}

// Clear a field's error while the user corrects it.
Object.entries(fields).forEach(([fieldName, field]) => {
    field.input.addEventListener("input", () => {
        validateField(fieldName);

        formStatus.textContent = "";
        formStatus.classList.remove("error");
    });
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formStatus.textContent = "";
    formStatus.classList.remove("error");

    let formIsValid = true;
    let firstInvalidField = null;

    Object.keys(fields).forEach((fieldName) => {
        const isValid = validateField(fieldName);

        if (!isValid) {
            formIsValid = false;

            if (!firstInvalidField) {
                firstInvalidField = fields[fieldName].input;
            }
        }
    });

    if (!formIsValid) {
        formStatus.textContent =
            "Please correct the highlighted fields and try again.";
        formStatus.classList.add("error");

        firstInvalidField.focus();
        return;
    }

    // This is a front-end demonstration only.
    // No email or server request is made.
    formStatus.textContent =
        "Validation successful! This demo does not send messages yet.";

    contactForm.reset();

    Object.values(fields).forEach((field) => {
        setFieldError(field, "");
    });
});
