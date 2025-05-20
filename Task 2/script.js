// DOM Elements
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const millisecondsElement = document.getElementById('milliseconds');
const startBtn = document.getElementById('start-btn');
const lapBtn = document.getElementById('lap-btn');
const resetBtn = document.getElementById('reset-btn');
const clearLapsBtn = document.getElementById('clear-laps-btn');
const lapsList = document.getElementById('laps-list');

// Stopwatch variables
let startTime;
let elapsedTime = 0;
let timeInterval;
let isRunning = false;
let lapCounter = 0;
let previousLapTime = 0;

// Event listeners
startBtn.addEventListener('click', toggleStartPause);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetStopwatch);
clearLapsBtn.addEventListener('click', clearLaps);

// Functions
function toggleStartPause() {
    if (!isRunning) {
        // Start the stopwatch
        startTime = Date.now() - elapsedTime;
        timeInterval = setInterval(updateTime, 10);
        isRunning = true;
        
        // Update button states
        startBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
        startBtn.classList.add('pause');
        lapBtn.disabled = false;
        resetBtn.disabled = false;
        
        // Add animation
        animateTimeDisplay();
        addParticleEffect();
    } else {
        // Pause the stopwatch
        clearInterval(timeInterval);
        isRunning = false;
        
        // Update button states
        startBtn.innerHTML = '<i class="fas fa-play"></i><span>Resume</span>';
        startBtn.classList.remove('pause');
    }
}

function updateTime() {
    // Calculate elapsed time
    elapsedTime = Date.now() - startTime;
    
    // Convert to minutes, seconds, milliseconds
    const minutes = Math.floor(elapsedTime / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);
    
    // Update the display
    minutesElement.textContent = formatTime(minutes);
    secondsElement.textContent = formatTime(seconds);
    millisecondsElement.textContent = formatTime(milliseconds);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function recordLap() {
    if (isRunning) {
        lapCounter++;
        const lapTime = elapsedTime;
        const lapDiff = lapTime - previousLapTime;
        
        // Remove empty laps message if it exists
        const emptyLaps = document.querySelector('.empty-laps');
        if (emptyLaps) {
            emptyLaps.remove();
        }
        
        // Create lap item
        const lapItem = document.createElement('div');
        lapItem.classList.add('lap-item');
        
        // Determine if this is the fastest or slowest lap (if we have more than 1 lap)
        let lapClass = '';
        if (lapCounter > 1) {
            const allLapItems = document.querySelectorAll('.lap-item');
            const lapTimes = Array.from(allLapItems).map(item => {
                const timeString = item.querySelector('.lap-diff').dataset.time;
                return parseInt(timeString);
            });
            
            // Add current lap time to compare
            lapTimes.push(lapDiff);
            
            const minTime = Math.min(...lapTimes);
            const maxTime = Math.max(...lapTimes);
            
            if (lapDiff === minTime && lapCounter > 1) {
                lapClass = 'fastest-lap';
            } else if (lapDiff === maxTime && lapCounter > 1) {
                lapClass = 'slowest-lap';
            }
        }
        
        // Add lap data
        lapItem.innerHTML = `
            <span class="lap-number">${lapCounter}</span>
            <span class="lap-diff ${lapClass}" data-time="${lapDiff}">${formatTimeMS(lapDiff)}</span>
            <span class="lap-total">${formatTimeMS(lapTime)}</span>
        `;
        
        // Add lap to list (at the beginning)
        lapsList.insertBefore(lapItem, lapsList.firstChild);
        
        // Save previous lap time
        previousLapTime = lapTime;
        
        // Enable clear laps button
        clearLapsBtn.disabled = false;
        
        // Add animation
        lapItem.style.animation = 'fade-in 0.3s ease';
        
        // Add flag animation
        addFlagAnimation();
    }
}

function resetStopwatch() {
    // Stop the timer
    clearInterval(timeInterval);
    isRunning = false;
    
    // Reset variables
    elapsedTime = 0;
    
    // Reset display
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
    millisecondsElement.textContent = '00';
    
    // Reset buttons
    startBtn.innerHTML = '<i class="fas fa-play"></i><span>Start</span>';
    startBtn.classList.remove('pause');
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    
    // Animate reset
    animateReset();
}

function clearLaps() {
    // Clear laps list
    lapsList.innerHTML = `
        <div class="empty-laps">
            <i class="fas fa-stopwatch"></i>
            <p>Lap times will appear here</p>
        </div>
    `;
    
    // Reset lap counter and previous lap time
    lapCounter = 0;
    previousLapTime = 0;
    
    // Disable clear laps button
    clearLapsBtn.disabled = true;
    
    // Add sweeping animation
    addSweepAnimation();
}

function formatTimeMS(time) {
    const minutes = Math.floor(time / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    
    return `${formatTime(minutes)}:${formatTime(seconds)}.${formatTime(milliseconds)}`;
}

// Animations
function animateTimeDisplay() {
    const timeElements = [minutesElement, secondsElement, millisecondsElement];
    timeElements.forEach((element, index) => {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'pulse 1s ease';
        }, index * 100);
    });
}

function animateReset() {
    const timeElements = [minutesElement, secondsElement, millisecondsElement];
    timeElements.forEach((element, index) => {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'fade-in 0.5s ease';
        }, index * 50);
    });
    
    // Add reset animation effect
    addRewindAnimation();
}

// Add keypress shortcuts
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case ' ': // Space bar
            toggleStartPause();
            break;
        case 'l': // L key
        case 'L':
            if (!lapBtn.disabled) recordLap();
            break;
        case 'r': // R key
        case 'R':
            if (!resetBtn.disabled) resetStopwatch();
            break;
        case 'c': // C key
        case 'C':
            if (!clearLapsBtn.disabled) clearLaps();
            break;
    }
});

// Graphical animations
function addParticleEffect() {
    const container = document.querySelector('.stopwatch');
    
    // Create 10 particles
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position around the time display
        const angle = Math.random() * 360;
        const distance = 80 + Math.random() * 30;
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;
        
        // Random size
        const size = 3 + Math.random() * 5;
        
        // Random color (blue or pink from our theme)
        const color = Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--accent-color)';
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.position = 'absolute';
        particle.style.top = '50%';
        particle.style.left = '50%';
        particle.style.borderRadius = '50%';
        particle.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        particle.style.opacity = '0';
        particle.style.boxShadow = `0 0 ${size}px ${color}`;
        
        // Animation
        particle.style.animation = `particle-fade ${0.5 + Math.random() * 1}s ease forwards`;
        
        // Add to container
        container.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
}

function addFlagAnimation() {
    const flag = document.createElement('div');
    flag.classList.add('flag-animation');
    flag.innerHTML = '<i class="fas fa-flag"></i>';
    
    document.querySelector('.stopwatch').appendChild(flag);
    
    // Remove after animation
    setTimeout(() => {
        flag.remove();
    }, 1500);
}

function addRewindAnimation() {
    const rewind = document.createElement('div');
    rewind.classList.add('rewind-animation');
    rewind.innerHTML = '<i class="fas fa-undo-alt"></i>';
    
    document.querySelector('.stopwatch').appendChild(rewind);
    
    // Remove after animation
    setTimeout(() => {
        rewind.remove();
    }, 1500);
}

function addSweepAnimation() {
    const sweep = document.createElement('div');
    sweep.classList.add('sweep-animation');
    sweep.innerHTML = '<i class="fas fa-broom"></i>';
    
    document.querySelector('.laps-container').appendChild(sweep);
    
    // Remove after animation
    setTimeout(() => {
        sweep.remove();
    }, 1500);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        10% { transform: scale(1.1); }
        20% { transform: scale(1); }
    }
    
    .fastest-lap {
        color: #4CAF50;
        font-weight: 600;
    }
    
    .slowest-lap {
        color: var(--accent-color);
    }
    
    @keyframes particle-fade {
        0% { opacity: 0; transform: translate(-50%, -50%) translate(0, 0); }
        20% { opacity: 0.8; }
        100% { opacity: 0; transform: translate(-50%, -50%) translate(var(--x, 80px), var(--y, 80px)) scale(0.5); }
    }
    
    .flag-animation {
        position: absolute;
        top: 50%;
        right: 10%;
        color: var(--primary-color);
        font-size: 2rem;
        animation: flag-wave 1.5s ease-in-out;
        opacity: 0;
    }
    
    @keyframes flag-wave {
        0% { opacity: 0; transform: translateY(20px) rotate(-30deg); }
        30% { opacity: 1; transform: translateY(0) rotate(0deg); }
        70% { opacity: 1; transform: translateY(0) rotate(0deg); }
        100% { opacity: 0; transform: translateY(-20px) rotate(30deg); }
    }
    
    .rewind-animation {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--primary-color);
        font-size: 4rem;
        animation: rewind 1.5s ease-in-out;
        opacity: 0;
    }
    
    @keyframes rewind {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        30% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        60% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(-180deg); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5) rotate(-360deg); }
    }
    
    .sweep-animation {
        position: absolute;
        bottom: 20%;
        left: 50%;
        transform: translateX(-50%);
        color: var(--accent-color);
        font-size: 2.5rem;
        animation: sweep 1.5s ease-in-out;
        opacity: 0;
    }
    
    @keyframes sweep {
        0% { opacity: 0; transform: translateX(-100%) rotate(-30deg); }
        30% { opacity: 1; transform: translateX(-50%) rotate(0deg); }
        70% { opacity: 1; transform: translateX(0%) rotate(0deg); }
        100% { opacity: 0; transform: translateX(100%) rotate(30deg); }
    }
`;
document.head.appendChild(style);

// Initialize theme - remove the initial blur animation
document.addEventListener('DOMContentLoaded', function() {
    // No initial animation delay that causes blurring
    const timeDisplay = document.querySelector('.time-display');
    timeDisplay.style.animation = 'none';
}); 