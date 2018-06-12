window.setInterval(function(){
  var matrix = $('#ic-search').css('transform').replace(/[^0-9\-.,]/g, '').split(',');
  var x = matrix[12] || matrix[4];
  var y = matrix[13] || matrix[5];
  x=Number(x)+29.5;
  y=Number(y)+29.5;
  $('#ic-search').css('transform','translate');
  $('#items').children('svg').each(function(){
    var svgX=$(this).css('left');
    var svgY=$(this).css('top');
    // console.log(svgY);
    svgX=Number(svgX.slice(0,svgX.length-2))+10;
    svgY=Number(svgY.slice(0,svgY.length-2))+10;
    var dist=Math.sqrt((x-svgX)*(x-svgX)+(y-svgY)*(y-svgY));
    // console.log(dist);
    if(dist<20) {
      $(this).css('transform','scale(2)');
    } else {
      $(this).css('transform','scale(0.5)');
    }
  })
}, 10);