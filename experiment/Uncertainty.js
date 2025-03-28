/**
 * Calulates COnfidence intervall for hospital and infected graph
 */
function calcConfidence() {
  // reset Conf Arrays to empty
  graphConfI.top = Array(numberOfCalculatedDays);
  graphConfI.bottom = Array(numberOfCalculatedDays);
  graphConfH.top = Array(numberOfCalculatedDays);
  graphConfH.bottom = Array(numberOfCalculatedDays);

  // set inital values
  var temp2 = {
    S: [{ x: startingDateSimulation, y: initsSEIHR.susecptible() }],
    E: [{ x: startingDateSimulation, y: initsSEIHR.exposed }],
    I: [{ x: startingDateSimulation, y: initsSEIHR.infected() }],
    H: [{ x: startingDateSimulation, y: initsSEIHR.hospitalized() }],
    R: [{ x: startingDateSimulation, y: initsSEIHR.recovered }],
  };

  for (var R0Index = 0; R0Index < currentSzenario.gauss.R0.length; R0Index++) {
    // for each Beta calc graphs
    const currentGraph = universalCalcDataFunction(dayOffset, tMax, temp2, R0Index + 1);

    for (var dayIndex = 0; dayIndex < numberOfCalculatedDays; dayIndex++) {
      // save highest and lowest value for each day for I and H
      if (graphConfI.top[dayIndex]) {
        if (graphConfI.top[dayIndex].y < currentGraph.I[dayIndex].y) {
          graphConfI.top[dayIndex] = currentGraph.I[dayIndex];
        }
        if (graphConfI.bottom[dayIndex].y > currentGraph.I[dayIndex].y) {
          graphConfI.bottom[dayIndex] = currentGraph.I[dayIndex];
        }
        if (graphConfH.top[dayIndex].y < currentGraph.H[dayIndex].y) {
          graphConfH.top[dayIndex] = currentGraph.H[dayIndex];
        }
        if (graphConfH.bottom[dayIndex].y > currentGraph.H[dayIndex].y) {
          graphConfH.bottom[dayIndex] = currentGraph.H[dayIndex];
        }
      } else {
        graphConfI.top[dayIndex] = currentGraph.I[dayIndex];
        graphConfI.bottom[dayIndex] = currentGraph.I[dayIndex];
        graphConfH.top[dayIndex] = currentGraph.H[dayIndex];
        graphConfH.bottom[dayIndex] = currentGraph.H[dayIndex];
      }
    }
    // save values
    temp2 = {
      S: [{ x: startingDateSimulation, y: initsSEIHR.susecptible() }],
      E: [{ x: startingDateSimulation, y: initsSEIHR.exposed }],
      I: [{ x: startingDateSimulation, y: initsSEIHR.infected() }],
      H: [{ x: startingDateSimulation, y: initsSEIHR.hospitalized() }],
      R: [{ x: startingDateSimulation, y: initsSEIHR.recovered }],
    };
  }

  //adding Reportrate to Confidence Intervall I Top and bottom
  const yMovementTop = graphConfI.top[0].y - graphConfI.top[0].y * params.reportRate;
  graphConfI.top.forEach((p) => (p.y = p.y * params.reportRate + yMovementTop));

  const yMovementBottom = graphConfI.bottom[0].y - graphConfI.bottom[0].y * params.reportRate;
  graphConfI.bottom.forEach((p) => (p.y = p.y * params.reportRate + yMovementBottom));

  // draw and fill confidence intervall for I
  svg
    .select("#" + graphConfI.id)
    .attr("fill", graphConfI.color)
    .attr("stroke", "none");
  graphConfI.bottom.reverse();
  // Remove reportrate from Confidence intervall
  graphConfI.top.forEach((p) => (p.y = (p.y - yMovementTop) * (1 / params.reportRate)));
  graphConfI.bottom.forEach((p) => (p.y = (p.y - yMovementBottom) * (1 / params.reportRate)));

  // draw and fill confidence intervall for H
  draw(graphConfH.id, graphConfH.top.concat(graphConfH.bottom.reverse()), graphConfH.color, graphH.isVisible, graphH.dashArray);
  svg
    .select("#" + graphConfH.id)
    .attr("fill", graphConfH.color)
    .attr("stroke", "none");
  graphConfH.bottom.reverse();

  // Calc confidence middle line for I
  const midI = calcMiddleLine(graphConfI.top, graphConfI.bottom);
  //adding reportrate to confidence intervallmiddleline
  const yMovementMiddleLine = midI[0].y - midI[0].y * params.reportRate;
  midI.forEach((p) => (p.y = p.y * params.reportRate + yMovementMiddleLine));

  // Calc and draw confidence middle line for H
  const midH = graphH.historic.concat(calcMiddleLine(graphConfH.top, graphConfH.bottom));
  draw("H", midH, graphH.color, graphH.isVisible, graphH.dashArray);
}

/**
 * Calculates graph which is mean of top and bottom graph
 * @param {object} topGraph
 * @param {object} bottomGraph
 * @returns Array of middle line Graph
 */
function calcMiddleLine(topGraph, bottomGraph) {
  const middleGraph = [];

  for (var i = 0; i < topGraph.length; i++) {
    const yValue = (topGraph[i].y + bottomGraph[i].y) / 2;
    middleGraph.push({ x: topGraph[i].x, y: yValue });
  }

  return middleGraph;
}

// HOP
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    play();
  }
}); //start/pause Hop with space

/**
 * Start/Pause HOP animation
 */
var interval;
function play() {
  if (animationPlays) {
    //if animation plays
    stop();
  } else {
    usedHOP = true;
    interval = setInterval(function () {
      moveFrame(1, true);
    }, timePerFrame); //else start
    animationPlays = true;
    playButton.innerHTML = '<i class="fa">&#xf04c;</i>';
  }
}

function stop() {
  clearInterval(interval); //pause
  animationPlays = false;
  playButton.innerHTML = '<i class="fa">&#xf04b;</i>';
}

document.getElementById("play").addEventListener("click", play);

/**
 * Moves the current frame by specified Movement
 * @param {number} movement Number of frames
 */
function moveFrame(movement, playButtonUsed = false) {
  if (playButtonUsed) {
    if (currentFrame >= maxFrame) {
      //frame out of bounds
      stop();
      return;
    }
  }
  currentFrame += movement;
  if (currentFrame <= 0) {
    currentFrame = maxFrame;
  } else if (currentFrame > maxFrame) {
    currentFrame = 1;
  }

  if (currentFrame > highestViewedFrame) {
    highestViewedFrame = currentFrame;
  }

  //recalc with new Graph
  simulateGraph(false);

  //update currentFrame label
  frameNrObject.innerHTML = `${currentFrame}/${maxFrame}`;
}

document.getElementById("prevFrame").addEventListener("click", () => {
  moveFrame(-1);
});
document.getElementById("nextFrame").addEventListener("click", () => {
  moveFrame(1);
});

//. General Functions
/**
 * Changes the type of shown Uncertainty visualisation
 * @param {String} mode
 */
function uncertaintyMode(mode) {
  if (mode != "hop" && animationPlays) {
    //if animation plays and mode is changed
    clearInterval(interval); //pause animation
    animationPlays = false;
    playButton.innerHTML = '<i class="fa">&#xf04b;</i>';
  }
  [...document.getElementsByClassName("task-explanation")].forEach((e) => (e.style.display = "none"));
  switch (mode) {
    case "ensemble":
      // title.innerText = "Pandemie Modellierung";
      frameControll.style.visibility = "hidden";

      // hide confidence intervall
      viewConfidence = false;
      svg.select("#" + graphH.id).style("opacity", 0);
      svg.select("#" + graphConfH.id).style("opacity", 0);

      showEnsemble();

      document.getElementById("ensemble-explanation").style.display = "block";

      break;

    case "conf":
      // title.innerText = "Pandemie Modellierung - Konfidenzintervall";
      frameControll.style.visibility = "hidden";

      viewConfidence = true;
      calcConfidence();

      document.getElementById("confidence-explanation").style.display = "block";

      break;

    case "hop":
      // title.innerText = "Pandemie Modellierung - HOP";
      frameControll.style.visibility = "visible";

      // hide confidence intervall
      viewConfidence = false;
      svg.select("#" + graphConfH.id).style("opacity", 0);
      simulateGraph(false);

      document.getElementById("hop-explanation").style.display = "block";

      break;

    default:
      break;
  }
}

function removeEnsemble() {
  const ids = Array.from({ length: 94 }, (_, i) => `H-${i + 1}`);
  ids.forEach((id) => d3.selectAll("#" + id).remove());
}

function showEnsemble() {
  removeEnsemble();
  // Remove H and ConfH Graph
  for (currentFrame = 1; currentFrame < 95; currentFrame++) {
    const id = `H-${currentFrame}`;
    simulateGraph(true);
    const data = currentFrame % 2 == 1 ? graphH.data.reverse() : graphH.data;
    svg
      .selectAll()
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
      .attr("stroke", "#f6abb4")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .join("path")
      .style("mix-blend-mode", "multiply");
  }
}
