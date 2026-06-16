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
      this.showResults();
    }
  }

  updateProgress() {
    const progress = this.section.querySelector("[data-progress]");

    if (progress) {
      progress.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
  }

  showResults() {
    this.section
      .querySelectorAll(".firstday-quiz__step")
      .forEach((step) => step.classList.remove("active"));

    const result = this.section.querySelector("[data-result]");

    const container = this.section.querySelector("[data-product-results]");

    const handles = this.getRecommendations();

    const products = this.section.querySelectorAll("[data-product]");

    container.innerHTML = "";

    products.forEach((product) => {
      if (handles.includes(product.dataset.handle)) {
        container.appendChild(product.cloneNode(true));
      }
    });

    const progress = this.section.querySelector("[data-progress]");

    if (progress) {
      progress.textContent = "Your personalized routine is ready ✨";
    }

    result.classList.remove("hidden");

    result.scrollIntoView({
      behavior: "smooth",
    });
  }

  getRecommendations() {
    const products = [];

    const shopper = this.answers.shopper;
    const goal = this.answers.goal;
    const person = this.answers.person;

    if (goal === "nutrition") {
      if (shopper === "child") {
        products.push("the-no-junk™-kids-multi");
      }

      if (shopper === "teen") {
        products.push("the-no-junk™-teens-multi");
      }
    }

    if (goal === "gut") {
      if (person === "kids") {
        products.push("kids-3-in-1-pre-post-probiotic");
      }

      if (person === "teen") {
        products.push("teens-3-in-1-pre-post-probiotic");
      }

      if (person === "women") {
        products.push("womens-3-in-1-pre-post-probiotic");
      }
    }

    if (goal === "sleep") {
      if (person === "kids") {
        products.push("kids-nighttime-reset-magnesium");
      }

      if (person === "teen") {
        products.push("teens-nighttime-reset-magnesium");
      }

      if (person === "women") {
        products.push("women-s-nighttime-reset-magnesium");
      }
    }

    if (goal === "brain") {
      if (person === "kids") {
        products.push("kids-daily-focus-brain-support");
      }

      if (person === "teen") {
        products.push("teens-daily-focus-brain-support");
      }

      if (person === "women") {
        products.push("womens-daily-focus-brain-support");
      }
    }

    if (!products.length) {
      products.push(
        "the-no-junk™-kids-multi",
        "kids-3-in-1-pre-post-probiotic",
      );
    }

    return products;
  }

  saveLead() {
    const email = this.section.querySelector("[data-email]").value;

    if (!email) return;

    localStorage.setItem(
      "firstday_profile",
      JSON.stringify({
        email,
        answers: this.answers,
      }),
    );

    this.section.querySelector("[data-success]").classList.remove("hidden");
  }
}

document.querySelectorAll("[data-firstday-quiz]").forEach((section) => {
  new FirstDayQuiz(section);
});
