
const fs = require('fs');
const smallInputFile = 'A-small-practice.in';
const largeInputFile = 'A-large-practice.in';

const inputFile = largeInputFile;

function readData() {
  const ENGINES = 'engines';
  const QUERIES = 'queries';
  const rawData = fs.readFileSync(inputFile, 'utf8');
  const rows = rawData.split('\n');
  const casesN = rows.shift();
  const data = [];

  if (isNaN(casesN)) {
    throw 'Cases not a number';
  }

  let caseIndex = 0;
  let current = QUERIES;

  rows.forEach((row, i) => {

    if (!data[caseIndex]) {
      data[caseIndex] = {};
      data[caseIndex]['caseNumber'] = caseIndex + 1;
      data[caseIndex][ENGINES] = [];
      data[caseIndex][QUERIES] = [];
    }

    if (isNaN(+row)) {
      data[caseIndex][current].push(row);
    } else {

      if (current === QUERIES && i !== 0) {
        caseIndex++;
      }

      current = current === ENGINES ? QUERIES : ENGINES;
    }
  });

  return data;
}

const write = (index, switches) => {
  output.push(`Case #${index + 1}: ${switches}`);
};

const getScore = (engines, queries) => {
  return engines
    .map((e,i) => {
      return {
        engine: e,
        score: queries.indexOf(e),
        index: i
      };
    })
    .sort((a, b) => b.score - a.score);
};

const hasUnusedEngine = (engines, queries) => {
  return engines.find(e => queries.indexOf(e) === -1) !== undefined;
};

const computeSwitches = (engines, queries) => {
  let switches = 0;
  let hasUnused = hasUnusedEngine(engines, queries);

  while (hasUnused === false) {
    switches++;

    const scoreData = getScore(engines, queries);
    queries.splice(0, scoreData[0].score);

    hasUnused = hasUnusedEngine(engines, queries);
  }

  return switches;
}

const data = readData();

fs.writeFileSync('structured-data.json', JSON.stringify(data, null, 2), 'utf8');

const output = [];

data.forEach((test, i) => {
  const switches = computeSwitches(test.engines, test.queries);

  write(i, switches);
});

fs.writeFileSync('output.txt', output.join('\n') + '\n', 'utf8');
