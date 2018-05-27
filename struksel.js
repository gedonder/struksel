//"use strict"
var struksel;
var winh=800;
var winb=600;
var particlesize = 30;
var space = 0;       //0= room 1 = space


var NODE_SIZE = 30;//10;
var EDGE_LENGTH = 200;//20;
var EDGE_STRENGTH = 0.01;//0.2;
var SPACER_STRENGTH = 100;//1000;
var MINAFSTAND = 190;
var MAXAFSTAND = 210;
var MIN_AFSTAND_TS_PART=50;
var  centroidscale = 1;
var centroidX = 0;
var centroidY = 0;

 
class Stuksels{
    constructor(){
	this.space=0; // 0 room with walls  1 infinite
	
    }
}

var Struksel = function () {
    this.particles = [];
    this.forces=[];
    this.attractions=[];
    this.springs=[];
    this.customForces=[];

    this.selected=[];
    this.sel = -1;
    //   this.integrator = new RungeKuttaIntegrator(this);
    this.integrator = new EulerIntegrator(this);
    this.gravity=1; //0.1
    this.space=1;
    
    Struksel.prototype.addForce= function(p1,p2){
	f=new Force(this.part(p1),this.part(p2));
	this.forces.push(f);
    }
    
    Struksel.prototype.addPartatMouse= function (coordx,coordy) {
	console.log(coordx);
	if (this.space==1){
	    // translate screen coords to space coords
	    coordx=(coordx-winb/2)/centroidscale+centroidX;
	    coordy=(coordy-winh/2)/centroidscale+centroidY;
	}
    
	p = new Particle(createVector(coordx,coordy));
	
	p.setColor(random(0,255),random(0,255),random(0,255));
	p.setText(this.len().toString());     // give the particle a number
	this.particles.push(p);
    }

    Struksel.prototype.addPart= function (coordx,coordy) {
	p = new Particle(createVector(coordx,coordy));
	
	p.setColor(random(0,255),random(0,255),random(0,255));
	p.setText(this.len().toString());     // give the particle a number
	this.particles.push(p);
    }

    Struksel.prototype.makeAttraction = function (part1, part2, k, minDistance) {
        var a = new Attraction(part1,part2, k, minDistance);
        this.attractions.push(a);
    };
    
    Struksel.prototype.implode=function(){
	for (var i = this.particles.length - 1; i >= 0; i--) {
	    p1=this.particles[i];
	    for (var j= this.particles.length - 1; j >= 0; j--){
		p2 = this.particles[j];
		this.makeAttraction( p1, p2, SPACER_STRENGTH=100, MIN_AFSTAND_TS_PART=10);
	    }
	}
    }
    
    Struksel.prototype.part=function(i){
	return this.particles[i]
    }
    
    Struksel.prototype.unSelectAll=function(){
	for (var i = this.particles.length - 1; i >= 0; i--) {
	    this.particles[i].selected=false;
	}
    }

    Struksel.prototype.len= function () {
	return this.particles.length;
    }

    Struksel.prototype.draw = function () {
	for (var j = this.forces.length - 1; j >= 0; j--) {
	    var f = this.forces[j];
	    f.draw(); 
	}

	for (var i = this.particles.length - 1; i >= 0; i--) {
	    var p = this.particles[i];
	    p.draw(); 
	}
    }
    
    Struksel.prototype.tick = function () {       
        this.integrator.step(1);
	if (this.space==0){
	    this.checkBorders();
	}
	if (this.space == 1){
	    this.calcCentroid();
	}	
    }
    
    Struksel.prototype.calcCentroid=function(){  
	var xMax = Number.NEGATIVE_INFINITY;
	var xMin = Number.POSITIVE_INFINITY; 
	var yMin = Number.POSITIVE_INFINITY; 
	var yMax = Number.NEGATIVE_INFINITY;
	
	for ( var i = this.particles.length - 1; i >= 0; i--) 
	{
	    var p = this.particles[i];
	    xMax = max( xMax, p.position.x );
	    xMin = min( xMin, p.position.x );
	    yMin = min( yMin, p.position.y );
	    yMax = max( yMax, p.position.y );
	}
	var  deltaX = xMax-xMin;
	var  deltaY = yMax-yMin;

	centroidX = xMin + 0.5 * deltaX;
	centroidY = yMin + 0.5 * deltaY;
	
	if ( deltaY > deltaX )
	{   centroidscale = winh/(deltaY+50);}
	else
	{  centroidscale = winb/(deltaX+50);}


	translate( winb/2, winh/2 );
	
	scale( centroidscale );
	translate( -centroidX, -centroidY );
	
    }
    
    Struksel.prototype.checkBorders=function(){
	for (var i = this.particles.length - 1; i >= 0; i--) {
	    var p = this.particles[i];
	   
	    if ((p.position.x > (winh-particlesize/2)) || (p.position.x < particlesize/2)) {
		p.velocity.x = p.velocity.x * -1;
	    }
	    if ((p.position.y > (winb-particlesize/2)) || (p.position.y < particlesize/2 )) {
		p.velocity.y = p.velocity.y * -1;
	    }
	}
	
    }
    
    Struksel.prototype.isClicked = function (coordx,coordy) {
	var clicked=false;
	if (this.space==1){
	    	    coordx=(coordx-winb/2)/centroidscale+centroidX;
	    coordy=(coordy-winh/2)/centroidscale+centroidY;
	}
	this.selected=[];
	for (var i = this.particles.length - 1; i >= 0; i--) {
	    if (this.particles[i].isClicked(coordx,coordy)){
		console.log(i,"clicked")
		this.particles[i].toggleSelect();
		clicked=true;
	    }
	    if(this.particles[i].selected){
		this.selected.push(i);
	    }
	}
	return clicked;
    }

    Struksel.prototype.init = function(){
	this.particles = [];
    }
    
    Struksel.prototype.applyForces = function () {
        if (!this.gravity==0) {
            for (var i = 0; i < this.particles.length; ++i) {
                var p = this.particles[i];
                p.force.add(this.gravity);
            }
        }
        for (var i = 0; i < this.particles.length; ++i) {
            var p = this.particles[i];
            p.force.add(p.velocity.x * -this.drag, p.velocity.y * -this.drag, p.velocity.z * -this.drag);
        }
        for (var i = 0; i < this.springs.length; i++) {
            var f = this.springs[i];
            f.apply();
        }
        for (var i = 0; i < this.attractions.length; i++) {
            var f = this.attractions[i];
	    f.apply();
        }
        for (var i = 0; i < this.customForces.length; i++) {
            var f = this.customForces[i];
            f.apply();
        } 
    }
    
    Struksel.prototype.clearForces = function () {
        var i = (function (a) { var i = 0; return { next: function () { return i < a.length ? a[i++] : null; }, hasNext: function () { return i < a.length; } }; })(this.particles);
        while ((i.hasNext())) {
            var p = i.next();
            p.force.set(0,0,0);
        }
    }
}


// Particle
var Particle = function(position) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.kleur = createVector(0,255,0);
    this.age = 255.0;
    this.isfixed=false;
    this.isfree=true;
    this.size=30;                     // size of the particle default 30
    this.text=null;                   // short text shown add particle
    this.selected=false;              // turns red if the particle is selected
    this.force=createVector(0,0,0);
    
    Particle.prototype.draw = function () {
	if (this.selected==false){
	    stroke(this.kleur.x,this.kleur.y,this.kleur.z, this.lifespan);	
	}
	else {
	    stroke(255,0,0, this.lifespan);
	}
	
	strokeWeight(2);
	
	fill(127, this.lifespan);
	ellipse(this.position.x, this.position.y, this.size, this.size);
	
	if (this.text!=null) {
	    fill(0);
	    noStroke();
	    textSize(14);
	    text(this.text, this.position.x, this.position.y);
	}
    }
    
    Particle.prototype.isFixed = function () {
        return this.fixed;
    }
    
    Particle.prototype.isFree = function () {
        return this.free;
    }
    
    Particle.prototype.getColor = function () {
	return this.kleur;
    }
    
    Particle.prototype.setColor = function (r,g,b) {
	this.kleur.x = r;
	this.kleur.y = g;
	this.kleur.z = b;
    }
    
    Particle.prototype.setPostion= function (x,y) {
	this.position.x = x;
	this.position.y = y;
	this.position.z = 0;
    }

    Particle.prototype.getText = function () {
	return this.text;
    };

    Particle.prototype.toggleSelect = function () {
	if (this.selected==true) this.selected=false;
	else this.selected = true;
	return this.text;
    }

    Particle.prototype.setText = function (t) {
	this.text = t;
    }

    Particle.prototype.isClicked = function (muisX, muisY) {
	console.log(muisX,muisY,this.position.x,this.position.y)
	if (muisX > this.position.x - (this.size / 2 | 0) && muisX <= this.position.x + (this.size / 2 | 0)) {
            if (muisY > this.position.y - (this.size/ 2 | 0) && muisY <= this.position.y + (this.size / 2 | 0)) {	   
		return true;
	    }
	}    
	return false;
    }
}

// Force

//var Force = function(part1,part2){
class Force{
    constructor(part1,part2){
	this.visible=true;
	this.p1=part1;           // begin particle
	this.p2=part2;           // end particle
    }
    draw () {
	if (this.visible==true){
	    stroke(127);
	}
	else {
	    noStroke();
	}
	strokeWeight(2);
	line(this.p1.position.x, this.p1.position.y, this.p2.position.x, this.p2.position.y);
    }
}


class EulerIntegrator{
    constructor(s) {
        this.s = s;
    }
    step(t) {
        this.s.clearForces();
        this.s.applyForces();
	for (var i = this.s.particles.length - 1; i >= 0; i--) {


            var p = this.s.particles[i];
         //   if (p.isFree()) {
                p.velocity.add(p.force.x / (p.mass * t), p.force.y / (p.mass * t), p.force.z / (p.mass * t));
                p.position.add(p.velocity.x / t, p.velocity.y / t, p.velocity.z / t);
          //  }
        }
    }
  
}



class  RungeKuttaIntegrator{
    constructor(struksel){
	 this.s = struksel;
        this.originalPositions = [];
        this.originalVelocities = [];
        this.k1Forces = [];
        this.k1Velocities = [];
        this.k2Forces = [];
        this.k2Velocities = [];
        this.k3Forces = [];
        this.k3Velocities = [];
        this.k4Forces = [];
        this.k4Velocities = [];
	
    }
    step(deltaT){
	// deltaT =delta Time 
	//	console.log("step");
	this.allocateParticles();
	for (var i = 0; i < this.s.particles.length; ++i) {
            var p = this.s.particles[i];
            if (p.isFree()) {
                this.originalPositions[i].set(p.position);
                this.originalVelocities[i].set(p.velocity);
            }
            p.force.set(0,0,0);
        }
        ;
	this.s.applyForces();
	for (var i = 0; i < this.s.particles.length; ++i) {
            var p = this.s.particles[i];
            if (p.isFree()) {
                var originalPosition = this.originalPositions[i];
                var k2Velocity = this.k2Velocities[i];
                p.position.x = originalPosition.__x + k2Velocity.__x * 0.5 * deltaT;
                p.__position.__y = originalPosition.__y + k2Velocity.__y * 0.5 * deltaT;
                p.__position.__z = originalPosition.__z + k2Velocity.__z * 0.5 * deltaT;
                var originalVelocity = this.originalVelocities[i];
                var k2Force = this.k2Forces[i];
                p.__velocity.__x = originalVelocity.__x + k2Force.__x * 0.5 * deltaT / p.__mass;
                p.__velocity.__y = originalVelocity.__y + k2Force.__y * 0.5 * deltaT / p.__mass;
                p.__velocity.__z = originalVelocity.__z + k2Force.__z * 0.5 * deltaT / p.__mass;
            }
         }
	this.s.applyForces();
        for (var i = 0; i < this.s.particles.length; ++i) {
            var p = this.s.particles[i];
            if (p.isFree()) {
                this.k2Forces[i].set(p.force);
                this.k2Velocities[i].set(p.__velocity);
            }
            p.force.set(0,0,0);
        }
        
        for (var i = 0; i < this.s.particles.length; ++i) {
            var p = this.s.particles[i];
            if (p.isFree()) {
                var originalPosition = this.originalPositions[i];
                var k2Velocity = this.k2Velocities[i];
                p.__position.__x = originalPosition.__x + k2Velocity.__x * 0.5 * deltaT;
                p.__position.__y = originalPosition.__y + k2Velocity.__y * 0.5 * deltaT;
                p.__position.__z = originalPosition.__z + k2Velocity.__z * 0.5 * deltaT;
                var originalVelocity = this.originalVelocities[i];
                var k2Force = this.k2Forces[i];
                p.__velocity.__x = originalVelocity.__x + k2Force.__x * 0.5 * deltaT / p.__mass;
                p.__velocity.__y = originalVelocity.__y + k2Force.__y * 0.5 * deltaT / p.__mass;
                p.__velocity.__z = originalVelocity.__z + k2Force.__z * 0.5 * deltaT / p.__mass;
            }
        }
        
        this.s.applyForces();
        for (var i = 0; i < this.s.particles.length; ++i) {
            var p = this.s.particles[i];
        //    if (p.isFree()) {// dit gaat fout
                this.k3Forces[i].set$Vector3D(p.__force);
                this.k3Velocities[i].set$Vector3D(p.__velocity);
    //        }
            p.force.set(0,0,0);
        }
        
        for (var i = 0; i < this.s.particles.length; ++i) {
            var p = this.s.particles[i];
            if (p.isFree()) {
                var originalPosition = this.originalPositions[i];
                var k3Velocity = this.k3Velocities[i];
                p.__position.__x = originalPosition.__x + k3Velocity.__x * deltaT;
                p.__position.__y = originalPosition.__y + k3Velocity.__y * deltaT;
                p.__position.__z = originalPosition.__z + k3Velocity.__z * deltaT;
                var originalVelocity = this.originalVelocities[i];
                var k3Force = this.k3Forces[i];
                p.__velocity.__x = originalVelocity.__x + k3Force.__x * deltaT / p.__mass;
                p.__velocity.__y = originalVelocity.__y + k3Force.__y * deltaT / p.__mass;
                p.__velocity.__z = originalVelocity.__z + k3Force.__z * deltaT / p.__mass;
            }
        }
        
        this.s.applyForces();
	      for (var i = 0; i < this.s.particles.length; ++i) {
            var p = this.s.particles[i];
            if (p.isFree()) {
                this.k4Forces[i].set$Vector3D(p.force);
                this.k4Velocities[i].set$Vector3D(p.velocity);
            }
        }
        
        for (var i = 0; i < this.s.particles.length; ++i) {
            var p = this.s.particles[i];
            p.__age += deltaT;
            if (p.isFree()) {
                var originalPosition = this.originalPositions[i];
                var k1Velocity = this.k1Velocities[i];
                var k2Velocity = this.k2Velocities[i];
                var k3Velocity = this.k3Velocities[i];
                var k4Velocity = this.k4Velocities[i];
                p.__position.__x = originalPosition.__x + deltaT / 6.0 * (k1Velocity.__x + 2.0 * k2Velocity.__x + 2.0 * k3Velocity.__x + k4Velocity.__x);
                p.__position.__y = originalPosition.__y + deltaT / 6.0 * (k1Velocity.__y + 2.0 * k2Velocity.__y + 2.0 * k3Velocity.__y + k4Velocity.__y);
                p.__position.__z = originalPosition.__z + deltaT / 6.0 * (k1Velocity.__z + 2.0 * k2Velocity.__z + 2.0 * k3Velocity.__z + k4Velocity.__z);
                var originalVelocity = this.originalVelocities[i];
                var k1Force = this.k1Forces[i];
                var k2Force = this.k2Forces[i];
                var k3Force = this.k3Forces[i];
                var k4Force = this.k4Forces[i];
                p.__velocity.__x = originalVelocity.__x + deltaT / (6.0 * p.__mass) * (k1Force.__x + 2.0 * k2Force.__x + 2.0 * k3Force.__x + k4Force.__x);
                p.__velocity.__y = originalVelocity.__y + deltaT / (6.0 * p.__mass) * (k1Force.__y + 2.0 * k2Force.__y + 2.0 * k3Force.__y + k4Force.__y);
                p.__velocity.__z = originalVelocity.__z + deltaT / (6.0 * p.__mass) * (k1Force.__z + 2.0 * k2Force.__z + 2.0 * k3Force.__z + k4Force.__z);
            }
        }


    }
    
    allocateParticles() {
        while (this.s.particles.length > this.originalPositions.length) {
            /* add */ (this.originalPositions.push(createVector) > 0);
            /* add */ (this.originalVelocities.push(createVector) > 0);
            /* add */ (this.k1Forces.push(createVector) > 0);
            /* add */ (this.k1Velocities.push(createVector) > 0);
            /* add */ (this.k2Forces.push(createVector) > 0);
            /* add */ (this.k2Velocities.push(createVector) > 0);
            /* add */ (this.k3Forces.push(createVector) > 0);
            /* add */ (this.k3Velocities.push(createVector) > 0);
            /* add */ (this.k4Forces.push(createVector) > 0);
            /* add */ (this.k4Velocities.push(createVector) > 0);
        }
    }
}

class  Attraction {
    constructor(a, b, k, distanceMin) {
       
        this.a = a;
        this.b = b;
        this.k = k;
        this.on = true;
        this.distanceMin = distanceMin;
        this.distanceMinSquared = distanceMin * distanceMin;
    }
    setA(p) {
        this.a = p;
    }
    setB (p) {
        this.b = p;
    }
    getMinimumDistance() {
        return this.distanceMin;
    }
    setMinimumDistance(d) {
        this.distanceMin = d;
        this.distanceMinSquared = d * d;
    }
    turnOff() {
        this.on = false;
    }
    turnOn() {
        this.on = true;
    }
    setStrength(k) {
        this.k = k;
    };
    
    getOneEnd() {
        return this.a;
    };
    
    getTheOtherEnd() {
        return this.b;
    }
    
    apply() {
        if (this.on && (this.a.isfree || this.b.isfree)) {

            var a2bX = this.a.position.x - this.b.position.x;
            var a2bY = this.a.position.y - this.b.position.y;
            var a2bZ = this.a.position.z - this.b.position.z;
            var a2bDistanceSquared = a2bX * a2bX + a2bY * a2bY + a2bZ * a2bZ;
            if (a2bDistanceSquared < this.distanceMinSquared)
                a2bDistanceSquared = this.distanceMinSquared;
            var force = this.k * this.a.mass * this.b.mass / a2bDistanceSquared;
            var length_1 = Math.sqrt(a2bDistanceSquared);
            a2bX /= length_1;
            a2bY /= length_1;
            a2bZ /= length_1;
            a2bX *= force;
            a2bY *= force;
            a2bZ *= force;
            if (this.a.isFree())
                this.a.force().add(-a2bX, -a2bY, -a2bZ);
	       //	console.log("apply on a",-a2bX)

            if (this.b.isFree())
                this.b.force().add(a2bX, a2bY, a2bZ);
	    	  //  	    	console.log("apply on b")

        }
    }
    getStrength() {
        return this.k;
    }
    isOn() {
        return this.on;
    }
    isOff() {
        return !this.on;
    }
}
