var mapimg;
var fontBold;
var fontRegular;

var clat = 0;
var clon = 0;

var ww = 1024;
var hh = 666;

var zoom = 1;
var data;

var lat = [];
var lon = [];
var mag = [];
var alp = [];

var num1 = 0;
var num2 = 0;
var num3 = 0;
var num4 = 0;
var num5 = 0;

var mag_ = [];

var day = [];
var counts = [];//计算每天发生地震的数量

var barH = [];

var posX = [];
var posX1 = [];
var posX2 = [];
var posY = [];
var posY2 = [];
var loc = [];

var d = [];
var targetD =[];
var temp = 1;
var rows;
var easing = 0.05;

//button
var button = "a";
var btnY = -666/2+50;
var btn1, btn2, btn3; //按钮
var btnW = 90;
var btnH = 30;
var btn1c = (255,255,255,200);
var btn2c = (255,255,255,40);
var btn1Color = (255,255,255,200);
var btn2Color = (255,255,255,40);
var txt1 = 20;
var txt2 = 255;
var txt1Color = 20;
var txt2Color = 255;
var boxw = 140;
var boxh = 60;



function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v8/static/' +
    clon + ',' + clat + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw');

  data = loadTable("data/earthquake.csv","header");
  fontBold = loadFont("data/Anton-Regular.ttf");
  fontRegular = loadFont("data/NotoSansSC-Medium.otf");
}

function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = data.getRowCount();
  for (var i = 0; i < rows; i++) {
    lat[i] = data.getNum(i,4);
    lon[i] = data.getNum(i,5);  
    mag[i] = data.getNum(i,6);
    loc[i] = data.getString(i,8);
    day[i] = data.getNum(i,2);
    barH[i] = 0;
    counts[i]= 0;
    d[i] = 0;
    alp[i] = 200;
    targetD[i] = map(mag[i], 0, 10, 0, 15);

    posX[i] = mercX(lon[i]) - mercX(clon);
    posY[i] = mercY(lat[i]) - mercY(clat);

    if( posX[i] < - width/2) {
      posX[i] += width;
    } else if( posX1[i] > width / 2) {
      posX[i] -= width;
    }
    posX1[i] = posX[i];
    posX2[i] = posX[i];
    posY2[i] = posY[i];
  }
  allcounts();

}


function allcounts(){
  //计算同一天发生地震的数量
  for(var j = 0; j<rows; j++){  
    if(day[j] == day[temp]){
      counts[temp]++;
    }else if(day[j] > day[temp]){
      counts[temp]++;
      temp = j;
    }  
  } 

  //计算不同震级的数量
  for(var k = 0; k<rows; k++){
    if(mag[k] <= 3){
      num1++;
      mag_[k] = num1;
      
    }else if(mag[k]>3 && mag[k]<=4){
      num2++;
      mag_[k] = num2;
      
    }else if(mag[k]>4 && mag[k]<=5){
      num3++;
      mag_[k] = num3;
      
    }else if(mag[k]>5 && mag[k]<=6){
      num4++;
      mag_[k] = num4;
      
    }else if(mag[k]>6 ){
      num5++;
      mag_[k] = num5;    
    }
  }

}


function draw(){  
  fill(44);
  var w = (width-ww)/2;
  noStroke();
  rect(0,0,width,w);
  rect(0,0,w,height);
  rect(width-w,0,w,height);
  rect(0,height-w,width,w);

  translate(width / 2, height / 2);

  imageMode(CENTER);
  image(mapimg, 0, 0);
 
  if (button == "a") {   
    for(var i = 0; i < rows; i++){
      posX2[i] = posX[i];
      posY2[i] = posY[i];
    }
      earthquake();
      drawDays();
  }else if(button == "b") {
    showMag();
    // for(var i = 0; i < rows; i++){
    //   posX1[i] = posX[i];
    //   posY1[i] = posY[i];
    // }
  }

  drawBtn(btnY);  
  title();

}

function earthquake(){
    for (var i = 0; i < rows; i++) {      
        var a = 0;

        if(frameCount - i > 0){
          d[i] += (targetD[i]-d[i])*0.05;
          alp[i] += ( 0 - alp[i])*0.02;
       
          var percent = norm(mag[i],0,8);
          var from = color(255,220,74);
          var to = color(255,0,74);
          var between = lerpColor(from, to,percent);

          fill(between.levels[0], between.levels[1], between.levels[2],150);
          noStroke();

          posX1[i] += (posX[i] - posX1[i])*0.05;
          ellipse(posX1[i], posY[i], d[i], d[i]);  

          noFill();
          strokeWeight(1);
          stroke(between.levels[0], between.levels[1], between.levels[2], alp[i]-30);      
          ellipse(posX1[i], posY[i], d[i]/0.5, d[i]/0.5);      
          stroke(between.levels[0], between.levels[1], between.levels[2], alp[i]-10);
          ellipse(posX1[i], posY[i], d[i]/0.3, d[i]/0.3);      
        }  
   }
}

function drawDays(){
  for(var i = 0; i <rows; i++){  
      var x = map(day[i],day[0],day[rows-1],-500,500);
      var h = map(counts[i],0,10,0,30);
      barH[i] += (h-barH[i])*0.05;
      if(counts[i]>0 && frameCount - i > 0){
        stroke(255,0,74);
        line(x,260,x,260-barH[i]);
      }
  }

  fill(100);
  textSize(12);
  noStroke();
  textFont(fontRegular);
  textAlign(LEFT);
  text("2017/05/02",-500,275);
  textAlign(RIGHT);
  text("2018/05/02", 500,275);
}

function title(){
  textFont(fontBold);
  textSize(30);
  fill(255,220);
  noStroke();
  textAlign(LEFT);
  text("Earthquake",-500,-hh/2+50);
  textSize(20);
  text("2017-2018",-500,-hh/2+90);
  fill(100);
  textSize(12);
  textFont(fontRegular);
  text("Created by Yasai",-500,-hh/2+120)
}


function showMag(){
  var s = 12;
  var a = 15;
  var x;
  var y;
  var marginT = hh/2-110;
  var from = color(255,220,74);
  var to = color(255,0,74);
  var between;
  var percent;
  var alpha =0;


  for(var j = 0; j < rows; j++){    
    var distance = dist(mouseX-width/2,mouseY-height/2,posX2[j],posY2[j]);
    if(distance<5){
      fill(255,60);
      noStroke();
      ellipse(posX2[j],posY2[j],20,20);

      posX1[j] += (posX[j] - posX1[j])*0.05;
      ellipse(posX1[j], posY[j], d[j], d[j]);  

      d[j] += (targetD[j]-d[j])*0.05;
      alp[j] += ( 0 - alp[j])*0.02;
       
      var percent = norm(mag[j],0,8);
      var from = color(255,220,74);
      var to = color(255,0,74);
      var between = lerpColor(from, to,percent);
      fill(between.levels[0], between.levels[1], between.levels[2],150);
      
      ellipse(posX1[j], posY[j], d[j] ,d[j]);  
      strokeWeight(1);
      fill(between.levels[0], between.levels[1], between.levels[2], alp[j]-30);      
      ellipse(posX1[j], posY[j], d[j]/0.3, d[j]/0.3);      
      fill(between.levels[0], between.levels[1], between.levels[2], alp[j]-30); 
      ellipse(posX1[j], posY[j], d[j]/0.1, d[j]/0.1); 

      textSize(14);
      fill(255,200);
      noStroke();
      text(loc[j], posX1[j]+20, posY[j]-10);
      text(mag[j], posX1[j]+20, posY[j]+6);
    }
  }

  for(var i = 0 ; i < rows; i++){
    percent = norm(mag[i],0,8);
    between = lerpColor(from, to,percent);

    x = int((mag_[i]-1)%a);
    y = int((mag_[i]-1)/a);
    
    easing = map(mag_[i],0,300,0.1,0.05);

    if(mag[i]<=3){   
      posX2[i] += (-500 + x*s - posX2[i])*easing;
      posY2[i] += (marginT - y*s - posY2[i])*easing;
    }else if(mag[i]>3 && mag[i]<=4){
      posX2[i] += (-300+10 + x*s - posX2[i])*easing;
      posY2[i] += (marginT - y*s - posY2[i])*easing;
    }else if(mag[i]>4 && mag[i]<=5){
      posX2[i] += (-100+10 + x*s - posX2[i])*easing;
      posY2[i] += (marginT - y*s - posY2[i])*easing;
    }else if(mag[i]>5 && mag[i]<=6){
      posX2[i] += ( 100+10 + x*s - posX2[i])*easing;
      posY2[i] += (marginT - y*s - posY2[i])*easing;
    }else if(mag[i]>6 ){
      posX2[i] += ( 300+10 + x*s - posX2[i])*easing;
      posY2[i] += (marginT - y*s - posY2[i])*easing;
    }

    fill(between.levels[0], between.levels[1], between.levels[2],200);
    noStroke();
    ellipse(posX2[i],posY2[i],targetD[i],targetD[i]);
  }

  
  textSize(35);
  fill(209,119,67);
  textFont(fontBold);
  text(num1,-500 , marginT +30 );
  textSize(14);
  textFont(fontRegular);
  text("Magnitude",-500 +60,marginT+22 );
  text("0-3.0",-500 +60,marginT+42 );

  textSize(35);
  fill(209,99,67);
  textFont(fontBold);
  text(num2,-290 , marginT +30 );
  textSize(14);  
  textFont(fontRegular);
  text("Magnitude",-310 +80,marginT+22 );
  text("3.0-4.0",-310 +80,marginT+42 );

  textSize(35);
  fill(209,79,67);
  textFont(fontBold);
  text(num3,-90 , marginT +30 );
  textSize(14);
  textFont(fontRegular);
  text("Magnitude",-90 +50,marginT+22 );
  text("4.0-5.0",-90 +50,marginT+42 );

  textSize(35);
  fill(209,59,67);
  textFont(fontBold);
  text(num4, 110 , marginT +30 );
  textSize(14);
  textFont(fontRegular);
  text("Magnitude",110 +40,marginT+22 );
  text("5.0-6.0",110 +40,marginT+42 );

  textSize(35)
  fill(209,39,67);
  textFont(fontBold);
  text(num5, 310 , marginT +30 );
  textSize(14);
  textFont(fontRegular);
  text("Magnitude",310 +40,marginT+22 );
  text("6.0+",310 +40,marginT+42 );


}

function drawBtn(btnY) {
    strokeCap(ROUND);
    stroke(255);

    fill(btn1Color);
    rect(ww/2-20-2*btnW, btnY, btnW, btnH);
    fill(btn2Color);
    rect(ww/2-20-1*btnW, btnY, btnW, btnH);

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    textFont(fontRegular);
    fill(txt1Color);
    text("Timeline", ww/2-20-2*btnW, btnY, btnW, btnH);

    fill(txt2Color);
    text("Magnitude", ww/2-20-1*btnW, btnY, btnW, btnH);

}



function mousePressed() {
    if (mouseX-width/2 > ww/2-20-2*btnW && mouseX-width/2 < ww/2-20-1*btnW &&
        mouseY-height/2 > btnY && mouseY-height/2 < btnY + btnH) {
        button = "a";
        btn1Color = color(btn1c);
        btn2Color = color(btn2c);
        txt1Color = color(txt1);
        txt2Color = color(txt2);
    } else if (mouseX-width/2 > ww/2-20-1*btnW && mouseX -width/2< ww/2-20&&
        mouseY-height/2 > btnY && mouseY-height/2 < btnY + btnH) {
        button = "b";
        btn1Color = color(btn2c);
        btn2Color = color(btn1c);
        txt1Color = color(txt2);
        txt2Color = color(txt1);
    } 
}
