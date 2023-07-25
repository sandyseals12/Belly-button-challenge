function updateGaugeChart(washingFrequency) {
  const trace = {
    type: "indicator",
    mode: "gauge+number",
    value: washingFrequency,
    title: { text: "Weekly Washing Frequency", font: { size: 24 } },
    gauge: {
      axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
      bar: { color: "cyan" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 1], color:  "rgba(165,42,42, 0.95)"}, 
        { range: [1, 2], color: "rgba(165,42,42, 0.9)" }, 
        { range: [2, 3], color: "rgba(165,42,42, 0.7)" }, 
        { range: [3, 4], color: "rgba(165,42,42, 0.5)" }, 
        { range: [4, 5], color: "rgba(165,42,42, 0.3)" },
        { range: [5, 6], color: "rgba(0, 128, 0, 0.97)" }, 
        { range: [6, 7], color: "rgba(0, 128, 0, 0.99)" },
        { range: [7, 8], color: "rgba(0, 128, 0, 0.999)" }, 
        { range: [8, 9], color: "rgba(0, 128, 0, 1)" },
      ],
    },
  };
  const dataArr = [trace];
  const layout = {
    width: 500,
    height: 400,
    margin: { t: 60, r: 20, l: 20, b: 20 },
  };
  Plotly.newPlot("gauge", dataArr, layout);
}

function updateBarChart(data) {
  const topOTUs = data.otu_ids.slice(0, 10);
  const topValues = data.sample_values.slice(0, 10);
  const topLabels = data.otu_labels.slice(0, 10);
  const trace = {
    x: topValues.reverse(),
    y: topOTUs.map((otuID) => `OTU ${otuID}`).reverse(),
    text: topLabels.reverse(),
    type: "bar",
    orientation: "h",
  };
  const dataArr = [trace];
  const layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU ID" },
    margin: { t: 30, l: 150 },
  };
  Plotly.newPlot("bar", dataArr, layout);
}
function updateBubbleChart(data) {
  const trace = {
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode: "markers",
    marker: {
      size: data.sample_values,
      color: data.otu_ids,
      colorscale: "Earth",
    },
  };
  const dataArr = [trace];
  const layout = {
    title: "OTU ID vs Sample Values",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" },
    showlegend: false,
    height: 500,
  };
  Plotly.newPlot("bubble", dataArr, layout);
}
function displayMetadata(metadata) {
  const sampleMetadataDiv = d3.select("#sample-metadata");
  sampleMetadataDiv.html("");
  Object.entries(metadata).forEach(([key, value]) => {
    sampleMetadataDiv.append("p").text(`${key}: ${value}`);
  });
}
function optionChanged(selectedID) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    const samples = data.samples;
    const metadata = data.metadata;
    const selectedData = samples.find((sample) => sample.id === selectedID);
    const selectedMetadata = metadata.find((meta) => meta.id === parseInt(selectedID));

    updateBarChart(selectedData);
    updateBubbleChart(selectedData);
    displayMetadata(selectedMetadata);
    updateGaugeChart(selectedMetadata.wfreq);
  });
}
function init() {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    const names = data.names;
    const samples = data.samples;
    const dropdownMenu = d3.select("#selDataset");
    names.forEach((name) => {
      dropdownMenu.append("option").text(name).property("value", name);
    });
    updateBarChart(samples[0]);
    updateBubbleChart(samples[0]);
    displayMetadata(data.metadata[0]);
    updateGaugeChart(data.metadata[0].wfreq); // Initialize the gauge with the washing frequency of the first individual
  });
}
init();
