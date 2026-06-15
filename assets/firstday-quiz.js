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
        this.answers[button.dataset.question] = button.dataset.answer;

        this.nextStep();
      });
    });

    this.section
      .querySelector("[data-submit]")
      ?.addEventListener("click", () => this.finish());
  }

  nextStep() {
    const current = this.section.querySelector(
      `[data-step="${this.currentStep}"]`,
    );

    current.classList.remove("active");

    this.currentStep++;

    const next = this.section.querySelector(
      `[data-step="${this.currentStep}"]`,
    );

    if (next) {
      next.classList.add("active");
    } else {
      this.showRecommendation();
    }
  }

  updateProgress() {
    const progress = this.section.querySelector("[data-progress]");

    progress.innerHTML = `Step ${this.currentStep} of 5`;
  }

  finish() {
    const email = this.section.querySelector("[data-email]").value;

    const customerProfile = {
      email,

      shopper: this.answers.shopper,

      goal: this.answers.goal,
    };

    /*
 First party data example

 This payload can later be sent to:
 - Shopify customer metafields
 - Klaviyo
 - Customer events
*/

    console.log("First Party Data", customerProfile);

    localStorage.setItem(
      "firstday_profile",

      JSON.stringify(customerProfile),
    );

    this.showRecommendation();
  }

  showRecommendation() {
    const result = this.section.querySelector("[data-result]");

    const products = this.section.querySelector("[data-products]");

    let recommendation = [];

    if (this.answers.shopper === "child") {
      recommendation.push("Kids Multi", "Kids Probiotic");
    }

    if (this.answers.goal === "sleep") {
      recommendation.push("Magnesium");
    }

    if (recommendation.length === 0) {
      recommendation.push("Daily Multi");
    }

    products.innerHTML = recommendation
      .map((product) => {
        return `

<div class="quiz-product">

<h3>
${product}
</h3>


<p>
Recommended based on your wellness goals.
</p>


</div>

`;
      })
      .join("");

    result.classList.remove("hidden");
  }
}

document.querySelectorAll("[data-firstday-quiz]").forEach((section) => {
  new FirstDayQuiz(section);
});
