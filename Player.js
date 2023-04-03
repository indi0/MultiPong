class Player {
    constructor(x, y, name, isMe = false) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 100;
    this.name = name;
    this.isMe = isMe;
    }

    show() {
        if(this.isMe){
            fill(255, 255, 0);
        } else {
            fill(255);
        }
        rect(this.x, this.y, this.w, this.h);
    }

    update() {
        database.ref("players/" + uid).update({
            x: this.x,
            y: this.y
        });
    }

    moveY(y) {
        if (this.y + y >= 0 && this.y + y <= height - this.h) {
            this.y += y;
            this.update();
        }
    }

    setposition(x, y) {
        this.x = x;
        this.y = y;
    }

    isMe() {
        return this.isMe;
    }
}