import * as d3 from "d3";const population = 83200000; // Total population
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
  days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  shortMonths: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
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
  .text("Zeit");

svg
  .append("text") //Label
  .attr("text-anchor", "end")
  .attr("x", 1500)
  .attr("y", 275)
  .attr("fill", graphHsp.color)
  .attr("font-weight", "bold")
  .text("Verfügbare Krankenhausbetten");

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
  .text("Krankenhausbetten");

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
