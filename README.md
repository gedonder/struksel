#+EMAIL:     gedonder@gmail.com

# struksel
struksel.js is a library used in combination with Processing P5.js. To play with particles, forces, attraction, springs


# start to run
Make a directory libraries with the following files:
- struksel.js
- P5.min.js or P5.js This file can be downloaded from https://p5js.org/download/
- example.js this is your code

Look at the index.html to see a simple example

# examples
![alt text](https://github.com/gedonder/struksel/blob/master/img1.png)

# Write your own code 
``` javascript
function setup() {
    createCanvas(winb, winh);
    struksel = new Struksel();
    textAlign(CENTER);
    ellipseMode(CENTER);

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
    }
}

function mousePressed() {
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

```

#
