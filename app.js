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

const QNET_BASE_URL = "https://www.q-net.or.kr/cst003.do";

const examArchive = [
  { year: 2025, round: 36, questionId: 5247125, answerId: 5249925 },
  { year: 2024, round: 35, questionId: 5214724, answerId: 5218527, localAnswer: "./public/pdfs/2024-answer.pdf" },
  { year: 2023, round: 34, questionId: 5212459, answerId: 5212816 },
  { year: 2022, round: 33, questionId: 5211107, answerId: 5211208 },
  {
    year: 2021,
    round: 32,
    questionId: 5209170,
    answerId: 5209538,
    localQuestion: "./public/pdfs/2021-question.pdf",
    localAnswer: "./public/pdfs/2021-answer.pdf",
    interactive: true,
  },
  { year: 2020, round: 31, questionId: 5207817, answerId: 5207915 },
  { year: 2019, round: 30, questionId: 5206273, answerId: 5206494 },
  { year: 2018, round: 29, questionId: 5204010, answerId: 5204546 },
  { year: 2017, round: 28, questionId: 5202172, answerId: 5202400 },
  { year: 2016, round: 27, questionId: 5198028, answerId: 5199003 },
  { year: 2015, round: 26, questionId: 5153804, answerId: 5162623 },
  { year: 2014, round: 25, questionId: 5112604, answerId: 5116202 },
  { year: 2013, round: 24, questionId: 5081403, answerId: 5085400 },
  { year: 2012, round: 23, questionId: 5057600, answerId: 5060264 },
  { year: 2011, round: 22, questionId: 5043379, answerId: 5044801 },
  { year: 2010, round: 21, questionId: 5026583, answerId: 5027388 },
  { year: 2009, round: 20, questionId: 5013975, answerId: 5013976 },
  { year: 2008, round: 19, questionId: 5007797, answerId: 5008471 },
  { year: 2007, round: 18, questionId: 5007796, answerId: 5008470 },
  { year: 2006, round: 17, questionId: 5007795, answerId: 5008469 },
  { year: 2005, round: 16, questionId: 5007794, answerId: 5008468 },
  { year: 2005, round: 15, questionId: 5007793, answerId: 5008467, extra: true },
];

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
  archiveSearch: document.getElementById("archiveSearch"),
  archiveGrid: document.getElementById("archiveGrid"),
  archiveCount: document.getElementById("archiveCount"),
  archiveEmpty: document.getElementById("archiveEmpty"),
  tabButtons: [...document.querySelectorAll(".tab-button")],
};

function qnetArticleUrl(articleId, menuType) {
  const params = new URLSearchParams({
    artlSeq: String(articleId),
    boardId: "Q004",
    gId: "08",
    gSite: "L",
    id: "cst00302",
    menuType,
  });
  return `${QNET_BASE_URL}?${params.toString()}`;
}

function renderArchive() {
  const query = elements.archiveSearch.value.trim().toLowerCase().replace(/\s+/g, "");
  const filtered = examArchive.filter((exam) => {
    const extraLabel = exam.extra ? "추가시험" : "";
    const haystack = `${exam.year}년 제${exam.round}회 ${exam.round}회 ${extraLabel}`
      .toLowerCase()
      .replace(/\s+/g, "");
    return haystack.includes(query);
  });

  elements.archiveCount.textContent = `${filtered.length}개 시험세트`;
  elements.archiveEmpty.hidden = filtered.length > 0;
  elements.archiveGrid.innerHTML = filtered
    .map((exam) => {
      const title = `${exam.year}년 제${exam.round}회${exam.extra ? " 추가시험" : ""}`;
      const localLinks = [
        exam.interactive
          ? `<a class="secondary-button" href="#solve">앱에서 풀기</a>`
          : "",
        exam.localQuestion
          ? `<a class="secondary-button" href="${exam.localQuestion}" target="_blank" rel="noreferrer">보관 문제 PDF</a>`
          : "",
        exam.localAnswer
          ? `<a class="secondary-button" href="${exam.localAnswer}" target="_blank" rel="noreferrer">보관 정답 PDF</a>`
          : "",
      ]
        .filter(Boolean)
        .join("");

      return `
        <article class="panel library-card">
          <div class="panel-head">
            <div>
              <span class="archive-year">${exam.year}</span>
              <h3>${title}</h3>
            </div>
            <span class="chip">${exam.interactive ? "즉시 채점" : "Q-Net 원문"}</span>
          </div>
          <p>공인중개사 자격시험 문제지와 최종정답을 공식 자료실에서 확인할 수 있습니다.</p>
          <div class="card-actions">
            <a
              class="primary-button"
              href="${qnetArticleUrl(exam.questionId, "cst00309")}"
              target="_blank"
              rel="noreferrer"
            >공식 문제지</a>
            <a
              class="ghost-button"
              href="${qnetArticleUrl(exam.answerId, "cst00310")}"
              target="_blank"
              rel="noreferrer"
            >공식 최종정답</a>
            ${localLinks}
          </div>
        </article>
      `;
    })
    .join("");
}

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

elements.archiveSearch.addEventListener("input", renderArchive);

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

renderArchive();
renderAll();
