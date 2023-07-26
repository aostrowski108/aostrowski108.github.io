// main.js - Your D3.js code goes here

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Declare the chart dimensions and margins.
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Declare the x (horizontal position) scale.
const x = d3.scaleUtc()
    .domain([new Date("2023-01-01"), new Date("2024-01-01")])
    .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

// Create the SVG container.
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

// Add the x-axis.
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

// Add the y-axis.
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

// Function to append the SVG element to the container.
function appendSVG(containerElement) {
    containerElement.append(svg.node());

    // Add a bar for May with the value 50.
    const mayValue = 50;
    const xMay = x(new Date("2023-05-01"));
    const yMay = y(mayValue);
    const barWidth = x(new Date("2023-06-01")) - x(new Date("2023-05-01")) - 2; // 2 pixels spacing between bars

    svg.append("rect")
        .attr("x", xMay)
        .attr("y", yMay)
        .attr("width", barWidth)
        .attr("height", height - marginBottom - yMay)
        .attr("fill", "steelblue");
}

// Get the container element by ID and call the function.
const container = document.getElementById("container");
appendSVG(container);
