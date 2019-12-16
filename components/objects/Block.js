class Block extends Thing {
  constructor(id, position = [0,0], speed = [1,1], size = [30,30], color = 'rgba(255,0,0,1)') {
    super(id, position, speed, color);
    this.type = `block`;
    this.id = `${this.type}_${id}`;
    this.size = {
      width: size[0],
      height: size[1]
    };
    this.distance = [Math.abs(this.size.width / 2), Math.abs(this.size.height / 2)];
  }
  
  get area() {
    return new Rectangle(
      new Interval(this.state.pos.x - this.distance[0], this.state.pos.x + this.distance[0]),
      new Interval(this.state.pos.y - this.distance[1], this.state.pos.y + this.distance[1])
    );
  }
  
  get mass() {
    return this.size.height * this.size.width;
  }
}