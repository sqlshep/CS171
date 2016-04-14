/**
 * Created by Shep on 4/12/16.
 */

function dontcallme() {
    return;


    queue()
        .defer(d3.csv, "data/UN-Population.csv")
        .defer(d3.csv, "data/TotalVotesPerPriorityByCountry.csv")
        //.defer(d3.csv, "data/Priority.csv")
        .await(function (error, population, priorities) {


            for (var i = 0; i < priorities.length; i++) {
                for (var j = 0; j < population.length; j++) {
                    if (priorities[i].countryName.toUpperCase() == population[j].Country.toUpperCase()) {
                        priorities[i].population = parseInt(population[j].population);
                        priorities[i].continent = population[j].Continent;
                    }
                }
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
            //console.log(population);
            console.log(priorities);

        });

}