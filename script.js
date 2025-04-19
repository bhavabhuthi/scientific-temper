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
        this.size = Math.random() * 4 + 1;
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 40 + 1;
        this.color = color;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.speedX = (Math.random() * 4 - 2) * 0.2; // Increased speed
        this.speedY = (Math.random() * 4 - 2) * 0.2; // Increased speed
        this.speedZ = Math.random() * 0.2 - 0.1;
        this.z = 0;
      }
      
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.color}, 100%, 50%, ${this.opacity})`;
      ctx.textBaseline = 'middle';
      ctx.fill()
    }
    update() {
      // Check for mouse collision and adjust position

      //mouse reaction
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
        this.x -= directionX / 10;
        this.y -= directionY / 10;
      }

      // Return to the base if pushed
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 50;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 50;
      }

      // Apply base movement
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off walls
      if (this.y + this.size > canvas.height || this.y - this.size < 0) {
        this.speedY = -this.speedY * 0.9; // Reduce speed on bounce
         // Bounce off top and bottom
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }

      this.z += this.speedZ;
      if (this.z > 0.5 || this.z < -0.5) {
        this.speedZ = -this.speedZ;
      }
      this.draw();

    }
  }

  function init() {
    for (let i = 0; i < numberOfParticles * 2; i++) {
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
        if (distance < 150) {
          opacity = 1 - distance / 300;
          ctx.strokeStyle = `rgba(221,221,221,${opacity})`; // Light gray connection lines
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

      document.querySelector('.title-text').textContent = randomItem.title;
      document.querySelector('.type-text').textContent = randomItem.type;
      document.querySelector('.example').textContent = randomItem.example;
      document.querySelector('.description').textContent = randomItem.description;
    })
    .catch(error => console.error('Error loading data:', error));
});
