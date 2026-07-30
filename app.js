const examData = window.CIVIL_LAW_2021;

if (!examData || !Array.isArray(examData.questions)) {
  throw new Error("민법 CBT 문제 데이터를 불러오지 못했습니다.");
}

const QNET_BASE_URL = "https://www.q-net.or.kr/cst003.do";
const STORAGE_KEY = `real-estate-cbt-progress-${examData.id}-v1`;
const CHOICE_LABELS = ["1", "2", "3", "4", "5"];

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

const elements = {
  startButton: document.getElementById("startButton"),
  resetProgressButton: document.getElementById("resetProgressButton"),
  installButton: document.getElementById("installButton"),
  saveStatus: document.getElementById("saveStatus"),
  elapsedTime: document.getElementById("elapsedTime"),
  questionPosition: document.getElementById("questionPosition"),
  progressCount: document.getElementById("progressCount"),
  progressBar: document.getElementById("progressBar"),
  progressTrack: document.querySelector(".progress-track"),
  questionTopic: document.getElementById("questionTopic"),
  sourceQuestion: document.getElementById("sourceQuestion"),
  flagButton: document.getElementById("flagButton"),
  questionPanel: document.querySelector(".question-panel"),
  questionPrompt: document.getElementById("questionPrompt"),
  answerChoices: document.getElementById("answerChoices"),
  answerFeedback: document.getElementById("answerFeedback"),
  previousButton: document.getElementById("previousButton"),
  nextButton: document.getElementById("nextButton"),
  navigatorCount: document.getElementById("navigatorCount"),
  answeredCount: document.getElementById("answeredCount"),
  unansweredCount: document.getElementById("unansweredCount"),
  flaggedCount: document.getElementById("flaggedCount"),
  questionNavigator: document.getElementById("questionNavigator"),
  gradeButton: document.getElementById("gradeButton"),
  results: document.getElementById("results"),
  resultTitle: document.getElementById("resultTitle"),
  resultNavLink: document.getElementById("resultNavLink"),
  resultSummary: document.getElementById("resultSummary"),
  topicResults: document.getElementById("topicResults"),
  reviewCount: document.getElementById("reviewCount"),
  reviewList: document.getElementById("reviewList"),
  retakeButton: document.getElementById("retakeButton"),
  archiveSearch: document.getElementById("archiveSearch"),
  archiveGrid: document.getElementById("archiveGrid"),
  archiveCount: document.getElementById("archiveCount"),
  archiveEmpty: document.getElementById("archiveEmpty"),
};

const storedProgress = loadProgress();
const state = {
  deferredPrompt: null,
  currentIndex: clampIndex(storedProgress.currentIndex),
  answers: normalizeAnswers(storedProgress.answers),
  flagged: new Set(
    Array.isArray(storedProgress.flagged)
      ? storedProgress.flagged.map(Number).filter((number) => findQuestion(number))
      : []
  ),
  submitted: Boolean(storedProgress.submitted),
  started: Boolean(
    storedProgress.started ||
      storedProgress.submitted ||
      Number(storedProgress.elapsedSeconds) > 0 ||
      Object.keys(storedProgress.answers || {}).length > 0
  ),
  elapsedSeconds: Number.isInteger(storedProgress.elapsedSeconds)
    ? Math.max(0, storedProgress.elapsedSeconds)
    : 0,
  runningSince: null,
  lastSavedElapsed: Number.isInteger(storedProgress.elapsedSeconds)
    ? Math.max(0, storedProgress.elapsedSeconds)
    : 0,
};

if (state.started && !state.submitted) {
  state.runningSince = Date.now();
}

function clampIndex(value) {
  const index = Number(value);
  if (!Number.isInteger(index)) {
    return 0;
  }
  return Math.min(Math.max(index, 0), examData.questions.length - 1);
}

function findQuestion(number) {
  return examData.questions.find((question) => question.number === Number(number));
}

function normalizeAnswers(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([number, answer]) => [Number(number), Number(answer)])
      .filter(([number, answer]) => {
        const question = findQuestion(number);
        return (
          question &&
          Number.isInteger(answer) &&
          answer >= 1 &&
          answer <= question.choices.length
        );
      })
  );
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

function saveProgress(message = "진도 자동 저장됨") {
  const payload = {
    currentIndex: state.currentIndex,
    answers: state.answers,
    flagged: [...state.flagged],
    submitted: state.submitted,
    started: state.started,
    elapsedSeconds: getElapsedSeconds(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  state.lastSavedElapsed = payload.elapsedSeconds;
  elements.saveStatus.textContent = message;
}

function currentQuestion() {
  return examData.questions[state.currentIndex];
}

function countAnswered() {
  return examData.questions.filter((question) => state.answers[question.number]).length;
}

function isCorrect(question, selected = state.answers[question.number]) {
  return Boolean(selected) && question.answers.includes(Number(selected));
}

function answerLabel(answers) {
  if (answers.length === 5) {
    return "①~⑤ 모두 정답 인정";
  }
  return answers.map((answer) => `${answer}번`).join(", ");
}

function broadTopic(topic) {
  return topic.split(" - ")[0].trim();
}

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const values = hours > 0 ? [hours, minutes, seconds] : [minutes, seconds];
  return values.map((value) => String(value).padStart(2, "0")).join(":");
}

function getElapsedSeconds() {
  if (!state.runningSince || state.submitted) {
    return state.elapsedSeconds;
  }
  return state.elapsedSeconds + Math.floor((Date.now() - state.runningSince) / 1000);
}

function ensureTimerStarted() {
  state.started = true;
  if (!state.submitted && !state.runningSince) {
    state.runningSince = Date.now();
  }
}

function renderTimer() {
  elements.elapsedTime.textContent = formatDuration(getElapsedSeconds());
}

function renderProgress() {
  const total = examData.questions.length;
  const answered = countAnswered();
  const unanswered = total - answered;
  const percentage = (answered / total) * 100;

  elements.questionPosition.textContent = `민법 ${state.currentIndex + 1} / ${total}`;
  elements.progressCount.textContent = `${answered}문항 응답`;
  elements.progressBar.style.width = `${percentage}%`;
  elements.progressTrack.setAttribute("aria-valuemax", String(total));
  elements.progressTrack.setAttribute("aria-valuenow", String(answered));
  elements.navigatorCount.textContent = `${answered} / ${total}`;
  elements.answeredCount.textContent = String(answered);
  elements.unansweredCount.textContent = String(unanswered);
  elements.flaggedCount.textContent = String(state.flagged.size);
  elements.gradeButton.textContent = state.submitted
    ? "채점 완료"
    : `답안 제출하고 채점 (${answered}/${total})`;
  elements.gradeButton.disabled = state.submitted;
  elements.resultNavLink.setAttribute("href", state.submitted ? "#results" : "#cbt");
  elements.startButton.textContent = state.submitted
    ? "채점 결과 보기"
    : answered > 0 || getElapsedSeconds() > 0
      ? "이어서 풀기"
      : "민법 CBT 시작";
}

function renderQuestion() {
  const question = currentQuestion();
  const selected = state.answers[question.number];
  const isFlagged = state.flagged.has(question.number);

  elements.questionTopic.textContent = question.topic;
  elements.sourceQuestion.textContent = `원문 ${question.number}번`;
  elements.questionPrompt.textContent = question.prompt;
  elements.flagButton.setAttribute("aria-pressed", String(isFlagged));
  elements.flagButton.innerHTML = `<span aria-hidden="true">${isFlagged ? "◆" : "◇"}</span>${isFlagged ? "보류됨" : "보류"}`;
  elements.flagButton.disabled = state.submitted;
  elements.answerChoices.innerHTML = "";

  question.choices.forEach((choiceText, index) => {
    const choiceNumber = index + 1;
    const button = document.createElement("button");
    const marker = document.createElement("span");
    const text = document.createElement("span");
    const selectedChoice = selected === choiceNumber;

    button.type = "button";
    button.className = "answer-choice";
    button.setAttribute("aria-pressed", String(selectedChoice));
    button.setAttribute("aria-label", `${choiceNumber}번 선택지. ${choiceText}`);
    marker.className = "choice-index";
    marker.textContent = CHOICE_LABELS[index];
    text.className = "choice-text";
    text.textContent = choiceText;

    if (selectedChoice) {
      button.classList.add("is-selected");
    }

    if (state.submitted) {
      if (question.answers.includes(choiceNumber)) {
        button.classList.add("is-correct");
      }
      if (selectedChoice && !question.answers.includes(choiceNumber)) {
        button.classList.add("is-wrong");
      }
      button.disabled = true;
    } else {
      button.addEventListener("click", () => selectAnswer(choiceNumber));
    }

    button.append(marker, text);
    elements.answerChoices.appendChild(button);
  });

  renderFeedback(question, selected);

  elements.previousButton.disabled = state.currentIndex === 0;
  const isLastQuestion = state.currentIndex === examData.questions.length - 1;
  elements.nextButton.textContent =
    isLastQuestion && !state.submitted ? "답안 제출" : "다음 문제";
  elements.nextButton.disabled = isLastQuestion && state.submitted;
}

function renderFeedback(question, selected) {
  if (!state.submitted) {
    elements.answerFeedback.hidden = true;
    elements.answerFeedback.className = "answer-feedback";
    elements.answerFeedback.textContent = "";
    return;
  }

  elements.answerFeedback.hidden = false;

  if (!selected) {
    elements.answerFeedback.className = "answer-feedback unanswered";
    elements.answerFeedback.textContent = `미응답 · 공식 정답: ${answerLabel(question.answers)}`;
    return;
  }

  if (isCorrect(question, selected)) {
    elements.answerFeedback.className = "answer-feedback correct";
    elements.answerFeedback.textContent =
      question.answers.length === 5
        ? "정답으로 인정됩니다 · 이 문항은 ①~⑤ 모두 정답 처리되었습니다."
        : `정답입니다 · 공식 정답: ${answerLabel(question.answers)}`;
    return;
  }

  elements.answerFeedback.className = "answer-feedback wrong";
  elements.answerFeedback.textContent = `오답입니다 · 선택: ${selected}번 / 공식 정답: ${answerLabel(question.answers)}`;
}

function renderNavigator() {
  elements.questionNavigator.innerHTML = "";

  examData.questions.forEach((question, index) => {
    const button = document.createElement("button");
    const selected = state.answers[question.number];
    const states = [];

    button.type = "button";
    button.className = "navigator-button";
    button.textContent = String(question.number);

    if (selected) {
      button.classList.add("is-answered");
      if (!state.submitted) {
        states.push("응답");
      }
    } else if (!state.submitted) {
      states.push("미응답");
    }

    if (state.flagged.has(question.number)) {
      button.classList.add("is-flagged");
      states.push("보류");
    }

    if (state.submitted) {
      button.classList.add(isCorrect(question, selected) ? "is-correct" : "is-wrong");
      states.push(isCorrect(question, selected) ? "정답" : selected ? "오답" : "미응답");
    }

    if (index === state.currentIndex) {
      button.classList.add("is-current");
      button.setAttribute("aria-current", "step");
      states.push("현재 문제");
    }

    button.setAttribute("aria-label", `${question.number}번, ${states.join(", ")}`);
    button.addEventListener("click", () => navigateTo(index, true));
    elements.questionNavigator.appendChild(button);
  });
}

function renderResults() {
  elements.results.hidden = !state.submitted;
  if (!state.submitted) {
    return;
  }

  const total = examData.questions.length;
  const answered = countAnswered();
  const correct = examData.questions.filter((question) => isCorrect(question)).length;
  const wrong = answered - correct;
  const unanswered = total - answered;
  const convertedScore = correct * 2.5;

  elements.resultSummary.innerHTML = `
    <div class="score-card primary">
      <span>민법 환산점수</span>
      <strong>${convertedScore}점</strong>
      <small>${correct} / ${total} 정답</small>
    </div>
    <div class="score-card">
      <span>정답</span>
      <strong>${correct}</strong>
      <small>${Math.round((correct / total) * 100)}% 정답률</small>
    </div>
    <div class="score-card">
      <span>오답 · 미응답</span>
      <strong>${wrong} · ${unanswered}</strong>
      <small>다시 볼 문제 ${wrong + unanswered}개</small>
    </div>
    <div class="score-card">
      <span>풀이 시간</span>
      <strong>${formatDuration(getElapsedSeconds())}</strong>
      <small>권장 ${examData.recommendedMinutes}분</small>
    </div>
  `;

  renderTopicResults();
  renderReviewList();
}

function renderTopicResults() {
  const topics = new Map();

  examData.questions.forEach((question) => {
    const label = broadTopic(question.topic);
    const current = topics.get(label) || { correct: 0, total: 0 };
    current.total += 1;
    current.correct += isCorrect(question) ? 1 : 0;
    topics.set(label, current);
  });

  elements.topicResults.innerHTML = "";
  topics.forEach((score, label) => {
    const row = document.createElement("div");
    const title = document.createElement("span");
    const bar = document.createElement("div");
    const fill = document.createElement("i");
    const value = document.createElement("strong");

    row.className = "topic-row";
    title.textContent = label;
    bar.className = "topic-bar";
    fill.style.width = `${(score.correct / score.total) * 100}%`;
    value.textContent = `${score.correct} / ${score.total}`;
    bar.appendChild(fill);
    row.append(title, bar, value);
    elements.topicResults.appendChild(row);
  });
}

function renderReviewList() {
  const reviewQuestions = examData.questions.filter(
    (question) => !isCorrect(question, state.answers[question.number])
  );

  elements.reviewCount.textContent = `${reviewQuestions.length}문항`;
  elements.reviewList.innerHTML = "";

  if (reviewQuestions.length === 0) {
    const message = document.createElement("div");
    message.className = "review-empty";
    message.textContent = "모든 문항을 맞혔습니다. 다시 볼 오답이 없습니다.";
    elements.reviewList.appendChild(message);
    return;
  }

  reviewQuestions.forEach((question) => {
    const index = examData.questions.indexOf(question);
    const selected = state.answers[question.number];
    const button = document.createElement("button");
    const number = document.createElement("span");
    const topic = document.createElement("span");
    const status = document.createElement("span");

    button.type = "button";
    button.className = "review-item";
    number.className = "review-number";
    number.textContent = `${question.number}번`;
    topic.className = "review-topic";
    topic.textContent = question.topic;
    status.className = "review-status";
    status.textContent = selected ? "오답" : "미응답";
    button.append(number, topic, status);
    button.addEventListener("click", () => navigateTo(index, true));
    elements.reviewList.appendChild(button);
  });
}

function renderAll() {
  renderTimer();
  renderProgress();
  renderQuestion();
  renderNavigator();
  renderResults();
}

function selectAnswer(choiceNumber) {
  if (state.submitted) {
    return;
  }
  const restoreChoiceFocus = document.activeElement?.classList.contains("answer-choice");
  ensureTimerStarted();
  state.answers[currentQuestion().number] = choiceNumber;
  saveProgress();
  renderProgress();
  renderQuestion();
  renderNavigator();
  if (restoreChoiceFocus) {
    elements.answerChoices
      .querySelector('[aria-pressed="true"]')
      ?.focus({ preventScroll: true });
  }
}

function navigateTo(index, focusQuestion = false) {
  ensureTimerStarted();
  state.currentIndex = clampIndex(index);
  saveProgress();
  renderProgress();
  renderQuestion();
  renderNavigator();

  if (focusQuestion) {
    document.getElementById("cbt").scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => elements.questionPrompt.focus({ preventScroll: true }), 250);
  }
}

function toggleFlag() {
  if (state.submitted) {
    return;
  }

  ensureTimerStarted();
  const number = currentQuestion().number;
  if (state.flagged.has(number)) {
    state.flagged.delete(number);
  } else {
    state.flagged.add(number);
  }

  saveProgress();
  renderProgress();
  renderQuestion();
  renderNavigator();
}

function submitExam() {
  if (state.submitted) {
    return;
  }

  const unanswered = examData.questions.length - countAnswered();
  const message =
    unanswered > 0
      ? `아직 ${unanswered}문항이 미응답입니다. 그대로 제출하고 채점할까요?`
      : "답안을 제출하면 더 이상 수정할 수 없습니다. 채점할까요?";

  if (!window.confirm(message)) {
    return;
  }

  state.elapsedSeconds = getElapsedSeconds();
  state.runningSince = null;
  state.submitted = true;
  saveProgress("채점 결과 저장됨");
  renderAll();
  elements.results.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => elements.resultTitle.focus({ preventScroll: true }), 250);
}

function resetExam() {
  if (!window.confirm("저장된 답안과 풀이 시간을 모두 지우고 새로 풀까요?")) {
    return;
  }

  state.currentIndex = 0;
  state.answers = {};
  state.flagged = new Set();
  state.submitted = false;
  state.started = false;
  state.elapsedSeconds = 0;
  state.runningSince = null;
  state.lastSavedElapsed = 0;
  localStorage.removeItem(STORAGE_KEY);
  elements.saveStatus.textContent = "새 풀이를 시작합니다";
  renderAll();
  document.getElementById("cbt").scrollIntoView({ behavior: "smooth", block: "start" });
}

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
      const cbtLink = exam.interactive
        ? `<a class="primary-button" href="#cbt">민법 CBT 풀기</a>`
        : "";
      const localQuestion = exam.localQuestion
        ? `<a class="ghost-button" href="${exam.localQuestion}" target="_blank" rel="noreferrer">원문 대조</a>`
        : "";

      return `
        <article class="panel library-card">
          <div class="panel-head">
            <div>
              <span class="archive-year">${exam.year}</span>
              <h3>${title}</h3>
            </div>
            <span class="chip">${exam.interactive ? "CBT 지원" : "원문 자료"}</span>
          </div>
          <p>${
            exam.interactive
              ? "민법 40문항을 PDF 없이 앱에서 바로 풀고 채점할 수 있습니다."
              : "Q-Net 공식 문제지와 최종정답으로 연결됩니다."
          }</p>
          <div class="card-actions">
            ${cbtLink}
            <a
              class="${exam.interactive ? "secondary-button" : "primary-button"}"
              href="${qnetArticleUrl(exam.questionId, "cst00309")}"
              target="_blank"
              rel="noreferrer"
            >공식 문제지</a>
            <a
              class="secondary-button"
              href="${qnetArticleUrl(exam.answerId, "cst00310")}"
              target="_blank"
              rel="noreferrer"
            >최종정답</a>
            ${localQuestion}
          </div>
        </article>
      `;
    })
    .join("");
}

elements.startButton.addEventListener("click", () => {
  if (state.submitted) {
    elements.results.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => elements.resultTitle.focus({ preventScroll: true }), 250);
    return;
  }
  ensureTimerStarted();
  saveProgress("풀이 시작 · 진도 자동 저장");
  document.getElementById("cbt").scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => elements.questionPrompt.focus({ preventScroll: true }), 250);
});

elements.resetProgressButton.addEventListener("click", resetExam);
elements.retakeButton.addEventListener("click", resetExam);
elements.flagButton.addEventListener("click", toggleFlag);
elements.previousButton.addEventListener("click", () => {
  if (state.currentIndex > 0) {
    navigateTo(state.currentIndex - 1);
    elements.questionPrompt.focus({ preventScroll: true });
  }
});
elements.nextButton.addEventListener("click", () => {
  if (state.currentIndex === examData.questions.length - 1) {
    if (!state.submitted) {
      submitExam();
    }
    return;
  }
  navigateTo(state.currentIndex + 1);
  elements.questionPrompt.focus({ preventScroll: true });
});
elements.gradeButton.addEventListener("click", submitExam);
elements.archiveSearch.addEventListener("input", renderArchive);
elements.resultNavLink.addEventListener("click", (event) => {
  event.preventDefault();
  const target = state.submitted ? elements.results : document.getElementById("cbt");
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(
    () =>
      (state.submitted ? elements.resultTitle : elements.questionPrompt).focus({
        preventScroll: true,
      }),
    250
  );
});

document.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;
  const isInteractive = activeElement?.closest(
    "input, textarea, select, button, a, [contenteditable='true']"
  );
  const isAnswerChoice = activeElement?.classList.contains("answer-choice");
  if (
    !activeElement ||
    !elements.questionPanel.contains(activeElement) ||
    (isInteractive && !isAnswerChoice)
  ) {
    return;
  }

  if (!state.submitted && /^[1-5]$/.test(event.key)) {
    event.preventDefault();
    selectAnswer(Number(event.key));
    return;
  }

  if (event.key === "ArrowLeft" && state.currentIndex > 0) {
    event.preventDefault();
    navigateTo(state.currentIndex - 1);
    elements.questionPrompt.focus({ preventScroll: true });
    return;
  }

  if (event.key === "ArrowRight" && state.currentIndex < examData.questions.length - 1) {
    event.preventDefault();
    navigateTo(state.currentIndex + 1);
    elements.questionPrompt.focus({ preventScroll: true });
    return;
  }

  if (!state.submitted && event.key.toLowerCase() === "f") {
    event.preventDefault();
    toggleFlag();
    elements.questionPrompt.focus({ preventScroll: true });
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.deferredPrompt = event;
});

elements.installButton.addEventListener("click", async () => {
  if (!state.deferredPrompt) {
    window.alert("브라우저 주소창이나 메뉴의 '앱 설치' 기능을 이용해 주세요.");
    return;
  }

  state.deferredPrompt.prompt();
  await state.deferredPrompt.userChoice;
  state.deferredPrompt = null;
});

window.setInterval(() => {
  if (!state.started || state.submitted) {
    return;
  }
  const elapsed = getElapsedSeconds();
  renderTimer();
  if (elapsed - state.lastSavedElapsed >= 15) {
    saveProgress();
  }
}, 1000);

window.addEventListener("pagehide", () => saveProgress());

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error(error);
    });
  });
}

elements.saveStatus.textContent =
  Object.keys(state.answers).length > 0 || getElapsedSeconds() > 0
    ? state.submitted
      ? "채점 결과 불러옴"
      : "저장된 진도 불러옴"
    : "진도 자동 저장";

renderArchive();
renderAll();
