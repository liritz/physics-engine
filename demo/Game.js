class Game {
  constructor(screen) {
    this.universe = new Universe();
    this.screen = new Renderer(screen, 60);
  }
  
  play() {
    this.stop();
    this.universe.exist();
    this.screen.show(this.universe);
  }
  
  stop() {
    this.universe.physics.stop();
    this.screen.stop();
  }
  
  add_Ball(size = 33) {
    
    // allows the user to add a random ball to the space
    
    const space = this.universe.space;
    space.balls.push(new Ball(space.balls.length, new Vector(space.width/2, space.height / 2).val, [0,0], size));
  }
}