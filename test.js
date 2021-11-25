//The Magicians 3
//Spell Gestures

var gestureSpell = { oldX: 0, oldY: 0, canvas: new Object(), ctx: new Object(), r: new Object(), points: [], isMouseDown: false, threshold: 3 };

function gestureSpell_adjustX(x) {
  return x - gestureSpell.canvas.getBoundingClientRect().left;
}

function gestureSpell_adjustY(y) {
  return y - gestureSpell.canvas.getBoundingClientRect().top;
}

function gestureSpell_canvasDetection(canvasName) {
  document.getElementById(canvasName).addEventListener('touchstart', function (e) {
    e.preventDefault();
    gestureSpell.points = [];
    var touch = e.touches[0];
    gestureSpell.ctx.beginPath();
    gestureSpell.ctx.strokeStyle = "#DCE3FA";
    gestureSpell.ctx.lineCap = "round";
    gestureSpell.ctx.lineJoin = "round";
    gestureSpell.ctx.lineWidth = 6;
    gestureSpell.oldX = gestureSpell_adjustX(touch.pageX);
    gestureSpell.oldY = gestureSpell_adjustY(touch.pageY);
  }, false);

  document.getElementById(canvasName).addEventListener('touchmove', function (e) {
    var touch = e.touches[0];
    if ((Math.abs(gestureSpell.oldX - gestureSpell_adjustX(touch.pageX)) < gestureSpell.threshold) && (Math.abs(gestureSpell.oldY - gestureSpell_adjustY(touch.pageY)) < gestureSpell.threshold)) {
      return;
    }

    gestureSpell.ctx.moveTo(gestureSpell.oldX, gestureSpell.oldY);
    gestureSpell.oldX = gestureSpell_adjustX(touch.pageX);
    gestureSpell.oldY = gestureSpell_adjustY(touch.pageY);
    gestureSpell.ctx.lineTo(gestureSpell.oldX, gestureSpell.oldY);
    gestureSpell.ctx.stroke();
    gestureSpell.ctx.shadowColor = 'rgba(213,218,232,0.1)';
    gestureSpell.ctx.shadowOffsetX = 0;
    gestureSpell.ctx.shadowOffsetY = 0;
    gestureSpell.ctx.shadowBlur = 7;
    gestureSpell.points[gestureSpell.points.length] = new gestureDollar_Point(gestureSpell.oldX, gestureSpell.oldY);
  }, false);

  document.getElementById(canvasName).addEventListener('touchend', function (e) {
    gestureSpell.ctx.closePath();
    if (gestureSpell.points.length >= Math.floor(20 / Math.sqrt(gestureSpell.threshold))) {
      var result = gestureSpell.r.Recognize(gestureSpell.points);

      gamePlayer.spellCurrent = result.Name;
      gamePlayer.spellType = 2;
      gamePlayer.spellLevel = result.Score;
    }
    gestureSpell.points = [];
    gestureSpell.ctx.clearRect(0, 0, gestureSpell.canvas.width, gestureSpell.canvas.height);
  }, false);


  // MOUSE BINDS FOR THE HELL OF IT
  document.getElementById(canvasName).addEventListener('mousedown', function (e) {

    gestureSpell.isMouseDown = true;
    e.preventDefault();
    gestureSpell.points = [];
    gestureSpell.ctx.beginPath();
    gestureSpell.ctx.strokeStyle = "#DCE3FA";
    gestureSpell.ctx.lineCap = "round";
    gestureSpell.ctx.lineJoin = "round";
    gestureSpell.ctx.lineWidth = 6;
    gestureSpell.ctx.shadowColor = 'rgba(213,218,232,0.1)';
    gestureSpell.ctx.shadowOffsetX = 0;
    gestureSpell.ctx.shadowOffsetY = 0;
    gestureSpell.ctx.shadowBlur = 7;
    gestureSpell.oldX = gestureSpell_adjustX(e.pageX);
    gestureSpell.oldY = gestureSpell_adjustY(e.pageY);
  }, false);

  document.getElementById(canvasName).addEventListener('mousemove', function (e) {
    if (!gestureSpell.isMouseDown) {
      return;
    }

    if ((Math.abs(gestureSpell.oldX - gestureSpell_adjustX(e.pageX)) < gestureSpell.threshold) && (Math.abs(gestureSpell.oldY - gestureSpell_adjustY(e.pageY)) < gestureSpell.threshold)) {
      return;
    }

    gestureSpell.ctx.moveTo(gestureSpell.oldX, gestureSpell.oldY);
    gestureSpell.oldX = gestureSpell_adjustX(e.pageX);
    gestureSpell.oldY = gestureSpell_adjustY(e.pageY);
    gestureSpell.ctx.lineTo(gestureSpell.oldX, gestureSpell.oldY);
    gestureSpell.ctx.stroke();
    gestureSpell.points[gestureSpell.points.length] = new gestureDollar_Point(gestureSpell.oldX, gestureSpell.oldY);
  }, false);

  document.getElementById(canvasName).addEventListener('mouseup', function (e) {
    gestureSpell.isMouseDown = false;
    gestureSpell.ctx.closePath();
    if (gestureSpell.points.length >= Math.floor(20 / Math.sqrt(gestureSpell.threshold))) {
      var result = gestureSpell.r.Recognize(gestureSpell.points);

      gamePlayer.spellCurrent = result.Name;
      gamePlayer.spellType = 2;
      gamePlayer.spellLevel = result.Score;
    }

    if (document.getElementById('gestureInput')) {
      gestureSpell.points = gestureDollar_Resample(gestureSpell.points, NumPoints);
      var radians = gestureDollar_IndicativeAngle(gestureSpell.points);
      gestureSpell.points = gestureDollar_RotateBy(gestureSpell.points, -radians);
      gestureSpell.points = gestureDollar_ScaleTo(gestureSpell.points, SquareSize);
      gestureSpell.points = gestureDollar_TranslateTo(gestureSpell.points, Origin);
      var buildHTML = 'new gestureDollar_Point(' + parseInt(gestureSpell.points[0].X) + ', ' + parseInt(gestureSpell.points[0].Y) + ')';
      for (var i = 1; i < gestureSpell.points.length; i++) {
        buildHTML += ', new gestureDollar_Point(' + parseInt(gestureSpell.points[i].X) + ', ' + parseInt(gestureSpell.points[i].Y) + ')';
      }
      document.getElementById('gestureInput').innerHTML = buildHTML;
    }

    gestureSpell.points = [];
    gestureSpell.ctx.clearRect(0, 0, gestureSpell.canvas.width, gestureSpell.canvas.height);
  }, false);
}