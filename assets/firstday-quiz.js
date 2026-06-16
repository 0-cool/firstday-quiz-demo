class FirstDayQuiz {
  constructor(section) {
    this.section = section;
    this.currentStep = 1;
    this.totalSteps = 5;
    this.answers = {};

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.section.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        this.answers[button.dataset.question] = button.dataset.answer;
        this.nextStep();
      });
    });

    this.section
      .querySelector("[data-email-submit]")
      ?.addEventListener("click", () => this.saveLead());
  }

  nextStep() {
    this.section
      .querySelector(`[data-step="${this.currentStep}"]`)
      ?.classList.remove("active");

    this.currentStep++;

    const next = this.section.querySelector(
      `[data-step="${this.currentStep}"]`,
    );

    if (next) {
      next.classList.add("active");
      this.updateProgress();
    } else {
      this.generateRecommendations();
    }
  }

  updateProgress() {
    const progress = this.section.querySelector("[data-progress]");

    if (progress) {
      progress.innerHTML = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
  }

  generateRecommendations() {
    this.section
      .querySelectorAll(".firstday-quiz__step")
      .forEach((step) => step.classList.remove("active"));

    const result = this.section.querySelector("[data-result]");

    const handles = this.getProducts();

    const container = this.section.querySelector("[data-product-results]");

    container.innerHTML = handles
      .map((handle) => {
        return `
        <div class="quiz-product-placeholder">
          <a href="/products/${handle}">
            View recommendation
          </a>
        </div>
      `;
      })
      .join("");

    result.classList.remove("hidden");

    result.scrollIntoView({
      behavior: "smooth",
    });
  }

  getProducts() {
    const products = [];

    if (this.answers.goal === "nutrition") {
      if (this.answers.shopper === "child") {
        products.push("the-no-junk™-kids-multi");
      }

      if (this.answers.shopper === "teen") {
        products.push("the-no-junk™-teens-multi");
      }
    }

    if (this.answers.goal === "gut") {
      if (this.answers.person === "kids") {
        products.push("kids-3-in-1-pre-post-probiotic");
      }

      if (this.answers.person === "teen") {
        products.push("teens-3-in-1-pre-post-probiotic");
      }

      if (this.answers.person === "women") {
        products.push("womens-3-in-1-pre-post-probiotic");
      }
    }

    if (this.answers.goal === "sleep") {
      if (this.answers.person === "kids") {
        products.push("kids-nighttime-reset-magnesium");
      }

      if (this.answers.person === "teen") {
        products.push("teens-nighttime-reset-magnesium");
      }

      if (this.answers.person === "women") {
        products.push("women-s-nighttime-reset-magnesium");
      }
    }

    if (this.answers.goal === "brain") {
      if (this.answers.person === "kids") {
        products.push("kids-daily-focus-brain-support");
      }

      if (this.answers.person === "teen") {
        products.push("teens-daily-focus-brain-support");
      }

      if (this.answers.person === "women") {
        products.push("womens-daily-focus-brain-support");
      }
    }

    if (!products.length) {
      products.push("the-no-junk™-kids-multi");
    }

    return products;
  }

  saveLead() {
    const email = this.section.querySelector("[data-email]").value;

    if (!email) return;

    const profile = {
      email,
      answers: this.answers,
    };

    localStorage.setItem("firstday_profile", JSON.stringify(profile));

    this.section.querySelector("[data-success]").classList.remove("hidden");
  }
}

document.querySelectorAll("[data-firstday-quiz]").forEach((section) => {
  new FirstDayQuiz(section);
});
