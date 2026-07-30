const path = require("path");

global.window = {};
require(path.join(__dirname, "..", "public", "data", "civil-law-2021.js"));

const exam = global.window.CIVIL_LAW_2021;
const expectedAnswers = {
  41: [5], 42: [3], 43: [2], 44: [1], 45: [4],
  46: [1], 47: [2], 48: [4], 49: [1], 50: [3],
  51: [2], 52: [5], 53: [2], 54: [3], 55: [4],
  56: [4], 57: [3], 58: [5], 59: [2], 60: [2],
  61: [5], 62: [4], 63: [4], 64: [3], 65: [4],
  66: [4], 67: [1], 68: [5], 69: [5], 70: [4],
  71: [2], 72: [3], 73: [3], 74: [1], 75: [3],
  76: [1, 2, 3, 4, 5], 77: [1], 78: [2], 79: [5], 80: [1],
};

const errors = [];

if (!exam || !Array.isArray(exam.questions)) {
  errors.push("시험 데이터 또는 questions 배열이 없습니다.");
} else {
  if (exam.questions.length !== 40) {
    errors.push(`문항 수가 40이 아닙니다: ${exam.questions.length}`);
  }

  exam.questions.forEach((question, index) => {
    const expectedNumber = 41 + index;

    if (question.number !== expectedNumber) {
      errors.push(`${index + 1}번째 문항 번호가 ${expectedNumber}이 아닙니다.`);
    }
    if (!question.topic || !question.prompt) {
      errors.push(`${question.number}번의 주제 또는 지문이 비어 있습니다.`);
    }
    if (!Array.isArray(question.choices) || question.choices.length !== 5) {
      errors.push(`${question.number}번의 선택지가 5개가 아닙니다.`);
    } else if (question.choices.some((choice) => typeof choice !== "string" || !choice.trim())) {
      errors.push(`${question.number}번에 빈 선택지가 있습니다.`);
    }
    if (
      JSON.stringify(question.answers) !==
      JSON.stringify(expectedAnswers[question.number])
    ) {
      errors.push(`${question.number}번의 공식 정답이 일치하지 않습니다.`);
    }
  });
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("민법 CBT 데이터 검증 완료: 40문항, 200개 선택지, 공식 정답표 일치");
