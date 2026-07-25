const examData = {
  id: "realtor-2021-32-1st-1st-b",
  title: "2021년 제32회 공인중개사 1차 1교시 B형",
  sections: [
    {
      id: "intro",
      title: "부동산학개론",
      start: 1,
      end: 40,
      answers: {
        1: [4], 2: [3], 3: [4], 4: [5], 5: [3],
        6: [4], 7: [4], 8: [1], 9: [2], 10: [3],
        11: [4], 12: [1], 13: [2], 14: [3], 15: [2],
        16: [5], 17: [4], 18: [3], 19: [1], 20: [3],
        21: [1], 22: [5], 23: [2, 4], 24: [5], 25: [3],
        26: [5], 27: [1], 28: [2], 29: [3], 30: [2],
        31: [4], 32: [2], 33: [5], 34: [1], 35: [1],
        36: [2], 37: [5], 38: [4], 39: [5], 40: [3],
      },
    },
    {
      id: "civil-law",
      title: "민법및민사특별법",
      start: 41,
      end: 80,
      answers: {
        41: [5], 42: [3], 43: [2], 44: [1], 45: [4],
        46: [1], 47: [2], 48: [4], 49: [1], 50: [3],
        51: [2], 52: [5], 53: [2], 54: [3], 55: [4],
        56: [4], 57: [3], 58: [5], 59: [2], 60: [2],
        61: [5], 62: [4], 63: [4], 64: [3], 65: [4],
        66: [4], 67: [1], 68: [5], 69: [5], 70: [4],
        71: [2], 72: [3], 73: [3], 74: [1], 75: [3],
        76: [1, 2, 3, 4, 5], 77: [1], 78: [2], 79: [5], 80: [1],
      },
    },
  ],
};

const STORAGE_KEY = "real-estate-exam-progress-v1";

const state = {
  deferredPrompt: null,
  currentSection: 0,
  showAnswers: false,
  graded: false,
  answers: loadSavedAnswers(),
};

const elements = {
  installButton: document.getElementById("installButton"),
  resetProgressButton: document.getElementById("resetProgressButton"),
  gradeButton: document.getElementById("gradeButton"),
  showAnswersButton: document.getElementById("showAnswersButton"),
  answerSheet: document.getElementById("answerSheet"),
  saveStatus: document.getElementById("saveStatus"),
  progressCount: document.getElementById("progressCount"),
  resultSummary: document.getElementById("resultSummary"),
  resultDetails: document.getElementById("resultDetails"),
  tabButtons: [...document.querySelectorAll(".tab-button")],
};

function loadSavedAnswers() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return typeof saved === "object" && saved ? saved : {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

function saveAnswers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.answers));
  elements.saveStatus.textContent = "진도 자동 저장됨";
}

function countAnswered() {
  return Object.values(state.answers).filter(Boolean).length;
}

function expectedAnswerString(questionNumber) {
  const section = examData.sections.find(
    (item) => questionNumber >= item.start && questionNumber <= item.end
  );
  return section.answers[questionNumber].join(", ");
}

function isCorrect(questionNumber, selected) {
  const section = examData.sections.find(
    (item) => questionNumber >= item.start && questionNumber <= item.end
  );
  return section.answers[questionNumber].includes(Number(selected));
}

function renderProgress() {
  elements.progressCount.textContent = `${countAnswered()} / 80 답안 입력`;
}

function renderAnswerSheet() {
  const section = examData.sections[state.currentSection];
  const wrapper = document.createElement("div");
  wrapper.className = "answer-group";

  const title = document.createElement("h4");
  title.textContent = `${section.title} (${section.start} - ${section.end})`;
  wrapper.appendChild(title);

  const questionGrid = document.createElement("div");
  questionGrid.className = "question-grid";

  for (let question = section.start; question <= section.end; question += 1) {
    const card = document.createElement("div");
    card.className = "question-card";

    const top = document.createElement("div");
    top.className = "question-top";
    top.innerHTML = `
      <span class="question-number">${question}번</span>
      <span class="selected-answer">선택: ${state.answers[question] || "-"}</span>
    `;
    card.appendChild(top);

    const choiceRow = document.createElement("div");
    choiceRow.className = "choice-row";

    for (let choice = 1; choice <= 5; choice += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = String(choice);
      button.dataset.question = String(question);
      button.dataset.choice = String(choice);

      if (Number(state.answers[question]) === choice) {
        button.classList.add("active");
      }

      if (state.graded) {
        const selected = Number(state.answers[question]);
        if (selected === choice && isCorrect(question, selected)) {
          button.classList.add("correct");
        } else if (selected === choice && !isCorrect(question, selected)) {
          button.classList.add("wrong");
        } else if (state.showAnswers && isCorrect(question, choice)) {
          button.classList.add("correct");
        }
      }

      button.addEventListener("click", () => {
        state.answers[question] = choice;
        state.graded = false;
        saveAnswers();
        renderAll();
      });

      choiceRow.appendChild(button);
    }

    card.appendChild(choiceRow);

    if (state.showAnswers) {
      const hint = document.createElement("p");
      hint.className = "result-answer";
      hint.textContent = `정답: ${expectedAnswerString(question)}번`;
      card.appendChild(hint);
    }

    questionGrid.appendChild(card);
  }

  wrapper.appendChild(questionGrid);
  elements.answerSheet.innerHTML = "";
  elements.answerSheet.appendChild(wrapper);
}

function gradeExam() {
  state.graded = true;

  const rows = [];
  let totalCorrect = 0;

  examData.sections.forEach((section) => {
    let sectionCorrect = 0;
    let answered = 0;

    for (let question = section.start; question <= section.end; question += 1) {
      const selected = state.answers[question];
      if (selected) {
        answered += 1;
      }
      if (selected && isCorrect(question, selected)) {
        sectionCorrect += 1;
        totalCorrect += 1;
      }
    }

    rows.push({
      title: section.title,
      sectionCorrect,
      answered,
      total: section.end - section.start + 1,
    });
  });

  elements.resultSummary.innerHTML = `
    <div class="score-line">
      <span>총점</span>
      <strong>${totalCorrect} / 80</strong>
    </div>
    ${rows
      .map(
        (row) => `
        <div class="score-line">
          <span>${row.title}</span>
          <strong>${row.sectionCorrect} / ${row.total}</strong>
        </div>
      `
      )
      .join("")}
  `;

  const wrongItems = [];
  Object.keys(state.answers).forEach((key) => {
    const question = Number(key);
    const selected = state.answers[question];
    if (!selected) {
      return;
    }
    if (!isCorrect(question, selected)) {
      wrongItems.push({
        question,
        selected,
        expected: expectedAnswerString(question),
      });
    }
  });

  elements.resultDetails.innerHTML =
    wrongItems.length === 0
      ? `<div class="result-item correct"><div class="result-item-title"><span>오답 없음</span><span>좋습니다</span></div><div class="result-answer">입력한 답안 기준으로 모두 정답입니다.</div></div>`
      : wrongItems
          .map(
            (item) => `
            <div class="result-item wrong">
              <div class="result-item-title">
                <span>${item.question}번</span>
                <span>오답</span>
              </div>
              <div class="result-answer">선택: ${item.selected}번 / 정답: ${item.expected}번</div>
            </div>
          `
          )
          .join("");
}

function renderResultDefaults() {
  if (!state.graded) {
    elements.resultSummary.textContent = "아직 채점 전입니다. 답안을 입력한 뒤 채점해 보세요.";
    elements.resultSummary.className = "result-summary empty-message";
    elements.resultDetails.innerHTML = "";
    return;
  }

  elements.resultSummary.className = "result-summary";
}

function renderTabs() {
  elements.tabButtons.forEach((button, index) => {
    button.classList.toggle("active", index === state.currentSection);
  });
}

function renderAll() {
  renderProgress();
  renderTabs();
  renderResultDefaults();
  renderAnswerSheet();
  if (state.graded) {
    gradeExam();
  }
}

elements.tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    state.currentSection = index;
    renderAll();
  });
});

elements.gradeButton.addEventListener("click", () => {
  gradeExam();
  renderAnswerSheet();
});

elements.showAnswersButton.addEventListener("click", () => {
  state.showAnswers = !state.showAnswers;
  elements.showAnswersButton.textContent = state.showAnswers ? "정답 숨기기" : "정답 보기";
  renderAnswerSheet();
  if (state.graded) {
    gradeExam();
  }
});

elements.resetProgressButton.addEventListener("click", () => {
  const confirmed = window.confirm("저장된 풀이를 모두 초기화할까요?");
  if (!confirmed) {
    return;
  }
  state.answers = {};
  state.graded = false;
  state.showAnswers = false;
  localStorage.removeItem(STORAGE_KEY);
  elements.showAnswersButton.textContent = "정답 보기";
  elements.saveStatus.textContent = "풀이가 초기화되었습니다";
  renderAll();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.deferredPrompt = event;
  elements.installButton.disabled = false;
  elements.installButton.textContent = "앱처럼 설치";
});

elements.installButton.addEventListener("click", async () => {
  if (!state.deferredPrompt) {
    alert("이 브라우저에서는 바로 설치 버튼이 보이지 않을 수 있습니다. 주소창의 설치 메뉴를 사용해 주세요.");
    return;
  }
  state.deferredPrompt.prompt();
  await state.deferredPrompt.userChoice;
  state.deferredPrompt = null;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error(error);
    });
  });
}

renderAll();
