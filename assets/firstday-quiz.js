class FirstDayQuiz {
  constructor(section: HTMLElement) {
    this.section = section;
    this.currentStep = 1;
    this.answers: Record<string, string> = {};
    this.init();
  }

  init(): void {
    this.bindEvents();
  }

  bindEvents(): void {
    this.section.querySelectorAll("[data-answer]").forEach((button: Element) => {
      button.addEventListener("click", () => {
        const dataQuestion = (button as HTMLElement).dataset.question;
        const dataAnswer = (button as HTMLElement).dataset.answer;
        if (dataQuestion && dataAnswer) {
          this.answers[dataQuestion] = dataAnswer;
          this.nextStep();
        }
      });
    });

    this.section
      .querySelector("[data-submit]")
      ?.addEventListener("click", () => this.finish());
  }

  nextStep(): void {
    const current = this.section.querySelector(`[data-step="${this.currentStep}"]`);
    if (current) {
      current.classList.remove("active");
    }

    this.currentStep++;

    const next = this.section.querySelector(`[data-step="${this.currentStep}"]`);
    if (next) {
      next.classList.add("active");
      this.updateProgress();
    }
  }

  updateProgress(): void {
    const progress = this.section.querySelector("[data-progress]");
    if (progress) {
      progress.innerHTML = `Step ${this.currentStep} of 3`;
    }
  }

  finish(): void {
    const emailElement = this.section.querySelector("[data-email]") as HTMLInputElement;
    const email = emailElement?.value || "";

    const customerProfile = {
      email,
      shopper: this.answers.shopper,
      goal: this.answers.goal,
    };

    // First party data example
    // This payload can later be sent to:
    // - Shopify customer metafields
    // - Klaviyo
    // - Customer events
    console.log("First Party Data", customerProfile);

    localStorage.setItem("firstday_profile", JSON.stringify(customerProfile));
    this.showRecommendation();
  }

  showRecommendation(): void {
    const result = this.section.querySelector("[data-result]");
    const products = this.section.querySelector("[data-products]");

    const recommendation: string[] = [];

    if (this.answers.shopper === "child") {
      recommendation.push("Kids Multi", "Kids Probiotic");
    }

    if (this.answers.goal === "sleep") {
      recommendation.push("Magnesium");
    }

    if (recommendation.length === 0) {
      recommendation.push("Daily Multi");
    }

    if (products) {
      products.innerHTML = recommendation
        .map((product) => `<div class="quiz-product"><h3>${product}</h3><p>Recommended based on your wellness goals.</p></div>`)
        .join("");
    }

    if (result) {
      result.classList.remove("hidden");
    }
  }
}

document.querySelectorAll("[data-firstday-quiz]").forEach((section) => {
  new FirstDayQuiz(section as HTMLElement);
});
