import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Juego de Snake</h1>
    <canvas #gameCanvas width="400" height="400"></canvas>
    <p>Puntuación: {{ score }}</p>
  `,
})
export class App implements OnInit {
  @ViewChild('gameCanvas', { static: true }) gameCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private snake: number[][] = [[10, 10]];
  private food: number[] = [5, 5];
  private direction: string = 'right';
  private gameLoop: any;
  score: number = 0;

  ngOnInit() {
    this.ctx = this.gameCanvas.nativeElement.getContext('2d')!;
    this.startGame();
  }

  startGame() {
    this.gameLoop = setInterval(() => {
      this.moveSnake();
      this.checkCollision();
      this.draw();
    }, 100);
  }

  moveSnake() {
    const head = [...this.snake[0]];
    switch (this.direction) {
      case 'up': head[1]--; break;
      case 'down': head[1]++; break;
      case 'left': head[0]--; break;
      case 'right': head[0]++; break;
    }
    this.snake.unshift(head);
    if (head[0] === this.food[0] && head[1] === this.food[1]) {
      this.score++;
      this.generateFood();
    } else {
      this.snake.pop();
    }
  }

  checkCollision() {
    const head = this.snake[0];
    if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20 ||
        this.snake.slice(1).some(segment => segment[0] === head[0] && segment[1] === head[1])) {
      clearInterval(this.gameLoop);
      alert('Game Over! Tu puntuación: ' + this.score);
    }
  }

  generateFood() {
    this.food = [
      Math.floor(Math.random() * 20),
      Math.floor(Math.random() * 20)
    ];
  }

  draw() {
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, 400, 400);

    this.ctx.fillStyle = '#4CAF50';
    this.snake.forEach(([x, y]) => {
      this.ctx.fillRect(x * 20, y * 20, 20, 20);
    });

    this.ctx.fillStyle = '#FF4136';
    this.ctx.fillRect(this.food[0] * 20, this.food[1] * 20, 20, 20);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp': if (this.direction !== 'down') this.direction = 'up'; break;
      case 'ArrowDown': if (this.direction !== 'up') this.direction = 'down'; break;
      case 'ArrowLeft': if (this.direction !== 'right') this.direction = 'left'; break;
      case 'ArrowRight': if (this.direction !== 'left') this.direction = 'right'; break;
    }
  }
}

bootstrapApplication(App);