/**
 * Draw given Graph
 * @param {string} id Graphs ID
 * @param {array} data Array with data points
 * @param {string} color Graphs Color
 * @param {boolean} isVisible Visibility
 * @param {array} dashArray graps dash mode
 */
function draw(id, data, color, isVisible, dashArray) {
  //Delete existing Graph
  d3.selectAll("#" + id).remove();

  //Draw new Graph
  svg
    .selectAll(".lineTest")
    .data([data], function (d) {
      return d.x;
    })
    .enter()
    .append("path")
    .attr("id", id)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.y);
        })
    )
    .attr("fill", "none")
    .attr("stroke", color)
    .style("stroke-dasharray", dashArray)
    .attr("stroke-width", strokeWidth);

  //Set Visibility
  svg.select("#" + id).style("opacity", isVisible ? 1 : 0);
}

// .  Graph Calculation
/**
 * Simulate Graphs of S-E-I-H-R-S model and draw them
 * @param {bool} fullGraph true if entire graph is calucted, false if just simultaion part is calculated
 */
async function simulateGraph(onlyData = false) {
  //Initial values for simulation
  const temp = {
    S: [{ x: startingDateSimulation, y: initsSEIHR.susecptible() }],
    E: [{ x: startingDateSimulation, y: initsSEIHR.exposed }],
    I: [{ x: startingDateSimulation, y: initsSEIHR.infected() }],
    H: [{ x: startingDateSimulation, y: initsSEIHR.hospitalized() }],
    R: [{ x: startingDateSimulation, y: initsSEIHR.recovered }],
  };

  // calc each graph
  const simData = universalCalcDataFunction(dayOffset, tMax, temp, currentFrame);

  //Save Graphs
  graphH.data = simData.H;

  if (onlyData) {
    return;
  }
  // draw each graph
  const g = graphH;
  draw(g.id, g.historic.concat(g.data), g.color, g.isVisible, g.dashArray);
  // check for confidence intervall and calc if necessary
  if (viewConfidence) {
    calcConfidence();
  }
}

/**
 * Calculates SEIHRS model from startday number until length. Stores results in temp.
 * @param {number} startDayNumber number of first day of calculation
 * @param {number} length length of calulation in days
 * @param {object} temp object to store graphs
 * @param {number} betaIndex Current betaIndex
 * @returns temp-object with SEIHRS-graphs
 */
function universalCalcDataFunction(startDayNumber, length, temp, betaIndex, infectedData, hospitalData) {
  // set beta to current beta
  var count = 0;
  for (var day = startDayNumber; day < length; day++) {
    var betaUV = getBetaForDay(day, betaIndex);

    // calc get infected and hospitak Delta
    var infectedDelta = false,
      hospitalDelta = false;
    if (infectedData) {
      infectedDelta = infectedData[count].y;
      hospitalDelta = hospitalData[count].y;
    }
    count++;

    //Calc data for one day
    var oneDayData = nextDay(day, temp, betaUV, infectedDelta, hospitalDelta);

    //Save data from Day
    temp.S.push(oneDayData.S);
    temp.E.push(oneDayData.E);
    temp.I.push(oneDayData.I);
    temp.H.push(oneDayData.H);
    temp.R.push(oneDayData.R);
  }

  temp.S.shift();
  temp.E.shift();
  temp.I.shift();
  temp.H.shift();
  temp.R.shift();
  return temp;
}

function getBetaForDay(day, betaIndex) {
  //check if day uses standard beta or beta index
  var R0 = 0;
  //no interention day?
  if (
    day < timeUntilEarliestIntervention + intervention.start ||
    day > timeUntilEarliestIntervention + intervention.end ||
    intervention.name == "none"
  ) {
    R0 = currentSzenario.gauss.R0[betaIndex - 1];
  }
  //intervention day
  else {
    // other stuff
    switch (intervention.name) {
      case "low":
        R0 = currentSzenario.gauss.intervention25[betaIndex - 1];
        break;
      case "middle":
        R0 = currentSzenario.gauss.intervention50[betaIndex - 1];
        break;
      case "high":
        R0 = currentSzenario.gauss.intervention75[betaIndex - 1];
        break;

      default:
        break;
    }
  }
  return R0 * params.gamma;
}

/**
 * Calculates data for given day in SEIHRS based on given input
 * @param {number} day
 * @param {object} graphsObject
 * @param {number} betaUV
 * @returns object with data for graph of that day
 */
function nextDay(day, graphsObject, betaUV, infectedDelta, hospitalDelta) {
  const temp = graphsObject;
  // get date of current day
  const dayDate = addDaysToDate(firstDateOfGraph, day);
  // calc sesonal faktor of date
  const seasonalFactor = isSeasonal ? getSeason(dayDate) : 1;
  // calc new hospital cases for day
  var hospitalCases = hospitalDelta ? hospitalDelta : params.eta() * getLast(temp.I).y;
  // calc newly infected for date
  var infectedCases = infectedDelta ? infectedDelta : (betaUV * seasonalFactor * getLast(temp.I).y * getLast(temp.S).y) / population;

  // use SEIHRS formular to get new values for each graph
  const tempS = getLast(temp.S).y - infectedCases + params.omega * getLast(temp.R).y;
  const tempE = getLast(temp.E).y - params.alpha * getLast(temp.E).y + infectedCases;
  const tempI = getLast(temp.I).y - params.gamma * getLast(temp.I).y - hospitalCases + params.alpha * getLast(temp.E).y;
  const tempH = getLast(temp.H).y - params.theta * getLast(temp.H).y + hospitalCases;
  const tempR = getLast(temp.R).y - params.omega * getLast(temp.R).y + params.gamma * getLast(temp.I).y + params.theta * getLast(temp.H).y;

  return {
    S: { x: dayDate, y: tempS },
    E: { x: dayDate, y: tempE },
    I: { x: dayDate, y: tempI },
    H: { x: dayDate, y: tempH },
    R: { x: dayDate, y: tempR },
  };
}

/**
 * Return new beta based on Beta Index
 * @param {number} index index in R0gauss array
 * @returns Beta value
 */
function getUncertainBeta(index) {
  return currentSzenario.gauss.R0[index] * params.gamma;
}

// Seasons
/**
 * Returns season factor of given Date
 * @param {Date} date
 * @returns Sesonal Factor number
 */
function getSeason(date) {
  const dayOfYear = getDayOfYear(date);
  // Use modified cosinus to get season of the given day
  const convertedToPi = (dayOfYear * 2 * Math.PI) / 365;
  const seasonalFactor = params.seasonalEffect * Math.cos(convertedToPi) + 1;
  return seasonalFactor;
}

/**
 * returns wich day of the year it is
 * @param {Date} date  Date for which number in year is wanted
 * @returns Daynumber
 */
function getDayOfYear(date) {
  // converts given date to milliseconds
  const nowMillSeconds = date.getTime();

  //create date of 1.Jan of same year as given date
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  // convert 1.Jan of same year to milliseconds
  const firstDayMillSeconds = firstDayOfYear.getTime();

  // get difference betwen 1. jan and given date. Convert diffenece to full days.
  const day = Math.floor((nowMillSeconds - firstDayMillSeconds) / 1000 / 60 / 60 / 24) + 1;
  return day;
}

// .  Calling Functions
resizeLines();
uncertaintyMode(currentVisualisation);
if (currentVisualisation !== "ensemble") {
  simulateGraph();
} else {
  showEnsemble();
}
resizeLines();
