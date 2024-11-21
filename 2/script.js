// 获取画布元素并设置2D绘图上下文
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// 定义球的属性
var ballRadius = 10;
var x = canvas.width / 2; // 初始x坐标
var y = canvas.height - 30; // 初始y坐标
var dx = 2; // x方向速度
var dy = -2; // y方向速度

// 定义挡板的属性
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2; // 初始x坐标

// 定义键盘按键状态
var rightPressed = false;
var leftPressed = false;

// 定义砖块属性
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// 初始化分数和生命值
var score = 0;
var lives = 3;

// 创建砖块数组并初始化每个砖块的状态
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // status为1表示砖块存在
    }
}

// 添加事件监听器以处理键盘和鼠标事件
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// 键盘按下事件处理函数
function keyDownHandler(e) {
    if (e.code == "ArrowRight") {
        rightPressed = true;
    } else if (e.code == 'ArrowLeft') {
        leftPressed = true;
    }
}

// 键盘松开事件处理函数
function keyUpHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = false;
    } else if (e.code == 'ArrowLeft') {
        leftPressed = false;
    }
}

// 鼠标移动事件处理函数，用于控制挡板位置
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// 碰撞检测函数，检测球是否与砖块或挡板发生碰撞
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) { // 如果砖块存在
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy; // 反转y方向速度
                    b.status = 0; // 将砖块状态设为0（消失）
                    score++; // 增加分数
                    if (score == brickRowCount * brickColumnCount) { // 如果所有砖块都被击碎
                        alert("YOU WIN, CONGRATS!"); // 显示胜利信息
                        document.location.reload(); // 重新加载页面
                    }
                }
            }
        }
    }
}

// 绘制球的函数
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); // 绘制圆形球体
    ctx.fillStyle = "#0095DD"; // 填充颜色
    ctx.fill(); // 填充路径
    ctx.closePath(); // 关闭路径
}

// 绘制挡板的函数
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight); // 绘制矩形挡板
    ctx.fillStyle = "#0095DD"; // 填充颜色
    ctx.fill(); // 填充路径
    ctx.closePath(); // 关闭路径
}

// 绘制砖块的函数
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) { // 如果砖块存在
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft; // 计算砖块x坐标
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop; // 计算砖块y坐标
                bricks[c][r].x = brickX; // 更新砖块x坐标
                bricks[c][r].y = brickY; // 更新砖块y坐标
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight); // 绘制矩形砖块
                ctx.fillStyle = "#0095DD"; // 填充颜色
                ctx.fill(); // 填充路径
                ctx.closePath(); // 关闭路径
            }
        }
    }
}

// 绘制分数的函数
function drawScore() {
    ctx.font = "16px Arial"; // 设置字体样式
    ctx.fillStyle = "#0095DD"; // 设置填充颜色
    ctx.fillText("Score: " + score, 8, 20); // 绘制分数文本
}

// 绘制生命值的函数
function drawLives() {
    ctx.font = "16px Arial"; // 设置字体样式
    ctx.fillStyle = "#0095DD"; // 设置填充颜色
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20); // 绘制生命值文本
}

// 主绘制函数，负责调用其他绘制函数并处理游戏逻辑
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布内容
    drawBricks(); // 绘制砖块
    drawBall(); // 绘制球体
    drawPaddle(); // 绘制挡板
    drawScore(); // 绘制分数
    drawLives(); // 绘制生命值
    collisionDetection(); // 进行碰撞检测

    // 检查球是否碰到左右边界，如果是则反转x方向速度
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // 检查球是否碰到顶部边界，如果是则反转y方向速度
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) { // 检查球是否碰到底部边界或挡板
        if (x > paddleX && x < paddleX + paddleWidth) { // 如果球在挡板范围内，反转y方向速度
            dy = -dy;
        } else { // 如果球不在挡板范围内，减少生命值并重置球的位置和速度
            lives--;
            if (!lives) { // 如果生命值为0，显示游戏结束信息并重新加载页面
                alert("GAME OVER");
                document.location.reload();
            } else { // 如果还有剩余生命值，重置球的位置和速度以及挡板的位置和速度
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    // 根据按键状态移动挡板，确保挡板不会移出画布边界
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // 更新球的位置
    x += dx;
    y += dy;
    requestAnimationFrame(draw); // 请求下一帧动画，实现动画效果
}

draw(); // 开始绘制动画