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
      ?.addEventListener("click", () => this.saveEmail());
  }

  nextStep() {
    const current = this.section.querySelector(
      `[data-step="${this.currentStep}"]`,
    );

    current?.classList.remove("active");

    this.currentStep++;

    const next = this.section.querySelector(
      `[data-step="${this.currentStep}"]`,
    );

    if (next) {
      next.classList.add("active");
      this.updateProgress();
    } else {
      this.showRecommendation();
    }
  }

  updateProgress() {
    const progress = this.section.querySelector("[data-progress]");

    if (progress) {
      progress.innerHTML = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
  }

  showRecommendation() {
    this.section
      .querySelectorAll(".firstday-quiz__step")
      .forEach((step) => step.classList.remove("active"));

    const result = this.section.querySelector("[data-result]");
    const products = this.section.querySelector("[data-products]");

    let recommendations = [];

    if (this.answers.shopper === "child") {
      recommendations.push("Kids Multi", "Kids Probiotic");
    }

    if (this.answers.goal === "sleep") {
      recommendations.push("Magnesium");
    }

    if (this.answers.habits === "picky" && this.answers.goal === "nutrition") {
      recommendations.push("Kids Daily Nutrition");
    }

    if (!recommendations.length) {
      recommendations.push("Daily Multi");
    }

    products.innerHTML = recommendations
      .map(
        (product) => `
        <div class="quiz-product">
          <h3>${product}</h3>
          <p>Recommended based on your wellness profile.</p>
        </div>
      `,
      )
      .join("");

    result.classList.remove("hidden");

    result.scrollIntoView({
      behavior: "smooth",
    });
  }

  saveEmail() {
    const email = this.section.querySelector("[data-email]").value;

    if (!email) {
      return;
    }

    const profile = {
      email,
      answers: this.answers,
      createdAt: new Date().toISOString(),
    };

    console.log("First Day Profile", profile);

    localStorage.setItem("firstday_profile", JSON.stringify(profile));

    this.section.querySelector("[data-success]").classList.remove("hidden");
  }
}

document
  .querySelectorAll("[data-firstday-quiz]")
  .forEach((section) => new FirstDayQuiz(section));
