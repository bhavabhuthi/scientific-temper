document.addEventListener('DOMContentLoaded', () => {
  // Canvas setup for particle effects
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let particlesArray = [];
  const numberOfParticles = 100;
  
  // Particle class
  class Particle {
    constructor(x, y, size, speedX, speedY, color) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speedX = speedX;
      this.speedY = speedY;
      this.color = color;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.1;
  
      if (this.x + this.size > canvas.width || this.x - this.size < 0) {
        this.speedX = -this.speedX;
      }
      if (this.y + this.size > canvas.height || this.y - this.size < 0) {
        this.speedY = -this.speedY;
      }
      if (this.size <= 0.2) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 10 + 1;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
      }
      this.draw();
    }
  }
  
  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 10 + 1;
      const speedX = Math.random() * 4 - 2;
      const speedY = Math.random() * 4 - 2;
      const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      particlesArray.push(new Particle(x, y, size, speedX, speedY, color));
    }
  }
  init();
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    requestAnimationFrame(animate);
  }
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray = [];
    init();
  });
  
  fetch('jsonData.json')
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomItem = data[randomIndex];

      document.querySelector('.titleContainer').textContent = randomItem.title;
      document.querySelector('.info').textContent = randomItem.type;
      document.querySelector('.example').textContent = randomItem.example;
      document.querySelector('.description').textContent = randomItem.description;
    })
    .catch(error => console.error('Error loading data:', error));
});