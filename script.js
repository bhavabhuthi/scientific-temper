let ctx, numberOfParticles = 150, particlesArray = [];


//----------------------------------------------------------------------------------------------------
// Main DOM event listener
//----------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Query Elements once to avoid multiple queries
  const titleElement = document.querySelector('.title-text');
  const typeElement = document.querySelector('.type-text');
  const exampleElement = document.querySelector('.example');
  const descriptionElement = document.querySelector('.description');
  const refreshButton = document.getElementById('refreshButton')

  const themeToggle = document.getElementById('themeToggle');

  // Canvas setup for particle effects
  const canvas = document.getElementById('particleCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const mouse = {
    x: null,
    y: null,
    radius: 150,
  };


  //----------------------------------------------------------------------------------------------------
  // Particle Class
  //----------------------------------------------------------------------------------------------------
  class Particle {
    constructor(x, y, size, speedX, speedY, color) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.length = Math.random() * 2 + 1;
      this.baseY = y;
      this.density = Math.random() * 40 + 1;
      this.color = color;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() * 4 - 2) * 0.2; // Increased speed
      this.speedY = (Math.random() * 4 - 2) * 0.2; // Increased speed
    }

    // Draw the particle
    draw() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.length, this.y + this.length);

      // Use CSS variable for particle color with opacity
      const particleColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--particle-color').trim();

      // Convert hex to rgba if needed
      if (particleColor.startsWith('#')) {
        const r = parseInt(particleColor.slice(1, 3), 16);
        const g = parseInt(particleColor.slice(3, 5), 16);
        const b = parseInt(particleColor.slice(5, 7), 16);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
      } else {
        // If it's already rgb/rgba, just append the opacity
        ctx.strokeStyle = particleColor.replace(')', `, ${this.opacity})`).replace('rgb', 'rgba');
      }

      ctx.stroke();
    }

    // Update the particle based on mouse position
    update() {
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

      if (this.y + this.length > canvas.height || this.y - this.length < 0) { this.speedY = -this.speedY * 0.9; }
      if (this.x + this.length > canvas.width || this.x - this.length < 0) { this.speedX = -this.speedX * 0.9; }

      this.draw();
    }
  }


  //----------------------------------------------------------------------------------------------------
  // Particle Functions
  //----------------------------------------------------------------------------------------------------

  // Function to initialize particles
  function init() {
    for (let i = 0; i < numberOfParticles * 2; i++) {
      const x = Math.random() * (canvas.width - 100) + 50 + Math.random() * 20 - 10;
      const y = Math.random() * (canvas.height - 100) + 50 + Math.random() * 20 - 10;

      const color = `${Math.random() * 360}, 100%, 50%`;
      particlesArray.push(new Particle(x, y, 0, 0, 0, color));
    }
  }

  // Helper function to get CSS variable value
  function getCssVar(variable) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }

  // Function to connect particles
  function connect() {
    let opacity = 1;
    const connectionColor = getCssVar('--particle-connection');

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = Math.sqrt(
          (particlesArray[a].x - particlesArray[b].x) ** 2 +
          (particlesArray[a].y - particlesArray[b].y) ** 2
        );
        if (distance < 150) {
          opacity = 1 - distance / 300;
          // Extract RGB values from the CSS variable and apply opacity
          const rgba = connectionColor.startsWith('rgba') ?
            connectionColor :
            `${connectionColor}${Math.round(opacity * 1000) / 1000}`.replace(')', `, ${opacity})`);

          ctx.strokeStyle = rgba;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Function to animate particles
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {

      particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  //----------------------------------------------------------------------------------------------------
  // Content Function
  //----------------------------------------------------------------------------------------------------

  // Function to load content from JSON module
  function loadContent() {
    // Function to load content from JSON
    fetch('jsonData.json')
      .then(response => response.json())
      .then(data => {
        jsonData = data;
        const randomIndex = Math.floor(Math.random() * jsonData.length);
        const { title, type, example, description } = jsonData[randomIndex];

        titleElement.textContent = title;
        typeElement.textContent = type;
        exampleElement.textContent = example;
        descriptionElement.textContent = description;
      })
  }

  // Theme switching function
  function setupThemeToggle() {


  }

  // Initialize everything
  init();
  animate();
  setupThemeToggle();
  // Load content on initial page load
  loadContent();

  // Event Listener to update mouse position
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  // Event Listener to resize canvas on window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray = [];
    init();
  });

  // Event listener to load content on click of refresh button
  refreshButton.addEventListener('click', loadContent);

  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    // Force redraw of canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
})
