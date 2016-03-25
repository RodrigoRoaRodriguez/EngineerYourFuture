"use strict";
/**
 * An object with an attribute for every column in the csv file.
 * @class Alumn
 */
class Alumn {
  /**
   * An object for every row entry in the csv file.
   * @param  {String} country        Country of origin
   * @param  {String} company   What company they work at.
   * @param  {String} profession       Current employment title
   * @param  {String} programme      What programme they studied at KTH
   * @param  {number} graduation     What year they graduated
   * @constructs Alumn
   */
  constructor(country, company, profession, education, graduation) {
    this.Country = country;
    this.Company = company;
    this.Profession = profession;
    this.Education = education;
    this.Graduation = graduation;
  }
}

class Tooltip {
  constructor(accessor) {
    this._tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("pointer-events", "none")
        .style("position", "absolute")
        // .style("opacity", 0)
        ;

    this.accessor = accessor || ((d) => String(d));
    this._tooltip.append("p");

    this.show = (d) =>{
      this._tooltip.transition()
        .duration(400)
        .style("opacity", 1);

      this._tooltip.select('p')
        .text(this.accessor(d));
    }

    this.move = () =>{
      var xpos = d3.event.pageX - (d3.event.pageX < window.width/2 ? 0 : parseInt(getComputedStyle(this._tooltip.node(), "").width));

      this._tooltip
        .style("left", (xpos) + "px")
        .style("top", (d3.event.pageY) + "px");
    }

    this.hide = () =>{
      this._tooltip.transition()
        .duration(400)
        .style("opacity", 0);
    }
  }


}

class Donut {
  constructor(parentId, name, radius) {
    this._name = name;
    this.tooltip = new Tooltip((d) => d.data.key);
    this.color = (i) => d3.hcl(i * 23, 10 + 40 * Math.sin(i/2), 40 + (i % 2) * 40).toString();
    //If the data does not exist read data from files

    //Calculate sizes
    this.arc = d3.svg.arc()
    .innerRadius(radius*2/4)
    .outerRadius(radius);

    this.pie = d3.layout.pie()
    .value((d)=>d.value)
    .sort(null);

    // this._data = d3.entries(data).sort((a,b)=>b.value-a.value);
    this.donut = d3.select('#'+parentId).append('g')
      .attr('width', radius)
      .attr('height', radius)
      .attr('id', `${name}-donut`)
      .attr('class', 'donut');
      //on click event where d.data is the label attached to the clicked segment, ex name:ericsson, count:21
     // .on("click", (d) => this.showDetails(d.data));

    this.topText = this.donut.append("text").attr("text-anchor", "middle")
      .classed("donut-center-text", true).attr("transform", "translate(0 -10)");
    this.bottomText = this.donut.append("text").attr("text-anchor", "middle")
      .classed("donut-center-text", true).attr("transform", "translate(0 10)");

     //this.donut.selectAll('path')
     this._showAll = false;
  }

  get showAll(){
    return this._showAll;
  }

  set showAll(value){
    this._showAll = value;
    if(value){
      this.updateDonut(this.data);
      this.topText.text("All");
    }else{
      this.updateDonut(this.data.slice(0,10));
      this.topText.text("Top 10");
    }
  }

  get programme() {
    return this._programme;
  }
  set programme(value) {
    this._programme = value;
    this.showAll = this.showAll; //Triggers updateDonut
    this.bottomText.text(this._name);
  }

  get data() {
    var data = this._name === "Skills" ?
    Donut._json.filter((d) => d.program === this.programme)[0].skills : // JSON
    matchAsEntries(Donut._csv, ['Education', this._name], [this.programme]);//CSV

    return data.sort((a,b)=>b.value-a.value)
  }

  updateDonut(data){
    this.donut.selectAll('path').remove();

    this.donut.selectAll('path')
        .data(this.pie(data)) // Show all
        .enter()
        .append('path')
        .attr('d', this.arc)
        .attr('fill', (d, i) => this.color(i))
        .on("mouseover", this.tooltip.show)
        .on("mousemove", this.tooltip.move)
        .on("mouseout", this.tooltip.hide);

        canvas.selectAll("#donut-toggle , #donut-toggle-text")
        .classed("hidden-section", false)
        .classed("active-section", true);
        canvas.selectAll("#donut-toggle-text")
        .text("Toggle Top/All "+this._name);
  }
}
//Make all donuts share data
d3.csv("data/alumni_data.csv", rowToObject, (csv)=>{Donut._csv=csv;});
d3.json("data/skills.json", (json) => {Donut._json=json;});


class SizeManager {
  // height and width are the sizes of the actual content.
  // navBarHeight = 71
  get height() {return window.innerHeight - 71;}
  get width() {return window.innerWidth;}
  //
  get longSide() {return Math.max(this.width, this.height);}
  get shortSide() {return Math.min(this.width, this.height);}
  get bigRadius() {return this.shortSide/3}
  get donutRadius() {return this.shortSide/10}
  get bubbleRadius() {return this.shortSide/14}
  get icon() {return this.shortSide/11}

  delta(subdivisions){ return (2 * Math.PI) / subdivisions;}
}
