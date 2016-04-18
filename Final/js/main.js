
// Will be used to the save the loaded JSON data
var allData = [];

// Date parser to convert strings to date objects
var parseDate = d3.time.format("%Y").parse;

// Variables for the visualization instances
var myScatter;


// Start application by loading the data
loadData();

function loadData() {
    d3.csv("data/PriorityAndDemographics.csv", function(error, csvData){
        if(!error){
            allData = csvData;
            createVis();
        }
    });
}

function createVis() {
    myScatter = new ScatterPlot("scatterVB",allData);
}

