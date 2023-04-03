class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;
        this.speedX = 2;
        this.speedY = 2;
        this.color = color(255, 255, 255);
        this.trail = [];
    }

    physics() {
        this.x += this.speedX;
        this.y += this.speedY;
    
        if (this.y < 0 || this.y > height - this.h) {
        this.speedY *= -1;
        }
    
        if (this.x < 0) {
            score.addRight();
            this.reset();
        }

        if (this.x > width - this.w) {
            score.addLeft();
            this.reset();
        }

        Object.keys(players).forEach(function(key) {

            if (players[key].x < ball.x + ball.w &&
                players[key].x + players[key].w > ball.x &&
                players[key].y < ball.y + ball.h &&
                players[key].y + players[key].h > ball.y) {
                // collision detected!
                ball.speedX *= -1.1;
                ball.speedY *= 1.1;
            }
        });
    }
    
    update() {
        database.ref("ball").update({
            x: this.x,
            y: this.y,
            speedX: this.speedX,
            speedY: this.speedY,
        });
    }
    
    show() {
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSpeed(x, y) {
        this.speedX = x;
        this.speedY = y;
    }

    reset() {

        this.x = width/2-this.w/2;
        this.y = height/2-this.h/2;

        let s = score.getTotalscore();
        if (s % 2 == 0) {
            this.speedX = 2;
        } else {
            this.speedX = -2;
        }

        if(s % 3 == 0 || s % 5 == 0) {
            this.speedY = 2;
        } else {
            this.speedY = -2;
        }

        this.update();
    }

    drawTrail(length, startSpeed = 3) {

        if (this.trail.length > length) {
            this.trail.shift();
        }

        this.trail.push({x: this.x, y: this.y});

        if(this.speedX < startSpeed && this.speedX > -startSpeed) {
            return;
        }

        for (var i = 0; i < this.trail.length; i++) {
            //remove the black edges
            let alpha = map(i, 0, this.trail.length, 0, 255);
            strokeWeight(0);
            fill(255, 255, 255, alpha);
            rect(this.trail[i].x, this.trail[i].y, this.w, this.h);

        }
    }
}