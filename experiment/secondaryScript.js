/**
 * Creates Intervention with given name and effect and simulates graph new
 * @param {string} name name of Intervention
 * @param {number} effectivness effect of intervention (0.00 - 1.00)
 */
function setIntervention(name) {
  if (name !== intervention.name) {
    numberOfInterventionChanges++;
  }
  intervention.name = name;

  switch (name) {
    case "low":
      intervention.effect = 0.25;
      break;
    case "middle":
      intervention.effect = 0.5;
      break;
    case "high":
      intervention.effect = 0.75;
      break;

    default:
      intervention.effect = 0.0;
      break;
  }

  //hide slider if no interention is selected
  sliderDiv.style.visibility = name == "none" ? "hidden" : "visible";
  if (currentVisualisation === "ensemble") {
    showEnsemble();
    return;
  }

  //Calculate Simulation with new Values and draw them
  simulateGraph(false);
}

document.getElementById("interventionNoneBtn").addEventListener("click", () => {
  setIntervention("none");
});
document.getElementById("interventionLowBtn").addEventListener("click", () => {
  setIntervention("low");
});
document.getElementById("interventionMiddleBtn").addEventListener("click", () => {
  setIntervention("middle");
});
document.getElementById("interventionHighBtn").addEventListener("click", () => {
  setIntervention("high");
});

document.getElementById("nextSzenarioBtn").addEventListener("click", () => {
  showDialog();
});

/**
 * updates to next szenario
 */
function changeSzenario() {
  //Log data
  const endTime = Date.now();
  const userId = sessionStorage.getItem("userId");
  const startTime = sessionStorage.getItem("startTime");
  const state = {
    startTime: startTime.toString(),
    endTime: endTime.toString(),
    userId: userId,
    uvType: currentVisualisation,
    szenarioId: currentSzenario.id,
    protectiveMeasure: intervention.name,
    sliderStartIndex: intervention.start,
    sliderEndIndex: intervention.end,
    hopAnimationUsed: usedHOP,
    highestHopAnimationFrame: highestViewedFrame,
    numberOfProtectiveMeasuresChanged: numberOfInterventionChanges,
  };
  saveArray.push(state);
  saveArray.forEach((e) => sessionStorage.setItem(e.uvType, JSON.stringify(e)));

  //remove current szenario from list and update storage
  var a = szenarioIDs.findIndex((e) => e == currentSzenario.id);
  szenarioIDs.splice(a, 1);
  sessionStorage.setItem("Szenario_ID_List", szenarioIDs.join(","));

  //remove current visualisation from list and update storage
  var b = allVisualisations.findIndex((e) => e == currentVisualisation);
  allVisualisations.splice(b, 1);
  sessionStorage.setItem("UV_List", allVisualisations.join(","));

  // find new Szenario and Visualisation
  if (allVisualisations.length == 0) {
    nextScenarioInput.disabled = true;
    startFreeExplorationMode();
  } else {
    //get new random Szenario
    currentSzenario = getSzenarioByID(szenarioIDs[Math.floor(Math.random() * (szenarioIDs.length - 1))]);
    sessionStorage.setItem("Szenario_ID", currentSzenario.id);

    //and get new random UV
    var randVisualisation = Math.floor(Math.random() * (allVisualisations.length - 1));
    currentVisualisation = allVisualisations[randVisualisation];
    sessionStorage.setItem("UV_Type", currentVisualisation);

    //use UV
    uncertaintyMode(currentVisualisation);

    // reset intervention to no intervention
    interventionRadioButtons["none"].checked = true;
    intervention.start = Math.round(lengthOfInterventionInput * 0.25);
    intervention.end = Math.round(lengthOfInterventionInput * 0.75);

    rangeInputs[0].value = intervention.start;
    rangeInputs[1].value = intervention.end;

    //setting slider LAbel to correct date
    setTagToDate(minTag, intervention.start);
    setTagToDate(maxTag, intervention.end);

    //show thumbs and lines at correct position
    setSliderToCorrectPosition();

    //move slider
    setIntervention("none", 0.0);

    //reset Values
    usedHOP = false;
    highestViewedFrame = 1;
    numberOfInterventionChanges = 0;
    currentFrame = 1;
    if (currentVisualisation === "ensemble") {
      return;
    }
    removeEnsemble();
    simulateGraph(true);
  }
}

//EventListener: Resize
window.addEventListener("resize", (e) => {
  resizeLines();
});

rangeInputs.forEach((input) => {
  //EventListener: Slider Inputs
  input.addEventListener("input", (event) => {
    intervention.start = parseInt(rangeInputs[0].value); //Get new Value
    intervention.end = parseInt(rangeInputs[1].value);

    if (intervention.end - intervention.start < intervention.minimalDuration) {
      enforceMinimalInterventionDuration(event);
    } else {
      //. minSlider
      let percentMin = (intervention.start / rangeInputs[0].max) * 100;
      let offsetMin = (45 * percentMin) / 100 - 1;

      progress.style.left = percentMin + "%";
      minLine.style.left = percentMin + "%";

      minTag.style.left = `calc(${percentMin}% - ${offsetMin}px )`;
      let date = addDaysToDate(earliestInterventionStart, intervention.start);
      minTag.innerHTML = date.getDate() + "." + months[date.getMonth()];

      //. maxSlider
      let percentMax = 100 - (intervention.end / rangeInputs[1].max) * 100;
      let offsetMax = -45 * (1 - percentMax / 100) + 1;

      progress.style.right = percentMax + "%";
      maxLine.style.right = percentMax + "%";

      const percentMaxRev = 100 - percentMax;

      maxTag.style.right = `calc(-${percentMaxRev}% - ${offsetMax}px )`;
      date = addDaysToDate(earliestInterventionStart, intervention.end);
      maxTag.innerHTML = date.getDate() + "." + months[date.getMonth()];

      setIntervention(intervention.name, intervention.effect);
    }
  });
});

/**
 * Enforces the minimal Duration for Interventions
 * @param {object} event Input event on one of the slider
 */
function enforceMinimalInterventionDuration(event) {
  if (event.target.className === "range-min") {
    rangeInputs[0].value = intervention.end - intervention.minimalDuration;
    intervention.start = rangeInputs[0].value;
  } else {
    rangeInputs[1].value = intervention.start + intervention.minimalDuration;
    intervention.end = rangeInputs[1].value;
  }
}

function startFreeExplorationMode() {
  //show Tabs
  tabDiv.style.display = "block";
  tabContentDiv[0].style.border = "1px solid #ccc";
  tabContentDiv[1].style.border = "1px solid #ccc";

  // select first Tab as activ
  tabDiv.firstElementChild.click();

  //hide "weiter"-Button
  nextScenarioInput.style.display = "none";
}

function changeToFirstTab(event) {
  tabContentDiv[0].style.display = "none";
  tabContentDiv[1].style.display = "block";

  const tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  event.currentTarget.className += " active";
}

document.getElementById("firstTab").addEventListener("click", changeToFirstTab);

function changeToSavedState(event, saveObject) {
  tabContentDiv[0].style.display = "block";
  tabContentDiv[1].style.display = "none";
  //change Tab and set active
  const tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  event.currentTarget.className += " active";

  //Set szenario
  currentSzenario = getSzenarioByID(saveObject.szenarioId);
  if (saveObject.uvType !== "ensemble") {
    removeEnsemble();
    currentFrame = 1;
  }

  currentVisualisation = saveObject.uvType;

  //set intervetion type and timeframe
  setIntervention(saveObject.protectiveMeasure);
  intervention.start = saveObject.sliderStartIndex;
  intervention.end = saveObject.sliderEndIndex;
  //show intervention in interface
  //radiobuttons
  interventionRadioButtons[saveObject.protectiveMeasure].checked = true;
  //Slider
  rangeInputs[0].value = intervention.start;
  rangeInputs[1].value = intervention.end;

  //setting slider LAbel to correct date
  setTagToDate(minTag, intervention.start);
  setTagToDate(maxTag, intervention.end);

  //show thumbs and lines at correct position
  setSliderToCorrectPosition();

  //set Visualisation (recalcs graph)
  uncertaintyMode(saveObject.uvType);
  if (saveObject.uvType == "hop") {
    frameControll.style.visibility = "visible";
  } else {
    frameControll.style.visibility = "hidden";
  }
  resizeLines();
}

document.getElementById("secondTab").addEventListener("click", (event) => {
  changeToSavedState(
    event,
    saveArray.find((e) => e.uvType == "ensemble")
  );
});
document.getElementById("thirdTab").addEventListener("click", (event) => {
  changeToSavedState(
    event,
    saveArray.find((e) => e.uvType == "conf")
  );
});
document.getElementById("fourthTab").addEventListener("click", (event) => {
  changeToSavedState(
    event,
    saveArray.find((e) => e.uvType == "hop")
  );
});

/**
 * Resizes vertical lines to current size of modelField
 */
export function resizeLines() {
  minLine.style.height = modelField.clientHeight - 40 + "px";
  maxLine.style.height = modelField.clientHeight - 40 + "px";
}

//.dialog
function showDialog() {
  dialogBtn.setAttribute("disabled", true);
  dialog.showModal();
  //disable button for x seconds
  setTimeout(() => {
    dialogBtn.removeAttribute("disabled");
  }, disabledTime * 1000);
}

function startNextSzenario() {
  dialog.close();
  changeSzenario();
  //startTime
  const newStartTime = Date.now();
  sessionStorage.setItem("startTime", newStartTime.toString());
}

document.getElementById("dialogNxtBtn").addEventListener("click", () => {
  startNextSzenario();
});

//. Accordion
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    // Toggle between adding and removing the "active" class
    this.classList.toggle("active");

    // Toggle between hiding and showing the active panel
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

document.getElementById("showEpiInfoBtn").addEventListener("click", () => {
  const modal = document.getElementById("epiInfoDialog");
  modal.showModal();
});
document.getElementById("closeEpiInfoBtn").addEventListener("click", () => {
  const modal = document.getElementById("epiInfoDialog");
  modal.close();
});
