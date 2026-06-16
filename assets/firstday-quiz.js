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

    const container = this.section.querySelector("[data-product-results]");

    const products = this.getProducts();

    console.log("Recommendations:", products);
    container.innerHTML = products
      .map((product) => {
        return `
      <div class="quiz-product">

        <h3>${product.title}</h3>

        <a href="${product.url}">
          Shop now
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
    const catalog = {
      kidsMulti: {
        title: "The No Junk™ Kids Multi",
        url: "/products/the-no-junk%E2%84%A2-kids-multi",
      },

      teenMulti: {
        title: "The No Junk™ Teens Multi",
        url: "/products/the-no-junk%E2%84%A2-teens-multi",
      },

      kidsProbiotic: {
        title: "Kids 3-in-1 Pre + Post Probiotic",
        url: "/products/kids-3-in-1-pre-post-probiotic",
      },

      teenProbiotic: {
        title: "Teens 3-in-1 Pre + Post Probiotic",
        url: "/products/teens-3-in-1-pre-post-probiotic",
      },

      kidsSleep: {
        title: "Kids Nighttime Reset Magnesium",
        url: "/products/kids-nighttime-reset-magnesium",
      },

      teenSleep: {
        title: "Teens Nighttime Reset Magnesium",
        url: "/products/teens-nighttime-reset-magnesium",
      },

      kidsBrain: {
        title: "Kids Daily Focus Brain Support",
        url: "/products/kids-daily-focus-brain-support",
      },
    };

    let recommendations = [];

    if (this.answers.goal === "nutrition") {
      if (this.answers.shopper === "child") {
        recommendations.push(catalog.kidsMulti);
      }

      if (this.answers.shopper === "teen") {
        recommendations.push(catalog.teenMulti);
      }
    }

    if (this.answers.goal === "gut") {
      recommendations.push(catalog.kidsProbiotic);
    }

    if (this.answers.goal === "sleep") {
      recommendations.push(catalog.kidsSleep);
    }

    if (this.answers.goal === "brain") {
      recommendations.push(catalog.kidsBrain);
    }

    if (!recommendations.length) {
      recommendations.push(catalog.kidsMulti);
    }

    return recommendations;
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
