var winh=800;
var winb=600;

function setup() {
    createCanvas(winb, winh);
    struksel = new Struksel();
    textAlign(CENTER);
    ellipseMode(CENTER);
    test();

}

function draw() {
    background(100);
    struksel.tick();
    struksel.draw();
    if (struksel.len()==0) {
	fill(255);
	textAlign(CENTER);
	textSize(32);
	text("click mouse to add a particle ", width/2, height/2);
  }
}

function mouseDragged(){
    console.log("drag"+struksel.selected.length);
    if (struksel.selected.length==1)
    {
	//	struksel.particle[struksel.selected[0]].setPosition(mouseX, mouseY);
    }
}

function mousePressed() {
 //   struksel.isClicked(mouseX, mouseY);
 //   console.log("len"+struksel.selected.length);   
    //  if (struksel.selected.length==0)
    if ( struksel.isClicked(mouseX, mouseY)==false)
    {
	struksel.addPartatMouse(mouseX, mouseY);
    }
}


function  keyPressed()
{
    console.log(key);
    if (key=='I'){
	struksel.init();
    }
    if (key=='N') {
	struksel.addPartatMouse(mouseX, mouseY);
	return;
    }
    if (key='C'){
	if (struksel.selected.length==2){
	   
	    struksel.addForce(struksel.selected[0],struksel.selected[1],0.1,10);
	    struksel.makeAttraction(struksel.particles[0],struksel.particles[1],0.1,5);
	    struksel.unSelectAll();	    
	}
	return;
    }    
    else console.log(key);
    
}

function test(){
//    struksel.addPart(20,20);

    struksel.addPart(100,100);
//    struksel.addPart(200,200);
//    struksel.addPart(100,200);
//    struksel.addPart(100,250);

 //   struksel.particles[1].selected=true;
  //  struksel.addForce(1,0);
//    struksel.makeAttraction(struksel.particles[0],struksel.particles[1],0.1,5);
}
