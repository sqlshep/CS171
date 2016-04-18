// Reference: https://bl.ocks.org/mbostock/3886208

$('document').ready(function() {

    var continentCountry = "Continent";
    var selectedContinent;
    var selectedCountry;
    var selectedIssue;
    // Define continent data
    var continents = ["Africa", "Asia", "Australia", "Europe", "North America", "South America"];
    //var continents = ["Africa", "Antarctica", "Asia", "Australia", "Europe", "North America", "South America"];
    var continentData = [];
    var countryData = [];
    var filterData = [];
    var continentObject = {};
    var continentName;
    var continent100TotalVote;
    var continent101TotalVote;
    var continent102TotalVote;
    var continent103TotalVote;
    var continent104TotalVote;
    var continent105TotalVote;
    var continent106TotalVote;
    var continent107TotalVote;
    var continent108TotalVote;
    var continent109TotalVote;
    var continent110TotalVote;
    var continent111TotalVote;
    var continent112TotalVote;
    var continent113TotalVote;
    var continent114TotalVote;
    var continent115TotalVote;
    var continentTotalVote;

    // Set margin, width and height for SVG drawing
    var cmargin = {top:50, right:20, bottom:100,left:60},
        cwidth = 1100 - cmargin.left - cmargin.right,
        cheight = 600 - cmargin.top - cmargin.bottom;

    // Define color and issue domain (same, the 16 issues)
    var colorIssueDomain = ["100", "101","102","103","104","105","106","107","108","109","110","111","112","113","114","115"]
    // Define color range as per colors used on UN website
    var colorRange = ["#fcb749", "#fbe792", "#233884", "#97d3c9", "#ca3a28", "#47c0be", "#2da9e1", "#7cb5d6", "#a01c40", "#b0d256", "#71be45", "#387195", "#723390", "#dec0ca", "#c84699", "#e8168b"];
    // Define issue range (i.e. the 16 issues)
    var issueRange = ["Action taken on climate change",
        "Better transport and roads",
        "Support for people who can't work",
        "Access to clean water and sanitation",
        "Better healthcare",
        "A good education",
        "A responsive government we can trust",
        "Phone and internet access",
        "Reliable energy at home",
        "Affordable and nutritious food",
        "Protecting forests, rivers and oceans",
        "Protection against crime and violence",
        "Political freedoms",
        "Freedom from discrimination and persecution",
        "Equality between men and women",
        "Better job opportunities"];

    // Setup color scale (to choose color based on the issue code)
    var colorScale = d3.scale.ordinal()
        .domain(colorIssueDomain)
        .range(colorRange);

    // Setup issue scale (to choose text of issue based on issue code)
    var issueScale = d3.scale.ordinal()
        .domain(colorIssueDomain)
        .range(issueRange);

    // Setup scale for x (continent or country)
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, cwidth],.1);

    // Setup scale for y (votes)
    var y = d3.scale.linear()
        .range([cheight, 0]);

    // Define x-axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // Define y-axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // Define svg area
    // Class "removable" allows for the complete removal and redraw of SVG
    var svg = d3.select(".stackedbarchart").append("svg")
        .attr("width", cwidth + cmargin.left + cmargin.right)
        .attr("height", cheight + cmargin.top + cmargin.bottom)
        .attr("class", "removable")
        .append("g")
        .attr("transform", "translate(" + cmargin.left + "," + cmargin.top + ")");

    // Load in the data
    queue()
    .defer(d3.csv, "data/UN-Population.csv")
    .defer(d3.csv, "data/TotalVotesPerPriorityByCountry.csv")
    .await(function(error, population, priorities) {

    // Setup data so Population and Continent data is included
    for (var i = 0; i < priorities.length; i++) {
        for (var j = 0; j < population.length; j++) {
            if (priorities[i].countryName.toUpperCase() == population[j].Country.toUpperCase()) {
                priorities[i].population = parseInt(population[j].population);
                priorities[i].continent = population[j].Continent.toUpperCase();
            }
        }
        // Convert all votes to integer value
        for (var k = 0; k < priorities.length; k++) {
            if (priorities[i].countryName.toUpperCase() == priorities[k].countryName.toUpperCase()) {
                priorities[i][100] = parseInt(priorities[k][100]);
                priorities[i][101] = parseInt(priorities[k][101]);
                priorities[i][102] = parseInt(priorities[k][102]);
                priorities[i][103] = parseInt(priorities[k][103]);
                priorities[i][104] = parseInt(priorities[k][104]);
                priorities[i][105] = parseInt(priorities[k][105]);
                priorities[i][106] = parseInt(priorities[k][106]);
                priorities[i][107] = parseInt(priorities[k][107]);
                priorities[i][108] = parseInt(priorities[k][108]);
                priorities[i][109] = parseInt(priorities[k][109]);
                priorities[i][110] = parseInt(priorities[k][110]);
                priorities[i][111] = parseInt(priorities[k][111]);
                priorities[i][112] = parseInt(priorities[k][112]);
                priorities[i][113] = parseInt(priorities[k][113]);
                priorities[i][114] = parseInt(priorities[k][114]);
                priorities[i][115] = parseInt(priorities[k][115]);


                priorities[i].TotalVotes = parseInt(priorities[k][100]) +
                    parseInt(priorities[k][101]) + parseInt(priorities[k][102]) +
                    parseInt(priorities[k][103]) + parseInt(priorities[k][104]) +
                    parseInt(priorities[k][105]) + parseInt(priorities[k][106]) +
                    parseInt(priorities[k][107]) + parseInt(priorities[k][108]) +
                    parseInt(priorities[k][109]) + parseInt(priorities[k][110]) +
                    parseInt(priorities[k][111]) + parseInt(priorities[k][112]) +
                    parseInt(priorities[k][113]) + parseInt(priorities[k][114]) +
                    parseInt(priorities[k][115]);

            }
        }
    }

    // countryData will be used when the switch selection is set as "Countries"
    countryData = priorities;


    // Construct continent data
    // Loop through all data and add up the total votes of each issue for each continent
    for (var l = 0; l < continents.length; l++) {
        continentObject = {};
        continentName = continents[l];
        continent100TotalVote = 0;
        continent101TotalVote = 0;
        continent102TotalVote = 0;
        continent103TotalVote = 0;
        continent104TotalVote = 0;
        continent105TotalVote = 0;
        continent106TotalVote = 0;
        continent107TotalVote = 0;
        continent108TotalVote = 0;
        continent109TotalVote = 0;
        continent110TotalVote = 0;
        continent111TotalVote = 0;
        continent112TotalVote = 0;
        continent113TotalVote = 0;
        continent114TotalVote = 0;
        continent115TotalVote = 0;
        continentTotalVote = 0;
        for (var m = 0; m < priorities.length; m++) {
            if (priorities[m].continent == continents[l].toUpperCase()) {
                continent100TotalVote += priorities[m][100];
                continent101TotalVote += priorities[m][101];
                continent102TotalVote += priorities[m][102];
                continent103TotalVote += priorities[m][103];
                continent104TotalVote += priorities[m][104];
                continent105TotalVote += priorities[m][105];
                continent106TotalVote += priorities[m][106];
                continent107TotalVote += priorities[m][107];
                continent108TotalVote += priorities[m][108];
                continent109TotalVote += priorities[m][109];
                continent110TotalVote += priorities[m][110];
                continent111TotalVote += priorities[m][111];
                continent112TotalVote += priorities[m][112];
                continent113TotalVote += priorities[m][113];
                continent114TotalVote += priorities[m][114];
                continent115TotalVote += priorities[m][115];
            }
        }
        continentObject.continent = continentName;
        continentObject[100] = continent100TotalVote;
        continentObject[101] = continent101TotalVote;
        continentObject[102] = continent102TotalVote;
        continentObject[103] = continent103TotalVote;
        continentObject[104] = continent104TotalVote;
        continentObject[105] = continent105TotalVote;
        continentObject[106] = continent106TotalVote;
        continentObject[107] = continent107TotalVote;
        continentObject[108] = continent108TotalVote;
        continentObject[109] = continent109TotalVote;
        continentObject[110] = continent110TotalVote;
        continentObject[111] = continent111TotalVote;
        continentObject[112] = continent112TotalVote;
        continentObject[113] = continent113TotalVote;
        continentObject[114] = continent114TotalVote;
        continentObject[115] = continent115TotalVote;
        continentObject.Total = continentObject[100] + continentObject[101] +continentObject[102] + continentObject[103] + continentObject[104] +
            continentObject[105] + continentObject[106] + continentObject[107] + continentObject[108] + continentObject[109] +
            continentObject[110] + continentObject[111] + continentObject[112] + continentObject[113] + continentObject[114] + continentObject[115];

        // continentData will be used when switch selection is set as "Continents"
        continentData.push(continentObject);
    }

    // Call wrangleData() to manipulate with the data for drawing based on current screen input (i.e. the Continent / Country switch and the drop boxes)
    wrangleData();

    });

// if any of the switch or dropbox changes, call wrangleData() as well to manipulate data for drawing
d3.select("#continentcountry").on("change", wrangleData);
d3.select("#selectcontinent").on("change", wrangleData);
d3.select("#selectcountry").on("change", wrangleData);
d3.select("#selectissue").on("change", wrangleData);

    function wrangleData() {

        // First check whether the switch is set as "Continent" or "Country"
        if($("#continentcountry").is(':checked'))
            continentCountry = "Continent";
        else
            continentCountry = "Country";

        // Also check the values of the drop down boxes
        selectedContinent = $('#selectcontinent').val();
        selectedCountry = $('#selectcountry').val();
        selectedIssue = $('#selectissue').val();

        if (continentCountry == "Continent") {
            // If switch is set as "Continent", hide the corresponding label and dropdown box for country
            $('.country').fadeOut(500);
            $('.continent').fadeIn(500);

            filterData = [];

            // Populate the filterData based on the Continent dropdown selection
            for (var i = 0; i < selectedContinent.length; i++) {
                for (var j = 0; j < continentData.length; j++) {
                    if (selectedContinent[i] == continentData[j].continent) {
                        filterData.push(continentData[j]);
                    }
                }
            }

            // For each entry of the filterData, add in more data for drawing the stacked bar chart
            filterData.forEach(function(d) {
                var y0 = 0;
                d.issues = colorScale.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name], votes: d[name]};  });
//                d.Totals = d.issues[d.issues.length - 1].y1;
            });

            // Setup of domain for y scale based on the filtered data
            y.domain([0, d3.max(filterData, function(d) { return d.Total; })]);

            // If single issue is selected
            if (selectedIssue !== "All") {

              var tempFilterData = [];
              var tempFilterDataObject0;
              var tempFilterDataObject1;
              var tempFilterDataObject2;

                // setup data in the correct format with only the continent name, the number of votes for that issue and the issue code
                for (var i = 0; i < filterData.length; i++) {
                    tempFilterDataObject0 = selectedIssue
                     tempFilterDataObject1 = filterData[i].continent;
                     tempFilterDataObject2 = filterData[i][selectedIssue];
                     tempFilterData.push( {"name": tempFilterDataObject0, "continent": tempFilterDataObject1, "votes": tempFilterDataObject2});
                }

                filterData = tempFilterData;

                // Re-setup domain of y scale as it is changed based on the selected issue
                y.domain([0, d3.max(filterData, function(d) { return d.votes; })]);

            }
            // Setup of domain for x scale (similar domain for either all issues are selected or single issue is selected)
            x.domain(selectedContinent);


        } else if (continentCountry == "Country") {

            // If switch is set as "Country", hide the corresponding label and dropdown box for continent
            $('.continent').fadeOut(500);
            $('.country').fadeIn(500);

            filterData = [];

            // Populate the filterData based on the Country dropdown selection
            for (var i = 0; i < selectedCountry.length; i++) {
                for (var j = 0; j < countryData.length; j++) {
                    if (selectedCountry[i] == countryData[j].countryName) {
                        filterData.push(countryData[j]);

                    }
                }
            }

            // For each entry of the filterData, add in more data for drawing the stacked bar chart
            filterData.forEach(function(d) {
                var y0 = 0;
                d.issues = colorScale.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name], votes: d[name]};  });
                d.Totals = d.issues[d.issues.length - 1].y1;
            });

            // Setup of domain for y scale based on filtered data
            y.domain([0, d3.max(filterData, function(d) { return d.Totals; })]);

            // If single issue is selected
            if (selectedIssue !== "All") {

                var tempFilterData = [];
                var tempFilterDataObject0;
                var tempFilterDataObject1;
                var tempFilterDataObject2;

                // setup data in the correct format with only the country name, the number of votes for that issue and the issue code
                for (var i = 0; i < filterData.length; i++) {
                    tempFilterDataObject0 = selectedIssue
                    tempFilterDataObject1 = filterData[i].countryName;
                    tempFilterDataObject2 = filterData[i][selectedIssue];
                    tempFilterData.push( {"name": tempFilterDataObject0, "country": tempFilterDataObject1, "votes": tempFilterDataObject2});
                }

                filterData = tempFilterData;

                // Re-setup domain of y-scale as it has been changed based on the selected issue
                y.domain([0, d3.max(filterData, function(d) { return d.votes; })]);

            }
            // Setup of domain for x scale (similar domain for either all issues are selected or single issue is selected)
            x.domain(selectedCountry);

        }

        // Call updateVis() to draw data
        updateVis();
    }

    function updateVis() {

        // First we have to remove the existing SVG and create a fresh one (to clear existing drawings)
        d3.select(".removable").remove();

        svg = d3.select(".stackedbarchart").append("svg")
            .attr("width", cwidth + cmargin.left + cmargin.right)
            .attr("height", cheight + cmargin.top + cmargin.bottom)
            .attr("class", "removable")
            .append("g")
            .attr("transform", "translate(" + cmargin.left + "," + cmargin.top + ")");

        // Define tooltip
        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([5, 0])
            .html(function(d){return "<p>" + issueScale(d.name)  + "</p> Votes: " + d.votes });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + cheight + ")")
//            .attr("transform", "rotate(-1)")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "0.6em")
            .attr("transform", function(d) {
                return "rotate(-45)"
            })
            .call(wrap, x.rangeBand() - 70);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Votes");

        // Draw data based on the selection before

        if (continentCountry == "Continent") {
            if (selectedIssue == "All") {

                // If switch is set as "Continent" and all issues are selected
                // draw stacked bar chart
                var bar = svg.selectAll(".bar")
                    .data(filterData)
                    .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function (d) {
                        return "translate(" + x(d.continent) + ",0)";
                    });
                bar.selectAll("rect")
                    .data(function (d) {
                        return d.issues;
                    })
                    .enter().append("rect")
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {
                        return y(d.y1);
                    })
                    .attr("height", function (d) {
                        return y(d.y0) - y(d.y1);
                    })
                    .style("fill", function (d) {
                        return colorScale(d.name);
                    })
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide);
            } else {

                // If switch is set as "Continent" and single issue is selected
                // draw normal bar chart
                var bar = svg.selectAll(".bar")
                    .data(filterData)
                    .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function (d) {
                        return "translate(" + x(d.continent) + ",0)";
                    })
                    .attr("width", x.rangeBand())
                    .append("rect")
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) {
                        return y(d.votes);
                    })
                    .attr("height", function (d) {
                        return cheight - y(d.votes);
                    })
                    .style("fill", function (d) {
                        return colorScale(d.name);
                    })
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide);
            }
        } else if (continentCountry == "Country") {

            // If switch is set as "Country" and all issues are selected
            // draw stacked bar chart
            if (selectedIssue == "All") {
                var bar = svg.selectAll(".bar")
                    .data(filterData)
                    .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function (d) {
                        return "translate(" + x(d.countryName) + ",0)";
                    });
                bar.selectAll("rect")
                    .data(function (d) {
                        return d.issues;
                    })
                    .enter().append("rect")
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {
                        return y(d.y1);
                    })
                    .attr("height", function (d) {
                        return y(d.y0) - y(d.y1);
                    })
                    .style("fill", function (d) {
                        return colorScale(d.name);
                    })
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide);

            } else {

                // If switch is set as "Country" and single issue is selected
                // draw normal bar chat
                var bar = svg.selectAll(".bar")
                    .data(filterData)
                    .enter().append("g")
                    .attr("class", "g")
                    .attr("transform", function (d) {
                        return "translate(" + x(d.country) + ",0)";
                    })
                    .attr("width", x.rangeBand())
                    .append("rect")
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) {
                        return y(d.votes);
                    })
                    .attr("height", function (d) {
                        return cheight - y(d.votes);
                    })
                    .style("fill", function (d) {
                        return colorScale(d.name);
                    })
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide);
            }
        }

        // Call the tool tip
        bar.call(tip);


    }

    // Reference: https://bl.ocks.org/mbostock/7555321
    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }


});


