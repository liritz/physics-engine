class Renderer {
  constructor(canvas_id, framerate) {
    this.canvas = document.getElementById(canvas_id);
    this.ctx = this.canvas.getContext('2d');
    this.refresh_time = Math.ceil(1000 / framerate);
    this.actions = [];
  }
  
  show(universe) {
    this.actions.push(
      setInterval(
        () => {
          this.draw(universe);
        },
        this.refresh_time
      )
    );
  }
  
  stop() {
    this.actions.forEach(action => clearInterval(action));
    this.actions = [];
  }
  
  draw(universe) {
    // collect all the rendering functions and call them
    this.renderSpace(universe.space);
  }
  
  renderSpace(space) {
    this.ctx.clearRect(0, 0, space.width, space.height);
    
    space.walls.forEach(w => this.renderWall(w));
    space.paddles.forEach(p => this.renderBlock(p));
    space.blocks.forEach(b => this.renderBlock(b));
    space.balls.forEach(b => this.renderBall(b));
  }
  
  renderWall(wall) {
    this.ctx.beginPath();
    this.ctx.moveTo(...wall.start.val);
    this.ctx.lineTo(...wall.stop.val);
    this.ctx.lineWidth = wall.width;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = wall.color;
    this.ctx.stroke();
  }
  
  renderBlock(block) {
    
    this.ctx.fillStyle = block.color;
    this.ctx.fillRect(
      block.area.horizontal.start,
      block.area.vertical.start,
      block.size.width,
      block.size.height
    );
  }
  
  renderBall(ball) {
    const area = ball.area;
    
    this.ctx.beginPath();
    this.ctx.arc(area.center.x, area.center.y, area.radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = ball.color;
    this.ctx.fill();
  }
}