function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);

     
    });

  });
}

// 1. Create the buildCharts function.
 function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples; 

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var otuArray = samples.filter(sampleOtu => sampleOtu.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var otuResult = otuArray[0]
    
    // var BAR = d3.select("#bar");
    // BAR.html("");

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
       
    var ids_otu = otuResult.otu_ids;
    var labels_otu = otuResult.otu_labels;
    var values_otu = otuResult.sample_values;
    // console.log(ids_otu);
    // console.log(values_otu);
   
                   
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
      
    var yticks = ids_otu.sort((a,b) => b.ids_otu - a.ids_otu).slice(0,10).reverse();
    var final = yticks.map(ids => "OTU " + ids);
    console.log (final);
    
    var xticks = values_otu.slice(0,10).reverse();
    // console.log(xticks);

    // 8. Create the trace for the bar chart. 
    var barTrace = {
      type: 'bar',
      x: xticks,
      y: final,
      orientation: 'h' ,
      text: labels_otu.reverse(),
      
    };
    
    var barData = [barTrace];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "<b>Top 10 Bacteria Cultures Found</b>"},
      xaxis: { title: "Sample Values"},
      height: 330,
      width: 450
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout )
    
    var yticksBubble = ids_otu.sort((a,b) => b.ids_otu - a.ids_otu).reverse();
    var finalBubble = yticksBubble.map(ids => ids);
    var xticksBubble = values_otu.reverse();

    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: finalBubble,
      y: xticksBubble,
      text: labels_otu,
      hoverinfo: "x+y+text",
      mode: "markers",
      marker: {size: xticksBubble, color: finalBubble, colorscale: "Earth"}
  };
    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "<b>Bacteria Cultures Per Sample</b>"},
      xaxis: { title: "OTU ID"},
      height: 450,
      width: 1180
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)


    // Step 1-3: Creating variables that holds arrays for the sample from metadata
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array.
      var metadata = data.metadata; 
  
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var gaugeArray = metadata.filter(sampleGauge => sampleGauge.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var gaugeResult = gaugeArray[0]
      // console.log(gaugeResult);
    // 4. Create the trace for the gauge chart.

     // Declaread Variable for Washing Frequency use on Gauge Chart
     var washF = gaugeResult.wfreq;
     console.log(washF);
      
     // washFResult = washF.map(wfreq => wfreq);
    //  console.log(washF);

    var gaugeTrace = {
          value: washF,
          type: "indicator",
          mode: "gauge+number",
          title: {text: "<br><b>Belly Button Washing Frequency</b></br>Scrubs per Week"},
          gauge: {
            axis: {range: [null, 10]},
            bar: {color: "grey"},
            steps: [
              {range: [0,2], color: "red"},
              {range: [2,4], color: "orange"},
              {range: [4,6], color: "gold"},
              {range: [6,8], color: "lightgreen"},
              {range: [8,10], color: "darkgreen"}
            ],
          }
    } 
    var gaugeData = [gaugeTrace];
     
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500, height: 330 };
     
   

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
      
  });
});
}