//setup initial empty arrays 
  var samples = [];
  var names = [];
  var otu_idValues= [];
  var sample_values=[];
  var metadata=[];  
  var otu_labels = [];  

const url = "data/samples.json";

//update page based on dropdown selection
function optionChanged (d) {
  console.log("option changed function");
  const isNumber = (element) => element === d;
  var idx = (names.findIndex(isNumber));
  d3.selectAll("td").remove();
  d3.selectAll("option").remove();
  var dropMenu = d3.select("#selDataset")
    dropMenu.append("option").text(d);  
  init(idx);
}

//call function to plot  
   
//fill the above arrays
function init (i){
  d3.json(url).then((object) => {
    console.log(object);
    names = object.names;
    var otu_idValues = object.samples[i].otu_ids;
    var sample_values = object.samples[i].sample_values;
    var otu_labels= object.samples[i].otu_labels;
    var metadata = object.metadata[i];    
    
    var dropMenu = d3.select("#selDataset")
    // d3.selectAll("option").remove();
    for (i in names){
      var newOption=dropMenu.append("option")
      newOption.text(names[i]);
    }
//labels for chart
    var otu_ids =[];
    otu_idValues.forEach(val => {
      otu_ids.push(`OTU ${val}`);
      });
  
//sliced sample values for bar graph, reverse so graph is desc
    var slicedSampleValues = sample_values.slice(0,10).reverse();
    var slicedOtu_ids = otu_ids.slice(0,10).reverse();
    
//check if you need to
    // console.log(names);    
    // console.log(`otu_ids: ${otu_ids}`);   
    // console.log(`otu_idValues: ${otu_idValues}`);  
    // console.log(`sorted_otuIdValues: ${sortedIdValues}`);  
    // console.log(`sample_values: ${sample_values}`);  
    // console.log(`sortedSampleValues: ${sortedSampleValues}`);  
    // console.log(`slicedSampleValues: ${slicedSampleValues}`); 
    // console.log(metadata);  
    // console.log (`otu_labels: ${otu_labels}`);
    
//bar chart
  var trace1={
    x: slicedSampleValues,
    y: slicedOtu_ids,
    text: otu_ids,
    type: "bar",
    orientation: "h"
  };
  var data= [trace1];
  var layout = {title: "Sample OTU"}
  Plotly.newPlot("plot", data, layout, width = 500);

// //metadata panel
var panel = d3.select("#sample-metadata");
var table = panel.append("table");
var tbody = table.append("tbody");
Object.keys(metadata).forEach(function(key) {
    d3.select("tbody");
    var row = tbody.append("tr");
    var cell = row.append("td");
    cell.text(`${key}: `);
    var cell = row.append("td");
    cell.text(metadata[key]);
});

// //gauge plot  
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: metadata.wfreq,
      title: { text: 'Belly Button Washing Frequency<br>Scrubs per week' },
      type: "indicator",
      mode: "gauge+number",
      gauge: { axis: { range: [null, 9] }}
    }
  ];
  
  var layout = { 
    width: 500, 
    height: 400,
    margin: { t: 0, b: 0 } 
    };
  Plotly.newPlot('gauge', data, layout);

var bubbleSizes= sample_values.map( i => {return i*50})

//bubble plot
var trace2 = {
  x: otu_idValues,
  y: sample_values,
  text: otu_labels,
  mode: 'markers',
  marker: {
    size: bubbleSizes,
    sizemode: 'area',
    color: otu_idValues
  }
};

var data = [trace2];

var layout = {
  title: 'Sample values of each OTU',
  xaxis:{title: "OTU ID"},
  showlegend: false,
  height: 600,
  width: 1150
};

Plotly.newPlot('bubble', data, layout);

})};
  init(0); 
console.log(names);
