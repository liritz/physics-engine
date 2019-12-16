# Physics Engine

This is a 2-D physics engine which simulates gravity and conservation of momentum
for circles, objects and lines (the stroke of lines).

It is the base for another project of mine, called ballbender. The engine creates
a virtual 2-D space and lets the physics module work on it. For demonstration
purposes the main class (Universe) is wrapped inside a class called Game which is
able to use its Renderer to show what's happening on a html-canvas. However the Game
and Renderer class should not be thought of as a part of the physics engine as the
engine is separated from the visualisation logic such that you could easily render
the 2-D space with a different approach (like svg or plain html elements).

If you want to see what the engine is capable of and play around with circles, squares
and lines, check out the pre-beta version of my game-editor project called Ballbender
on ballbender.linusritzmann.ch
