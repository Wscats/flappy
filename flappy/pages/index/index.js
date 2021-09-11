/**
 * @Author: Wscats
 * @Date: 2021-09-10 14:45:32
 */

import prompt from '@system.prompt';
export default {
    data: {
        el: null,
        bird: new Image(),
        bg: new Image(),
        fg: new Image(),
        pipeNorth: new Image(),
        pipeSouth: new Image(),
        gap: 85,
        constant: 0,
        score: 0,
        bX: 10,
        bY: 150,
        gravity: 1.5,
        pipe: [],
        birdHeight: 26,
        birdWidth: 38,
        pipeNorthHeight: 242,
        pipeNorthWidth: 52,
        cvsHeight: 512,
        cvsWidth: 288,
        fgHeight: 118,
        fgWidth: 306,
    },
    draw() {
        const ctx = this.ctx;
        ctx.drawImage(this.bg, 0, 0);
        for (let i = 0; i < this.pipe.length; i++) {
            this.constant = this.pipeNorthHeight + this.gap;
            ctx.drawImage(this.pipeNorth, this.pipe[i].x, this.pipe[i].y);
            ctx.drawImage(this.pipeSouth, this.pipe[i].x, this.pipe[i].y + this.constant);
            this.pipe[i].x--;
            if (this.pipe[i].x == 125) {
                this.pipe.push({
                    x: this.cvsWidth,
                    y: Math.floor(Math.random() * this.pipeNorthHeight) - this.pipeNorthHeight,
                });
            }
            if (
            this.bX + this.birdWidth >= this.pipe[i].x
            && this.bX <= this.pipe[i].x + this.pipeNorthWidth
            && (this.bY <= this.pipe[i].y + this.pipeNorthHeight
            || this.bY + this.birdHeight >= this.pipe[i].y + this.constant)
            || this.bY + this.birdHeight >= this.cvsHeight - this.fgHeight
            ) {
                prompt.showDialog({
                    buttons: [{
                                  text: '重来一次',
                                  color: '#666666',
                              }],
                    success: (data) => {
                        this.restart();
                        this.interval = setInterval(this.draw, 30);
                    },
                    cancel: (data) => {
                        this.restart();
                        this.interval = setInterval(this.draw, 30);
                    }
                });
                clearInterval(this.interval);
            }
            if (this.pipe[i].x == 5) {
                this.score++;
            }
        }
        ctx.drawImage(this.fg, 0, this.cvsHeight - this.fgHeight);
        ctx.drawImage(this.bird, this.bX, this.bY);
        this.bY += this.gravity;
        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : " + this.score, 10, this.cvsHeight - 20);
    },
    restart() {
        this.pipe = [];
        this.pipe[0] = {
            x: this.cvsWidth,
            y: 0,
        };
        this.constant = 0;
        this.score = 0;
        this.bY = 150;
    },
    moveUp() {
        this.bY -= 25;
    },
    onShow() {
        this.bird.src = "images/bird.png";
        this.bg.src = "images/bg.png";
        this.fg.src = "images/fg.png";
        this.pipeNorth.src = "images/pipeNorth.png";
        this.pipeSouth.src = "images/pipeSouth.png";
        this.el = this.$refs.canvas;
        this.ctx = this.el.getContext('2d');
        this.pipe[0] = {
            x: this.cvsWidth,
            y: 0,
        };
        this.interval = setInterval(this.draw, 20);
        //  等待后续 API6 支持升级 requestAnimationFrame
        // requestAnimationFrame(this.draw);
    },
}