class Score {
    constructor() {
        this.leftScore = 0;
        this.rightScore = 0;
        this.font = "Silkscreen";
    }

    show() {
        textSize(32);
        textFont(this.font);
        fill(255);
        text(this.leftScore, width / 2 - 50 -10, 32);
        text(this.rightScore, width / 2 + 50 -10, 32);
    }

    update() {
        database.ref("score").update({
            leftScore: this.leftScore,
            rightScore: this.rightScore
        });
    }

    reset() {
        this.leftScore = 0;
        this.rightScore = 0;
        this.update();
    }

    addLeft() {
        this.leftScore++;
        this.update();
    }

    addRight() {
        this.rightScore++;
        this.update();
    }

    setScore(leftScore, rightScore) {
        this.leftScore = leftScore;
        this.rightScore = rightScore;
    }

    getTotalscore() {
        return this.leftScore + this.rightScore;
    }
}
