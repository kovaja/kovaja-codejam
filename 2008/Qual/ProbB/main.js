
const fs = require('fs');
const smallInputFile = 'B-small-practice.in';
const largeInputFile = 'B-large-practice.in';

const inputFile = largeInputFile;

// ------------------------------READ-------------------------------
function byDeparture(a, b) {
  return a.dep.getTime() < b.dep.getTime() ? -1 : 1;
}

function readTrains(rows, type, i, offset, limit) {
  const trains = [];

  for (j = 0; j < limit; j += 1) {
    const scheduleData = rows[i + offset + j].split(' ');

    trains[j] = {
      type: type,
      dep: new Date(`2019-01-01T${scheduleData[0]}:00.000Z`),
      arr: new Date(`2019-01-01T${scheduleData[1]}:00.000Z`)
    }
  }

  return trains;
}

function readData() {
  const rawData = fs.readFileSync(inputFile, 'utf8');
  const rows = rawData.split('\n');
  const casesN = rows.shift();
  const data = [];

  let increase = 0;
  let i = 0;
  let time, numberOfTrains, NA, NB, ATrains, BTrains;

  for (let index = 0; index < casesN; index = index + 1) {
    i += increase;
    time = +rows[i];
    numberOfTrains = rows[i + 1].split(' ');
    NA = +numberOfTrains[0];
    NB = +numberOfTrains[1]

    ATrains = readTrains(rows, 'A', i, 2, NA);
    BTrains = readTrains(rows, 'B', i, 2 + NA, NB);

    data[index] = {
      nr: index + 1,
      time: time,
      NA: NA,
      NB: NB,
      trains: ATrains.concat(BTrains).sort(byDeparture)
    }

    increase = NA + NB + 2;
  }

  return data;
}

const data = readData();

fs.writeFileSync('structured-data.json', JSON.stringify(data, null, 2), 'utf8');

// ------------------------------COMPUTE-------------------------------

function getOppositeTypeOf(type) {
  return type === 'A' ? 'B' : 'A';
}

function computeTrains(test, caseNr) {
  if (test.NA === 0 || test.NB === 0) {
    return [test.NA, test.NB];
  }

  const offset = test.time * 60 * 1000; // ms

  test.trains[0].currentStation = getOppositeTypeOf(test.trains[0].type);
  const reducedTrains = [test.trains[0]];

  console.log('Case:', caseNr + 1);

  for (let i = 1; i < test.trains.length; i += 1) {
    const train = test.trains[i];

    const isInStationOfCurrentDeparture = (t) => {
      return t.currentStation === train.type
    };
    const isAbleToOperateNextLine = (t) => {
      return t.arr.getTime() + offset <= train.dep.getTime();
    }

    const eliminatingTrain = reducedTrains
      .filter(isInStationOfCurrentDeparture)
      .find(isAbleToOperateNextLine);

    if (eliminatingTrain) {
      console.log(train.dep, ' eliminated by ', eliminatingTrain.arr);

      eliminatingTrain.currentStation = getOppositeTypeOf(eliminatingTrain.currentStation);
      eliminatingTrain.arr = train.arr;

    } else {

      train.currentStation = getOppositeTypeOf(train.type);
      reducedTrains.push(train);

    }
  }

  const trainsA = reducedTrains.filter(t => t.type === 'A');
  const trainsB = reducedTrains.filter(t => t.type === 'B');

  return [trainsA.length, trainsB.length];
};

const output = [];

function write(index, a, b) {
  output.push(`Case #${index + 1}: ${a} ${b}`);
};

data.forEach((test, i) => {
  const [a, b] = computeTrains(test, i);

  write(i, a, b);
});

fs.writeFileSync('output.txt', output.join('\n') + '\n', 'utf8');
