let balance = 0;
let batteryLevel = 10000;
let batteryRefillInterval;

// Function to initialize the app
function initApp() {
    document.getElementById('home-nav').addEventListener('click', () => showPage('home-content'));
    document.getElementById('tasks-nav').addEventListener('click', () => showPage('tasks-content'));
    document.getElementById('invite-nav').addEventListener('click', () => showPage('invite-content'));
    document.getElementById('wallet-nav').addEventListener('click', () => showPage('wallet-content'));
    document.getElementById('click-image').addEventListener('click', handleImageClick);

    // Add event listeners for task buttons
    document.querySelectorAll('.task-button').forEach(button => {
        button.addEventListener('click', () => handleTask(button.dataset.taskId));
    });

    loadUserData();  // Load user data from local storage on initialization
    startBatteryRefill();
}

// Function to handle page navigation
function showPage(pageId) {
    const pages = document.querySelectorAll('.container');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'flex';
}

// Function to update the balance display
function updateBalance() {
    document.getElementById('balance-amount').innerText = balance;
}

// Function to update battery level display
function updateBattery() {
    const batteryLevelElement = document.getElementById('battery-level');
    batteryLevelElement.style.width = `${(batteryLevel / 10000) * 100}%`;

    if (batteryLevel >= 8000) {
        batteryLevelElement.style.backgroundColor = '#4CAF50'; // Full
    } else if (batteryLevel >= 6000) {
        batteryLevelElement.style.backgroundColor = '#8BC34A'; // High
    } else if (batteryLevel >= 4000) {
        batteryLevelElement.style.backgroundColor = '#FFEB3B'; // Medium
    } else if (batteryLevel >= 2000) {
        batteryLevelElement.style.backgroundColor = '#FF9800'; // Low
    } else {
        batteryLevelElement.style.backgroundColor = '#F44336'; // Critical
    }

    document.getElementById('battery-level-number').innerText = batteryLevel;
}

// Function to handle click on the image
function handleImageClick() {
    if (batteryLevel >= 10) {
        batteryLevel -= 10;
        balance += 10;
        updateBattery();
        updateBalance();
        showPlus10Animation();

        clearInterval(batteryRefillInterval);
        startBatteryRefill();
        saveUserData();
    }
}

// Function to display floating "+10"
function showPlus10Animation() {
    const plus10Element = document.createElement('div');
    plus10Element.className = 'plus10';
    plus10Element.innerText = '+10';
    document.body.appendChild(plus10Element);

    plus10Element.addEventListener('animationend', () => {
        plus10Element.remove();
    });
}

// Function to start the battery refill process
function startBatteryRefill() {
    batteryRefillInterval = setInterval(() => {
        if (batteryLevel < 10000) {
            batteryLevel += 5;
            updateBattery();
        }
    }, 1000);
}

// Function to handle task start and completion
function handleTask(taskId) {
    const button = document.getElementById(`task-${taskId}-btn`);
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {};

    if (!completedTasks[taskId]) {
        if (button.innerText === 'Start') {
            openTaskLink(taskId);
            button.innerText = 'Claim';
        } else if (button.innerText === 'Claim') {
            balance += 1000;
            completedTasks[taskId] = true;
            button.innerText = 'Completed';
            button.disabled = true;
            saveUserData();
            updateBalance();
        }
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
}

// Function to open the task link based on taskId
function openTaskLink(taskId) {
    const links = {
        'follow-twitter': 'https://x.com/matecoin',
        'subscribe-yt': 'https://www.youtube.com/channel/@matecoin',
        'join-telegram': 'https://t.me/matecoin_announcement'
    };
    window.open(links[taskId], '_blank');
}

// Function to load user data from local storage
function loadUserData() {
    const savedBalance = localStorage.getItem('balance');
    const savedBattery = localStorage.getItem('batteryLevel');
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {};

    if (savedBalance !== null) balance = parseInt(savedBalance);
    if (savedBattery !== null) batteryLevel = parseInt(savedBattery);

    Object.keys(completedTasks).forEach(taskId => {
        const button = document.getElementById(`task-${taskId}-btn`);
        if (button) {
            button.innerText = 'Completed';
            button.disabled = true;
        }
    });

    updateBalance();
    updateBattery();
}

// Function to save user data to local storage
function saveUserData() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('batteryLevel', batteryLevel);
}

// Initialize the app on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
// Function to simulate fetching the username
async function fetchUsername() {
    // Simulate fetching the username; replace with actual implementation if needed
    return 'sampleUser123';
}

// Function to generate the invite link
function generateInviteLink(username) {
    return `https://t.me/matecoin_bot?start=${username}`;
}

// Function to initialize the invite page
async function initInvitePage() {
    try {
        // Fetch the username
        const username = await fetchUsername();
        if (!username) throw new Error('Username not found');
        
        // Generate the invite link
        const inviteLink = generateInviteLink(username);

        // Display the invite link in the input field
        document.getElementById('invite-link').value = inviteLink;
    } catch (error) {
        console.error('Error fetching invite link:', error);
    }
}

// Function to copy the invite link to clipboard
function copyInviteLink() {
    const inviteLinkInput = document.getElementById('invite-link');
    inviteLinkInput.select();
    document.execCommand('copy');
    alert('Invite link copied to clipboard!');
}

// Initialize the invite page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initInvitePage();
});
