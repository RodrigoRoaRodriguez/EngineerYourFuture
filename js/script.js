/////////////////////
// SEQUENTIAL CODE //
/////////////////////
var sizes = new SizeManager();

var tooltip = new Tooltip((d) => d[0]);
var donutArray = [];
var donutToggle;

//Colours for the program circles
var color = (i) => d3.hcl(i * 23, 10 + 40 * Math.sin(i), 40 + (i % 2) * 40).toString();
//All programs available in our data
var programs = [
  ["Computer Science", "Computer"],
  ["Media Technology", "Media"],
  ["Industrial Economy", "Economy"],
  ["Mechanical Engineering", "Mechanical"],
  ["Electrical Engineering", "Electrical"],
  ["Engineering Physics", "Physics"],
  ["Vehicle Engineering", "Vehicle"],
  ["Civil Engineering", "Civil"],
  ["Information Technology", "IT"],
  ["Design and Product Realization", "Design"],
  ["Chemistry", "Chemistry"],
  ["Architect", "Architect"],
  ["Biotechnology", "Biotechnology"],
  ["Constructional Engineering and Design", "Construction"]
];

//Select SVG Canvas
var canvas = d3.select('#main-svg')

//Create groups four our graphical elements
var everything = canvas.append('g').attr('id','everything');
var bubbles = everything.append('g').attr('id','programme-bubbles');
var donuts = everything.append('g').attr('id','donuts');

// D3 selections that will operate on every element of a kind
var perBubble;
var perDonut;

// Define functions for placing things on the screen.
var placeDonut, placeBubble, zoomDonut, zoomOffset;

// SETUP
setup();

window.onresize = resize;
////////////////////////////
// END OF SEQUENTIAL CODE //
////////////////////////////
function setup(){
  placeBubble = (d, i) => 'translate(' +
    sizes.bigRadius * Math.cos(i * sizes.delta(14)) + ',' +
    sizes.bigRadius * Math.sin(i * sizes.delta(14)) + ')';

  if (sizes.height < sizes.width) { // Landscape mode
    placeDonut = (d, i) => 'translate(' +
      sizes.bigRadius * Math.cos((i - 1) * sizes.delta(6)) + ',' + //x position
      sizes.bigRadius * Math.sin((i - 1) * sizes.delta(6)) + ')'; //y position

    zoomDonut = () => 'scale(2) translate(' + sizes.width / 3 + ',0)';
    zoomOffset = () => `translate(${-sizes.width/3})`;
  }else { // Portrait mode
    placeDonut = (d, i) => 'translate(' +
      sizes.bigRadius * Math.sin((i - 1) * sizes.delta(6)) + ',' + //x position
      sizes.bigRadius * Math.cos((i - 1) * sizes.delta(6)) + ')'; //y position

    placeBubble = (d, i) => 'translate(' +
      sizes.bigRadius * Math.cos(i * sizes.delta(14)) + ',' +
      sizes.bigRadius * Math.sin(i * sizes.delta(14)) + ')';

    zoomDonut = () => 'scale(2) translate(0,' + sizes.height / 3 + ')';
    zoomOffset = () => `translate(0,${-sizes.height/3-71})`;
  }

  // Place the groups origin point at the middle of the screen.
  bubbles.attr('transform', `translate(${sizes.width/2}, ${sizes.height/2})`);
  donuts.attr('transform', `translate(${sizes.width/2}, ${sizes.height/2})`);
  // Resize svg canvas
  canvas.attr('height', sizes.height)
  .attr('width', sizes.width);
  // Create graphics on the screen
  createProgrammeBubbles();
  createDonuts();
  showProgrammes();
}

function resize(){
  //Delete everything
  perBubble.remove();
  perDonut.remove();
  donutArray = [];
  //Do setup again.
  setup();
}

function createProgrammeBubbles(){
  // Select the right group in the svg canvas,
  perBubble = canvas.select('#programme-bubbles').selectAll('g').data(programs).enter().append('g');

  // Set group properties
  perBubble.attr('id','programme-bubble')
  .style('opacity', 0)
  .on('mouseover', tooltip.show)
  .on('mousemove', tooltip.move)
  .on('mouseout', tooltip.hide)
  ;

  //Append circles for all programmes
  perBubble.append('circle')
    .attr('r', sizes.bubbleRadius.toString())
    .style('fill', (d, i) => color(i));

  // // Append text to the circles
  // perBubble.append('text')
  //   .style('text-anchor', 'middle')
  //   .style('alignment-baseline', 'middle')
  //   .style('fill', 'white') //TODO: Move this to css file
  //   .text((d) => (d[1]).toUpperCase());

  //Append icons to the circles
  perBubble.append('use')
      .attr('xlink:href', (d)=>'/img/icons.svg#'+d[1])
      .attr('width', sizes.icon)
      .attr('height', sizes.icon)
      .attr('transform', `translate(${-sizes.icon/2}, ${-sizes.icon/2})`)
      .style('fill', '#fff')
      .style('stroke', '#fff')
      ;
}

function createDonuts(){
  var categories = ["Company", "Profession", "Skills"];
  // Select the right group in the svg canvas,
  perDonut = canvas.select('#donuts').selectAll('g').data(categories).enter()
  .append('g').attr('id', (d)=> d);

  //Define click callback
  perDonut.on('click', zoomIntoDonut);

  //Append a donut for each category
  perDonut.each((d) => {donutArray.push(new Donut(d, d, sizes.donutRadius));})
}

function showProgrammes(){
  // Everything should go back to normal
  everything.transition()
    .duration(500)
    .attr('transform',"");

  //Return donuts to starting position and zero opacity
  perDonut.transition()
  .duration(500)
  .attr('transform', "")
  .style('opacity', 0)
  .style('pointer-events', 'none')
  ;

  //Places bubbles in a circle
  perBubble.transition()
    // .delay((d, i) => i * 100) //Rodrigo argues this animation is too slow
    .duration(1000)
    .style('opacity', 1)
    .attr("transform", placeBubble);

  perBubble.on("click", zoomIntoProgramme);
}

/** @callback bubble on click */
function zoomIntoProgramme(name, index) {
  perBubble.transition()
    .delay(100)
    .duration(1100)
    .attr('transform', `scale(2)`)
    .style("opacity", (d, i) => (i == index) ? 1 : 0);

  // Return to previous menu on click
  perBubble.on("click", showProgrammes);

  // Show donuts
  donutArray.forEach((d)=> {d.programme = programs[index][0];});
  perDonut.transition()
    .delay(400)
    .duration(1100)
    .attr('transform', placeDonut)
    .style("opacity", 1)
    .style('pointer-events', 'auto');

}

/** @callback bubble on click */
function zoomIntoDonut(clickedName, clickedIndex) {
  // Everything should move to the left
  everything.transition()
    .delay(200)
    .duration(1100)
    .attr('transform', zoomOffset);
  //If selected zoom into donuts, if not return to starting position.
  perDonut.transition()
    .delay(200)
    .duration(1100)
    .attr('transform', (d, i) => (i == clickedIndex) ? zoomDonut(d,i) : placeDonut(d, i))
}
