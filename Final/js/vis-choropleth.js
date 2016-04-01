


d3.select(window).on("resize", throttle);


var mapWidth = document.getElementById('map-area').offsetWidth;
var mapHeight = mapWidth / 2;

var color = d3.scale.linear()
    .range(colorbrewer.Paired[12]);



var zoom = d3.behavior.zoom()
    .scaleExtent([1, 6])
    .on("zoom", move);

var topo,projection,path,svg, g,countries,domainRange,maxValue;

var labelWidth = 20, labelHeight = 20;

var tooltip = d3.select("#map-area").append("div").attr("class", "tooltip hidden");





loadData();


function loadData() {

    queue()
        .defer(d3.json, "data/world-topo.json")
        //http://esa.un.org/unpd/wpp/Download/Standard/Population/
        .defer(d3.csv, "data/UN-Population.csv")
        //d3.json("data/world-topo.json", function(error, world) {
        .await(function (error, world, population) {
            countries = topojson.feature(world, world.objects.countries).features;


            for (var i = 0; i < countries.length; i++){
                //console.log(countries[i].properties.name.toUpperCase());
                for (var j = 0 ; j < population.length; j++){
                    if(countries[i].properties.name.toUpperCase() == population[j].Country.toUpperCase()) {
                        countries[i].properties.population = parseInt(population[j].population);
                    }
                }
            }

            //for (var i = 0; i < countries.length; i++){
            //    if (!countries[i].properties.population){
            //        console.log(countries[i].properties.name);
            //    }
            //
            //}
            //console.log(countries);
            //console.log(population);
            topo = countries;

            drawMap();
            draw(topo);

        });
}


function drawMap(){
    projection = d3.geo.mercator()
        .translate([(mapWidth/2), (mapHeight/2)])
        .scale( mapWidth / 2 / Math.PI);

    //console.log([(mapWidth/2), (mapHeight/2)], " ",mapWidth / 2 / Math.PI);


    path = d3.geo.path()
        .projection(projection);

    svg = d3.select("#map-area").append("svg")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .call(zoom)
        .on("click", click)
        .append("g");

    g = svg.append("g");

    var legend = svg.selectAll("g.legend");

}


function draw(topo) {

    var country = g.selectAll(".country").data(topo);

    maxValue = d3.max(countries, function(d) {return d.properties.population});

    domainRange = ([0,
            (maxValue *.00001),
            (maxValue *.0001),
            (maxValue *.001),
            (maxValue *.01),
            (maxValue *.05),
            (maxValue *.10),
            (maxValue *.15),
            (maxValue *.25),
            (maxValue *1),
        ]);

    console.log(domainRange);
    color.domain(domainRange);

    //console.log(color.domain());

    country.enter()
        .insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
      //  .style("fill", function(d) { return d.properties.color; });
        .style("fill", function(d) { return color(d.properties.population); });


    var offsetL = document.getElementById('map-area').offsetLeft+20;
    var offsetT =document.getElementById('map-area').offsetTop+10;

    //tooltips
    country
        .on("mousemove", function(d) {
            var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
            tooltip
                .classed("hidden", false)
                .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
                .html(d.properties.name +
                    "<br>Population: " + d.properties.population.toLocaleString('en') )
        })
        .on("mouseout",  function(d) {
            tooltip.classed("hidden", true)
        });




    svg.selectAll("g.legend").remove()

    //legend

    svg.selectAll("g.legend")
        .data(domainRange)
        .enter()
        .append("g")
        .attr("class", "legend");

    updateLegend(maxValue);



}

function redraw() {
    mapWidth = document.getElementById('map-area').offsetWidth-60;
    mapHeight = mapWidth / 2;
    d3.select('svg').remove();
    drawMap();
    draw(topo);
}



function click() {
    var latlon = projection.invert(d3.mouse(this));

}


function move() {

    var t = d3.event.translate;
    var s = d3.event.scale;
    var h = mapHeight/4;


    t[0] = Math.min((mapWidth/mapHeight)  * (s - 1), Math.max( mapWidth * (1 - s), t[0] ));
    t[1] = Math.min(h * (s - 1) + h * s, Math.max(mapHeight  * (1 - s) - h * s, t[1]));

    zoom.translate(t);
    g.attr("transform", "translate(" + t + ")scale(" + s + ")");

    //adjust the country hover stroke mapWidth based on zoom level
    d3.selectAll(".country").style("stroke-width", 1.5 / s);
}

var throttleTimer;
function throttle() {
    window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
        redraw();
    }, 200);
}

function updateLegend(maxValue){


    legend = svg.selectAll("g.legend")
        .data(domainRange)
        .append("g")
        .attr("class", "legend");

    legend.append("rect")
        .transition()
        .attr("x", 20)
        .attr("y", function(d, i){ return mapHeight - (i*labelHeight) - 2*labelHeight+6;})
        .attr("width", labelWidth)
        .attr("height", labelHeight)
        .style("fill", function(d) { return color(d); })
        .style("opacity", 0.8);

    legend.append("text")
        .transition()
        .attr("x", 50)
        .attr("y", function(d, i){ return mapHeight - (i*labelHeight) - labelHeight ;})
        .text(function(d){ return d3.format(",")(d3.round(d)); });



}