var gridSize = $("#gridSize").val();
var clickToDrag = false;
var grid = [];
var gridTwoDim = [];
var currentPositionX = 0;
var currentPositionY = 0;
var actualCursors = 0;

var maxPositionY = 0;

  $(function(){
    redrawGrid(gridSize);

  });

  $("body").on("drag", function(e) {
    e.preventDefault();
  })



  function redrawGrid(gridSize){
    maxPositionY = 0;
    $("#percole,#notPercole").hide();
    grid = [];
    gridTwoDim = [];
    var gridLine = "";
    var globalIndex = 0;
    for(var i = 0; i< gridSize; i++){
      gridTwoDim[i] = [];
      gridLine += "<tr>";
      for (var j = 0; j < gridSize; j++) {
        gridLine += "<td id="+globalIndex+"  onmouseup=\"unClick()\" onmousedown=\"clickCell("+globalIndex+")\" onmouseover=\"enterCell("+globalIndex+")\"></td>";

        //status : 0 => empty, 1=> block, 2 => full
        grid.push({id:globalIndex, x:j, y:i, status:0});
        gridTwoDim[i].push(0);
        globalIndex += 1;

      }
      gridLine += "</tr>";
    }
    $("table").html(gridLine);
  }

  $("#gridSize").on("input", function(){
    gridSize = $("#gridSize").val();
    redrawGrid(gridSize);
  });

function clickCell(id){
    if($("#" + id).hasClass("block")){
      $("#" + id).removeClass("block");
      var cell = grid.find(x => x.id == id);
      cell.status = 0;
      gridTwoDim[cell.y][cell.x] = 0;
    }
    else{
      $("#" + id).addClass("block");
      var index = grid.findIndex(x => x.id == id);
      grid[id].status = 1;
      gridTwoDim[grid[id].y][grid[id].x] = 1;

    }
    clickToDrag = true;
}
function enterCell(id){
  if(clickToDrag){
    var index = grid.findIndex(x => x.id == id);
    grid[id].status = 1;
    gridTwoDim[grid[id].y][grid[id].x] = 1;
    $("#" + id).addClass("block");
  }
}

function unClick(){
  clickToDrag = false;
}

$("#start").on("click", function(){
  findStartCursorPosition();
  console.log("start");
})

function switchCursor(id){
  actualCursors = id;

}
