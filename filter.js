// main.js - Your D3.js code goes here

// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
const d3 = window.d3;

// Function to calculate top 10 wins by country in descending order
function calculateTopTenWins2() {
    return fetch("results.csv")
        .then(response => response.text())
        .then(csvText => {
            const data = d3.csvParse(csvText);

            const winsByCountry = {};
            data.forEach(d => {
                const homeTeam = d.home_team;
                const awayTeam = d.away_team;
                const homeScore = +d.home_score; // Convert to a number
                const awayScore = +d.away_score; // Convert to a number
                const date = d.date;
                const year = +date.substring(0,4)

                // Check if the match resulted in a draw
                if (homeScore === awayScore) {
                    return;
                }

                // Determine the winning team and update winsByCountry
                const winner = homeScore > awayScore ? homeTeam : awayTeam;
                if (winner in winsByCountry && year === 1873) {
                    winsByCountry[winner]++;
                } else if (year === 1873) {
                    winsByCountry[winner] = 1;
                }
            });

            const topTenWins = Object.entries(winsByCountry)
                .map(([country, wins]) => ({ country, wins }))
                .sort((a, b) => b.wins - a.wins)
                .slice(0, 10);

            return topTenWins;
        })
        .catch(error => {
            console.error("Error fetching or processing CSV:", error);
            throw error; // Propagate the error to the caller if needed.
        });
}
const temp = await calculateTopTenWins2()
console.log(temp)

const width = 1200;
const height = 450;
const margin = { top: 50, bottom: 50, left: 50, right: 50 };
const svg = d3.select('#container')
    .append('svg')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, height]);

function renderChart(data) {
    data.sort((a, b) => d3.ascending(a.wins, b.wins));
    const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.wins)])
        .range([height - margin.bottom, margin.top]);

    const bars = svg.selectAll(".bar")
        .data(data, d => d.country);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.wins))
        .attr("height", d => y(0) - y(d.wins))
        .attr("width", x.bandwidth())
        .attr("fill", 'royalblue')
        .on("mouseover", (event, d) => { // Show tooltip on mouseover
            const tooltipContent = `Country: ${d.country}<br>International Wins: ${d.wins}`;
            tooltip.style("visibility", "visible").html(tooltipContent);
        })
        .on("mousemove", (event) => { // Move tooltip with mouse
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", () => { // Hide tooltip on mouseout
            tooltip.style("visibility", "hidden");
        });

    bars.attr("x", (d, i) => x(i))
        .attr("y", d => y(d.wins))
        .attr("height", d => y(0) - y(d.wins))
        .attr("width", x.bandwidth());

    bars.exit().remove();

    svg.select(".y-axis").remove();
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, "s"))
        .attr("font-size", '20px');

    svg.select(".y-axis-label").remove(); // Remove any existing y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -40)
        .attr("y", 300)
        .attr("dy", "-2.5em") // Adjust the vertical position of the label
        // .attr("transform", "rotate(-90)") // Rotate the label to be vertical
        .style("text-anchor", "middle")
        .style("font-size", "24px") // Set the font size here
        .text("Wins");

    svg.select(".x-axis").remove();
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].country))
        .attr("font-size", '20px');

    const annotations = [
        {
            note: {
                label: "England beat Scotland to win the first international game!", // The text for the annotation
                // title: "England beat Scotland to win the first international game!", // The title for the annotation
            },
            x: width - margin.right - 90, // Place the annotation on the right side
            y: 200, // y-coordinate of the annotation
            dx: 50, // x-offset of the annotation (optional)
            dy: 50, // y-offset of the annotation (optional)
        }
    ];
        
    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);
        
    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

const tooltip = d3.select("#container")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("padding", "8px 12px")
    .style("border-radius", "4px")
    .style("font-size", "14px")
    .style("pointer-events", "none") // Disable mouse events on the tooltip
    .style("visibility", "hidden");

// Initially, render the chart with the top ten wins data
renderChart(temp);


// Function to handle the "Next" button click
function handleNextButtonClick() {
    // Render the filter page with the interactive chart
    console.log("clicked next")
    window.location.href = 'index.html';
    // renderFilterPage();
}

function handleBackButtonClick() {
    // Render the filter page with the interactive chart
    console.log("clicked back")
    window.location.href = 'index.html';
    // renderFilterPage();
}

const nextButton = document.getElementById("nextButton");
nextButton.addEventListener("click", handleNextButtonClick);

const backButton = document.getElementById("backButton");
backButton.addEventListener("click", handleBackButtonClick);