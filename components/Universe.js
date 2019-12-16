class Universe {
  constructor() {
    this.space = new Space();
    this.physics = new Physics(this.space);
  }
  
  exist() {
    this.physics.happens();
  }
}