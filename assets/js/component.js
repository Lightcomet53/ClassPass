// Handle Select Components
document.querySelectorAll(".select-wrapper").forEach((select) => {
  const selectedValue = select.querySelector(".selected-value");
  const optionsList = select.querySelector(".options-list");
  const options = select.querySelectorAll(".option");
  const formField = select.closest(".form-field");

  // Toggle options list
  select.addEventListener("click", (e) => {
    e.stopPropagation();
    select.classList.toggle("open");
    optionsList.classList.toggle("show");
  });

  // Handle option selection
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedValue.textContent = option.textContent;
      formField.classList.add("has-value");
      select.classList.remove("open");
      optionsList.classList.remove("show");
    });
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    select.classList.remove("open");
    optionsList.classList.remove("show");
  });

  // Handle keyboard navigation
  select.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select.click();
    }
  });
});

// Handle Input Components
document.querySelectorAll("input").forEach((input) => {
  const formField = input.closest(".form-field");

  if (formField) {
    input.addEventListener("input", () => {
      if (input.value) {
        formField.classList.add("has-value");
      } else {
        formField.classList.remove("has-value");
      }
    });

    input.addEventListener("focus", () => {
      formField.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      formField.classList.remove("focused");
    });
  }
});

// Handle Input Components
document.querySelectorAll(".text-field input").forEach((input) => {
  const textField = input.closest(".text-field");

  // Initial state check
  if (input.value) {
    textField.classList.add("has-value");
  }

  // Handle input changes
  input.addEventListener("input", () => {
    if (input.value) {
      textField.classList.add("has-value");
    } else {
      textField.classList.remove("has-value");
    }
  });

  // Handle focus
  input.addEventListener("focus", () => {
    textField.classList.add("focused");
  });

  // Handle blur
  input.addEventListener("blur", () => {
    textField.classList.remove("focused");
  });
});

// Handle password visibility toggle
document
  .querySelectorAll(".with-end-adornment .end-adornment")
  .forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const input = toggle.previousElementSibling;
      const type = input.getAttribute("type");
      input.setAttribute("type", type === "password" ? "text" : "password");
    });
  });

// -------------------- Handle checkbox components --------------------

// Add ripple effect on click (optional)
document.querySelectorAll(".checkbox-field").forEach((field) => {
  field.addEventListener("click", function (e) {
    const checkmark = this.querySelector(".checkmark");
    const ripple = document.createElement("div");
    ripple.classList.add("ripple");
    checkmark.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});
