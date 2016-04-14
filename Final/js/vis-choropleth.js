


d3.select(window).on("resize", throttle);


var mapWidth = document.getElementById('map-area').offsetWidth ;
var mapHeight = mapWidth / 2 ;

//console.log(mapWidth, " ", mapWidth);

var color = d3.scale.linear()
    .range(colorbrewer.RdYlGn[11]);



var zoom = d3.behavior.zoom()
    .scaleExtent([1, 6])
    .on("zoom", move);

var topo,projection,path,svg, g,countries,domainRange,maxValue, UNpopulation,UNPri;

var labelWidth = 15, labelHeight = 15;

var tooltip = d3.select("#map-area").append("div").attr("class", "tooltip hidden");


loadData();


function loadData() {
    //population file from here
    //http://esa.un.org/unpd/wpp/Download/Standard/Population/

    queue()
        .defer(d3.json, "data/world-topo.json")
        .defer(d3.csv, "data/UN-Population.csv")
        .defer(d3.csv, "data/TotalVotesPerPriorityByCountry.csv")
        //.defer(d3.csv, "data/Priority.csv")
        .await(function (error, world, population,priorities ) {
            countries = topojson.feature(world, world.objects.countries).features;
            UNpopulation = population;
            UNPri = priorities;
            //console.log(UNPri);

            wrangleData();

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

    //domainRange = ([0,
    //        //(maxValue *.00001),
    //        //(maxValue *.0001),
    //        (maxValue *.001),
    //        (maxValue *.01),
    //        (maxValue *.05),
    //        (maxValue *.10),
    //        (maxValue *.125),
    //        (maxValue *.15),
    //        (maxValue *.175),
    //        (maxValue *.20),
    //        (maxValue *.35),
    //        (maxValue *1)
    //    ]);
        domainRange = ([
            (maxValue *1),
            (maxValue *.35),
            (maxValue *.20),
            (maxValue *.175),
            (maxValue *.15),
            (maxValue *.125),
            (maxValue *.10),
            (maxValue *.05),
            (maxValue *.01),
            (maxValue *.001),
            //(maxValue *.0001),
            //(maxValue *.00001),
            0   ]);

    //console.log(domainRange);
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
                    "<br>Population: " + (d.properties.population*1000).toLocaleString('en') +
                    "<br>Total Votes: " + d.properties.TotalVotes.toLocaleString('en')+
                    "<br>HDI: " + "100"
                )
                updateTable(d);
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
        .attr("y", function(d, i){ return mapHeight - (i*labelHeight) - 2*labelHeight+2;})
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
function wrangleData(){


    for (var i = 0; i < countries.length; i++){

        for (var j = 0 ; j < UNpopulation.length; j++){
            if(countries[i].properties.name.toUpperCase() == UNpopulation[j].Country.toUpperCase()) {
                countries[i].properties.population = parseInt(UNpopulation[j].population);
                countries[i].properties.continent = UNpopulation[j].Continent;
            }
        }
        for (var k = 0 ; k < UNPri.length; k++){
            if(countries[i].properties.name.toUpperCase() == UNPri[k].countryName.toUpperCase()){
                countries[i].properties[100] = parseInt(UNPri[k][100]);
                countries[i].properties[101] = parseInt(UNPri[k][101]);
                countries[i].properties[102] = parseInt(UNPri[k][102]);
                countries[i].properties[103] = parseInt(UNPri[k][103]);
                countries[i].properties[104] = parseInt(UNPri[k][104]);
                countries[i].properties[105] = parseInt(UNPri[k][105]);
                countries[i].properties[106] = parseInt(UNPri[k][106]);
                countries[i].properties[107] = parseInt(UNPri[k][107]);
                countries[i].properties[108] = parseInt(UNPri[k][108]);
                countries[i].properties[109] = parseInt(UNPri[k][109]);
                countries[i].properties[110] = parseInt(UNPri[k][110]);
                countries[i].properties[111] = parseInt(UNPri[k][111]);
                countries[i].properties[112] = parseInt(UNPri[k][112]);
                countries[i].properties[113] = parseInt(UNPri[k][113]);
                countries[i].properties[114] = parseInt(UNPri[k][114]);
                countries[i].properties[115] = parseInt(UNPri[k][115]);
                countries[i].properties.TotalVotes = parseInt(UNPri[k][100]) +
                    parseInt(UNPri[k][101]) + parseInt(UNPri[k][102]) +
                    parseInt(UNPri[k][103]) + parseInt(UNPri[k][104]) +
                    parseInt(UNPri[k][105]) + parseInt(UNPri[k][106]) +
                    parseInt(UNPri[k][107]) + parseInt(UNPri[k][108]) +
                    parseInt(UNPri[k][109]) + parseInt(UNPri[k][110]) +
                    parseInt(UNPri[k][111]) + parseInt(UNPri[k][112]) +
                    parseInt(UNPri[k][113]) + parseInt(UNPri[k][114]) +
                    parseInt(UNPri[k][115]);
            }
        }
    }




    //for (var i = 0; i < countries.length; i++){
    //    if (!countries[i].properties.population){
    //        console.log(countries[i].properties.name);
    //    }
    //
    //}

}
function updateTable(d){

    document.getElementById('countryName').innerHTML = d.properties.name.toLocaleString('en');
    document.getElementById('Pri-100').innerHTML = d.properties[100].toLocaleString('en');
    document.getElementById('PriPer-100').innerHTML =((d.properties[100]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-101').innerHTML = d.properties[101].toLocaleString('en');
    document.getElementById('PriPer-101').innerHTML = ((d.properties[101]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-102').innerHTML = d.properties[102].toLocaleString('en');
    document.getElementById('PriPer-102').innerHTML = ((d.properties[102]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-103').innerHTML = d.properties[103].toLocaleString('en');
    document.getElementById('PriPer-103').innerHTML = ((d.properties[103]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-104').innerHTML = d.properties[104].toLocaleString('en');
    document.getElementById('PriPer-104').innerHTML = ((d.properties[104]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-105').innerHTML = d.properties[105].toLocaleString('en');
    document.getElementById('PriPer-105').innerHTML = ((d.properties[105]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-106').innerHTML = d.properties[106].toLocaleString('en');
    document.getElementById('PriPer-106').innerHTML = ((d.properties[106]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-107').innerHTML = d.properties[107].toLocaleString('en');
    document.getElementById('PriPer-107').innerHTML = ((d.properties[107]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-108').innerHTML = d.properties[108].toLocaleString('en');
    document.getElementById('PriPer-108').innerHTML = ((d.properties[108]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-109').innerHTML = d.properties[109].toLocaleString('en');
    document.getElementById('PriPer-109').innerHTML = ((d.properties[109]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-110').innerHTML = d.properties[110].toLocaleString('en');
    document.getElementById('PriPer-110').innerHTML = ((d.properties[110]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-111').innerHTML = d.properties[111].toLocaleString('en');
    document.getElementById('PriPer-111').innerHTML = ((d.properties[111]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-112').innerHTML = d.properties[112].toLocaleString('en');
    document.getElementById('PriPer-112').innerHTML = ((d.properties[112]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-113').innerHTML = d.properties[113].toLocaleString('en');
    document.getElementById('PriPer-113').innerHTML = ((d.properties[113]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-114').innerHTML = d.properties[114].toLocaleString('en');
    document.getElementById('PriPer-114').innerHTML = ((d.properties[114]/d.properties.TotalVotes)* 100).toFixed(2)+"%";
    document.getElementById('Pri-115').innerHTML = d.properties[115].toLocaleString('en');
    document.getElementById('PriPer-115').innerHTML = ((d.properties[115]/d.properties.TotalVotes)* 100).toFixed(2)+"%";

}