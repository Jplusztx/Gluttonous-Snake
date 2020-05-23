if(localStorage.highestScore == undefined){
	localStorage.highestScore = 0;
}
var highestScore = parseInt(localStorage.highestScore);
var main = document.querySelector(`.main`);
var score = 0;
var speed = 150;
var dead = false;
//生成小方格
for(var i=0;i<26;i++){
	for(var j=0;j<26;j++){
		var div = document.createElement(`div`);
		div.className = "square";
		div.id = "x"+i+"y"+j;
		main.appendChild(div);
	}
}
var food;
function randomFood(){
	var repeat = false;
	var x = parseInt(Math.random()*26);
	var y = parseInt(Math.random()*26);
	for (let item in snake) {
		if(item.x == x && item.y == y){
			randomFood();
		}
	}
	food = {x:x,y:y};
	var foodNode = document.querySelector('#x'+food.x+`y`+food.y);
	foodNode.className = "square food";
}
randomFood()
var snake = [];
function refreshSnake(){
	snake.forEach(function(item,index){
		var snakeBody = document.querySelector(`#x`+item.x+`y`+item.y);
		snakeBody.className = index==0?"square snakeHead":"square snake";
	});
}
function randSnake(){
	var hx = parseInt(Math.random()*15)+5;
	var hy = parseInt(Math.random()*15)+5;
	for(var i=0;i<3;i++){
		snake.push({x:hx,y:hy-i});
	}
}
randSnake();
refreshSnake();
var direction = {x:0,y:1};
function snakeMove(){
	var foodNode = document.querySelector('#x'+food.x+`y`+food.y);
	foodNode.className = "square food";
	var hx = snake[0].x+direction.x;
	if(hx >= 26) hx = 0;
	if(hx < 0) hx = 25;
	var hy = snake[0].y+direction.y;
	if(hy >= 26) hy = 0;
	if(hy < 0) hy = 25;
	snake.forEach(function(item,index){
		if(hx == item.x && hy == item.y){
			dead = true;
			if(score > highestScore){
				localStorage.highestScore = score;
			}
			deadWinFn();
			clearInterval(move);
		}
	});
	if(!dead){
		snake.unshift({x:hx,y:hy});
		if(hx == food.x && hy == food.y){
			score++;
			refreshScore();
			randomFood();
		}else{
			var tail = snake.pop();
			tail = document.querySelector('#x'+tail.x+`y`+tail.y);
			tail.className = "square";
		}
		refreshSnake();
	}
}
function refreshScore(){
	var scoreBoard = document.querySelector(`.score`);
	scoreBoard.innerText = "Score："+score*10;
	speed -= score;
}
var move = setInterval(snakeMove,speed);
var control = document.querySelector(`.control`);
var isPlay = true;
control.onclick = function(){
	if(isPlay && !dead){
		clearInterval(move);
		control.innerText = "继续";
	}else{
		move = setInterval(snakeMove,speed);
		control.innerText = "暂停";
	}
	isPlay = !isPlay;
}
var body = document.querySelector(`body`);
body.onkeydown = function(event){
	if(event.key == "ArrowUp" && direction.x != 1){
		direction = {x:-1,y:0};
	}else if(event.key == "ArrowDown" && direction.x != -1){
		direction = {x:1,y:0};
	}else if(event.key == "ArrowLeft" && direction.y != 1){
		direction = {x:0,y:-1};
	}else if(event.key == "ArrowRight" && direction.y != -1){
		direction = {x:0,y:1};
	}
	snakeMove();
}
var restart = document.querySelector(`.restart`);
restart.onclick = function(){
	direction = {x:0,y:1};
	speed = 150;
	dead = false;
	score = 0;
	snake = [];
	food = [];
	main.innerHTML = "";
	for(var i=0;i<26;i++){
		for(var j=0;j<26;j++){
			var div = document.createElement(`div`);
			div.className = "square";
			div.id = "x"+i+"y"+j;
			main.appendChild(div);
		}
	}
	randSnake();
	refreshSnake();
	randomFood();
	refreshScore();
	clearInterval(move);
	move = setInterval(snakeMove,speed);
}

function deadWinFn(){
	var deadWin = document.createElement(`div`);
	deadWin.className = "shade";
	deadWin.innerHTML = `
		<div class="deadWin">
			<h3 class="title">您吃掉了自己的尾巴！</h3>
			<div class="content">
				<div class="highestScore">历史最高：${localStorage.highestScore*10}</div>
				<div class="nowScore">本次分数：${score*10}</div>
			</div>
			<div class="choose">
				<div class="restart button">ReStart</div>
				<div class="control button">Close</div>
			</div>
		</div>
	`;
	body.appendChild(deadWin);
	var re = document.querySelector(`.choose>.restart`);
	re.onclick = function(){
		body.removeChild(deadWin);
		restart.click();
	}
	var cls = document.querySelector(`.choose>.control`);
	cls.onclick = function(){
		window.close();
	}
}
