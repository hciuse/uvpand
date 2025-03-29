const delay = (ms) => new Promise((res) => setTimeout(res, ms));

var tutorialCounter = 0;

if (!sessionStorage.getItem("tutorialIsDone")) {
  uncertaintyMode("hop");
  explainTaskAndDescription();
}

function explainTaskAndDescription() {
  explanations.scrollIntoView({ block: "center" });
  explanations.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  dialogContainer.style.top = "40%";

  tutorial.show();
}

async function explainGraph() {
  modelField.scrollIntoView({ block: "center" });
  dialogContainer.style.top = "50%";
  modelField.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  tutorialText.innerHTML =
    "Here you can see the predicted course of the epidemic. The x-axis shows the timeline. The y-axis shows the number of available and occupied hospital beds";
  tutorial.show();
}

function explainIntervention() {
  setIntervention("low");
  modelField.scrollIntoView({ block: "center" });
  dialogContainer.style.top = "40%";
  modelField.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  tutorialText.innerHTML =
    "Once you've selected a measure or combinations, you can use these two sliders to set the start and end time. You'll see the impact on the course directly in the graph.";
  tutorial.show();
}

function explainSelection() {
  selections.scrollIntoView({ block: "center" });
  dialogContainer.style.top = "75%";
  selections.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  tutorialText.innerHTML =
    "Here you'll find the selection of possible measures and combinations. On the left, you'll find an explanation of which symbol represents which measure.";
  tutorial.show();
}

function explainHOP() {
  frameControll.scrollIntoView({ block: "center" });
  frameControll.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  tutorialText.innerHTML =
    "Here you'll find the controls for the HOP visualization. With the button in the middle, you can start and pause the animation. The buttons to the right and left of it jump to the next or previous frame of the animation. On the far right, you can see which frame is currently being displayed.";
  tutorial.show();
}

function explainContinueButton() {
  nextScenarioInput.scrollIntoView({ block: "center" });
  dialogContainer.style.top = "100%";
  dialogContainer.style.left = "25%";
  nextScenarioInput.style.margin = "20px";
  nextScenarioInput.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  tutorialText.innerHTML =
    "Once you've made your selection, signal the test supervisor. To proceed to the next visualization, click on 'Next' in the bottom left.";
  tutorial.show();
}

function nextTutorial() {
  switch (tutorialCounter) {
    case 0:
      explanations.style.boxShadow = "0 0 0 0 rgba(0, 0, 0, .5)";
      tutorial.close();
      explainGraph();
      break;
    case 1:
      modelField.style.boxShadow = "0 0 0 0 rgba(0, 0, 0, .5)";
      tutorial.close();
      explainSelection();
      break;
    case 2:
      selections.style.boxShadow = "0 0 0 0 rgba(0, 0, 0, .5)";
      tutorial.close();
      explainIntervention();
      break;
    case 3:
      modelField.style.boxShadow = "0 0 0 0 rgba(0, 0, 0, .5)";
      setIntervention("none");
      tutorial.close();
      explainHOP();
      break;
    case 4:
      frameControll.style.boxShadow = "0 0 0 0 rgba(0, 0, 0, .5)";
      tutorial.close();
      explainContinueButton();
      break;

    default:
      nextScenarioInput.style.boxShadow = "0 0 0 0 rgba(0, 0, 0, .5)";
      tutorial.close();
      tutorialIsDone = true;
      sessionStorage.setItem("tutorialIsDone", true);
      uncertaintyMode(currentVisualisation);
      break;
  }
  tutorialCounter++;
}

document.getElementById("nextTutorialStep").addEventListener("click", nextTutorial);
