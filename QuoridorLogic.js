let dragItem = "";
let trackWallsP1 = 10;
let trackWallsP2 = 10;
let current_player1_row = 1;
let current_player1_col = 5;
let current_player2_row = 9;
let current_player2_col = 5;
let endRow;
let lateral = "";
let left_of_cell_bellow;
let right_of_cell_bellow;
     
// There are two 2D arrays: one to track the beginning of horizontal walls, and the other to track the beginning of vertical walls

let hor_Wall_Positions = [                 // for detection of wall crossing!
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let ver_Wall_Positions = [                 // for detection of wall crossing!
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let wasHere = [
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false]
  ];

function checkWin(which_player, rowNumber) {
    if(which_player === "Player 1") {
      if(rowNumber === 9) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if(rowNumber === 1) {
        return true;
      }
      else {
        return false;
      }
    }
}

          function recursiveSolve(x, y) {    // both x and y go from 1!
          if (x === endRow) return true;    // exit found
          if (wasHere[x - 1][y - 1]) return false;
          wasHere[x - 1][y - 1] = true;

          let left_cell = document.querySelector(`.r${x}.c${y - 1}`);
          let upper_cell = document.querySelector(`.r${x - 1}.c${y}`);
          let target_cell = document.querySelector(`.r${x}.c${y}`);

          if (y !== 1 && left_cell.style.borderRight !== "2px solid orange") {
             if (recursiveSolve(x, y-1)) {                // move left
               return true;
             }
          }
          if (y !== 9 && target_cell.style.borderRight !== "2px solid orange") {
             if (recursiveSolve(x, y+1)) {          // move right
               return true;
             }
          }
          if (x !== 1 && upper_cell.style.borderBottom !== "2px solid orange") {
             if (recursiveSolve(x-1, y)) {       // move up
               return true;
             }
          }
          if (x !== 9 && target_cell.style.borderBottom !== "2px solid orange") {     
             if (recursiveSolve(x+1, y)) {       // move down
               return true;
             }
          }
          return false;
        }

        function path_Not_Blocked(tbl_row, tbl_column) {
          // reset all elements of wasHere to false
          for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
              wasHere[i][j] = false;
            }
          }
          
          let selectorString = `.r${tbl_row}.c${tbl_column}`;
          
          if(dragItem === "hor_wall_1" || dragItem === "hor_wall_2") {
          // You need to drag the wall to where you want the beginning of the wall to be placed! Hor. walls are always placed at the bottom
          
          // Here I place border on drag destination, and THEN check to see if path is closed!
          document.querySelector(selectorString).style.borderBottom = "2px solid orange";
          tbl_column++;
          selectorString = `.r${tbl_row}.c${tbl_column}`;
          
          //wall spreads across two cells, so we must set border on adjacent cell also
          document.querySelector(selectorString).style.borderBottom = "2px solid orange";
          }

          if(dragItem === "ver_wall_1" || dragItem === "ver_wall_2") {

          // You need to drag the wall to where you want the top part of the wall to be placed! Ver. walls are always placed to the right
          document.querySelector(selectorString).style.borderRight = "2px solid orange";
          tbl_row++;
          selectorString = `.r${tbl_row}.c${tbl_column}`;

          //wall spreads across two cells, so we must set border on the bottom cell also
          document.querySelector(selectorString).style.borderRight = "2px solid orange";
          }

          let startX;
          let startY;

          if(dragItem === "hor_wall_1" || dragItem === "ver_wall_1") {
          startX = current_player2_row;
          startY = current_player2_col;
          endRow = 1;
          }

          if(dragItem === "hor_wall_2" || dragItem === "ver_wall_2") {
          startX = current_player1_row;
          startY = current_player1_col;
          endRow = 9;  
          }

          return recursiveSolve(startX, startY);     
       }

function hor_Walls_Not_Overlap(tbl_rw, tbl_cl) {
  let targetCell = document.querySelector(`.r${tbl_rw}.c${tbl_cl}`);
  let rightCell = document.querySelector(`.r${tbl_rw}.c${tbl_cl + 1}`);
    
  if(targetCell.style.borderBottom === "2px solid orange") {
    return false;
  }
  if(rightCell.style.borderBottom === "2px solid orange") {
      return false;
  }
  return true;
}

function ver_Walls_Not_Overlap(tbl_rw, tbl_cl) {
  let targetCell = document.querySelector(`.r${tbl_rw}.c${tbl_cl}`);
  let cellBellow = document.querySelector(`.r${tbl_rw + 1}.c${tbl_cl}`);
    
  if(targetCell.style.borderRight === "2px solid orange") {
    return false;
  }
  if(cellBellow.style.borderRight === "2px solid orange") {
      return false;
  }
  return true;
}

function pawn_Move_Allowed(dragItm, table_rw, table_cl) {
  let opponent_row;
  let opponent_col;
  let player_row;
  let player_col;

  if(dragItm === "invalid") {
    return false;
  }
  if(dragItm === "Player 1") {
    opponent_row = current_player2_row;
    opponent_col = current_player2_col;
    player_row = current_player1_row;
    player_col = current_player1_col; 
  }
  if(dragItm === "Player 2") {
    opponent_row = current_player1_row;
    opponent_col = current_player1_col;
    player_row = current_player2_row;
    player_col = current_player2_col;
  }

  let test_cell = document.querySelector(`.r${table_rw}.c${table_cl}`);      // target cell
  let cell_bellow = document.querySelector(`.r${table_rw + 1}.c${table_cl}`);
  let cell_above = document.querySelector(`.r${table_rw - 1}.c${table_cl}`);
  let cell_above_2 = document.querySelector(`.r${table_rw - 2}.c${table_cl}`);
  left_of_cell_bellow = document.querySelector(`.r${table_rw + 1}.c${table_cl - 1}`);
  right_of_cell_bellow = document.querySelector(`.r${table_rw + 1}.c${table_cl + 1}`);
  let left_of_cell_above = document.querySelector(`.r${table_rw - 1}.c${table_cl - 1}`);
  let right_of_cell = document.querySelector(`.r${table_rw}.c${table_cl + 1}`);
  let right_of_cell_2 = document.querySelector(`.r${table_rw - 1}.c${table_cl + 1}`);
  let left_of_cell = document.querySelector(`.r${table_rw}.c${table_cl - 2}`);
  let left_of_cell_2 = document.querySelector(`.r${table_rw}.c${table_cl - 1}`);
  
    if(lateral !== "") {
      if(lateral === "left") {
        if(table_rw === opponent_row && table_cl === opponent_col - 1) {
          lateral = "";
          return true;
        }
      } else if(lateral === " right") {
        if(table_rw === opponent_row && table_cl === opponent_col + 1) {
          lateral = "";
          return true;
        }  
      } else if(lateral === "left right") {
        if(table_rw === opponent_row && table_cl === opponent_col - 1) {
          lateral = "";
          return true;
        }
        if(table_rw === opponent_row && table_cl === opponent_col + 1) {
          lateral = "";
          return true;
        }
      } else if(lateral === "up") {
        if(table_rw === opponent_row - 1 && table_cl === opponent_col) {
          lateral = "";
          return true;
        }
      } else if(lateral === " down") {
        if(table_rw === opponent_row + 1 && table_cl === opponent_col) {
          lateral = "";
          return true;
        }
      } else {
        if(table_rw === opponent_row - 1 && table_cl === opponent_col) {
          lateral = "";
          return true;
        }
        if(table_rw === opponent_row + 1 && table_cl === opponent_col) {
          lateral = "";
          return true;
        }
      }
    }
  
    // player 1 moved up - one step  
    if(table_rw === player_row - 1 && table_cl === player_col) {
      if (test_cell.style.borderBottom !== "2px solid orange") {
        // is there already a pawn on target cell
        if(opponent_row !== table_rw || opponent_col !== table_cl) {
          return true;
        }
      }
      return false;
    }
    
    // player 1 moved up - two steps  
    if(table_rw === player_row - 2 && table_cl === player_col) {
      if(cell_bellow.style.borderBottom !== "2px solid orange") {
        if(opponent_row === table_rw + 1 && opponent_col === table_cl) {
          if(test_cell.style.borderBottom !== "2px solid orange") {
            return true;
          }
          else {
            if (left_of_cell_bellow.style.borderRight !== "2px solid orange") {
              left_of_cell_bellow.style.backgroundImage = `url('../images/check.png')`;
              left_of_cell_bellow.style.backgroundRepeat = "no-repeat";
              left_of_cell_bellow.style.backgroundPosition = "center center";
              setTimeout(function() {
                left_of_cell_bellow.style.backgroundImage = "none";  
              }, 400);
              lateral = "left";
            }
            if (cell_bellow.style.borderRight !== "2px solid orange") {
              right_of_cell_bellow.style.backgroundImage = `url('../images/check.png')`;
              right_of_cell_bellow.style.backgroundRepeat = "no-repeat";
              right_of_cell_bellow.style.backgroundPosition = "center center";
              setTimeout(function() {
                right_of_cell_bellow.style.backgroundImage = "none";  
              }, 400);
              lateral = lateral + " right";
            }
          }
        }
      }
      return false;
    }
  
    // player 1 moved down - one step  
    if(table_rw === player_row + 1 && table_cl === player_col) {
      if (cell_above.style.borderBottom !== "2px solid orange") {
        // is there already a pawn on target cell
        if(opponent_row !== table_rw || opponent_col !== table_cl) {
          return true;
        }
      }
      return false;
    }
  
    // player 1 moved down - two steps  
    if(table_rw === player_row + 2 && table_cl === player_col) {
      if(cell_above_2.style.borderBottom !== "2px solid orange") {
        if(opponent_row === table_rw - 1 && opponent_col === table_cl) {
          if(cell_above.style.borderBottom !== "2px solid orange") {
            return true;
          }
          else {
            if (left_of_cell_above.style.borderRight !== "2px solid orange") {
              left_of_cell_above.style.backgroundImage = `url('../images/check.png')`;
              left_of_cell_above.style.backgroundRepeat = "no-repeat";
              left_of_cell_above.style.backgroundPosition = "center center";
              setTimeout(function() {
                left_of_cell_above.style.backgroundImage = "none";  
              }, 400);
              lateral = "left";
            }
            if (cell_above.style.borderRight !== "2px solid orange") {
              right_of_cell_2.style.backgroundImage = `url('../images/check.png')`;
              right_of_cell_2.style.backgroundRepeat = "no-repeat";
              right_of_cell_2.style.backgroundPosition = "center center";
              setTimeout(function() {
                right_of_cell_2.style.backgroundImage = "none";  
              }, 400);
              lateral = lateral + " right";
            }
          }
        }
      }
      return false;
    }
  
    // player 1 moved left - one step  
    if(table_rw === player_row && table_cl === player_col - 1) {
      if (test_cell.style.borderRight !== "2px solid orange") {
        // is there already a pawn on target cell
        if(opponent_row !== table_rw || opponent_col !== table_cl) {
          return true;
        }
      }
      return false;
    }
  
    // player 1 moved left - two steps
    if(table_rw === player_row && table_cl === player_col - 2) {
      if(right_of_cell.style.borderRight !== "2px solid orange") {
        if(opponent_row === table_rw && opponent_col === table_cl + 1) {
          if(test_cell.style.borderRight !== "2px solid orange") {
            return true;
          }
          else {
            if (right_of_cell_2.style.borderBottom !== "2px solid orange") {
              right_of_cell_2.style.backgroundImage = `url('../images/check.png')`;
              right_of_cell_2.style.backgroundRepeat = "no-repeat";
              right_of_cell_2.style.backgroundPosition = "center center";
              setTimeout(function() {
                right_of_cell_2.style.backgroundImage = "none";  
              }, 400);
              lateral = "up";
            }
            if (right_of_cell.style.borderBottom !== "2px solid orange") {
              right_of_cell_bellow.style.backgroundImage = `url('../images/check.png')`;
              right_of_cell_bellow.style.backgroundRepeat = "no-repeat";
              right_of_cell_bellow.style.backgroundPosition = "center center";
              setTimeout(function() {
                right_of_cell_bellow.style.backgroundImage = "none";  
              }, 400);
              lateral = lateral + " down";
            }
          }
        }
      }
      return false;
    }
  
    // player 1 moved right - one step
    if(table_rw === player_row && table_cl === player_col + 1) {
      if (left_of_cell_2.style.borderRight !== "2px solid orange") {
        // is there already a pawn on target cell
        if(opponent_row !== table_rw || opponent_col !== table_cl) {
          return true;
        }
      }
      return false;
    }
  
    // player 1 moved right - two steps
    if(table_rw === player_row && table_cl === player_col + 2) {
      if(left_of_cell.style.borderRight !== "2px solid orange") {
        if(opponent_row === table_rw && opponent_col === table_cl - 1) {
          if(left_of_cell_2.style.borderRight !== "2px solid orange") {
            return true;
          }
          else {
            if (left_of_cell_above.style.borderBottom !== "2px solid orange") {
              left_of_cell_above.style.backgroundImage = `url('../images/check.png')`;
              left_of_cell_above.style.backgroundRepeat = "no-repeat";
              left_of_cell_above.style.backgroundPosition = "center center";
              setTimeout(function() {
                left_of_cell_above.style.backgroundImage = "none";  
              }, 400);
              lateral = "up";
            }
            if (left_of_cell_2.style.borderBottom !== "2px solid orange") {
              left_of_cell_bellow.style.backgroundImage = `url('../images/check.png')`;
              left_of_cell_bellow.style.backgroundRepeat = "no-repeat";
              left_of_cell_bellow.style.backgroundPosition = "center center";
              setTimeout(function() {
                left_of_cell_bellow.style.backgroundImage = "none";  
              }, 400);
              lateral = lateral + " down";
            }
          }
        }
      }
      return false;
    }
}

function canMove(table_row, table_column) {
  if(dragItem === "hor_wall_1" || dragItem === "ver_wall_1") {
    if(trackWallsP1 <= 0) {
      return false;
    }
    else {
      // we have enough walls, but is move valid?
      // beginning of a horizontal wall and beginning of a vertical wall, cannot be placed on the following places:
      if(table_column === 9 || table_row === 9) {
        return false;
      }

      if(dragItem === "hor_wall_1") {
      // check to see if walls are overlapping
      if(hor_Walls_Not_Overlap(table_row, table_column) === false) {
        return false;
      }  
  
      // check to see if walls are crossing
      if(ver_Wall_Positions[table_row - 1][table_column - 1] === 1) {
        return false;
        }
      }

      // check to see if walls are overlapping
      if(dragItem === "ver_wall_1") {     
        if(ver_Walls_Not_Overlap(table_row, table_column) === false) {
          return false;
        }

      // check to see if walls are crossing
      if(hor_Wall_Positions[table_row - 1][table_column - 1] === 1) {
          return false;
        }
      }
      // A wall may not be placed which cuts off the only remaining path of any pawn to the side of the board it must reach
      if(path_Not_Blocked(table_row, table_column)) {
        return true;
      } else {
        // move is not allowed, so we clear borders from cells!
        if(dragItem === "hor_wall_1") {
          let selectorString = `.r${table_row}.c${table_column}`;
          document.querySelector(selectorString).style.borderBottom = "";
          selectorString = `.r${table_row}.c${table_column + 1}`;
          
          //wall spreads across two cells, so we must clear border on adjacent cell also
          document.querySelector(selectorString).style.borderBottom = "";
          }

          if(dragItem === "ver_wall_1") { 
          let selectorString = `.r${table_row}.c${table_column}`;
          document.querySelector(selectorString).style.borderRight = "";
          selectorString = `.r${table_row + 1}.c${table_column}`;

          //wall spreads across two cells, so we must clear border on the bottom cell also
          document.querySelector(selectorString).style.borderRight = "";
          }
        return false;
      }
    }
  }

  if(dragItem === "hor_wall_2" || dragItem === "ver_wall_2") {
    if(trackWallsP2 <= 0) {
      return false;
    }
    else {
      // we have enough walls, but is move valid?
      // beginning of a horizontal wall and beginning of a vertical wall, cannot be placed on the following places:
      if(table_column === 9 || table_row === 9) {
        return false;
      }

        if(dragItem === "hor_wall_2") {
        // check to see if walls are overlapping
        if(hor_Walls_Not_Overlap(table_row, table_column) === false) {
          return false;
        }

        // check to see if walls are crossing
        if(ver_Wall_Positions[table_row - 1][table_column - 1] === 1) {
          return false;
        }
      }

      if(dragItem === "ver_wall_2") {
        // check to see if walls are overlapping
        if(ver_Walls_Not_Overlap(table_row, table_column) === false) {
          return false;
        }

        // check to see if walls are crossing
        if(hor_Wall_Positions[table_row - 1][table_column - 1] === 1) {
          return false;
        }
      }

      if(path_Not_Blocked(table_row, table_column)) {
        return true;
      } else {
        // move is not allowed, so we clear borders from cells!
        if(dragItem === "hor_wall_2") {
          let selectorString = `.r${table_row}.c${table_column}`;
          document.querySelector(selectorString).style.borderBottom = "";
          selectorString = `.r${table_row}.c${table_column + 1}`;
          
          //wall spreads across two cells, so we must clear border on adjacent cell also
          document.querySelector(selectorString).style.borderBottom = "";
          }

          if(dragItem === "ver_wall_2") { 
          let selectorString = `.r${table_row - 1}.c${table_column}`;
          document.querySelector(selectorString).style.borderRight = "";
          selectorString = `.r${table_row + 1}.c${table_column}`;

          //wall spreads across two cells, so we must clear border on the bottom cell also
          document.querySelector(selectorString).style.borderRight = "";
          }
        return false;
      }
    }
  }
return pawn_Move_Allowed(dragItem, table_row, table_column);
}

function dragStart(event) {
  // detect which item we are dragging
    if(event.target.id === "horizontal") {
      dragItem = "hor_wall_1";
    } else if(event.target.id === "horizontal2") {
      dragItem = "hor_wall_2";
    } else if(event.target.id === "vertical") {
      dragItem = "ver_wall_1";
    } else if(event.target.id === "vertical2") {
      dragItem = "ver_wall_2";
    } else if(event.target.id === "white_pawn") {
      dragItem = "Player 1";
    } else if(event.target.id === "yellow_pawn") {
      dragItem = "Player 2";
    } else { 
      dragItem = "invalid";
    }
    event.dataTransfer.setData("text/html", event.target.id);
  }

function allowDrop(event) {
    event.preventDefault();
  }

function drop(event) {
    event.preventDefault();

    let rowString, rowNum, colString, colNum;

    // detect where drop is performed
    let classes = event.target.classList;
    rowString = classes[0];
    colString = classes[1];

    // now we have to strip letters from class names
    rowNum = rowString[1];
    colNum = colString[1];
    rowNum = Number(rowNum);
    colNum = Number(colNum);

// rowNum and colNum are numbers starting from 1, while 2D arrays have indexes that start from 0 !

        if(canMove(rowNum, colNum)) {
        if(dragItem === "Player 1" || dragItem === "Player 2") {
          const data = event.dataTransfer.getData("text/html");
          const element = document.querySelector(`#${data}`);
          event.target.appendChild(element);

          if(dragItem === "Player 1") {
            current_player1_row = rowNum;
            current_player1_col = colNum;  
          }

          if(dragItem === "Player 2") {
            current_player2_row = rowNum;
            current_player2_col = colNum;  
          }

          // is it winning move?
          if(checkWin(dragItem, rowNum)) {
            if(dragItem === "Player 1") {
              alert("White wins!\nPress OK to reset game ...");
            }
            if(dragItem === "Player 2"){
              alert("Yellow wins!\nPress OK to reset game ...");
            }
            setTimeout(function(){ location.reload() }, 1000);
          }
        }
        else if(dragItem === "hor_wall_1" || dragItem === "hor_wall_2") {
          // track the beginning of the horizontal wall
          hor_Wall_Positions[rowNum - 1][colNum - 1] = 1;    // minus 1 - because row and column indexes of the 2D arrays start from 0 !

          if(dragItem === "hor_wall_1") {
            trackWallsP1--;
            if(trackWallsP1 >= 0) {
            document.querySelector("#num_of_walls_p1").innerHTML = `${trackWallsP1}`;
            }
          }
          else {
            trackWallsP2--;
            if(trackWallsP2 >= 0) {
            document.querySelector("#num_of_walls_p2").innerHTML = `${trackWallsP2}`;
            }
          }
        }
        else if(dragItem === "ver_wall_1" || dragItem === "ver_wall_2") {
          // track the top position of the vertical wall
          ver_Wall_Positions[rowNum - 1][colNum - 1] = 1;

          if(dragItem === "ver_wall_1") {
            trackWallsP1--;
            if(trackWallsP1 >= 0) {
            document.querySelector("#num_of_walls_p1").innerHTML = `${trackWallsP1}`;
            } 
          }
          else {
            trackWallsP2--;
            if(trackWallsP2 >= 0) {
            document.querySelector("#num_of_walls_p2").innerHTML = `${trackWallsP2}`;
            }
          }
        }
        else {
        alert("Not a valid item.");
        }
      }
      else {
      document.querySelector(`.r${rowNum}.c${colNum}`).style.backgroundImage = `url('../images/cross.png')`;
      document.querySelector(`.r${rowNum}.c${colNum}`).style.backgroundRepeat = "no-repeat";
      document.querySelector(`.r${rowNum}.c${colNum}`).style.backgroundPosition = "center center";
      setTimeout(function() {
      document.querySelector(`.r${rowNum}.c${colNum}`).style.backgroundImage = "none";  
      }, 200);    
      } 
}