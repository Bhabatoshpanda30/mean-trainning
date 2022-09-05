var board=[];  
 var userChoice  
 var currentTurn  
 function minmax(){  
  this.minPlayer=1;  
  this.maxPlayer=2;  
 }  
 /*Setting the min and max values once we get the choice from the user*/  
 minmax.prototype.setMinMax=function(min,max){  
  this.minPlayer=min;  
  this.maxPlayer=max;  
 }  
 /*Copying the current configuration of the board and returning it. We do this since we need more have to operate on induvidual board instances on deeper depths   
 */  
 minmax.prototype.copyBoard=function(board){  
  return board.slice(0);  
 }  
 /*This function checks if a position is free on the board and makes the move. If the position is free, it makes a move and returns the new board, else returns the old board.  
 */  
 minmax.prototype.makeMove=function(position,board,player){  
  if(board[position]==0){  
   var newBoard=this.copyBoard(board);  
   newBoard[position]=player;  
   return newBoard;  
  }  
  else{  
   return null;  
  }  
 }  
 /*The main implementation of Minax algorithm. Since we are already making the max players move here, we call the minMove function here. The minMove and maxMove functions flicker between each other until a score is available. This function returns the bestmove for the computer for the given board configuration.   
 */  
 minmax.prototype.minMaxAlgo=function(board){  
  var bestValue=-100;  
  var bestMove=0;  
  var newBoard=[];  
  var value;  
  for(var i=0;i<board.length;i++){  
   newBoard=this.makeMove(i,board,this.maxPlayer);  
   if(newBoard){  
    value=this.minMove(newBoard);  
    if(value>bestValue){  
     bestValue=value;  
     bestMove=i;  
    }  
   }  
  }  
  return bestMove;  
 }  
 /*This function depicts the moves of the player, it returns the final score of the board configuration if either of the players won or if it is a tie. Else it calls the maxMove function  
 */  
 minmax.prototype.minMove=function(board){  
  if(this.won(this.minPlayer,board)){  
   return -10;  
  }  
  else if(this.won(this.maxPlayer,board)){  
   return 10;  
  }  
  else if(this.isTie(board)){  
   return 0;  
  }  
  else{  
   var leastValue=100;  
   for(var i=0;i<board.length;i++){  
    var newBoard=this.makeMove(i,board,this.minPlayer);  
    if(newBoard){  
     var value=this.maxMove(newBoard);  
     if(value<leastValue){  
      leastValue=value;  
     }  
    }  
   }  
   return leastValue;  
  }  
 }  
 /*This function depicts the moves of the computer, it returns the final score of the board configuration if either of the players won or if it is a tie. Else calls the minMove function  
 */  
 minmax.prototype.maxMove=function(board){  
  if(this.won(this.minPlayer,board)){  
   return -10;  
  }  
  else if(this.won(this.maxPlayer,board)){  
   return 10;  
  }  
  else if(this.isTie(board)){  
   return 0;  
  }  
  else{  
   var maxValue=-100;  
   for(var i=0;i<board.length;i++){  
    var newBoard=this.makeMove(i,board,this.maxPlayer);  
    if(newBoard){  
     var value=this.minMove(newBoard);  
     if(value>maxValue){  
      maxValue=value;  
     }  
    }  
   }  
   return maxValue;  
  }  
 }  
 /*In this function we haveto check whether the player in the current board configuration has won the game or not. For a win we have to check the row , columns and diagnols respectively  
 */  
 minmax.prototype.won=function(player,board){  
  if((board[0]==player&&board[1]==player&&board[2]==player)||  
    (board[3]==player&&board[4]==player&&board[5]==player)||  
    (board[6]==player&&board[7]==player&&board[8]==player)||  
    (board[0]==player&&board[3]==player&&board[6]==player)||  
    (board[1]==player&&board[4]==player&&board[7]==player)||  
    (board[2]==player&&board[5]==player&&board[8]==player)||  
    (board[0]==player&&board[4]==player&&board[8]==player)||  
    (board[2]==player&&board[4]==player&&board[6]==player)){  
   return true;  
  }  
  else{  
   return false;  
  }  
 }  
 /*Since the board is populated with 0's in empty positions, I am checking for 0's, if I find any I will return the value as false else as true  
 */  
 minmax.prototype.isTie=function(board){  
  for(var i=0;i<board.length;i++){  
   if(board[i]==0){  
    return false;  
   }  
  }  
  return true;  
 }  
 //End of the MinMax algorithm  
 $(function() {  
  game=new minmax(board);  
  board=[0,0,0,0,0,0,0,0,0];  
  $("#game").css("pointer-events", "none");  
  console.log(board);  
 });  
 /*The main function which handles the user inputs. It basically makes a check of two important conditions and if they satify, it continues processing the input. They are   
 1. Check if the current turn is the users turn, as the user might click on the board, while the computer is processing its move, if the computer accepts this move, then the game goes haywire .  
 2. Check if the board position is already filled. It doesnt make sense to accept input into a box which is already filled. Yet to make sure even that the computer doesnt accept it as there might be accidental clicks, this condition should be in place   
 */  
 $("td").click(function(e){  
  console.log(currentTurn);  
  if(currentTurn=="user"){  
    var id=$(this).attr("id");  
    var value=$("#"+id).attr("data-value");  
    if(board[value-1]==0){  
      $("#game").css("pointer-events", "none");  
      $(convertValueToDiv(value-1) + " .center-space").html(userChoice);  
      board[value-1]=game.minPlayer;  
      if(game.won(game.minPlayer,board)){  
       $("#result").text("You win");  
       $("#anotherGame").css("display","block");  
      }  
      else if(game.isTie(board)){  
       $("#result").text("Its a tie");  
       $("#anotherGame").css("display","block");  
      }  
      else{  
       currentTurn="computer";  
       setTimeout(delayComputerMove,1000);  
      }  
    }  
  }   
 });  
 function delayComputerMove(){  
  var move=game.minMaxAlgo(board);  
  console.log(move);  
  board[move]=game.maxPlayer;  
  $(convertValueToDiv(move) + " .center-space").html(computerChoice);  
  setTimeout(function(){currentTurn="user";},0);  
  if(game.won(game.maxPlayer,board)){  
   $("#result").text("Computer wins");  
   $("#anotherGame").css("display","block");  
  }  
  else if(game.isTie(board)){  
   $("#result").text("Its a tie");  
   $("#anotherGame").css("display","block");  
  }  
  else{  
   $("#game").css("pointer-events", "auto");  
  }  
 }  
 $("#x").click(function(){  
  currentTurn="user";  
  $("#choiceMsg").text("You have choosen X, and X goes first !!");  
  $("#options").toggle(1000);  
  computerChoice="<i class='fa fa-stop-circle animated flip'></i>";  
  userChoice="<i class='fa fa-times animated flip'></i>";  
  game.setMinMax(2,1);  
  $("#game").css("pointer-events", "auto");  
  console.log(board);  
 });  
 $("#o").click(function(){  
  $("#game").css("pointer-events", "auto");  
  currentTurn="computer";  
  $("#choiceMsg").text("You have choosen O but X goes first ");  
  $("#options").toggle(1000);  
  setTimeout(delayO,1000);  
 });  
 $("#yes").click(function(){  
  board=[0,0,0,0,0,0,0,0,0];  
  $("td .center-space").empty();  
  $("#anotherGame").css("display","none");  
  $("#result").text("");  
  $("#choiceMsg").text("");  
  $("#options").toggle(1000);  
 });  
 $("#no").click(function(){  
  $("#game").css("pointer-events", "none");  
  $("#choiceMsg").text("");  
  $("#anotherGame").css("display","none");  
  $("td").empty();  
  $("#result").text("Refresh page to play again");  
 });  
 /*An initial delay when the computer goes first, to create an illusion that the computer is thinking. Also inrespect of the design perspective, when the the options toggle out, the first move of the computer appears  
 */  
 function delayO(){  
  $('#game').attr("disabled", "disabled");  
  userChoice="<i class='fa fa-stop-circle animated flip'></i>";  
  computerChoice="<i class='fa fa-times animated flip'></i>";  
  game.setMinMax(1,2);  
  myMax=8;  
  myMin=0;  
  /*Generating a random first move for the computer, because when the computer goes first, the first move doesnt matter. Also it takes lot of time for the computer to generate a first move with empty board, as it has to evaluate a lot of board positions.   
  */  
  var move= Math.floor(Math.random()*(myMax-myMin+1))+myMin;  
  board[move]=game.maxPlayer;  
  var divId=convertValueToDiv(move);  
  $(divId + " .center-space").html(computerChoice);  
  console.log(board);  
  setTimeout(function(){currentTurn="user";},0);  
 }  
 /*Return the divisionId for a corresponding value. This method is useful when the computer goes first and generates a random move. To represent the move on the table, we need a mapping between the value and the divId   
 */  
 function convertValueToDiv(value){  
  var cases={0:"#one",1:"#two",2:"#three",3:"#four",4:"#five",5:"#six",6:"#seven",7:"#eight",8:"#nine"};  
  return cases[value];  
 }  