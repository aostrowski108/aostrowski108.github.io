// main.js - Your D3.js code goes here

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Function to create an HTML table with the top 10 goal scorers
function createTopScorersTable(data) {
    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Player</th>
            <th>Goals</th>
        </tr>
    `;

    data.forEach((player) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player.scorer}</td>
            <td>${player.goals}</td>
        `;
        table.appendChild(row);
    });

    return table;
}

// Function to create the top 10 wins table and immediately append the data
function createTopTenWinsTable(data) {
    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Country</th>
            <th>Wins</th>
        </tr>
    `;

    data.forEach(({ country, wins }) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${country}</td>
            <td>${wins}</td>
        `;
        table.appendChild(row);
    });

    // Get the container element and append the top 10 wins table
    const topTenWinsContainer = document.getElementById("winsTable");
    topTenWinsContainer.appendChild(table);
}

// Read the "goalscorers.csv" file and process the data
fetch("goalscorers.csv")
    .then(response => response.text())
    .then(csvText => {
        const data = d3.csvParse(csvText);
        const goalScorers = {};

        data.forEach(d => {
            const scorer = d.scorer;
            if (scorer !== "NA") {
                if (scorer in goalScorers) {
                    goalScorers[scorer]++;
                } else {
                    goalScorers[scorer] = 1;
                }
            }
        });

        // Convert goalScorers object to an array of objects
        const topScorers = Object.entries(goalScorers)
            .map(([scorer, goals]) => ({ scorer, goals }))
            .sort((a, b) => b.goals - a.goals)
            .slice(0, 10);

        // Get the container element and append the top scorers table
        const topScorersContainer = document.getElementById("topScorers");
        topScorersContainer.appendChild(createTopScorersTable(topScorers));
    })
    .catch(error => console.error("Error fetching or processing CSV:", error));

// Read the "results.csv" file and process the data
fetch("results.csv")
    .then(response => response.text())
    .then(csvText => {
        const data = d3.csvParse(csvText);

        // Calculate top 10 wins by country in descending order
        const winsByCountry = {};

        data.forEach(d => {
            const homeTeam = d.home_team;
            const awayTeam = d.away_team;
            const homeScore = +d.home_score; // Convert to a number
            const awayScore = +d.away_score; // Convert to a number

            // Check if the match resulted in a draw
            if (homeScore === awayScore) {
                return;
            }

            // Determine the winning team and update winsByCountry
            const winner = homeScore > awayScore ? homeTeam : awayTeam;
            if (winner in winsByCountry) {
                winsByCountry[winner]++;
            } else {
                winsByCountry[winner] = 1;
            }
        });

        const topTenWins = Object.entries(winsByCountry)
            .map(([country, wins]) => ({ country, wins }))
            .sort((a, b) => b.wins - a.wins)
            .slice(0, 10);

        // Create and append the top 10 wins table
        createTopTenWinsTable(topTenWins);
    })
    .catch(error => console.error("Error fetching or processing CSV:", error));

    // Function to calculate top 10 wins by country and return an array of objects
function calculateTopTenWins(data) {
    const winsByCountry = {};

    data.forEach(d => {
        const homeTeam = d.home_team;
        const awayTeam = d.away_team;
        const homeScore = +d.home_score; // Convert to a number
        const awayScore = +d.away_score; // Convert to a number

        // Check if the match resulted in a draw
        if (homeScore === awayScore) {
            return;
        }

        // Determine the winning team and update winsByCountry
        const winner = homeScore > awayScore ? homeTeam : awayTeam;
        if (winner in winsByCountry) {
            winsByCountry[winner]++;
        } else {
            winsByCountry[winner] = 1;
        }
    });

    // Convert winsByCountry object to an array of objects and sort in descending order
    const topTenWins = Object.entries(winsByCountry)
        .map(([country, wins]) => ({ country, wins }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);

    
    console.log(topTenWins);
    return topTenWins;
}

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

                // Check if the match resulted in a draw
                if (homeScore === awayScore) {
                    return;
                }

                // Determine the winning team and update winsByCountry
                const winner = homeScore > awayScore ? homeTeam : awayTeam;
                if (winner in winsByCountry) {
                    winsByCountry[winner]++;
                } else {
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
        
        const x = d3.scaleBand()
            .domain(d3.range(temp.length))
            .range([margin.left, width - margin.right])
            .padding(0.1)
        
        const y = d3.scaleLinear()
            .domain([0, 800])
            .range([height - margin.bottom, margin.top])
        
        svg
            .append("g")
            .attr("fill", 'royalblue')
            .selectAll("rect")
            .data(temp.sort((a, b) => d3.ascending(a.wins, b.wins)))
            .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d.wins))
            .attr('title', (d) => d.wins)
            .attr("class", "rect")
            .attr("height", d => y(0) - y(d.wins))
            .attr("width", x.bandwidth())
            .on("mouseover", (event, d) => { // Show tooltip on mouseover
                const tooltipContent = `Country: ${d.country}<br>Goals Scored: ${d.wins}`;
                tooltip.style("visibility", "visible").html(tooltipContent);
              })
              .on("mousemove", (event) => { // Move tooltip with mouse
                tooltip.style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 20) + "px");
              })
              .on("mouseout", () => { // Hide tooltip on mouseout
                tooltip.style("visibility", "hidden");
              });

             // Append y-axis
        // Append y-axis
        svg.append("g")
            .call(g => yAxis(g, y, margin))
            .attr("font-size", '20px');

        // Append x-axis
        svg.append("g")
            .call(g => xAxis(g, x, temp, height, margin))
            .attr("font-size", '20px');


        function yAxis(g, yScale, margin) {
            g.attr("transform", `translate(${margin.left}, 0)`)
                .call(d3.axisLeft(yScale).ticks(null, "s")) // Use "s" for abbreviated number format (e.g., 1k instead of 1000)
        }
        
        // Custom x-axis function
        function xAxis(g, xScale, data, height, margin) { // Receive the height parameter
            g.attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale).tickFormat(i => data[i].country)) // Use country names for x-axis labels
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

    console.log("test")
    console.log(temp)