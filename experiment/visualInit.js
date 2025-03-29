// . Initalisierung von CSS, HTML für werte die errechnet/zusammengesetz werden
document.getElementById("frameNr").innerHTML = `${currentFrame}/${maxFrame}`;
modelField.style.maxWidth = totalWidth + "px";

// . slider Position, breite, max und aktueller Wert
rangeInputs.forEach((r) => (r.max = lengthOfInterventionInput));

//setting slider to value
rangeInputs[0].value = intervention.start;
rangeInputs[1].value = intervention.end;

minLine.style.height = modelField.clientHeight - 40 + "px";
maxLine.style.height = modelField.clientHeight - 40 + "px";

//setting slider LAbel to correct date
setTagToDate(minTag, intervention.start);
setTagToDate(maxTag, intervention.end);

//move rangeinputs to the left to align with needed time frame
const sliderLeftDistance = ((margin.left + (timeUntilEarliestIntervention / tMax) * width) / totalWidth) * 100;
const sliderWidth = ((lengthOfInterventionInput * (width / tMax)) / totalWidth) * 100;

slider.style.left = sliderLeftDistance + "%";
slider.style.width = sliderWidth + "%";

rangeInputDiv.style.left = sliderLeftDistance + "%";
rangeInputDiv.style.width = sliderWidth + "%";

setSliderToCorrectPosition();

// . Colors
colorGraphLegend(1, graphH);
colorGraphLegend(checkboxes.length - 1, graphHsp);

// . SVG
var svg = d3
  .select("#modelField")
  .append("svg")
  .attr("viewBox", "0 0 " + totalWidth + " " + totalHeight) //create viewbox for responsivness
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // translate by Margins

// . XAxis
var x = d3
  .scaleTime()
  .domain([firstDateOfGraph, addDaysToDate(firstDateOfGraph, tMax)]) // min and max
  .range([0, width]); //width

var deDE = d3.timeFormatLocale({
  dateTime: "%A, der %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
});

var xAxis = d3.axisBottom(x).ticks(d3.timeWeek.every(2)).tickFormat(deDE.format("%d. %b %y")).tickPadding(15);

// .Grid
const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat("").ticks(d3.timeWeek.every(2));
svg
  .append("g")
  .attr("class", "x axis-grid")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxisGrid);

svg
  .append("g")
  .attr("transform", "translate(0," + height + ")") //translate to bottom
  .attr("class", "xaxis");
svg.selectAll(".xaxis").style("font-size", "18px").call(xAxis);

svg
  .append("text") //Label
  .attr("text-anchor", "end")
  .attr("x", width + margin.right)
  .attr("y", height + margin.bottom)
  .text("Time");

svg
  .append("text") //Label
  .attr("text-anchor", "end")
  .attr("x", 1500)
  .attr("y", 275)
  .attr("fill", graphHsp.color)
  .attr("font-weight", "bold")
  .text("Available Hospital Beds");

// . YAxis
var y = d3
  .scaleLinear()
  .domain([0, yAxisMax]) // min and max
  .range([height, 0]); //height

var yAxis = d3
  .axisLeft(y)
  .tickValues(d3.range(y.domain()[0], y.domain()[1], yAxisInterval)) // Tick interval
  .tickFormat(d3.format(".2s")) //tick 1 500 000 = 1.5M
  // .tickSizeInner(-width)
  .tickPadding(15);

// . Grid
const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat("").tickValues(d3.range(y.domain()[0], y.domain()[1], yAxisInterval));
svg.append("g").attr("class", "y axis-grid").call(yAxisGrid);

svg.append("g").attr("class", "yaxis");
svg.selectAll(".yaxis").style("font-size", "18px").call(yAxis);

svg
  .append("text") //Label
  .attr("text-anchor", "end")
  .attr("transform", "rotate(0)")
  .attr("y", 15)
  .attr("x", 0)
  .text("Hospital Beds");

//. Hospital Beds Line
svg
  .append("line")
  .attr("id", "Hsp")
  .attr("fill", "none")
  .attr("stroke", graphHsp.color)
  .style("stroke-dasharray", graphHsp.dashArray)
  .attr("stroke-width", 3)
  .attr("x1", 0)
  .attr("label", "HospitalBeds")
  .attr("y1", height - hospitalBeds * (height / yAxisMax))
  .attr("x2", width)
  .attr("y2", height - hospitalBeds * (height / yAxisMax));

// . Tab
tabDiv.style.display = "none";
tabContentDiv[0].style.border = "0px solid #ccc";
tabContentDiv[1].style.border = "0px solid #ccc";

if (saveArray.length >= 3) {
  document.querySelector(".tab").style.display = "block";
  document.getElementsByClassName("tabcontent")[0].style.border = "1px solid #ccc";
  document.getElementsByClassName("tabcontent")[1].style.border = "1px solid #ccc";

  //select default tab
  tabContentDiv[0].style.display = "none";
  tabContentDiv[1].style.display = "block";

  const tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  tablinks[0].className += " active";
  minLine.style.height = modelField.clientHeight - 40 + "px";
  maxLine.style.height = modelField.clientHeight - 40 + "px";

  //hide "weiter"-Button
  document.getElementById("nextSzenarioBtn").style.display = "none";
}

// . Functions
function setSliderToCorrectPosition() {
  //show thumbs and lines at correct position
  let offsetMin = (45 * 25) / 100 - 1;
  let minPer = (intervention.start / lengthOfInterventionInput) * 100;
  minTag.style.left = `calc(${minPer}% - ${offsetMin}px )`;
  minLine.style.left = minPer + "%";
  progress.style.left = minPer + "%";

  let offsetMax = (-45 * 75) / 100 - 1;
  let maxPer = (intervention.end / lengthOfInterventionInput) * 100;
  maxTag.style.right = `calc(-${maxPer}% - ${offsetMax}px )`;
  maxLine.style.right = 100 - maxPer + "%";
  progress.style.right = 100 - maxPer + "%";
}

function colorGraphLegend(i, graph) {
  checkboxes[i].style.color = graph.color;
  legendStrokes[i].style.stroke = graph.color;
  checkboxes[i].children[0].checked = graph.isVisible;
}

function setTagToDate(tag, day) {
  const date = addDaysToDate(earliestInterventionStart, day);
  tag.innerHTML = date.getDate() + "." + months[date.getMonth()];
}
