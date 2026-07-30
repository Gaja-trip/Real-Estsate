const fs = require("fs");
const path = require("path");

global.window = {};

const examSpecs = [
  { slug: "2005-extra", globalName: "CIVIL_LAW_2005_EXTRA", year: 2005, round: 15, type: "A형", extra: true },
  { slug: "2005", globalName: "CIVIL_LAW_2005", year: 2005, round: 16, type: "A형" },
  { slug: "2006", globalName: "CIVIL_LAW_2006", year: 2006, round: 17, type: "A형" },
  { slug: "2007", globalName: "CIVIL_LAW_2007", year: 2007, round: 18, type: "A형" },
  { slug: "2008", globalName: "CIVIL_LAW_2008", year: 2008, round: 19, type: "A형" },
  { slug: "2009", globalName: "CIVIL_LAW_2009", year: 2009, round: 20, type: "A형" },
  { slug: "2010", globalName: "CIVIL_LAW_2010", year: 2010, round: 21, type: "A형" },
  { slug: "2011", globalName: "CIVIL_LAW_2011", year: 2011, round: 22, type: "A형" },
  { slug: "2012", globalName: "CIVIL_LAW_2012", year: 2012, round: 23, type: "A형" },
  { slug: "2013", globalName: "CIVIL_LAW_2013", year: 2013, round: 24, type: "A형" },
  { slug: "2014", globalName: "CIVIL_LAW_2014", year: 2014, round: 25, type: "A형" },
  { slug: "2015", globalName: "CIVIL_LAW_2015", year: 2015, round: 26, type: "A형" },
  { slug: "2016", globalName: "CIVIL_LAW_2016", year: 2016, round: 27, type: "A형" },
  { slug: "2017", globalName: "CIVIL_LAW_2017", year: 2017, round: 28, type: "A형" },
  { slug: "2018", globalName: "CIVIL_LAW_2018", year: 2018, round: 29, type: "A형" },
  { slug: "2019", globalName: "CIVIL_LAW_2019", year: 2019, round: 30, type: "A형" },
  { slug: "2020", globalName: "CIVIL_LAW_2020", year: 2020, round: 31, type: "A형" },
  { slug: "2021", globalName: "CIVIL_LAW_2021", year: 2021, round: 32, type: "B형" },
  { slug: "2022", globalName: "CIVIL_LAW_2022", year: 2022, round: 33, type: "A형" },
  { slug: "2023", globalName: "CIVIL_LAW_2023", year: 2023, round: 34, type: "A형" },
  { slug: "2024", globalName: "CIVIL_LAW_2024", year: 2024, round: 35, type: "A형" },
  { slug: "2025", globalName: "CIVIL_LAW_2025", year: 2025, round: 36, type: "A형" },
];

examSpecs.forEach(({ slug }) => {
  require(path.join(__dirname, "..", "public", "data", `civil-law-${slug}.js`));
});

const expectedAnswerRows = {
  "2005-extra": [
    2, 1, 5, 1, 3, 5, 4, 4, 1, 3,
    5, 1, 3, 4, 5, 2, 4, 2, 5, 1,
    4, 2, 4, 3, 4, 2, 3, 4, 1, 3,
    5, 1, 3, 2, 4, 5, 2, 3, 5, 3,
  ],
  2005: [
    3, 2, 5, 2, 1, 5, 1, 3, 4, 3,
    4, 1, 2, 4, 5, 1, 3, 4, 5, 4,
    4, 3, 5, 2, 1, 5, 5, 1, 5, 4,
    2, 5, 1, 1, 4, 3, 3, [2, 4], 3, 2,
  ],
  2006: [
    1, 2, 5, 4, 2, 3, 5, 4, 2, 3,
    5, 4, 1, 3, 1, 5, 5, 4, 5, 5,
    1, 2, 5, 3, 1, 2, 2, 4, 3, 5,
    4, 1, 3, 1, 2, 3, 1, 4, 3, 2,
  ],
  2007: [
    1, 5, 3, 2, 4, 3, 3, 5, 1, 2,
    3, 2, 4, 3, 3, 4, 4, 2, 1, 5,
    2, 5, 2, 3, 4, 5, 4, 1, 1, 1,
    3, 5, 2, 1, 2, 3, 1, 1, 5, 4,
  ],
  2008: [
    3, 2, 2, 5, 2, 3, 1, 1, 4, 4,
    2, 1, 5, 5, 5, 1, 4, 3, 4, 1,
    3, 2, 4, 3, 3, 5, 4, 4, 3, 1,
    4, 3, 1, 1, 2, 5, 2, 5, 1, 3,
  ],
  2009: [
    2, 3, 5, 4, 2, 1, 4, 4, 1, 3,
    5, 4, 5, 1, 3, 3, 4, 3, 2, 2,
    3, 5, 5, 1, 4, 3, 2, 1, 4, 2,
    5, 1, 5, 2, 2, 3, 2, 4, 1, 5,
  ],
  2010: [
    5, 4, 3, 5, 3, 4, 4, 5, 3, 5,
    2, 3, 5, 4, 3, 1, 2, 1, 5, 3,
    4, 1, 3, 1, 2, 3, 3, 4, 4, 1,
    5, 1, 4, 2, 2, 5, 4, 2, 2, 1,
  ],
  2011: [
    1, 5, 4, 4, 4, 5, 1, 4, 5, 4,
    3, 1, 5, 3, 2, 3, 3, 2, 2, 3,
    5, 2, 2, 1, 3, 4, 1, 5, 2, 2,
    3, 5, 4, 3, 1, 1, 4, 1, 5, 5,
  ],
  2012: [
    3, 5, 2, 5, 3, 5, 1, 1, 4, 1,
    5, 2, 4, [1, 2, 3, 4, 5], 5, 3, 3, 4, 1, 4,
    2, 1, 5, 1, 3, 5, 1, 2, 3, 2,
    4, 3, 4, 2, 5, 1, 4, 3, 3, 2,
  ],
  2013: [
    1, 3, 1, 5, 2, 1, 5, 5, 4, 1,
    5, 4, 2, 3, 1, 5, 2, 3, 1, 5,
    1, 4, 3, 2, 4, 3, 4, 5, 1, 4,
    3, 2, 2, 3, 2, 5, 5, 2, 3, 4,
  ],
  2014: [
    4, 2, 4, 1, 1, 1, 5, 2, 4, 2,
    4, 3, 5, [1, 2, 3, 4, 5], 4, 3, 2, 5, 2, 3,
    4, 5, 5, 4, 1, 2, 1, 5, 1, 4,
    3, 1, 5, 3, 3, 1, 3, 2, 3, 1,
  ],
  2015: [
    1, 3, 3, 3, 1, 5, 3, 5, 1, 2,
    4, 4, 4, 5, 5, 5, 1, 1, 1, 2,
    3, 5, 4, 1, 5, 3, 5, 3, 4, 4,
    2, 3, 2, 2, 2, 2, 2, 5, 3, 4,
  ],
  2016: [
    2, 4, 2, 5, 1, 3, 1, 3, 5, 5,
    3, 1, 4, 2, 3, 1, 1, 4, 2, 3,
    4, 5, 4, 3, 3, 2, 2, 4, 3, 5,
    3, 5, 4, 5, 4, 1, 1, 5, 2, 3,
  ],
  2017: [
    1, 1, 2, 3, 2, 3, 4, 1, 5, 4,
    5, 1, 3, 1, 4, 4, 4, 3, 3, 2,
    5, 5, 2, 1, 3, 2, 3, 1, 5, 5,
    2, 5, 4, 2, 5, 1, 3, 2, 1, 4,
  ],
  2018: [
    4, 5, 5, 3, 5, 2, 2, 3, 5, 4,
    4, 1, 3, 1, 1, 4, 1, 2, 4, 3,
    3, 4, 2, 3, 5, 2, 3, 1, 4, 5,
    2, 5, 4, 2, 3, 1, 2, 1, 5, 1,
  ],
  2019: [
    5, 3, 3, 4, 1, 2, 3, 5, 3, 5,
    4, 2, 1, 4, 2, 1, 5, 2, 4, 5,
    1, 3, 2, 2, 5, 4, 3, 3, 1, 5,
    4, 3, 5, 4, 1, 5, 2, 3, 5, [1, 2, 3, 4, 5],
  ],
  2020: [
    3, 3, 2, 3, 2, 1, 4, 5, 4, 4,
    2, 5, 2, 5, 1, 1, 4, 3, 1, 5,
    4, 2, 4, 3, 5, 2, 3, 2, 3, 2,
    4, 1, 5, 3, 1, 5, 1, 3, [2, 4], 5,
  ],
  2021: [
    5, 3, 2, 1, 4, 1, 2, 4, 1, 3,
    2, 5, 2, 3, 4, 4, 3, 5, 2, 2,
    5, 4, 4, 3, 4, 4, 1, 5, 5, 4,
    2, 3, 3, 1, 3, [1, 2, 3, 4, 5], 1, 2, 5, 1,
  ],
  2022: [
    4, 5, 4, 3, 1, 2, 1, 5, 5, 1,
    2, 5, 2, 1, 2, [3, 5], 4, 1, 1, 3,
    2, 2, 5, 3, 3, 2, 4, 4, 3, 3,
    5, 5, 1, 3, 3, 4, 4, 4, 5, 2,
  ],
  2023: [
    1, 5, 1, 4, 3, 1, 4, 2, 1, 5,
    2, 3, 3, 1, 2, 4, 3, 2, 5, 4,
    5, 4, 2, 4, 1, 3, 3, 5, 2, 4,
    5, 4, 3, 5, 5, 3, 1, 2, 1, 2,
  ],
  2024: [
    3, 5, 3, 3, 2, 5, 5, 1, 1, 2,
    4, 3, 5, 2, 4, 5, 1, 2, 2, 1,
    4, 4, 2, 3, 5, 5, [1, 2, 3, 4, 5], 5, 1, 5,
    1, 4, 3, 3, 3, 1, 1, 1, 2, 4,
  ],
  2025: [
    2, 3, 1, 5, 3, 1, 2, 3, 4, 3,
    4, 2, 1, 5, 4, 4, 3, 1, 2, 5,
    4, 4, 2, 5, 1, 3, 5, 4, 1, 4,
    5, 3, 2, 2, 5, 2, 3, 5, 1, 2,
  ],
};

const errors = [];
const examIds = new Set();
const examRounds = new Set();
let questionCount = 0;
let choiceCount = 0;

examSpecs.forEach(({ slug, globalName, year, round, type, extra = false }) => {
  const label = `${year}년 제${round}회${extra ? " 추가시험" : ""}`;
  const exam = global.window[globalName];
  const expectedRow = expectedAnswerRows[slug];

  if (!exam || !Array.isArray(exam.questions)) {
    errors.push(`${label} 시험 데이터 또는 questions 배열이 없습니다.`);
    return;
  }

  if (examIds.has(exam.id)) {
    errors.push(`${label} 시험 ID가 중복됩니다: ${exam.id}`);
  }
  examIds.add(exam.id);

  const roundKey = `${year}-${round}`;
  if (examRounds.has(roundKey)) {
    errors.push(`${label} 연도·회차가 중복됩니다.`);
  }
  examRounds.add(roundKey);

  if (exam.year !== year) {
    errors.push(`${label} 데이터의 year 값이 ${exam.year}입니다.`);
  }
  if (exam.round !== round) {
    errors.push(`${label} 데이터의 round 값이 ${exam.round}입니다.`);
  }
  if (exam.type !== type) {
    errors.push(`${label} 문제지 유형이 올바르지 않습니다: ${exam.type}`);
  }
  if (Boolean(exam.extra) !== extra) {
    errors.push(`${label} 추가시험 표시가 올바르지 않습니다.`);
  }
  if (!exam.title || !exam.subject || !exam.round || !exam.recommendedMinutes) {
    errors.push(`${label} 시험 메타데이터가 비어 있습니다.`);
  }
  if (!exam.source?.question || !exam.source?.answer) {
    errors.push(`${label} 공식 출처 주소가 비어 있습니다.`);
  }
  if (exam.questions.length !== 40) {
    errors.push(`${label} 문항 수가 40이 아닙니다: ${exam.questions.length}`);
  }
  if (!Array.isArray(expectedRow) || expectedRow.length !== 40) {
    errors.push(`${label} 공식 정답 검증행이 40개가 아닙니다.`);
  }

  exam.questions.forEach((question, index) => {
    const expectedNumber = 41 + index;
    const rawExpected = expectedRow?.[index];
    const expectedAnswers = Array.isArray(rawExpected) ? rawExpected : [rawExpected];
    questionCount += 1;

    if (question.number !== expectedNumber) {
      errors.push(`${label} ${index + 1}번째 문항 번호가 ${expectedNumber}이 아닙니다.`);
    }
    if (!question.topic?.trim() || !question.prompt?.trim()) {
      errors.push(`${label} ${question.number}번의 주제 또는 지문이 비어 있습니다.`);
    }
    if (
      typeof question.prompt === "string" &&
      question.prompt !== question.prompt.trim()
    ) {
      errors.push(`${label} ${question.number}번 지문 앞뒤에 불필요한 공백이 있습니다.`);
    }
    if (/^(?:[1-9]|[1-3][0-9]|40)\.\s/.test(question.prompt)) {
      errors.push(`${label} ${question.number}번 지문에 과목 내 상대 문항번호가 남아 있습니다.`);
    }
    if (/모두\s*고른/.test(question.prompt) && !question.prompt.includes("\n")) {
      errors.push(`${label} ${question.number}번 복합 지문의 보기 상자가 누락된 것으로 보입니다.`);
    }
    if (!Array.isArray(question.choices) || question.choices.length !== 5) {
      errors.push(`${label} ${question.number}번의 선택지가 5개가 아닙니다.`);
    } else {
      choiceCount += question.choices.length;
      if (question.choices.some((choice) => typeof choice !== "string" || !choice.trim())) {
        errors.push(`${label} ${question.number}번에 빈 선택지가 있습니다.`);
      }
      if (question.choices.some((choice) => choice !== choice.trim())) {
        errors.push(`${label} ${question.number}번 선택지 앞뒤에 불필요한 공백이 있습니다.`);
      }
      if (new Set(question.choices).size !== question.choices.length) {
        errors.push(`${label} ${question.number}번에 중복 선택지가 있습니다.`);
      }
    }
    if (!Array.isArray(question.answers) || question.answers.length === 0) {
      errors.push(`${label} ${question.number}번의 정답이 비어 있습니다.`);
    } else if (
      question.answers.some(
        (answer) => !Number.isInteger(answer) || answer < 1 || answer > 5
      )
    ) {
      errors.push(`${label} ${question.number}번의 정답 범위가 잘못되었습니다.`);
    } else if (new Set(question.answers).size !== question.answers.length) {
      errors.push(`${label} ${question.number}번에 중복 정답이 있습니다.`);
    }
    if (JSON.stringify(question.answers) !== JSON.stringify(expectedAnswers)) {
      errors.push(
        `${label} ${question.number}번 공식 정답 불일치: ` +
          `${JSON.stringify(question.answers)} / 기대 ${JSON.stringify(expectedAnswers)}`
      );
    }

    const content = [question.prompt, ...(question.choices || [])].join(" ");
    if (/전자문제집|무료동영상|오답 및 오타 신고|�|undefined|null|NaN|<br\s*\/?>/.test(content)) {
      errors.push(`${label} ${question.number}번에 원문 외 텍스트가 포함되어 있습니다.`);
    }
  });
});

const expectedQuestionCount = examSpecs.length * 40;
const expectedChoiceCount = expectedQuestionCount * 5;
if (questionCount !== expectedQuestionCount) {
  errors.push(`전체 문항 수가 ${expectedQuestionCount}이 아닙니다: ${questionCount}`);
}
if (choiceCount !== expectedChoiceCount) {
  errors.push(`전체 선택지 수가 ${expectedChoiceCount}이 아닙니다: ${choiceCount}`);
}

const projectRoot = path.join(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
const appJs = fs.readFileSync(path.join(projectRoot, "app.js"), "utf8");
const serviceWorker = fs.readFileSync(path.join(projectRoot, "sw.js"), "utf8");

examSpecs.forEach(({ slug, globalName }) => {
  const assetPath = `./public/data/civil-law-${slug}.js?v=5`;
  if (!indexHtml.includes(`src="${assetPath}"`)) {
    errors.push(`index.html에 ${assetPath} 스크립트가 없습니다.`);
  }
  if (!serviceWorker.includes(`"${assetPath}"`)) {
    errors.push(`sw.js 오프라인 캐시에 ${assetPath} 파일이 없습니다.`);
  }
  if (!appJs.includes(`"${globalName}"`)) {
    errors.push(`app.js 시험 목록에 ${globalName}이 없습니다.`);
  }
});

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `민법 CBT 데이터 검증 완료: ${examSpecs.length}회분, ${questionCount}문항, ` +
    `${choiceCount}개 선택지, Q-Net 공식 최종정답 일치`
);
