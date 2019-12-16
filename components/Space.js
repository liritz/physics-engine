class Space {
  constructor(size = [window.innerWidth,window.innerHeight], color = '#eeeeee') {
    this.color = color;
    this.width = size[0];
    this.height = size[1];
    this.balls = [];
    this.blocks = [];
    this.paddles = [];
    this.walls = [];
    this.V = new Vector(); // This vector provides the space with a vector-factory, should be
                           // refactored in the next version
  }
  
  get area() {
    return new Rectangle(new Interval(0, this.width), new Interval(0, this.height));
  }
  
  add_Ball(size = 30,pos = [this.width/2, this.height / 2], spe = this.V.random().val,
           color = '#'+Math.floor(Math.random()*16777215).toString(16)) {
    this.balls.push(new Ball(this.balls.length, pos, spe, size, color));
  }
  
  add_Block(center = [], width = 40, height = 40) {
    this.blocks.push(new Block(this.blocks.length, center, [0,0], [width, height], 'firebrick'));
  }
  
  start_Wall(start, width = 10) {
    this.walls.push(new Wall(this.walls.length, start, start, width));
  }
  
  finish_Wall(stop) {
    if (this.walls.length > 0) {
      this.walls[this.walls.length - 1].stop = new Vector(...stop);
    }
  }

}