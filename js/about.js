d3.json('data/about.json', showCreators);

function showCreators(error, json) {
  if (error) return console.warn(error);
  console.log(json);
  var perCreator = d3.select('.creators-wrapper')
    .selectAll('div').data(json).enter()
    .append('div').attr('class', 'creator col-md-3');

  perCreator.append('img')
    .attr('src',function(d){return 'img/'+d.name+'.jpg';})
    .attr('class',"img-circle creator-img");

  perCreator.append('h4')
      .attr('class', 'yellow')
      .text(function(d){return d.fullName;});

  perCreator.append('a')
      .attr('class', 'btn')
      .attr('href', function(d){return 'mailto:'+d.email;})
      .append('i')
      .attr('class', 'fa fa-envelope-o fa-lg');

  perCreator.append('a')
      .attr('class', 'btn')
      .attr('href', function(d){return d.linkedIn;})
      .append('i')
      .attr('class', 'fa fa-linkedin-square fa-lg');
}
