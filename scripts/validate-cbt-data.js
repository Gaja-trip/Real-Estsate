const path = require("path");

global.window = {};

const years = [2021, 2022, 2023, 2024, 2025];
years.forEach((year) => {
  require(path.join(__dirname, "..", "public", "data", `civil-law-${year}.js`));
});

const expectedAnswerRows = {
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
let questionCount = 0;
let choiceCount = 0;

years.forEach((year) => {
  const exam = global.window[`CIVIL_LAW_${year}`];
  if (!exam || !Array.isArray(exam.questions)) {
    errors.push(`${year}년 시험 데이터 또는 questions 배열이 없습니다.`);
    return;
  }

  if (examIds.has(exam.id)) {
    errors.push(`${year}년 시험 ID가 중복됩니다: ${exam.id}`);
  }
  examIds.add(exam.id);

  if (exam.year !== year) {
    errors.push(`${year}년 데이터의 year 값이 ${exam.year}입니다.`);
  }
  if (exam.type !== (year === 2021 ? "B형" : "A형")) {
    errors.push(`${year}년 문제지 유형이 올바르지 않습니다: ${exam.type}`);
  }
  if (!exam.title || !exam.subject || !exam.round || !exam.recommendedMinutes) {
    errors.push(`${year}년 시험 메타데이터가 비어 있습니다.`);
  }
  if (!exam.source?.question || !exam.source?.answer) {
    errors.push(`${year}년 공식 출처 주소가 비어 있습니다.`);
  }
  if (exam.questions.length !== 40) {
    errors.push(`${year}년 문항 수가 40이 아닙니다: ${exam.questions.length}`);
  }

  exam.questions.forEach((question, index) => {
    const expectedNumber = 41 + index;
    const rawExpected = expectedAnswerRows[year][index];
    const expectedAnswers = Array.isArray(rawExpected) ? rawExpected : [rawExpected];
    questionCount += 1;

    if (question.number !== expectedNumber) {
      errors.push(`${year}년 ${index + 1}번째 문항 번호가 ${expectedNumber}이 아닙니다.`);
    }
    if (!question.topic?.trim() || !question.prompt?.trim()) {
      errors.push(`${year}년 ${question.number}번의 주제 또는 지문이 비어 있습니다.`);
    }
    if (!Array.isArray(question.choices) || question.choices.length !== 5) {
      errors.push(`${year}년 ${question.number}번의 선택지가 5개가 아닙니다.`);
    } else {
      choiceCount += question.choices.length;
      if (question.choices.some((choice) => typeof choice !== "string" || !choice.trim())) {
        errors.push(`${year}년 ${question.number}번에 빈 선택지가 있습니다.`);
      }
    }
    if (!Array.isArray(question.answers) || question.answers.length === 0) {
      errors.push(`${year}년 ${question.number}번의 정답이 비어 있습니다.`);
    } else if (
      question.answers.some(
        (answer) => !Number.isInteger(answer) || answer < 1 || answer > 5
      )
    ) {
      errors.push(`${year}년 ${question.number}번의 정답 범위가 잘못되었습니다.`);
    }
    if (JSON.stringify(question.answers) !== JSON.stringify(expectedAnswers)) {
      errors.push(
        `${year}년 ${question.number}번 공식 정답 불일치: ` +
          `${JSON.stringify(question.answers)} / 기대 ${JSON.stringify(expectedAnswers)}`
      );
    }
  });
});

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `민법 CBT 데이터 검증 완료: ${years.length}개년, ${questionCount}문항, ` +
    `${choiceCount}개 선택지, Q-Net 공식 최종정답 일치`
);
