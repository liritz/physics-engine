class Ball extends Thing {
  constructor(id, position = [0,0], speed = [1,1], size = 30, color = '#'+Math.floor(Math.random()*16777215).toString(16)) {
    super(id, position, speed, color);
    this.type = `ball`;
    this.id = `${this.type}_${id}`;
    this.size = {
      diameter: size
    };
    this.state.mov = true;
    this.state.brn = false;
    this.radius = Math.abs(this.size.diameter / 2);
  }
  
  get area() {
    return new Circle(this.state.pos, this.radius);
  }
  
  get mass() {
    return Math.PI * (this.radius ** 2);
  }
}
