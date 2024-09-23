const audioElement = document.getElementById("audioElement");
const fileInput = document.getElementById("audioUpload");
const canvas = document.getElementById("visualizer");
const canvasContext = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const visualizerModes = [
    { name: "Spectrum", draw: drawSpectrum },
    { name: "Fireworks", draw: drawFireworks },
    { name: "Oscilloscope", draw: drawOscilloscope },
    { name: "Particle Explosion", draw: drawParticleExplosion },
    { name: "Circular Bars", draw: drawCircularBars },
    { name: "Waveform Tunnel", draw: drawWaveformTunnel },
    { name: "Starfield", draw: drawStarfield },
    { name: "Rings", draw: drawRings },
    { name: "Squares", draw: drawSquares },
    { name: "Triangles", draw: drawTriangles },
    { name: "Hexagons", draw: drawHexagons },
    { name: "Galaxy", draw: drawGalaxy },
    { name: "Spiral", draw: drawSpiral },
    { name: "Waveform Pulse", draw: drawWaveformPulse },
    { name: "Pulsating Circles", draw: drawPulsatingCircles },
    { name: "Random Dots", draw: drawRandomDots },
    { name: "Ripple", draw: drawRipple },
    { name: "Flame", draw: drawFlame },
    { name: "Electric Pulse", draw: drawElectricPulse },
    { name: "Fireflies", draw: drawFireflies }
];

let currentVisualizer = visualizerModes[0].draw;

const buttonContainer = document.getElementById("visualizerButtons");
visualizerModes.forEach((mode, index) => {
    const button = document.createElement("button");
    button.innerHTML = mode.name;
    button.onclick = () => {
        currentVisualizer = mode.draw;
    };
    buttonContainer.appendChild(button);
});

fileInput.onchange = function () {
    const files = fileInput.files;
    if (files.length > 0) {
        const audioSrc = URL.createObjectURL(files[0]);
        audioElement.src = audioSrc;
        audioElement.play();
        audioElement.onplay = () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            const audioSource = audioContext.createMediaElementSource(audioElement);
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
            drawVisualizer();
        };
    }
};

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    currentVisualizer();
}

const colorPicker = document.getElementById('colorPicker');
const barWidthSlider = document.getElementById('barWidth');
const particleSizeSlider = document.getElementById('particleSize');
const explosionColorPicker = document.getElementById('explosionColor');

let barColor = colorPicker.value;
let barWidth = parseInt(barWidthSlider.value);
let particleSize = parseInt(particleSizeSlider.value);
let explosionColor = explosionColorPicker.value;

colorPicker.addEventListener('input', function() {
    barColor = this.value;
});

barWidthSlider.addEventListener('input', function() {
    barWidth = parseInt(this.value);
});

particleSizeSlider.addEventListener('input', function() {
    particleSize = parseInt(this.value);
});

explosionColorPicker.addEventListener('input', function() {
    explosionColor = this.value;
});

function drawSpectrum() {
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i] / 2;
        canvasContext.fillStyle = barColor;
        canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
    }
}

function drawFireworks() {
    for (let i = 0; i < bufferLength; i++) {
        let radius = dataArray[i] / 5 + particleSize;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        canvasContext.beginPath();
        canvasContext.arc(x, y, radius, 0, Math.PI * 2);
        canvasContext.fillStyle = explosionColor;
        canvasContext.fill();
    }
}

function drawOscilloscope() {
    canvasContext.beginPath();
    let sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }
        x += sliceWidth;
    }
    canvasContext.lineTo(canvas.width, canvas.height / 2);
    canvasContext.strokeStyle = barColor;
    canvasContext.stroke();
}

function drawParticleExplosion() {
    for (let i = 0; i < bufferLength; i++) {
        let radius = dataArray[i] / 5 + particleSize;
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        canvasContext.beginPath();
        canvasContext.arc(x + Math.random() * 200 - 100, y + Math.random() * 200 - 100, radius, 0, Math.PI * 2);
        canvasContext.fillStyle = explosionColor;
        canvasContext.fill();
    }
}

function drawCircularBars() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = Math.min(canvas.width, canvas.height) / 3;
    let angleStep = (Math.PI * 2) / bufferLength;
    for (let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i] / 2;
        let angle = i * angleStep;
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius;
        let xEnd = centerX + Math.cos(angle) * (radius + barHeight);
        let yEnd = centerY + Math.sin(angle) * (radius + barHeight);
        canvasContext.strokeStyle = `rgb(${barHeight + 100}, 50, ${255 - barHeight})`;
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        canvasContext.lineTo(xEnd, yEnd);
        canvasContext.stroke();
    }
}

function drawWaveformTunnel() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    for (let i = 0; i < bufferLength; i++) {
        let radius = dataArray[i] / 2;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius + i * 10, 0, Math.PI * 2);
        canvasContext.strokeStyle = `rgb(${255 - radius}, ${100 + radius}, ${150})`;
        canvasContext.stroke();
    }
}

function drawStarfield() {
    for (let i = 0; i < bufferLength; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = dataArray[i] / 5;
        canvasContext.fillStyle = `rgba(${size + 100}, 255, ${255 - size}, 0.8)`;
        canvasContext.beginPath();
        canvasContext.arc(x, y, size, 0, Math.PI * 2);
        canvasContext.fill();
    }
}

function drawRings() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    for (let i = 0; i < bufferLength; i++) {
        let radius = dataArray[i] / 2 + i * 10;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
        canvasContext.strokeStyle = `rgb(${radius + 50}, ${200 - radius}, 255)`;
        canvasContext.stroke();
    }
}

function drawSquares() {
    for (let i = 0; i < bufferLength; i++) {
        let size = dataArray[i] / 2;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        canvasContext.fillStyle = `rgb(${size + 100}, 100, ${255 - size})`;
        canvasContext.fillRect(x, y, size, size);
    }
}

function drawTriangles() {
    for (let i = 0; i < bufferLength; i++) {
        let size = dataArray[i] / 2;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        canvasContext.lineTo(x + size, y + size);
        canvasContext.lineTo(x - size, y + size);
        canvasContext.closePath();
        canvasContext.fillStyle = `rgb(${100}, ${size + 150}, ${255 - size})`;
        canvasContext.fill();
    }
}

function drawHexagons() {
    for (let i = 0; i < bufferLength; i++) {
        let size = dataArray[i] / 4;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        canvasContext.beginPath();
        for (let j = 0; j < 6; j++) {
            canvasContext.lineTo(
                x + size * Math.cos((j * Math.PI) / 3),
                y + size * Math.sin((j * Math.PI) / 3)
            );
        }
        canvasContext.closePath();
        canvasContext.strokeStyle = `rgb(${size + 50}, ${255 - size}, 150)`;
        canvasContext.stroke();
    }
}

function drawGalaxy() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    for (let i = 0; i < bufferLength; i++) {
        let angle = i * (Math.PI / 64);
        let distance = dataArray[i] / 2;
        let x = centerX + Math.cos(angle) * distance;
        let y = centerY + Math.sin(angle) * distance;
        let size = dataArray[i] / 10;
        canvasContext.fillStyle = `rgba(200, ${150 + size}, 255, 0.8)`;
        canvasContext.beginPath();
        canvasContext.arc(x, y, size, 0, Math.PI * 2);
        canvasContext.fill();
    }
}

function drawSpiral() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let angleStep = Math.PI / 16;
    canvasContext.beginPath();
    for (let i = 0; i < bufferLength; i++) {
        let radius = i * (dataArray[i] / 10);
        let angle = i * angleStep;
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius;
        canvasContext.fillStyle = `rgb(${255 - radius}, ${radius + 100}, 200)`;
        canvasContext.arc(x, y, 3, 0, Math.PI * 2);
        canvasContext.fill();
    }
    canvasContext.closePath();
}

function drawWaveformPulse() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    for (let i = 0; i < bufferLength; i++) {
        let radius = dataArray[i] / 3;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
        canvasContext.strokeStyle = `rgba(${255 - radius}, 50, ${radius + 50}, 0.7)`;
        canvasContext.stroke();
    }
}

function drawPulsatingCircles() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    for (let i = 0; i < bufferLength; i++) {
        let radius = dataArray[i] / 5 + i * 2;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
        canvasContext.strokeStyle = `rgba(${radius + 50}, 100, ${255 - radius}, 0.8)`;
        canvasContext.stroke();
    }
}

function drawRandomDots() {
    for (let i = 0; i < bufferLength; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = dataArray[i] / 4;
        canvasContext.fillStyle = `rgba(${100 + size}, ${255 - size}, 255, 0.8)`;
        canvasContext.beginPath();
        canvasContext.arc(x, y, size, 0, Math.PI * 2);
        canvasContext.fill();
    }
}

function drawRipple() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    for (let i = 0; i < bufferLength; i++) {
        let radius = dataArray[i] / 5 + i * 5;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
        canvasContext.strokeStyle = `rgba(100, ${radius + 100}, 255, 0.7)`;
        canvasContext.stroke();
    }
}

function drawFlame() {
    for (let i = 0; i < bufferLength; i++) {
        let height = dataArray[i] / 2;
        let x = Math.random() * canvas.width;
        let y = canvas.height;
        canvasContext.fillStyle = `rgba(${255 - height}, ${height + 50}, 50, 0.9)`;
        canvasContext.fillRect(x, y - height, 5, height);
    }
}

function drawElectricPulse() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    for (let i = 0; i < bufferLength; i++) {
        let radius = dataArray[i] / 2 + i * 2;
        let xEnd = centerX + Math.cos(i) * radius;
        let yEnd = centerY + Math.sin(i) * radius;
        canvasContext.strokeStyle = `rgba(255, ${100 + radius}, ${255 - radius}, 0.8)`;
        canvasContext.beginPath();
        canvasContext.moveTo(centerX, centerY);
        canvasContext.lineTo(xEnd, yEnd);
        canvasContext.stroke();
    }
}

function drawFireflies() {
    for (let i = 0; i < bufferLength; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = dataArray[i] / 6;
        canvasContext.fillStyle = `rgba(255, 255, ${size + 150}, 0.8)`;
        canvasContext.beginPath();
        canvasContext.arc(x, y, size, 0, Math.PI * 2);
        canvasContext.fill();
    }
}

