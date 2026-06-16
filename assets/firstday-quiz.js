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
      .classList.remove("active");

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
    this.section.querySelector("[data-progress]").innerHTML =
      `Step ${this.currentStep} of ${this.totalSteps}`;
  }

  generateRecommendations() {
    const result = this.section.querySelector("[data-result]");

    const products = this.section.querySelector("[data-products]");

    let handles = [];

    if (this.answers.goal === "nutrition") {
      if (this.answers.shopper === "child") {
        handles.push("the-no-junk™-kids-multi");
      }

      if (this.answers.shopper === "teen") {
        handles.push("the-no-junk™-teens-multi");
      }
    }

    if (this.answers.goal === "gut") {
      if (this.answers.person === "kids") {
        handles.push("kids-3-in-1-pre-post-probiotic");
      }

      if (this.answers.person === "teen") {
        handles.push("teens-3-in-1-pre-post-probiotic");
      }

      if (this.answers.person === "women") {
        handles.push("womens-3-in-1-pre-post-probiotic");
      }
    }

    if (this.answers.goal === "sleep") {
      if (this.answers.person === "kids") {
        handles.push("kids-nighttime-reset-magnesium");
      }

      if (this.answers.person === "teen") {
        handles.push("teens-nighttime-reset-magnesium");
      }

      if (this.answers.person === "women") {
        handles.push("women-s-nighttime-reset-magnesium");
      }
    }

    if (this.answers.goal === "brain") {
      if (this.answers.person === "kids") {
        handles.push("kids-daily-focus-brain-support");
      }

      if (this.answers.person === "teen") {
        handles.push("teens-daily-focus-brain-support");
      }

      if (this.answers.person === "women") {
        handles.push("womens-daily-focus-brain-support");
      }
    }

    if (!handles.length) {
      handles.push("the-no-junk™-kids-multi");
    }

    products.innerHTML = handles
      .map((handle) => {
        return `

<product-card
data-product-handle="${handle}">
</product-card>

`;
      })
      .join("");

    result.classList.remove("hidden");

    window.dispatchEvent(
      new CustomEvent("firstday:recommendations", {
        detail: {
          handles,
        },
      }),
    );
  }

  saveLead() {
    const profile = {
      email: this.section.querySelector("[data-email]").value,

      answers: this.answers,
    };

    console.log("First Party Data", profile);

    localStorage.setItem("firstday_profile", JSON.stringify(profile));

    this.section.querySelector("[data-success]").classList.remove("hidden");
  }
}

document.querySelectorAll("[data-firstday-quiz]").forEach((section) => {
  new FirstDayQuiz(section);
});
