

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }

JSL.gfx.View = function(dom, config){
	iblokz.Element.call(this, dom);

	this.config = config || {};

	this.position = config.position;

	this.elements = [];

	this.layers = {
		grid: new JSL.gfx.Grid(this.find("canvas.grid")[0], this.config),
		elements: new JSL.gfx.Canvas(this.find("canvas.elements")[0]),
		interaction: new JSL.gfx.Canvas(this.find("canvas.interaction")[0])
	}
}

JSL.gfx.View.prototype = Object.create( iblokz.Element.prototype );
JSL.gfx.View.prototype.constructor = JSL.gfx.View;

JSL.gfx.View.prototype.init = function() {

	this.layers.grid.init();
	this.layers.elements.init();
	this.layers.interaction.init();

	var view = this;

	// grid
	var grid = this.layers.grid;
	var conf = this.config;


	this.on('mousewheel', function(event) {

		var range = _.cloneDeep(conf.range);
		
		range.y.start = grid.multiAdd(range.y.start,grid.visible.y,range.y.length);
		range.x.end = grid.multiSubtract(range.x.end,grid.visible.x,range.x.length);
		//console.log(event.originalEvent.deltaX, event.originalEvent.deltaY, event.originalEvent.deltaFactor);
		var modified = false;
		if(event.deltaY != 0){
			var direction = (event.deltaY > 0) ? range.y.direction : -range.y.direction;
			grid.position.y = grid.multiIterate(grid.position.y, grid.position.y.length-1, range.y, direction);
			modified = true;
		}

		if(event.deltaX != 0){
			var direction = (event.deltaX > 0) ? range.x.direction : -range.x.direction;
			grid.position.x = grid.multiIterate(grid.position.x, grid.position.x.length-1, range.x, direction);
			modified = true;
		}

		if(modified){
			grid.refresh();
			this.position = grid.position;
			//console.log(grid.position.x);
		}

	});

	// interaction
	var interaction = this.layers.interaction;

	var startPos = [0,0];
	var currentPos = [0,0];
	var selecting = false;

	this.on('mousedown', function(event) {
		selecting = true;
		startPos = [event.offsetX, event.offsetY];
	})

	this.on('mousemove', function(event) {
		if(selecting == true){
			view.dom.style.cursor = "crosshair";
			currentPos = [event.offsetX-startPos[0], event.offsetY-startPos[1]];
			interaction.clear();
			interaction.rect(startPos, currentPos, false,"#fff", [7,5]);
		}
	})

	this.on('mouseup', function(event) {
		selecting = false;
		startPos = [0, 0];
		currentPos = [0, 0];
		interaction.clear();
		view.dom.style.cursor = "inherit";
	})

}

JSL.gfx.View.prototype.addElement = function(element){
	this.layers.grid.addElement(element);
}

JSL.gfx.View.prototype.refresh = function(){

}