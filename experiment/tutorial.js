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
    "Hier sehen Sie den vorhergesagten Verlauf der Epidemie. Auf der X-Achse sehen Sie den zeitlichen Verlauf. Auf der Y-Achse sehen Sie die Anzahl verfügbarer und belegter Krankenhausbetten";
  tutorial.show();
}

function explainIntervention() {
  setIntervention("low");
  modelField.scrollIntoView({ block: "center" });
  dialogContainer.style.top = "40%";
  modelField.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  tutorialText.innerHTML =
    "Wenn Sie eine Maßnahme oder Kombinationen ausgewählt haben, können Sie über diese beiden Schieberegler Start- und Endzeitpunkt festlegen. Die Auswirkung auf den Verlauf sehen Sie direkt im Graph.";
  tutorial.show();
}

function explainSelection() {
  selections.scrollIntoView({ block: "center" });
  dialogContainer.style.top = "75%";
  selections.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  tutorialText.innerHTML =
    "Hier finden Sie die Auswahl der möglichen Maßnahmen und Kombinationen. Links finden Sie die Erklärung welches Symbol für welche Maßnahme steht.";
  tutorial.show();
}

function explainHOP() {
  frameControll.scrollIntoView({ block: "center" });
  frameControll.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  tutorialText.innerHTML =
    "Hier finden Sie die Steuerung für die HOP-Visualisierung. Mit dem Button in der Mitte können Sie die Animation starten und pausieren. Die Buttons rechts und links davon springen zum nächsten bzw. vorherigen Frame der Animation. Ganz rechts sehen Sie, welcher Frame aktuell angezeigt wird.";
  tutorial.show();
}

function explainContinueButton() {
  nextScenarioInput.scrollIntoView({ block: "center" });
  dialogContainer.style.top = "100%";
  dialogContainer.style.left = "25%";
  nextScenarioInput.style.margin = "20px";
  nextScenarioInput.style.boxShadow = "0 0 0 99999px rgba(0, 0, 0, .5)";
  tutorialText.innerHTML =
    "Wenn Sie Ihre Auswahl getroffen haben, geben Sie der Versuchsleitung ein Signal. Um zur nächsten Visualisierung zu gelangen, klicken Sie auf 'Weiter' unten links.";
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
