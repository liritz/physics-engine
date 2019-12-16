// 2 D Elements

class Vector {
  
  /*
  * The Vector is the central concept of the 2-D Geometry used here. It allows us to work
  * with elements of 2-D Space almost as easily as with ordinary numbers. This class
  * implements most common vector operations, but be careful which one you use. There
  * usually are two methods per operation type, one which changes the vector and one which
  * returns a new one. In the next version of this engine the first kind will be deprecated,
  * as this approach creates less predictable results and is harder to debug.
  * */
  
  constructor(x = 0, y = 0) {
    
    // a vector has only two properties, the two coordinates (both floats)
    
    this.x = x;
    this.y = y;
  }
  
  get val() {
    
    // convert the vector to an array
    
    return [this.x, this.y]
  }
  
  set val(arr) {
    
    // change the vector by setting it equal to an array
    
    this.x = arr[0];
    this.y = arr[1];
  }
  
  copy() {
    
    // returns a copy of the vector, used for hacky stuff, will be deprecated soon.
    
    return new Vector(this.x, this.y);
  }
  
  randomise(factor = 1) {
    
    // randomly change the direction of the vector and optionally giving it a new length
    
    let l = this.length;
    
    this.x = 2 * Math.random() - 1;
    this.y = 2 * Math.random() - 1;
    
    this.length = l === 0 ? factor : factor * l;
  }
  
  random(factor = 1) {
    
    // returns a new random vector for a given length (default = 1)
    
    let result = new Vector();
    result.randomise(factor);
    return result;
  }
  
  plus(vector) {
    
    // returns a new vector which is the sum of this vector and a given vector
    
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  
  add(vector) {
    
    // modifies this vector by adding a given vector to it
    
    this.x += vector.x;
    this.y += vector.y;
  }
  
  minus(vector) {
    
    // returns a new vector which is the difference of this vector and a given vector
    
    return new Vector(this.x - vector.x, this.y - vector.y);
  }
  
  subtract(vector) {
    
    // modifies this vector by subtracting a given vector from it
    
    this.x -= vector.x;
    this.y -= vector.y;
  }
  
  times(num) {
    
    // returns a new vector which is equal to this vector times a given number
    
    return new Vector(this.x * num, this.y * num);
  }
  
  multiply(num) {
    
    // modifies this vector by multiplying it with a given number
    
    this.x *= num;
    this.y *= num;
  }
  
  get length() {
    
    // returns the length of this vector
    
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  
  set length(new_length) {
    
    // allows to change the length of this vector by setting it equal to a given number
    
    this.norm();
    this.multiply(new_length)
  }
  
  get direction() {
    
    // returns a new vector of length 1 in the same direction as this vector
    
    let result = this.copy();
    result.norm();
    return result;
  }
  
  norm() {
    
    // modifies this vector by setting its length to 1 but preserving the direction
    
    let factor = 1 / this.length;
    if (isFinite(factor)) {
      this.multiply(factor);
    }
  }
  
  stretch(new_length = 1) {
    
    // returns a new vector with the same direction as this vector and a given length
    
    let result = this.copy();
    result.length = new_length;
    return result;
  }
  
  to(vector) {
    
    // returns a new vector which is the vector connecting the tips of two vectors
    // if you think of vectors as arrows starting at the origin
    
    return vector.minus(this);
  }
  
  distanceTo(vector) {
    
    // returns the euclidean distance between to vectors if you think of vectors as
    // points on a 2-D plane
    
    return this.to(vector).length;
  }
  
  equals(vector) {
    
    // allows us to estimate whether two vectors are the same without directly
    // comparing two floats (would be bad practice)
    
    return this.distanceTo(vector) < 0.0001;
  }
  
  dot(vector) {
    
    // returns the dot product of this vector and a given vector
    
    return (this.x * vector.x) + (this.y * vector.y);
  }
}


/*
* Now that we are able to do vector geometry we also need a way to talk about some
* (infinite but compact) sets of vectors. These kind of sets are also known as areas.
* The areas implemented in this project are circles, rectangles and (stroked) lines.
*
* An area must be defined easily and also be able to answer whether a given vector
* is part of the set or not, the isInside() method on each area allows that.
*
* Also in order to make more complex interactions an area should be able to determine
* which of its vectors is closest to any given vector, the closestPointTo() function
* does exactly that.
* */


class Circle {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }
  
  isInside(vector) {
    return this.center.distanceTo(vector) <= this.radius;
  }
  
  closestPointTo(vector) {
    if (this.isInside(vector)) {
      return vector.copy();
    }
    else {
      return this.center.plus(this.center.to(vector).stretch(this.radius));
    }
  }
}

class Line {
  constructor(start, stop, width) {
    this.start = start;
    this.stop = stop;
    this.length = start.to(stop).length;
    this.width = width;
  }
  
  closestPointOnCenterLine(vector) {
    const projected_distance = this.start.to(this.stop).dot(this.start.to(vector)) / this.length;
    const interval = new Interval(0, this.length);
    const closest_point_in_1d = interval.closestValueTo(projected_distance);
    return this.start.plus(this.start.to(this.stop).stretch(closest_point_in_1d));
  }
  
  closestPointTo(vector) {
    
    if (this.isInside(vector)) {
      return vector;
    }
    
    const point_on_center_line = this.closestPointOnCenterLine(vector);
    
    return  point_on_center_line
      .plus(
        point_on_center_line.to(vector).stretch(this.width/2)
      );
  }
  
  isInside(vector) {
    return this.closestPointOnCenterLine(vector).to(vector).length < this.width / 2;
  }
}

class Rectangle {
  constructor(x_interval, y_interval) {
    this.horizontal = x_interval;
    this.vertical = y_interval;
  }
  
  intersect(rectangle) {
    return this.horizontal.intersect(rectangle.horizontal) && this.vertical.intersect(rectangle.vertical);
  }
  
  isInside(vector) {
    return this.horizontal.isInside(vector.x) && this.vertical.isInside(vector.y);
  }
  
  closestPointTo(vector) {
    
    return new Vector(this.horizontal.closestValueTo(vector.x), this.vertical.closestValueTo(vector.y));
    
  }
}

// 1 D Elements

/*
* In order to work with rectangles it is easiest to break it down from one 2-D problem into
* two 1-D problems. So we introduce the Interval as a way to represent both dimensions of
* the rectangle and thus solve the isInside and closestPointTo questions by asking them two
* times on the number line instead of once on the 2-D plane.
* */

class Interval {
  constructor(start, end, open = false) {
    let sorted = [start, end].sort((a,b) => a - b);
    this.start = sorted[0];
    this.end = sorted[1];
    this.open = false;
  }
  
  intersect(interval) {
    return !(interval.end < this.start || this.end < interval.start);
  }
  
  closestValueTo(num) {
    if (num < this.start) {
      return this.start;
    }
    else if (this.end < num) {
      return this.end;
    }
    else {
      return num;
    }
  }
  
  isInside(num) {
    return num === this.closestValueTo(num);
  }
}