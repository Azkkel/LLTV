const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 30;
const text = "Te Amo";
ctx.font = fontSize + "px monospace";

// MÁS columnas aún
const spacingFactor = 0.2;

let columns = Math.floor(canvas.width / (text.length * fontSize * spacingFactor));
let drops = Array(columns).fill(1);

const particles = [];

function drawMatrix() {
  // Fondo borroso para estela suave
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FF69B4";

  for (let i = 0; i < drops.length; i++) {
    let x = i * text.length * fontSize * spacingFactor;
    let y = drops[i] * fontSize;

    ctx.fillText(text, x, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i] += 0.2;
  }
}

// Partículas grandes
function Particle(x, y, color) {
  this.x = x;
  this.y = y;
  this.radius = Math.random() * 4 + 2;
  this.speed = Math.random() * 3 + 1.5;
  this.angle = Math.random() * 2 * Math.PI;
  this.life = 50;
  this.color = color;

  this.update = function () {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life--;
  };

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  };
}

// Explosiones
function createExplosion(x, y) {
  const colors = ['#ff69b4', '#ffd700', '#ff4500', '#ffffff'];
  for (let i = 0; i < 40; i++) {
    particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
  }
}

function updateExplosions() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Explosiones periódicas
setInterval(() => {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height / 2;
  createExplosion(x, y);
}, 600);

function animate() {
  drawMatrix();
  updateExplosions();
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / (text.length * fontSize * spacingFactor));
  drops = Array(columns).fill(1);
});
