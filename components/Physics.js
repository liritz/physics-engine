class Physics {
  constructor(space) {
    this.space = space;
    this.creator = 'Isaac Newton';
    this.lightspeed = 12;    // nothing can be faster than this
    this.planktime = 16;     // smallest duration in milliseconds
    this.friction = 0.001;   // by how strongly does the speed get reduced every planktime (0 means no friction)
    this.G = 0.000004;       // officially it is 6.7 * 10^-11
    this.V = new Vector();   // This vector provides the physics with a vector-factory
    
    this.ticks = [];
  }
  
  // - - - - - - - - - - - -
  // enforce the rules of Physics
  
  lightspeed_is_max_speed(thing) {
    if (thing.state.spe.length > this.lightspeed) {
      thing.state.spe.length = this.lightspeed;
    }
  }
  
  apply_friction(thing) {
    thing.state.spe.multiply(1 - this.friction);
  }
  
  // - - - - - - - - - - - -
  // Controller-Ball interactions
  
  collision_CB(controller, ball) {
    return this.collision_BB(controller, ball);
  }
  
  bounce_CB(controller, ball) {
    // Change state of both balls such that energy and impulse are conserved
  
    while (this.collision_CB(controller, ball)) {
      if (ball.state.pos.equals(controller.state.pos)) {
        ball.state.pos.add(this.V.random());
      }
      ball.state.pos.subtract(ball.state.pos.to(controller.state.pos).direction)
    }
    
    const v_1 = ball.state.spe.copy();
    const x_1 = ball.state.pos.copy();
    const m_1 = ball.mass;
    const v_2 = controller.state.spe.copy();
    const x_2 = controller.state.pos.copy();
    const m_2 = controller.collision_mass;
  
    ball.state.spe = v_1.minus(x_1.minus(x_2).times((2 * m_2 * (v_1.minus(v_2).dot(x_1.minus(x_2))))/((m_1 + m_2) * x_1.minus(x_2).length ** 2)));
  }
  
  do_controller_ball_collisions(controllers, balls) {
    controllers.forEach(c => {
      balls.forEach(b => {
        if (this.collision_CB(c,b)) {
          this.bounce_CB(c,b);
        }
      })
    });
  }
  
  attract_CB(controller, ball) {
    const x_1 = controller.state.pos.copy();
    const m_1 = controller.gravity_mass;
    const x_2 = ball.state.pos.copy();
    
    ball.state.spe.add(x_2.to(x_1).times((this.G * m_1) / x_2.distanceTo(x_1)));
  }
  
  do_controller_ball_gravity(controllers, balls) {
    controllers.forEach(c => {
      balls.forEach(b => {
        this.attract_CB(c,b);
      });
    });
  }
  
  update_controller_speed(controller) {
    const { pos, last_pos } = controller.state;
    controller.state.spe = last_pos.to(pos);
    controller.state.last_pos = pos;
  }
  
  update_controllers(controllers) {
    controllers.forEach(c => this.update_controller_speed(c));
  }
  
  // - - - - - - - - - - - -
  // Paddle-Wall collisions
  
  collision_PW(paddle, wall) {
    // Check if paddle and wall overlap (or will overlap?)
    return paddle.area.intersect(wall.area);
  }
  
  block_PW(paddle, wall) {
    // Change state of paddle such that it is blocked by the wall
    while (this.collision_PW(paddle, wall)) {
      paddle.state.pos.subtract(paddle.state.spe.direction)
    }
    paddle.state.mov = false;
  }
  
  do_paddle_wall_collisions(paddleArray, wallArray) {
    for (let paddle of paddleArray) {
      for (let wall of wallArray) {
        if (this.collision_PW(paddle, wall)) {
          this.block_PW(paddle, wall);
          paddle.reactTo(wall);
        }
      }
    }
  }
  
  // - - - - - - - - - - - -
  // Ball-Paddle collisions
  
  collision_BW(ball, wall) {
    // Check if ball and wall (or paddle) overlap (or will overlap?)
    return ball.area.isInside(wall.area.closestPointTo(ball.state.pos));
  }
  
  hit_BP(ball, paddle) {
    // Change state of ball to non-collide first
    while (this.collision_BW(ball, paddle)) {
      ball.state.pos.subtract(ball.state.spe.direction);
    }
    // Change state of ball such that it is hit by the paddle
    ball.state.spe = paddle.state.pos.to(ball.state.pos).stretch(ball.speed);
  }
  
  do_ball_paddle_collisions(ballArray, paddleArray) {
    for (let ball of ballArray) {
      for (let paddle of paddleArray) {
        if (this.collision_BW(ball,paddle)) {
          this.hit_BP(ball, paddle);
          ball.reactTo(paddle);
        }
      }
    }
  }
  
  // - - - - - - - - - - - -
  // Ball Wall (lines!) collisions
  
  collision_BL(ball, wall) {
    return ball.area.isInside(wall.area.closestPointTo(ball.state.pos));
  }
  
  bounce_BL(ball, wall) {
    // Change state of ball to non-collide first
    while (this.collision_BL(ball, wall)) {
      ball.state.pos.subtract(ball.state.spe.direction);
    }
    // Change state of ball such that it is reflected by the wall
    const a = wall.area.closestPointTo(ball.state.pos).to(ball.state.pos);
    const b = ball.state.spe.copy();
    const normal_part_of_ball_spe = a.stretch(a.dot(b)/a.length);
    ball.state.spe = b.minus(normal_part_of_ball_spe.times(2));
  }
  
  do_ball_wall_collisions(ballArray, wallArray) {
    ballArray.forEach(ball => {
      wallArray.forEach(wall => {
        if (this.collision_BL(ball, wall)) {
          this.bounce_BL(ball, wall);
          wall.reactTo(ball);
        }
      })
    })
  }
  
  // - - - - - - - - - - - -
  // Ball-Ball collisions
  
  collision_BB(ball_1, ball_2) {
    // Check if the balls overlap
    return ball_1.area.isInside(ball_2.area.closestPointTo(ball_1.state.pos));
  }
  
  bounce_BB(ball_1, ball_2) {
    // Change state of both balls such that energy and impulse are conserved
    
    while (this.collision_BB(ball_1, ball_2)) {
      if (ball_1.state.pos.equals(ball_2.state.pos)) {
        ball_1.state.pos.add(this.V.random());
      }
      if (ball_1.radius <= ball_2.radius) {
        ball_1.state.pos.subtract(ball_1.state.pos.to(ball_2.state.pos).direction)
      }
      else {
        ball_2.state.pos.subtract(ball_2.state.pos.to(ball_1.state.pos).direction)
      }
    }
    
    const v_1 = ball_1.state.spe.copy();
    const x_1 = ball_1.state.pos.copy();
    const m_1 = ball_1.mass;
    const v_2 = ball_2.state.spe.copy();
    const x_2 = ball_2.state.pos.copy();
    const m_2 = ball_2.mass;
    
    ball_1.state.spe = v_1.minus(x_1.minus(x_2).times((2 * m_2 * (v_1.minus(v_2).dot(x_1.minus(x_2))))/((m_1 + m_2) * x_1.minus(x_2).length ** 2)));
    ball_2.state.spe = v_2.minus(x_2.minus(x_1).times((2 * m_1 * (v_2.minus(v_1).dot(x_2.minus(x_1))))/((m_2 + m_1) * x_2.minus(x_1).length ** 2)));
  }
  
  do_ball_ball_collisions(ballArray) {
    for (let i = 0; i < ballArray.length; i++) {
      let remainingBalls = ballArray.slice(i+1);
      let ball_1 = ballArray[i];
      for (let ball_2 of remainingBalls) {
        if (this.collision_BB(ball_1, ball_2)) {
          this.bounce_BB(ball_1, ball_2);
          ball_1.reactTo(ball_2);
          ball_2.reactTo(ball_1);
        }
      }
    }
  }
  
  // - - - - - - - - - - - -
  // Ball-Block collisions (and by extension Ball-Brick collisions)
  
  reflect_BW(ball, block) {
    // Change state of ball such that it is reflected by the wall
    
    while (this.collision_BW(ball, block)) {
      ball.state.pos.subtract(ball.state.spe.direction);
    }
    
    const v_1 = ball.state.spe.copy();
    const x_1 = ball.state.pos.copy();
    const s_1 = block.area.closestPointTo(x_1).to(x_1).times(2);
    
    ball.state.spe = v_1.minus(s_1.times((2 * v_1.dot(s_1))/(s_1.length ** 2)));
  }
  
  do_ball_block_collisions(ballArray, wallArray) {
    for (let ball of ballArray) {
      for (let wall of wallArray) {
        if (this.collision_BW(ball,wall)) {
          this.reflect_BW(ball, wall);
          wall.reactTo(ball);
        }
      }
    }
  }
  
  // - - - - - - - - - - - -
  // Gravity
  
  attract(ball_1, ball_2) {
    const v_1 = ball_1.state.spe.copy();
    const x_1 = ball_1.state.pos.copy();
    const m_1 = ball_1.mass;
    const v_2 = ball_2.state.spe.copy();
    const x_2 = ball_2.state.pos.copy();
    const m_2 = ball_2.mass;
    
    ball_1.state.spe.add(x_1.to(x_2).times((this.G * m_2) / x_1.distanceTo(x_2)));
    ball_2.state.spe.add(x_2.to(x_1).times((this.G * m_1) / x_2.distanceTo(x_1)));
  }
  
  do_ball_ball_gravity(ballArray) {
    for (let i = 0; i < ballArray.length; i++) {
      let remainingBalls = ballArray.slice(i+1);
      let ball_1 = ballArray[i];
      for (let ball_2 of remainingBalls) {
        this.attract(ball_1, ball_2);
      }
    }
  }
  
  // - - - - - - - - - - - -
  // Move Blocks and Balls
  
  moveBlock(block) {
    block.state.pos.add(block.state.spe);
  }
  
  moveBlocks(blocks) {
    blocks.filter(b => b.state.mov).forEach(b => this.moveBlock(b));
  }
  
  moveBall(ball) {
    ball.state.pos.add(ball.state.spe);
  }
  
  moveBalls(balls) {
    balls.filter(b => b.state.mov).forEach(b => this.moveBall(b));
  }
  
  // - - - - - - - - - - - -
  // Make physics work on its space
  
  work() {
    
    // This is where the magic of all the collisions happens
    this.do_paddle_wall_collisions(this.space.paddles, this.space.walls);
    this.do_ball_ball_collisions(this.space.balls);
    this.do_ball_paddle_collisions(this.space.balls, this.space.paddles);
    this.do_ball_wall_collisions(this.space.balls, this.space.walls);
    this.do_ball_block_collisions(this.space.balls, this.space.blocks);
    
    // Gravity has its effects too!
    
    this.do_ball_ball_gravity(this.space.balls);
    
    // But we also enforce the rules of Physics!
    
    this.space.balls.forEach(ball => this.lightspeed_is_max_speed(ball));
    this.space.balls.forEach(ball => this.apply_friction(ball));
    
    // Ball and paddle need to be moved if they do...
    this.moveBlocks(this.space.paddles);
    this.moveBalls(this.space.balls);
    
    // You just witnessed one Physics happening ;-)
    // It is the job of the happens() function to do this over and over again
  }
  
  happens() {
    this.ticks.push( setInterval( () => this.work() , this.planktime ) );
  }
  
  stop() {
    this.ticks.forEach(tick => clearInterval(tick));
    this.ticks = [];
  }
}