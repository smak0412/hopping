const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");


const WIDTH = 400;
const HEIGHT = 400;

canvas.width = WIDTH;
canvas.height = HEIGHT;

document.querySelector("#game").appendChild(canvas);


const game = {
    start: false,
    over: false,
    score: 0,
    timerId: null,
}

const ballSpeed = -18;
const ball = {
    x: null,
    y: null,
    size: 5,
    floor: null,
    image: null,

    gravity: 1,
    speed: ballSpeed,
    fall: false,

    dx: null,

    update: function() {
        // ctx.fillStyle = "#000";
        // ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
        // ctx.fill();

        ctx.drawImage(
            this.image,
            this.x - this.image.width / 2,
            this.y - this.image.height,
        );

        this.x += this.dx;

        this.speed = this.speed + this.gravity;
        this.y = this.y + this.speed;

        // ゲームスタート後に下まで落下したらゲームオーバー
        if (game.start && this.y + this.size >= HEIGHT) {
            console.log("GAME OVER");
            game.over = true;
            return;
        }

        // 着地したら落下スピードをリセット
        if (this.y + this.size >= this.floor) {
            this.y = this.floor - this.size;
            this.speed = ballSpeed
        } else {
            // 着地できなければ地面まで落ちる
            this.floor = HEIGHT;
        }

        // 画面端は逆から出てくる
        if (this.x < 0) this.x = WIDTH;
        if (this.x > WIDTH) this.x = 0;

        if (this.speed > 0) {
            this.fall = true;
        } else {
            this.fall = false;
        }
    }
};


const steps = {
    data: [],
    width: WIDTH / 6,
    y: HEIGHT * 0.8,
    cycle: 0,
}

const addStep = () =>  {
    const step = {
        x: Math.max(0, Math.floor(Math.random() * WIDTH) - steps.width),
        y: steps.y,
        width: steps.width,
        height: 8,
    }
    steps.data.push(step);
    steps.y = steps.y - Math.max(50, Math.floor(Math.random() * 150));

    console.log("steps.data", steps.data);
}

const background = () => {
    const imgName = Math.floor(game.score / 1000);
    canvas.setAttribute('style', `background: url(/img/${imgName}.jpg)`);
}

const init = () => {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT - ball.size;
    ball.floor = HEIGHT;
    ball.image = new Image();
    ball.image.src = "/img/hoppingboy.png";

    while (steps.data.length < 5) {
        console.log("steps.y", steps.y);
        addStep();
    }

};



const collide = (ball, bar) => {
    return  ball.y + ball.size >= bar.y &&
            ball.y <= bar.y + bar.height &&
            ball.x < bar.x + bar.width &&
            bar.x < ball.x + ball.size / 2;
};




const level = () => {
    if (game.score > 1000) {
        steps.width = WIDTH / (game.score / 1000 + 6);
    }
}

const loop = () => {

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.beginPath();

    background();



    steps.data.forEach((bar) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
        ctx.fill();

        // ボールが落下中にバーに乗ったら
        if (ball.fall && collide(ball, bar)) {
            ball.floor = bar.y;
            game.start = true;
            console.log("乗った", ball.floor);
        }
    })


    ball.update();


    if (ball.y < HEIGHT * 0.5) {

        const move = 8;
        game.score += move;
        steps.cycle += move;

        ball.y += move;
        ball.floor += move;
        steps.data.forEach((bar) => {
            bar.y += move;
        })
    }

    if (steps.cycle > 50) {
        steps.y = HEIGHT * 0.3;
        addStep();
        steps.cycle = 0;
    }
    if (steps.data.length > 8) {
        steps.data.shift();
    }

    level();

    // スコア表示
    ctx.fillStyle = "#ffffff77";
    ctx.fillRect(0, 0, WIDTH, 30);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
	ctx.fillText(`SCORE : ${game.score}`, 10, 10); // 表示文言,位置指定(x,y)

    // ゲームオーバー表示
    if (game.over) {
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2 - 20); // 表示文言,位置指定(x,y)

        clearInterval(game.timerId);
    }

};

const start = () => {
    init();
    game.timerId = setInterval(loop, 16);
}

start();


// 操作
const left = () => {
    ball.dx = -8;
}
const right = () => {
    ball.dx = 8;
}
const stop = () => {
    ball.dx = 0;
}


// マウス操作
// canvas.addEventListener("mousemove", (e) => {
//     var rect = e.target.getBoundingClientRect()
//     var x = e.clientX - rect.left
//     ball.x = x;
// });


// タッチ操作
document.getElementById("left").addEventListener('touchstart', () => left());
document.getElementById("left").addEventListener('touchend', () => stop());

document.getElementById("right").addEventListener('touchstart', () => right());
document.getElementById("right").addEventListener('touchend', () => stop());


// クリック操作
document.getElementById("left").addEventListener('mousedown', () => left());
document.getElementById("left").addEventListener('mouseup', () => stop());

document.getElementById("right").addEventListener('mousedown', () => right());
document.getElementById("right").addEventListener('mouseup', () => stop());



// キーボード操作
document.addEventListener('keydown', e => {
    if(e.key === 'ArrowLeft') left();
    if(e.key === 'ArrowRight') right();
});
document.addEventListener('keyup', () => stop());



document.getElementById("reload").addEventListener('touchstart', () => location.reload());
document.getElementById("reload").addEventListener('mousedown', () => location.reload());
