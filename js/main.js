function anglePrincipal(angle){
    while (angle >360) angle-=360;
    while (angle < 0) angle +=360;
    return angle;
}

function newImage(path, stage, addToStage = true) {
    var newimage = new createjs.Bitmap(path);
    newimage.image.onload = function(e){ stage.update(); }
    if (addToStage) stage.addChild(newimage);
    return newimage;
}

function roundTo(num,to) {
  return Math.round(num*Math.pow(10,to))/Math.round(Math.pow(10,to));
}

function updateStateKet(angle) {
  angle = anglePrincipal(angle);
  var degrees = angle;
  angle = angle*Math.PI/180;
  var latex = '$|\\text{spin state}\\rangle =';

  latex += "\\cos(\\frac{"+String(roundTo(degrees,2))+"^o}{2}) |u\\rangle";
  latex += "+\\sin(\\frac{"+String(roundTo(degrees,2))+"^o}{2}) |d\\rangle =";
  latex += String(roundTo(Math.cos(angle/2),2));
  latex += '|u\\rangle';
  var downCoeff = roundTo(Math.sin(angle/2),2);
  latex += (downCoeff>=0 ?"+":"");
  latex += String(downCoeff);
  latex += '|d\\rangle';
  angle = roundTo(angle,2);
  latex +='$';
  $('#spin-state').html(latex);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

var mouseisdown = false;
var lastMousePos = new createjs.Point(0,0);
var lastStateAngle = 0;
var stage;

$(document).ready(function(){

    stage = new createjs.Stage("stateSimulation");
    lastMousePos = new createjs.Point(stage.mouseX, stage.mouseY);

    createjs.Ticker.addEventListener("tick",stage);

    var bg = new createjs.Shape(); stage.addChild(bg);
    bg.graphics.beginStroke("black").drawRect(0, 0, 500, 500).endStroke();


    var machine = new createjs.Container(); var machineImage = new createjs.Bitmap("images/machine.png");
    machineImage.image.onload = function() {
      machineImage.x = -machineImage.image.width/2;machineImage.y = -machineImage.image.height/2;
    }; machine.addChild(machineImage);
    machine.x = 130;
    machine.y = 150;


    var stateDrawing = new createjs.Container();  var stateArrow = new createjs.Bitmap("images/spin.png");
    stateArrow.image.onload = function() {
        stateArrow.y = -stateArrow.image.height;
        stateArrow.x = -stateArrow.image.width/2;
    }
    stateDrawing.addChild(stateArrow);
    stateDrawing.x = machine.x;
    stateDrawing.y = machine.y;
    stage.addChild(stateDrawing);
    stage.addChild(machine);



    var defaultPlusText = "Probability to measure +1: --";
    var defaultMinusText = "Probability to measure -1: --";
    var probPlus = new createjs.Text(defaultPlusText, "20px Arial", "#ff7700");
    var probMinus = new createjs.Text(defaultMinusText, "20px Arial", "#ff7700");
    probPlus.x = 50;
    probPlus.y = 250;
    stage.addChild(probPlus);
    probMinus.x = 50;
    probMinus.y = 300;
    stage.addChild(probMinus);


    var resultText = new createjs.Text("Result: -", "20px Arial");
    resultText.x = 300;
    resultText.y = 150;
    stage.addChild(resultText);

    $('#measure-btn').on("click", function(ev){
        var result =undefined;
        var angleDiff = anglePrincipal(machine.rotation)-anglePrincipal(lastStateAngle);
        var prob1 = Math.pow(Math.cos(Math.PI/180*angleDiff/2),2);
        if (Math.random() < prob1 ) {
            resultText.text = "Result: +"+String(1);
            lastStateAngle = machine.rotation;
        } else {
            resultText.text = "Result: "+String(-1);
            lastStateAngle = machine.rotation+180;
        }

        updateProbabilites();
        stage.update();
        createjs.Tween.get(stateDrawing).to({rotation:lastStateAngle}, 500, createjs.Ease.getPowOut(3));
        updateStateKet(lastStateAngle);
    });



    function updateProbabilites(){
        var angleDiff = anglePrincipal(machine.rotation)-anglePrincipal(lastStateAngle);
        var prob1 = Math.pow(Math.cos(Math.PI/180*angleDiff/2),2);
        probPlus.text = "Probability to measure +1: "+Math.round(prob1*100).toString()+"%";
        probMinus.text = "Probability to measure -1: "+Math.round((1-prob1)*100).toString()+"%";
    }

    stage.addEventListener("stagemousedown", function(ev){
        mouseisdown = true;
    });
    stage.addEventListener("stagemouseup", function(ev){
        mouseisdown = false;
    });

    stage.addEventListener("stagemousemove", function (ev){
        if (mouseisdown && stage.mouseY>350) {
            machine.rotation += 0.7*(stage.mouseX-lastMousePos.x);
            updateProbabilites();
        }

        lastMousePos.x = stage.mouseX; lastMousePos.y = stage.mouseY;

        stage.update();
    });

    stage.update();
});
