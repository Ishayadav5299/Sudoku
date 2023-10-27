import './App.css';
import { useState } from 'react';

const initial = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [ 8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1],
]
function App() {
  const [sudokuArr,setSudokuArr] = useState(getDeepCopy(initial));

  function getDeepCopy(arr){
    return JSON.parse(JSON.stringify(arr));
  }

  function onInputChange(e,row,col){
    var val = parseInt(e.target.value) || -1 , grid = getDeepCopy(sudokuArr);
    if(val === -1 || val>=1 && val<=9 ){
      grid[row][col] = val;
    }
    setSudokuArr(grid);
   
  }

  function compareSudokus(currentSudoku, solvedSudoku){
    let res ={
      isComplete:true,
      isSolvable:true
    }
    for(var i=0;i<9;i++){
      for(var j=0;j<9;j++){
        if(currentSudoku[i][j]!= solvedSudoku[i][j]){
          if(currentSudoku[i][j] != -1){
            res.isSolvable=false;
          }
          res.isComplete=false;
        }
      }
    }
    return res;

  }
  //function to check if sudoku is valid or not
  function checkSudoku(){
    let sudoku=getDeepCopy(initial);
    solver(sudoku);
    let compare = compareSudokus(sudokuArr,sudoku);
    if(compare.isComplete){
      alert("congratulations! you have solved sudoku! ");
    }
    else if(compare.isSolvable){
      alert("keep going!");
    }
    else{
      alert("sudoku can not be solved. try again! ");
    }

  }

  function checkRow(grid,row,num){
    return grid[row].indexOf(num) === -1


  }
// check num is unique in col
  function checkCol(grid,col,num){
    return grid.map(row => row[col]).indexOf(num) === -1;

  }
// check num is unique in box
  function checkBox(grid,row,col,num){
    // get box starts index
    let boxArr = [],
    rowStart = row - (row % 3),
    colStart = col - (col % 3);
    for(let i =0;i<3;i++){
      for(let j =0;j<3;j++){
        // get all the cell numbers and push in boxarr
        boxArr.push(grid[rowStart+i][colStart+j]);
      }
    }

    return boxArr.indexOf(num) === -1;


  }

  function checkValid(grid,row,col,num){
    // num should be uniqe in rw and col
    if(checkRow(grid,row,num) && checkCol(grid,col,num) && checkBox(grid,row,col,num)){
      return true;
    }
    return false;
  }
  function getNext(row,col){
    // if col reaches 8 then increase row number
    // if row reaches 8 and col reches 8  then next willbe [0,0]
    // if col do not reach 8 then inc the col number
    return col !== 8 ? [row,col+1] : row!=8 ? [row+1,0]: [0,0];

  }
// recursive function to solve sudoku
  function solver(grid,row=0,col=0){
    // if the current cell is already filled , move to the nxt cell
    if(grid[row][col] !== -1){
      // for the last cell dont solve
      let isLast= row>=8 && col>=8;
      if(!isLast){
        let[newRow,newCol]=getNext(row,col);
        return solver(grid,newRow,newCol);
      }
      }

    for(let num = 1; num<=9;num++){
      // check if this num is satisfying sudoku constraints
      if(checkValid(grid,row,col,num)){
        // fill the num in that cell
        grid[row][col] = num;
        //get next cell and repeat the function
        let[newRow , newCol] = getNext(row,col);

        if(!newRow && !newCol){
          return true;
        }
        if(solver(grid,newRow,newCol)){
          return true;
        }
      }
    }
    // if its invalid fill with -1
    grid[row][col] = -1;
    return false;
  }
   // function to solve sudoku by naigating to the each cell
  function solveSudoku(){
    let sudoku = getDeepCopy(initial);
    solver(sudoku);
    setSudokuArr(sudoku);
    
  }
  // function to reset sudoku
  function resetSudoku(){
    let sudoku = getDeepCopy(initial)
      setSudokuArr(sudoku);
  }

  return (
    <div className="App">
      <div className = "App-header">
        <h3>Sudoku Solver</h3>
        <table>
          <body>
            {
              [0,1,2,3,4,5,6,7,8].map((row,rIndex) => {
                return <tr key = {rIndex} className={(row + 1) % 3 === 0 ? 'bBorder' : ''}>
                  {[0,1,2,3,4,5,6,7,8].map((col,cIndex) => {
                    return<td key={rIndex + cIndex} className={(col + 1) % 3 === 0 ? 'rBorder' : ''}>
                      <input onChange={(e) => onInputChange(e,row,col)}
                      value={ sudokuArr[row][col] === -1 ? '' :  sudokuArr[row][col]}
                      className = "cellInput"
                      disabled={initial[row][col] !== -1}/>
                    </td>
                  })}
                </tr>
              })
            }
          </body>
        </table>
        <div className = "buttonContainer">
          <button className ="checkButton" onClick={checkSudoku}>Check</button>
          <button className ="solveButton" onClick={solveSudoku}>Solve</button>
          <button className ="resetButton" onClick={resetSudoku}>Reset</button>

        </div>

    

      </div>  
    </div>
  );
}

export default App;



