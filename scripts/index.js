var gridSize = $("#gridSize").val();
var clickToDrag = false;
var grid = [];
var gridTwoDim = [];
var currentPositionX = 0;
var currentPositionY = 0;
var actualCursors = 0;
var openList = [];
var closedList = [];


var maxPositionY = 0;

const reducer = (min, currentValue) => currentValue.heuristicDistance < min.heuristicDistance ? currentValue : min;

  $(function(){
    redrawGrid(gridSize);

  });

  $("body").on("drag", function(e) {
    e.preventDefault();
  })

  function resetGrid(){
    gridSize = $("#gridSize").val();
    redrawGrid(gridSize);
  }
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

        //status : 0 => empty, 1=> block, 2 => full, 3 => start, 4 => end
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

  if(actualCursors == 0){
      $("#" + id).removeClass("block");
      $("#" + id).removeClass("end");
      $("#" + id).addClass("start");

      var cellToRedraw = grid.find(x => x.status == 3);
      if(typeof cellToRedraw !=  'undefined'){
        cellToRedraw.status = 0;
        gridTwoDim[cellToRedraw.y][cellToRedraw.x] = 0;
        $("#" + cellToRedraw.id).removeClass("start");
      }

      var cell = grid.find(x => x.id == id);
      cell.status = 3;
      gridTwoDim[cell.y][cell.x] = 3;
  }
  else if(actualCursors == 2){
    $("#" + id).removeClass("block");
    $("#" + id).removeClass("start");
    $("#" + id).addClass("end");

    var cellToRedraw = grid.find(x => x.status == 4);
    if(typeof cellToRedraw !=  'undefined'){
      cellToRedraw.status = 0;
      gridTwoDim[cellToRedraw.y][cellToRedraw.x] = 0;
      $("#" + cellToRedraw.id).removeClass("end");
    }

    var cell = grid.find(x => x.id == id);
    cell.status = 4;
    gridTwoDim[cell.y][cell.x] = 4;
  }
  else{
    if($("#" + id).hasClass("start")){
      $("#" + id).removeClass("start");
      $("#" + id).addClass("block");

      var index = grid.findIndex(x => x.id == id);
      grid[id].status = 1;
      gridTwoDim[grid[id].y][grid[id].x] = 1;
    }
    else if($("#" + id).hasClass("end")){
      $("#" + id).removeClass("end");
      $("#" + id).addClass("block");

      var index = grid.findIndex(x => x.id == id);
      grid[id].status = 1;
      gridTwoDim[grid[id].y][grid[id].x] = 1;
    }
    else if($("#" + id).hasClass("block")){
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
}

function enterCell(id){
  if(clickToDrag && actualCursors == 1){
    clickCell(id);
  }
}

function unClick(){
  clickToDrag = false;
}

function switchCursor(id){
  actualCursors = id;
}

function pathFinding(){
  var startCell = grid.find(x => x.status == 3);
  var endCell = grid.find(x => x.status == 4);

  var startCellCost = 0;
  var startCellDistanceFromEnd = Math.abs(endCell.x - startCell.x) + Math.abs(endCell.y - startCell.y);
  var startCellHeuristicDistance = startCellDistanceFromEnd;

  openList.push({
    id : startCell.id,
    x : startCell.x,
    y : startCell.y,
    cost : 0,
    heuristicDistance : startCellHeuristicDistance,
    previousCellId : null
  });
var currentCell;
  while(openList.length > 0){

    currentCell = openList.reduce(reducer, {heuristicDistance : Number.MAX_SAFE_INTEGER});

    console.log(currentCell);

    if(currentCell.id == endCell.id){
      break;
    }

    var neighboursCell = grid.filter(x =>
       (x.x == currentCell.x && x.y == (currentCell.y - 1 ) ||
       x.x == currentCell.x && x.y == (currentCell.y + 1 ) ||
       x.x == (currentCell.x - 1) && x.y == (currentCell.y - 1 ) ||
       x.x == (currentCell.x + 1) && x.y == (currentCell.y - 1 ) ||
       x.x == (currentCell.x - 1) && x.y == currentCell.y ||
       x.x == (currentCell.x + 1) && x.y == currentCell.y ||
       x.x == (currentCell.x - 1) && x.y == (currentCell.y + 1 ) ||
       x.x == (currentCell.x + 1) && x.y == (currentCell.y + 1 )
     ) && x.status != 1);

     console.log(neighboursCell);

     neighboursCell.forEach(function(neighbour){

       var A = closedList.find(x => x.id == neighbour.id);
       var B = openList.find(x => x.id == neighbour.id);
        if(typeof  A != 'undefined'){
          if(A.cost < currentCell.cost){console.log("A");}
        }
        else if(typeof B != 'undefined'){
          if(B.cost < currentCell.cost){console.log("B");}
        }
        else{
          openList.push({
            id : neighbour.id,
            x : neighbour.x,
            y : neighbour.y,
            cost : currentCell.cost + 1,
            heuristicDistance : currentCell.cost + Math.abs(endCell.x - neighbour.x) + Math.abs(endCell.y - neighbour.y),
            previousCell : currentCell
          });
        }
     })
     closedList.push(currentCell);
     openList = openList.filter(x => x.id != currentCell.id);
  }
drawPath(currentCell);
console.log(closedList);

}

function drawPath(cell){
  if(cell.id != grid.find(x => x.status == 3).id){
      $("#" + cell.id).css("background-color","orange");
      drawPath(cell.previousCell);
  }


}
