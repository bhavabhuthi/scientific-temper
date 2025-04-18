document.addEventListener('DOMContentLoaded', () => {
  // Canvas setup for particle effects
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let particlesArray = [];
  const numberOfParticles = 150;
  const mouse = {
    x: null,
    y: null,
    radius: 150,
  };
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  // Particle class
  class Particle {
    constructor(x, y, size, speedX, speedY, color) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 1; // Random size between 1 and 9
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 30 + 1;
      this.color = color; // Set color when creating the particle
      this.opacity = Math.random() * 0.5 + 0.3; // Random opacity between 0.3 and 0.8
      this.speedX = Math.random() * 2 - 1; // Random speed between -1 and 1
      this.speedY = Math.random() * 2 - 1; // Random speed between -1 and 1
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`; // Use rgba with opacity
      ctx.fill();
    }
    update() {
      // Check for mouse collision and adjust position
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
      // Update particle position
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off walls
      if (this.x + this.size > canvas.width || this.x - this.size < 0) {
        this.speedX = -this.speedX * 0.9; // Reduce speed on bounce
      }
      if (this.y + this.size > canvas.height || this.y - this.size < 0) {
        this.speedY = -this.speedY * 0.9; // Reduce speed on bounce
      }
      if (this.size < 0.2) {
        //reset the values if the particles are too small
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 8 + 1; // Random size between 1 and 9
        this.speedX = Math.random() * 2 - 1; // Random speed between -1 and 1
        this.speedY = Math.random() * 2 - 1; // Random speed between -1 and 1
      }
      this.draw();
    }
  }
  
  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      const x = Math.random() * canvas.width ;
      const y = Math.random() * canvas.height ;

      const color = `${Math.random() * 360}, 100%, 50%`;
      particlesArray.push(new Particle(x, y, 0, 0, 0, color));
    }
  }
  function connect() {
    let opacity = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = Math.sqrt(
          (particlesArray[a].x - particlesArray[b].x) ** 2 +
            (particlesArray[a].y - particlesArray[b].y) ** 2
        );
        if (distance < 100) {
          opacity = 1 - distance / 100;
          ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }
  init();
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {

      particlesArray[i].update();
    }
    connect();

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
