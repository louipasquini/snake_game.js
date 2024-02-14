const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let points = 0;

const size = 10;

let snake = [
    {
        x: 200, y: 200
    },
    {
        x: 210, y: 200
    },
    {
        x: 220, y: 200
    },
    {
        x: 230, y: 200
    }
]

const snakePointZero = [
    {
        x: 200, y: 200
    },
    {
        x: 210, y: 200
    },
    {
        x: 220, y: 200
    },
    {
        x: 230, y: 200
    }
]

const food = {
    x: Math.floor(Math.random() * 40) * 10,
    y: Math.floor(Math.random() * 40) * 10,
    color: 'white',
    blur: 6,
    glow: 'shine'
}

let direction , loopId , corpo

const drawFood = () => {
    ctx.fillStyle = food.color
    ctx.shadowColor = food.color
    ctx.shadowBlur = food.blur
    if (food.glow == 'shine') {
        food.blur += 1
    } else {
        food.blur -= 1
    }
    if (food.blur >= 20) {
        food.glow = 'dark'
    } else if (food.blur <= 6) {
        food.glow = 'shine'
    }
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0
}

const defineFoodPosition = () => {
    let newX = Math.floor(Math.random() * 40) * 10
    let newY = Math.floor(Math.random() * 40) * 10 
    while (snake.find((position) => position.x == newX && position.y == newY)) {
        newX = Math.floor(Math.random() * 40) * 10
        newY = Math.floor(Math.random() * 40) * 10 
    }
    food.x = newX
    food.y = newY
    if (direction == 'right') {
        snake.push({x:snake.at(-1).x + 10, y: snake.at(-1).y})
    } else if (direction == 'left') {
        snake.push({x:snake.at(-1).x - 10, y: snake.at(-1).y})
    } else if (direction == 'up') {
        snake.push({x:snake.at(-1).x, y: snake.at(-1).y - 10})
    } else if (direction == 'down') {
        snake.push({x:snake.at(-1).x, y: snake.at(-1).y + 10})
    }
}



const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

let time = 100;

const moveSnake = () => {
    const head = snake[snake.length - 1]

    if (direction == "right") {
        if (head.x >= 390) {
            snake.push({ x: 0, y: head.y})
        } else {
            snake.push({ x: head.x + size, y: head.y})
        }
        snake.shift()
    }

    if (direction == "up") {
        if (head.y <= 0) {
            snake.push({ x: head.x, y: 390})
        } else {
            snake.push({ x: head.x , y: head.y - size})
        }
        snake.shift()
    }

    if (direction == "down") {
        if (head.y >= 390) {
            snake.push({ x: head.x, y: 0})
        } else {
            snake.push({ x: head.x , y: head.y + size})
        }
        snake.shift()
    }

    if (direction == "left") {
        if (head.x <= 0) {
            snake.push({ x: 390, y: head.y})
        } else {
            snake.push({ x: head.x - size, y: head.y})
        }
        snake.shift()
    }
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#0f0f0f'
    
    for (let i = 10; i < canvas.width; i += 10) {
        ctx.beginPath()
        ctx.lineTo(i,0)
        ctx.lineTo(i,400)
        ctx.stroke()
        ctx.beginPath()
        ctx.lineTo(0,i)
        ctx.lineTo(400,i)
        ctx.stroke()
    }
    
}

const resetSnake = () => {
    snake = []
    for (var i = 0; i < snakePointZero.length; i++) {
        snake.push(snakePointZero[i])
    }
}

const gameLoop = () => {
    
    clearInterval(loopId)
    corpo = snake.slice(0,-1)

    document.getElementById('points').innerText = `Points: ${points}`

    let head = snake[snake.length - 1]

    for (var i = 0; i < corpo.length ; i++) {
        if (corpo[i].x == head.x && corpo[i].y == head.y) {
            resetSnake()
            points = 0
        }
    }

    ctx.clearRect(0,0,400,400)
    drawGrid()
    drawFood()
    drawSnake()
    
    moveSnake()

    
    if (snake[snake.length - 1].x == food.x && snake[snake.length - 1].y == food.y) {
        defineFoodPosition()
        points += 10
    }

    loopId = setTimeout(() => {
        gameLoop()
    }, time)
}

gameLoop()

document.getElementById('up').onclick = () => {
    if (direction != 'down') {
        direction = 'up'
    }
}

document.getElementById('right').onclick = () => {
    if (direction != 'left') {
        direction = 'right'
    }
}

document.getElementById('down').onclick = () => {
    if (direction != 'up') {
        direction = 'down'
    }
}

document.getElementById('left').onclick = () => {
    if (direction != 'right') {
        direction = 'left'
    }
}

let runClicked = false

document.getElementById('run').onclick = () => {
    setTimeout(() => {
        time = 100
    }, 1000)

    time = 40
}


document.addEventListener("keydown", ({key}) => {
    if (key == 'A' && direction != 'right' || key == 'a' && direction != 'right' || key == "ArrowLeft" && direction != 'right') {
        direction = 'left'
    } else if (key == 'D' && direction != 'left' || key == 'd' && direction != 'left' || key == "ArrowRight" && direction != 'left') {
        direction = 'right'
    } else if (key == 'S' && direction != 'up' || key == 's' && direction != 'up' || key == "ArrowDown" && direction != 'up') {
        direction = 'down'
    } else if (key == 'W' && direction != 'down' || key == 'w' && direction != 'down' || key == "ArrowUp" && direction != 'down') {
        direction = 'up'
    }
    if (key == 'Shift') {
        time = 40
    }
})

document.addEventListener("keyup", ({key}) => {
    if (key == 'Shift') {
        time = 100
    }
})

