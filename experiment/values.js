const population = 83200000; // Total population
const hospitalBeds = 480000; // Number of hospital beds 450000  483 606

//. Szenario Parameters
const R0A = 1.5,
  R0B = 1.7;
const etaA = 0.025,
  etaB = 0.02;
const I1A = 0.002,
  I1B = 0.003;

// N=100, M(1.5) SD(0.2), remove min,min,max,max,max -> N_total = 95
var gaussR0_15 = [
  1.5, 1.41, 1.27, 1.41, 1.14, 1.43, 1.47, 1.78, 1.26, 1.49, 1.6, 1.76, 1.43, 1.48, 1.4, 1.36, 1.68, 1.78, 1.49, 1.65, 1.19, 1.47, 1.55,
  1.42, 1.52, 1.51, 1.71, 1.44, 1.61, 1.53, 1.55, 1.54, 1.56, 1.4, 1.6, 1.68, 1.63, 1.44, 1.55, 1.53, 1.51, 1.3, 1.46, 1.53, 1.58, 1.81,
  1.25, 1.08, 0.97, 1.37, 1.33, 1.37, 1.65, 1.37, 1.01, 1.79, 1.47, 1.16, 1.67, 1.24, 1.67, 1.18, 1.75, 1.47, 1.47, 1.53, 1.64, 1.56, 1.46,
  1.33, 1.47, 1.37, 1.62, 1.57, 1.49, 1.81, 1.39, 1.79, 1.74, 1.41, 1.28, 1.47, 1.84, 1.62, 1.59, 1.46, 1.7, 1.14, 1.24, 1.68, 1.6, 1.16,
  1.85, 1.52, 1.52,
];
// N=100, M(2.3) SD(0.2), remove min,min,max,max,max -> N_total = 95
var gaussR0_23 = [
  1.7, 2.13, 2.24, 2.29, 2.28, 1.97, 2.26, 2.04, 2.45, 2.3, 2.18, 2.14, 2.16, 2.43, 2.56, 2.57, 2.12, 2.01, 2.1, 2.26, 2.18, 2.56, 2.27,
  2.14, 2.2, 2.42, 2.39, 2.4, 2.26, 2.45, 2.35, 2.23, 2.4, 2.31, 1.99, 2.19, 2.35, 2.04, 2.39, 2.21, 2.23, 2.28, 2.22, 2.51, 2.5, 2.1, 2.16,
  2.4, 2.49, 2.48, 2.36, 2, 2.33, 2.56, 1.97, 1.95, 2.07, 2.16, 2.64, 2.26, 2.59, 1.91, 2.23, 2.2, 2.47, 2.17, 2.07, 2.03, 2.43, 2.24, 2.23,
  2.45, 2.34, 2.1, 2.46, 2.16, 2.04, 2.36, 2.48, 2.26, 2.19, 2.09, 2.35, 2.14, 2.39, 2.22, 2.11, 1.89, 2.62, 2.41, 2.23, 2.41, 2.52, 2.52,
  2.12,
];

// ! N=100, M(1.7) SD(0.2), remove min,min,max,max,max -> N_total = 95
var gaussR0_17 = [
  1.7, 1.86, 1.75, 1.89, 1.62, 2.09, 1.63, 1.62, 1.56, 1.72, 1.8, 2.01, 1.8, 1.75, 1.43, 1.59, 1.76, 1.63, 1.73, 1.9, 1.74, 1.4, 1.77, 1.72,
  1.91, 1.77, 1.92, 1.64, 1.69, 1.92, 1.45, 1.64, 1.45, 1.84, 1.48, 1.69, 1.9, 1.37, 1.97, 1.55, 1.64, 1.7, 1.81, 1.55, 2.09, 1.68, 1.74,
  1.73, 1.59, 1.7, 1.58, 2.02, 1.98, 1.68, 1.88, 1.61, 1.58, 1.54, 1.92, 1.55, 2.08, 1.55, 1.85, 1.79, 1.41, 1.88, 1.69, 1.75, 1.8, 1.43,
  1.77, 1.6, 1.68, 1.73, 1.61, 1.74, 1.87, 1.47, 1.88, 1.77, 1.5, 1.63, 1.84, 1.98, 1.69, 1.66, 1.77, 1.44, 1.89, 1.52, 1.54, 1.92, 1.47,
  1.87, 1.59,
];

// ! N=100, M(1.7*0.75)=M(1.275) SD(0.4), remove min,min,max,max,max -> N_total = 95
var gaussR0_17_I_25 = [
  1.275, 0.75, 1.47, 1.65, 1.17, 1.34, 1.86, 1.34, 1.52, 1.54, 0.71, 1.61, 0.79, 1.31, 1.56, 1.45, 1.36, 1.99, 1.45, 1.41, 1.41, 1.16, 0.79,
  1.13, 1.41, 1.19, 1.34, 1.63, 0.87, 1, 1.53, 1.69, 0.95, 1.37, 0.83, 1.72, 1.75, 1.39, 1.24, 1.54, 1.5, 1.15, 1.89, 1.95, 1.43, 0.98,
  1.43, 1.56, 0.99, 1.57, 0.98, 1.3, 1.63, 1.46, 1.05, 1.02, 1.07, 0.78, 1.46, 0.68, 1.41, 1.03, 1.14, 1.51, 1.2, 1.42, 1.33, 1.04, 1.19,
  1.77, 1.2, 1.71, 1.47, 1.02, 0.72, 1.4, 1.58, 1.33, 1.42, 1.83, 1.41, 1.28, 1.01, 1.58, 1.16, 1.44, 1.4, 1.66, 1.66, 1.9, 1.3, 0.91, 1.47,
  1.33, 1.86,
];
// ! N=100, M(1.7*0.5)=M(0.85) SD(0.4), remove min,min,max,max,max -> N_total = 95 (one negative to 0)
var gaussR0_17_I_50 = [
  0.85, 0.56, 1.21, 0.11, 0.49, 1.15, 1.25, 1.12, 1.09, 0.76, 0.73, 0.68, 1.17, 0.37, 0.38, 1.37, 0.76, 0.82, 1.09, 0.72, 0.55, 0.76, 0.26,
  0.4, 1.43, 1.2, 0.93, 1.05, 0.63, 1.04, 0.51, 0.53, 0.39, 0.49, 0.28, 0.06, 0.09, 0.66, 0.42, 1.17, 0.05, 1.24, 0.89, 0.54, 0.94, 0.51,
  0.64, 1.34, 0.76, 1.35, 0.29, 0.88, 0.44, 0.7, 0.29, 0, 0.55, 0.37, 0.87, 0.7, 1.22, 1.13, 0.82, 0.87, 1.12, 0.21, 1.03, 1.29, 1.39, 1.19,
  0.73, 0.87, 0.73, 0.52, 0.58, 0.54, 0.78, 1.04, 0.95, 0.43, 1.29, 0.42, 1.14, 1.01, 0.97, 0.82, 1.22, 1.11, 1.05, 0.94, 0.9, 0.56, 1.07,
  0.74, 1.13,
];
// ! N=100, M(1.7*0.25)=M(0.425) SD(0.4), remove min,min,max,max,max -> N_total = 95 (six negative to 0)
var gaussR0_17_I_75 = [
  0.425, 0.83, 0.37, 0.37, 0.56, 0.48, 0.22, 0.14, 0.44, 0.16, 0.23, 0.09, 0.34, 0.84, 1.11, 0.49, 1.02, 0.91, 0.3, 0.44, 0.07, 0.43, 0.99,
  0.72, 0.59, 0.71, 0.11, 0.86, 0.08, 0.48, 0.15, 0.54, 0.62, 0.67, 0.5, 0, 0.44, 0.52, 1.06, 0.14, 0, 0, 0.2, 0.36, 0, 0.88, 0.02, 0.55,
  0.85, 0.19, 0.9, 0, 0.7, 0.61, 0.75, 1.06, 0.73, 0.13, 1.1, 0, 0.16, 0.46, 0.87, 0.87, 0.12, 0.53, 0, 1.02, 0.7, 0.19, 0.4, 0.01, 0.34,
  0.63, 0.3, 1.07, 0.56, 0, 0.35, 0.37, 0.58, 0.68, 0.49, 1.02, 0.8, 0.45, 0.25, 0.1, 1.03, 0.61, 0.28, 0.89, 0.63, 1.03, 0,
];

// N=100, M(1.5*0.75)=M(1.125) SD(0.4), remove min,min,max,max,max -> N_total = 95
var gaussR0_15_I_25 = [
  1.125, 0.89, 1.15, 0.99, 1.54, 0.9, 0.56, 1.34, 1.75, 0.61, 1.07, 1, 1.6, 0.74, 1.04, 1.35, 1.76, 1.59, 0.93, 1.27, 1.26, 1.58, 0.89,
  1.38, 0.57, 1.73, 1.01, 0.64, 1.19, 1.01, 0.71, 1.17, 1.27, 1.16, 0.98, 1.55, 0.8, 1.27, 0.45, 1.4, 1.41, 1.53, 1.91, 1.09, 1.24, 1.72,
  0.48, 0.68, 0.43, 0.71, 1.8, 0.71, 1.17, 0.93, 1.61, 1.61, 0.87, 0.6, 0.58, 1.58, 1.73, 1.05, 0.63, 0.88, 0.76, 1.33, 0.72, 1.64, 1, 1.34,
  1.17, 1.3, 0.91, 0.85, 0.98, 1.61, 1.27, 1.48, 1.08, 1.5, 1.57, 1.19, 1.06, 0.59, 1.22, 0.64, 0.36, 1.28, 0.72, 1.34, 1.01, 0.81, 1.17,
  0.98, 1.25,
];
// N=100, M(1.5*0.5)=M(0.75) SD(0.4), remove min,min,max,max,max -> N_total = 95 (one negative to 0)
var gaussR0_15_I_50 = [
  0.75, 0.51, 0.36, 0.54, 1.2, 0.52, 0.94, 0.26, 0.56, 0.46, 1.12, 0.57, 0.73, 0.59, 1.09, 0.55, 0.69, 1.02, 0.85, 0.29, 0.31, 0.8, 1.05,
  0.74, 0.76, 0.95, 0.5, 0.78, 0.67, 1.14, 0.42, 0.31, 0.62, 0.7, 0.4, 0.7, 0.61, 0.46, 0.07, 0.34, 1.39, 0.92, 1.44, 0.13, 0.86, 0.74,
  0.98, 1.09, 0.59, 0.5, 0.68, 0.44, 0.66, 0.9, 0.54, 0.37, 0.28, 0.67, 0.76, 0, 0.04, 1.2, 0.96, 0.99, 0.3, 0.31, 0.98, 0.36, 0.36, 1.15,
  0.1, 0.88, 0.78, 0.86, 0.7, 0.81, 0.76, 0.27, 0.7, 0.09, 1.1, 0.25, 0.86, 0.25, 0.75, 0.65, 1.1, 0.61, 1.43, 0.92, 0.69, 0.31, 0.79, 0.43,
  0.34,
];
// N=100, M(1.5*0.25)=M(0.375) SD(0.4), remove min,min,max,max,max -> N_total = 95 (13 negative to 0)
var gaussR0_15_I_75 = [
  0.375, 0.92, 0.59, 0.07, 0.04, 0.04, 0.85, 0.43, 0.95, 0.61, 0.34, 0.56, 0.35, 0.16, 0.82, 0.12, 0.75, 0.94, 0.49, 0.45, 1.12, 0.15, 0.89,
  0, 0.24, 0.36, 0.54, 0, 0, 0.18, 0, 0.42, 0.43, 0.78, 0.66, 0.07, 0, 1.12, 0.32, 1.06, 0.83, 0.43, 0.36, 0.14, 0.35, 0.27, 0.25, 0.82, 0,
  0.64, 0.34, 0.43, 0.92, 0, 0.56, 0.74, 0.15, 0.6, 0.5, 0.02, 0, 0.74, 0, 0.96, 0.47, 0.5, 0.06, 0.02, 0.53, 0.36, 0.75, 0, 0.4, 0.42,
  0.59, 0.61, 0.86, 0.27, 0.19, 0.59, 0.46, 0, 0.27, 0, 0.85, 0.11, 0.96, 0.71, 0.91, 0.36, 0.28, 0, 1.08, 0.21, 0,
];

// N=100, M(2.3*0.75)=M(1.725) SD(0.4), remove min,min,max,max,max -> N_total = 95
var gaussR0_23_I_25 = [
  1.725, 2.25, 1.54, 1.88, 1.57, 1.68, 1.77, 1.5, 1.29, 1.2, 1.53, 1.47, 1.53, 1.27, 1.45, 1.83, 1.68, 1.63, 1.68, 1.62, 2.27, 2.03, 1.79,
  1.61, 2.35, 1.59, 1.94, 1.37, 1.92, 2.23, 1.82, 2.23, 1.71, 1.8, 1.82, 1.14, 2.01, 1.65, 1.77, 1.4, 1.68, 1.55, 1.46, 1.46, 1.13, 1.83,
  1.47, 1.81, 1.95, 1.89, 1.51, 1.77, 2.17, 1.79, 1.77, 1.95, 1.32, 1.55, 1.56, 1.63, 1.33, 2.23, 1.82, 1.45, 1.67, 1.25, 2.14, 1.58, 1.7,
  1.59, 2.06, 1.81, 1.54, 1.58, 2.25, 2.31, 1.03, 1.66, 1.2, 1.93, 1.68, 1.19, 1.65, 1.35, 1.89, 1.6, 1.79, 1.89, 1.48, 1.98, 1.89, 2.07,
  1.21, 1.88, 1.65,
];
// N=100, M(2.3*0.65)=M(1.495) SD(0.4), remove min,min,max,max,max -> N_total = 95
var gaussR0_23_I_35 = [
  1.495, 1.65, 1.13, 1.29, 0.83, 1.22, 1.15, 1.78, 1.53, 1.31, 1.32, 0.88, 1.74, 2.05, 1.25, 0.82, 0.74, 1.61, 1.27, 1.47, 1.57, 1.2, 1.4,
  0.73, 2.11, 1.87, 1.44, 1.57, 1.68, 1.4, 1.9, 1.22, 1.36, 1.44, 1.43, 1.92, 1.77, 1.41, 1.36, 1.51, 0.79, 1.51, 1.78, 1.32, 1.59, 1.5,
  1.35, 1.14, 2.04, 1.48, 1.99, 1.97, 1.78, 0.86, 1.01, 1.78, 1.35, 1.08, 1.59, 1.28, 1.76, 1.04, 1.64, 1.08, 1.95, 1.51, 1.21, 1.66, 1.26,
  1.18, 1.92, 1.89, 1.26, 2.04, 1.7, 1.36, 1.29, 1.37, 1.54, 1.41, 2.06, 0.68, 1.41, 1.17, 1.94, 1.65, 1.52, 1.35, 1.64, 2.03, 1.25, 1.34,
  1.49, 1.16, 1.36,
];
// N=100, M(2.3*0.55)=M(1.265) SD(0.4), remove min,min,max,max,max -> N_total = 95
var gaussR0_23_I_45 = [
  1.265, 0.98, 1.25, 1.14, 1.33, 0.84, 0.91, 1.49, 1.33, 1.78, 1.16, 1.1, 1.22, 1.19, 0.86, 1.44, 1.57, 1.24, 1.08, 1.05, 1.28, 1.49, 1.18,
  1.31, 0.71, 1.23, 1.36, 1.15, 1.56, 1.05, 0.62, 0.73, 1.17, 1.21, 1.31, 1.73, 0.98, 1.65, 2.06, 1.73, 1.3, 1.55, 1.32, 0.67, 2.15, 1,
  1.14, 0.57, 1.42, 0.86, 1.38, 1.62, 1.61, 1.87, 1.62, 1.03, 0.84, 1.84, 1.08, 1.97, 1.64, 1.35, 1.81, 1.72, 2.17, 1.37, 0.89, 1.53, 1.24,
  1.39, 0.69, 1.76, 1.98, 1, 1.43, 1.39, 1.11, 1.72, 1.28, 2.04, 1.41, 1.21, 1.01, 1.42, 1.42, 1.45, 1.11, 1.15, 1.12, 1.35, 1.72, 1, 1.14,
  1.63, 0.94,
];

const gauss15 = {
  R0: gaussR0_15,
  intervention25: gaussR0_15_I_25,
  intervention50: gaussR0_15_I_50,
  intervention75: gaussR0_15_I_75,
};

const gauss17 = {
  R0: gaussR0_17,
  intervention25: gaussR0_17_I_25,
  intervention50: gaussR0_17_I_50,
  intervention75: gaussR0_17_I_75,
};

const allSzenarios = [
  { R0: R0A, eta: etaA, I1: I1A, id: 111, gauss: gauss15 },
  { R0: R0A, eta: etaA, I1: I1B, id: 112, gauss: gauss15 },
  { R0: R0A, eta: etaB, I1: I1A, id: 121, gauss: gauss15 },
  { R0: R0A, eta: etaB, I1: I1B, id: 122, gauss: gauss15 },
  { R0: R0B, eta: etaA, I1: I1A, id: 211, gauss: gauss17 },
  { R0: R0B, eta: etaA, I1: I1B, id: 212, gauss: gauss17 },
  { R0: R0B, eta: etaB, I1: I1A, id: 221, gauss: gauss17 },
  { R0: R0B, eta: etaB, I1: I1B, id: 222, gauss: gauss17 },
];

var szenarioIDs = [111, 112, 121, 122, 211, 212, 221, 222];

var currentSzenario, currentVisualisation;
// . Uncertainty Mode Infos
var allVisualisations = ["ensemble", "conf", "hop"];
var currentVisualisation;
const saveArray = [];
var viewConfidence = false;

initializeSzenario();
// var currentSzenario = allSzenarios[Math.floor(Math.random() * (allSzenarios.length - 1))];
// var currentSzenario = allSzenarios.find(e=> e.id == sessionStorage.getItem("SzenarioID"));

// . Initial Values
const initsSEIHR = {
  exposed: 750000, // persons in incubation period
  infected: function () {
    return population * currentSzenario.I1;
  }, // contagious people
  hospitalized: function () {
    return this.infected() * currentSzenario.eta;
  }, // people in hospitalcurrentSzenario.eta
  recovered: 6531900, // recovered ersons
  susecptible: function () {
    return population - this.exposed - this.infected() - this.hospitalized() - this.recovered;
  }, // everyone else could get infected
};

// . Parameters
const params = {
  R0: function () {
    return currentSzenario.R0;
  }, // average new infected per sick person
  alpha: 1 / 4, // Time until someone is contagious
  gamma: 1 / 5, // Duration of Illness;
  beta: function () // Contagion level: average infected person per sick person per day
  {
    return currentSzenario.R0 * this.gamma;
  },
  omega: 1 / 180, // time to loss of immunity
  eta: function () {
    return currentSzenario.eta;
  }, // hospitalisation Rate
  theta: 1 / 8, // time spend in Hospitals
  reportRate: 0.4, // percent of reported Cases
  seasonalEffect: 0.5, // how much effect the season has
};

var isSeasonal = true;

// . Time line Infos
const tMax = 180; // total time span shown on y axis in days
const firstDateOfGraph = new Date(2030, 1, 1); // Date of y(0)
const startingDateSimulation = new Date(2030, 1, 1); // Date of first SEIHR Day
const dayOffset = Math.round((startingDateSimulation - firstDateOfGraph) / 1000 / 60 / 60 / 24); // Number of Days based on actuall Data
const numberOfCalculatedDays = tMax - dayOffset; // Number of Days based on SEIHR Calculation

const firstDateAPIData = new Date(2022, 9, 1);
const lastDateAPIData = new Date(2022, 10, 1);

const today = new Date(Date.now()); // Today
const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const hospitalDays = Math.round((today0 - firstDateAPIData + (lastDateAPIData - firstDateAPIData)) / 1000 / 60 / 60 / 24) + 2; //number of days back to y(0), based on today

const earliestInterventionStart = new Date(2030, 1, 15);
const lastInterventionEnd = new Date(2030, 4, 15);
const lengthOfInterventionInput = Math.round((lastInterventionEnd - earliestInterventionStart) / 1000 / 60 / 60 / 24);
const timeUntilEarliestIntervention = Math.round((earliestInterventionStart - firstDateOfGraph) / 1000 / 60 / 60 / 24);
const timeAfterLastIntervention = Math.round((tMax - lastInterventionEnd) / 1000 / 60 / 60 / 24);

// . Intervention
const intervention = {
  name: "none",
  effect: 0.0,
  start: Math.round(lengthOfInterventionInput * 0.25), // start day of Intervention
  end: Math.round(lengthOfInterventionInput * 0.75), // end day of Intervention
  minimalDuration: 14,
};

// . Axis Label Infos
const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const yAxisMax = 2500000;
const yAxisInterval = 1000000; // Y axis Tik-intervall

// . Animation Infos
const maxFrame = 95; //total number of frames
var currentFrame = 1;
var animationPlays = false;
// 100 maybe too fast | 200 felt good | 400 felt slow
const timePerFrame = 400; //time per frame in ms

// . Graphics Dimension
const margin = { top: 0, right: 10, bottom: 50, left: 150 };
const totalHeight = 400; // total height of SVG
const height = totalHeight - margin.top - margin.bottom; // height of diagramm
const totalWidth = 1800; // total width of  svg
const width = totalWidth - margin.right - margin.left; // width of diagramm
const strokeWidth = 3.5;

// . HTML Elemente
const modelField = document.getElementById("modelField");
const selections = document.getElementById("selections");
const rangeInputs = document.querySelectorAll(".range-input input"); //[range-min, range-max]
const rangeInputDiv = document.querySelector(".range-input");
const slider = document.querySelector(".slider");
const sliderDiv = document.querySelector(".sliderDiv");
const minLine = document.querySelector(".vlinemin");
const maxLine = document.querySelector(".vlinemax");
const progress = document.querySelector(".progress");
const minTag = document.querySelector("#minTag");
const maxTag = document.querySelector("#maxTag");

const checkboxes = document.getElementsByClassName("legend-checkbox");
const legendStrokes = document.querySelectorAll(".legend line");

const title = document.querySelector("h1");

const frameControll = document.querySelector(".frameControll");
const playButton = document.getElementById("play");
const frameNrObject = document.getElementById("frameNr");

const nextScenarioInput = document.getElementById("nextSzenarioBtn");
const interventionRadioButtons = {
  none: document.getElementById("interventionNoneBtn"),
  low: document.getElementById("interventionLowBtn"),
  middle: document.getElementById("interventionMiddleBtn"),
  high: document.getElementById("interventionHighBtn"),
};

const acc = document.getElementsByClassName("accordion");
const explanationDiv = document.getElementById("InfotextVis");
const tabContentDiv = document.getElementsByClassName("tabcontent");
const tabDiv = document.querySelector(".tab");

const textEtaField = document.getElementById("textEta");
const textI1Field = document.getElementById("textI1");

const dialog = document.getElementById("dialog");
const dialogBtn = document.getElementById("dialogNxtBtn");
const disabledTime = 3;

//. tutorial
var tutorialIsDone = false;
const explanations = document.getElementById("explanations");
const tutorial = document.getElementById("tutorial");
const tutorialText = document.querySelector("#tutorial p");
const dialogContainer = document.querySelector(".dialogContainer");

// . Graphs S-E-I-H-R-S
const graphH = {
  id: "H",
  data: [
    {
      x: startingDateSimulation,
      y: function () {
        return getLast(this.historic).y;
      },
    },
  ],
  historic: [{ x: firstDateOfGraph, y: initsSEIHR.hospitalized() }],
  color: "#EE6677",
  isVisible: true,
};

// . Graphs I-Confidence, H-Confidence, Hospital Beds
const graphConfI = {
  id: "ConI",
  top: [],
  bottom: [],
  color: "#22883333",
  isVisible: true,
};

const graphConfH = {
  id: "ConH",
  top: [],
  bottom: [],
  color: "#EE667733",
  isVisible: true,
};

const graphHsp = {
  id: "Hsp",
  color: "#4477AA",
  isVisible: true,
  dashArray: "5, 5",
};

const allGraphs = [graphH];

// . Save
var finishedExperiment = false;
var usedHOP = false;
var highestViewedFrame = 1;
var numberOfInterventionChanges = 0;

// . Texts
const ensemble_Explanation = "Die hier dargestellten Linien der Bettenbelegung sind ein <b>Ensemble</b> von den 95 möglichen Verläufen";
const CI_Explanation =
  "Die hier dargestellten Linien der Bettenbelegung stellen den täglichen <b>Mittelwert</b> aller <b>vorhergesagten Verläufe</b> dar. Die Fläche um den Mittelwert repräsentiert das tägliche <b>95%-Konfidenz-Intervall</b>. Das sind die mittleren 95% aller vorhergesagten Verläufe. Die extremsten 5%, also die schwersten und glimpflichsten Vorhersagen, sind nicht dargestellt.";
const HOP_Explanation =
  "Die hier dargestellten Linien der Bettenbelegung werden als sogenannter <b>Hypothetical Outcome Plot</b> (HOP) präsentiert. Das ist eine Animation, die die mittleren 95% der Vorhersagen zeigt. <b>Klicken Sie den Play-Button</b>, um die Animation zu starten. Sie können die Animation auch pausieren und sich manuell durch die einzelnen Vorhersagen klicken.";

// . Helper Functions
/**
 * The function adds a number of days to a given date.
 * @param {Date} date Initial Date
 * @param {number} days Number of Days
 * @returns Date modified by "days" days.
 */
function addDaysToDate(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/**
 * Returns the last object of an array
 * @param {object[]} array
 * @returns last object of array
 */
function getLast(array) {
  return array[array.length - 1];
}

function getSzenarioByID(id) {
  return allSzenarios.find((e) => e.id == id);
}

function initializeSzenario() {
  //get current state of Storage
  if (sessionStorage.getItem("UV_Type") == null && sessionStorage.getItem("Szenario_ID") == null) {
    //select Szenario
    currentSzenario = getSzenarioByID(szenarioIDs[Math.floor(Math.random() * (szenarioIDs.length - 1))]);
    sessionStorage.setItem("Szenario_ID", currentSzenario.id);
    sessionStorage.setItem("Szenario_ID_List", szenarioIDs.join(","));

    //select Visualisation
    currentVisualisation = allVisualisations[Math.floor(Math.random() * allVisualisations.length)];
    sessionStorage.setItem("UV_Type", currentVisualisation);
    sessionStorage.setItem("UV_List", allVisualisations.join(","));

    // sessionStorage.setItem(currentVisualisation, "haha");
  } else {
    //Set Szenario
    currentSzenario = allSzenarios.find((e) => e.id == sessionStorage.getItem("Szenario_ID"));
    szenarioIDs = sessionStorage.getItem("Szenario_ID_List").split(",");
    //set UV Type
    currentVisualisation = sessionStorage.getItem("UV_Type");

    //load save Array
    allVisualisations.forEach((element) => {
      if (sessionStorage.getItem(element) !== null) {
        saveArray.push(JSON.parse(sessionStorage.getItem(element)));
      }
    });
    allVisualisations = sessionStorage.getItem("UV_List").split(",");
  }
}
