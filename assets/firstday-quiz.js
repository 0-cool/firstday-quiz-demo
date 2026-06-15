class FirstDayQuiz {
  constructor(section) {
    this.section = section;
    this.currentStep = 1;
    this.answers = {};

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.section.querySelectorAll("[data-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.answer;

        this.answers[`step-${this.currentStep}`] = value;

        this.nextStep();
      });
    });

    const submit = this.section.querySelector("[data-submit]");

    submit?.addEventListener("click", () => this.complete());
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

    next?.classList.add("active");
  }

  complete() {
    const email = this.section.querySelector("[data-email]").value;

    const data = {
      email,

      answers: this.answers,

      createdAt: new Date().toISOString(),
    };

    console.log("First party data", data);

    this.section.querySelector("[data-result]").classList.remove("hidden");
  }
}

document.querySelectorAll("[data-firstday-quiz]").forEach((section) => {
  new FirstDayQuiz(section);
});
