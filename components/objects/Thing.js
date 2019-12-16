class Thing {
  constructor(id, position = [0,0], speed = [1,1], color = 'white') {
    this.type = `thing`;
    this.id = `${this.type}_${id}`;
    this.initial_speed = new Vector(...speed);
    this.color = color;
    this.state = {
      pos: new Vector(...position),
      spe: new Vector(...speed),
      mov: false
    };
  }
  
  get speed() {
    return this.state.spe.length;
  }
  
  set speed(num) {
    this.state.spe.length = num;
  }
  
  reactTo(thing) {
    // silence is golden
  }
}