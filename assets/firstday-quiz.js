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
    const answerButtons = this.section.querySelectorAll("[data-answer]");

    answerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const question = button.dataset.question;
        const answer = button.dataset.answer;

        if (!question || !answer) return;

        this.answers[question] = answer;
        this.nextStep();
      });
    });

    const emailSubmit = this.section.querySelector("[data-email-submit]");

    emailSubmit?.addEventListener("click", () => this.saveLead());
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
    const steps = this.section.querySelectorAll(".firstday-quiz__step");

    steps.forEach((step) => step.classList.remove("active"));

    const result = this.section.querySelector("[data-result]");
    const container = this.section.querySelector("[data-product-results]");

    if (!result || !container) return;

    const handles = this.getRecommendations();
    const products = this.section.querySelectorAll("[data-product]");

    container.innerHTML = "";

    products.forEach((product) => {
      const handle = product.dataset.handle;
      if (handle && handles.includes(handle)) {
        container.appendChild(product.cloneNode(true));
      }
    });

    const progress = this.section.querySelector("[data-progress]");
    if (progress)
      progress.textContent = "Your personalized routine is ready ✨";

    const firstdayQuizBadge = this.section.querySelector(
      "div.firstday-quiz__badge",
    );
    if (firstdayQuizBadge) firstdayQuizBadge.style.display = "none";

    const firstdayQuizDescription = this.section.querySelector(
      "p.firstday-quiz__description",
    );
    if (firstdayQuizDescription) firstdayQuizDescription.style.display = "none";

    result.classList.remove("hidden");

    result.scrollIntoView({
      behavior: "smooth",
    });
  }

  /**
   * Recommendation logic:
   *
   * This prototype uses product handles as the source of truth because the scope
   * of this assignment is focused on demonstrating the customer journey,
   * personalization flow, and product matching experience.
   *
   * In a production environment with a larger catalog, this logic should be
   * migrated to a more scalable approach using Shopify product tags, metafields,
   * or product attributes. This would allow the merchandising team to update
   * recommendations directly from Shopify Admin without requiring code changes.
   *
   * Example:
   * - Customer answers: child + sleep
   * - Query products tagged with:
   *   audience:kids
   *   benefit:sleep
   *
   * This would make the recommendation engine dynamic and easier to maintain
   * as the product catalog grows.
   */

  getRecommendations() {
    const products = [];

    const shopper = this.answers.shopper;
    const goal = this.answers.goal;
    const person = this.answers.person;

    if (goal === "nutrition") {
      if (shopper === "child") {
        products.push(
          "the-no-junk™-kids-multi",
          "kids-3-in-1-pre-post-probiotic",
        );
      }

      if (shopper === "teen") {
        products.push(
          "the-no-junk™-teens-multi",
          "teens-3-in-1-pre-post-probiotic",
        );
      }

      if (shopper === "family") {
        products.push("the-no-junk™-kids-multi", "the-no-junk™-teens-multi");
      }

      if (shopper === "myself") {
        products.push("womens-3-in-1-pre-post-probiotic");
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

    return [...new Set(products)];
  }

  saveLead() {
    const emailInput = this.section.querySelector("[data-email]");
    const email = emailInput?.value ?? "";

    if (!email) return;

    localStorage.setItem(
      "firstday_profile",
      JSON.stringify({
        email,
        answers: this.answers,
      }),
    );

    const success = this.section.querySelector("[data-success]");
    success?.classList.remove("hidden");
  }
}

document.querySelectorAll("[data-firstday-quiz]").forEach((section) => {
  new FirstDayQuiz(section);
});
