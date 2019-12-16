class Wall {
  constructor(id, start = [0,0], stop = [0,0], width = 10, color = 'peru') {
    this.type = `wall`;
    this.id = `${this.type}_${id}`;
    this.color = color;
    this.width = width;
    this.start = new Vector(...start);
    this.stop = new Vector(...stop);
  }
  
  get area() {
    return new Line(this.start, this.stop, this.width)
  }
  
}