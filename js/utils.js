function rectangleCircleCollison({circle, rectangle}){
    const distX = Math.abs(circle.position.x - rectangle.position.x-rectangle.width/2);
    const distY = Math.abs(circle.position.y - rectangle.position.y-rectangle.height/2);

    if (distX > (rectangle.width/2 + circle.radius)) { return false; }
    if (distY > (rectangle.height/2 + circle.radius)) { return false; }

    if (distX <= (rectangle.width/2)) { return true; } 
    if (distY <= (rectangle.height/2)) { return true; }

    var dx=distX-rectangle.width/2;
    var dy=distY-rectangle.height/2;
    return (dx*dx+dy*dy<=(circle.radius*circle.radius));
}
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.position.x + rectangle1.width >=
        rectangle2.position.x &&
      rectangle1.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.position.y + rectangle1.height >=
        rectangle2.position.y &&
      rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    );
  }