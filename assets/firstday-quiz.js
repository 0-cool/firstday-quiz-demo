/**
 * @typedef {{
 *   goal?: string,
 *   shopper?: string,
 *   [key: string]: string | undefined,
 * }} FirstDayQuizAnswers
 */

class FirstDayQuiz {
  /**
   * @param {HTMLElement} section
   */
  constructor(section) {
    /** @type {HTMLElement} */
    this.section = section;
    this.currentStep = 1;
    this.totalSteps = 5;
    /** @type {FirstDayQuizAnswers} */
    this.answers = {};
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const answerButtons = /** @type {NodeListOf<HTMLElement>} */ (
      this.section.querySelectorAll("[data-answer]")
    );

    answerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const question = button.dataset.question;
        const answer = button.dataset.answer;

        if (!question || !answer) return;

        this.answers[question] = answer;
        this.nextStep();
      });
    });

    const emailSubmit = /** @type {HTMLElement | null} */ (
      this.section.querySelector("[data-email-submit]")
    );

    emailSubmit?.addEventListener("click", () => this.saveLead());
  }

  nextStep() {
    this.section
      .querySelector(`[data-step="${this.currentStep}"]`)
      ?.classList.remove("active");

    this.currentStep++;

    const next = /** @type {HTMLElement | null} */ (
      this.section.querySelector(`[data-step="${this.currentStep}"]`)
    );

    if (next) {
      next.classList.add("active");
      this.updateProgress();
    } else {
      this.showResults();
    }
  }

  updateProgress() {
    const progress = /** @type {HTMLElement | null} */ (
      this.section.querySelector("[data-progress]")
    );

    if (progress) {
      progress.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
  }

  showResults() {
    const steps = /** @type {NodeListOf<HTMLElement>} */ (
      this.section.querySelectorAll(".firstday-quiz__step")
    );

    steps.forEach((step) => step.classList.remove("active"));

    const result = /** @type {HTMLElement | null} */ (
      this.section.querySelector("[data-result]")
    );

    const container = /** @type {HTMLElement | null} */ (
      this.section.querySelector("[data-product-results]")
    );

    if (!result || !container) return;

    const handles = this.getRecommendations();

    const products = /** @type {NodeListOf<HTMLElement>} */ (
      this.section.querySelectorAll("[data-product]")
    );

    container.innerHTML = "";

    products.forEach((product) => {
      const handle = product.dataset.handle;
      if (handle && handles.includes(handle)) {
        container.appendChild(product.cloneNode(true));
      }
    });

    const progress = /** @type {HTMLElement | null} */ (
      this.section.querySelector("[data-progress]")
    );
    if (progress)
      progress.textContent = "Your personalized routine is ready ✨";

    const firstday_quiz__badge = /** @type {HTMLElement | null} */ (
      this.section.querySelector("div.firstday-quiz__badge")
    );
    if (firstday_quiz__badge) firstday_quiz__badge.style.display = "none";

    result.classList.remove("hidden");

    result.scrollIntoView({
      behavior: "smooth",
    });
  }

  getRecommendations() {
    /** @type {string[]} */
    const products = [];

    if (this.answers.goal === "nutrition") {
      products.push(
        this.answers.shopper === "teen"
          ? "the-no-junk™-teens-multi"
          : "the-no-junk™-kids-multi",
      );
    }

    if (this.answers.goal === "gut") {
      products.push("kids-3-in-1-pre-post-probiotic");
    }

    if (this.answers.goal === "sleep") {
      products.push("kids-nighttime-reset-magnesium");
    }

    if (this.answers.goal === "brain") {
      products.push("kids-daily-focus-brain-support");
    }

    if (!products.length) {
      products.push("the-no-junk™-kids-multi");
    }

    return products;
  }

  saveLead() {
    const emailInput = /** @type {HTMLInputElement | null} */ (
      this.section.querySelector("[data-email]")
    );
    const email = emailInput?.value ?? "";

    if (!email) return;

    localStorage.setItem(
      "firstday_profile",
      JSON.stringify({
        email,
        answers: this.answers,
      }),
    );

    const success = /** @type {HTMLElement | null} */ (
      this.section.querySelector("[data-success]")
    );
    success?.classList.remove("hidden");
  }
}

document.querySelectorAll("[data-firstday-quiz]").forEach((section) => {
  new FirstDayQuiz(/** @type {HTMLElement} */ (section));
});
