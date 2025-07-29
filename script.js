// Event rewards and costs for MTGA events
// This data is used to calculate the expected value (EV) of participating in different MTGA
window.onload = function() {
const eventData = {
            premier: {
                name: "Premier Draft",
                cost: 1500,
                currency: "gems",
                rewards: {
                    0: { gems: 50, packs: 1 },
                    1: { gems: 100, packs: 1 },
                    2: { gems: 250, packs: 2 },
                    3: { gems: 1000, packs: 2 },
                    4: { gems: 1400, packs: 3 },
                    5: { gems: 1600, packs: 4 },
                    6: { gems: 1800, packs: 5 },
                    7: { gems: 2200, packs: 6 }
                },
                maxWins: 7,
                maxLosses: 3
            },
            traditional: {
                name: "Traditional Draft",
                cost: 1500,
                currency: "gems",
                rewards: {
                    0: { gems: 0, packs: 1 },
                    1: { gems: 1000, packs: 1 },
                    2: { gems: 1700, packs: 4 },
                    3: { gems: 2500, packs: 6 }
                },
                maxWins: 3,
                maxLosses: 1
            },
            quick: {
                name: "Quick Draft",
                cost: 750,
                currency: "gems",
                rewards: {
                    0: { gems: 50, packs: 1.2 },
                    1: { gems: 100, packs: 1.22 },
                    2: { gems: 200, packs: 1.24 },
                    3: { gems: 300, packs: 1.26 },
                    4: { gems: 450, packs: 1.3 },
                    5: { gems: 650, packs: 1.35 },
                    6: { gems: 850, packs: 1.4 },
                    7: { gems: 950, packs: 2 }
                },
                maxWins: 7,
                maxLosses: 3
            },
            sealed: {
                name: "Sealed",
                cost: 2000,
                currency: "gems",
                rewards: {
                    0: { gems: 200, packs: 3 },
                    1: { gems: 400, packs: 3 },
                    2: { gems: 600, packs: 3 },
                    3: { gems: 1200, packs: 3 },
                    4: { gems: 1400, packs: 4 },
                    5: { gems: 1600, packs: 5 },
                    6: { gems: 1800, packs: 6 },
                    7: { gems: 2200, packs: 6 }
                },
                maxWins: 7,
                maxLosses: 3
            },
            direct6wins: {
                name: "Arena Direct (6 wins = Play Booster Box(x2))",
                cost: 6000,
                currency: "gems",
                rewards: {
                    0: { gems: 0, packs: 0 },
                    1: { gems: 0, packs: 0 },
                    2: { gems: 0, packs: 0 },
                    3: { gems: 3600, packs: 8 },
                    4: { gems: 7200, packs: 16 },
                    5: { gems: 10800, packs: 24 },
                    6: { gems: 40000, packs: 32 },
                },
                maxWins: 6,
                maxLosses: 2,
                format: "Best-of-One"
            },
            direct7wins: {
                name: "Arena Direct (7 wins = Collector Box)",
                cost: 6000,
                currency: "gems",
                rewards: {
                    0: { gems: 0, packs: 0 },
                    1: { gems: 0, packs: 0 },
                    2: { gems: 0, packs: 0 },
                    3: { gems: 3600, packs: 8 },
                    4: { gems: 7200, packs: 16 },
                    5: { gems: 10800, packs: 24 },
                    6: { gems: 14400, packs: 32 },
                    7: { gems: 80000, packs: 0 }
                },
                maxWins: 7,
                maxLosses: 3,
                format: "Best-of-One"
            }
        };

// DOM elements
const eventSelect = document.getElementById('event-select');
const packValueInput = document.getElementById('pack-value');
const gemsGoldRatioInput = document.getElementById('gems-gold-ratio');
const winrateSlider = document.getElementById('winrate-slider');
const winrateDisplay = document.getElementById('winrate-display');
const evValue = document.getElementById('ev-value');
const eventDetails = document.getElementById('event-details');
const entryCost = document.getElementById('entry-cost');
const expectedGems = document.getElementById('expected-gems');
const expectedPacks = document.getElementById('expected-packs');
const packValueDisplay = document.getElementById('pack-value-display');
const totalEv = document.getElementById('total-ev');

// Chart setup
const ctx = document.getElementById('ev-chart').getContext('2d');
let chart;

// Calculate binomial probability
function binomialProbability(n, k, p) {
    function factorial(num) {
        if (num <= 1) return 1;
        return num * factorial(num - 1);
    }
    
    function combination(n, k) {
        return factorial(n) / (factorial(k) * factorial(n - k));
    }
    
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Calculate match outcome probabilities
function calculateOutcomeProbabilities(winRate, event) {
    const p = winRate / 100;
    const maxWins = event.maxWins;
    const maxLosses = event.maxLosses;

    const dp = [];
    for (let w = 0; w <= maxWins; w++) {
        dp[w] = new Array(maxLosses + 1).fill(0);
    }
    dp[0][0] = 1;

    // probability for finishing with exactly W wins
    const probabilities = new Array(maxWins + 1).fill(0);

    for (let w = 0; w <= maxWins; w++) {
        for (let l = 0; l <= maxLosses; l++) {
            if (dp[w][l] === 0) continue;
            
            if (w === maxWins || l === maxLosses) {
                probabilities[w] += dp[w][l];
                continue;
            }
            
            dp[w + 1][l] += dp[w][l] * p;
            dp[w][l + 1] += dp[w][l] * (1 - p);
        }
    }

    return probabilities.reduce((acc, val, idx) => {
        acc[idx] = val;
        return acc;
    }, {});
}

// Calculate expected value
function calculateEV() {
    const selectedEvent = eventData[eventSelect.value];
    const winRate = parseFloat(winrateSlider.value);
    const packValue = parseFloat(packValueInput.value);
    
    const probabilities = calculateOutcomeProbabilities(winRate, selectedEvent);
    
    let expectedGemsReturn = 0;
    let expectedPacksReturn = 0;
    
    for (let wins = 0; wins <= selectedEvent.maxWins; wins++) {
        const prob = probabilities[wins] || 0;
        const reward = selectedEvent.rewards[wins];
        
        expectedGemsReturn += prob * reward.gems;
        expectedPacksReturn += prob * reward.packs;
    }
    
    const packValueTotal = expectedPacksReturn * packValue;
    const totalReturn = expectedGemsReturn + packValueTotal;
    const ev = totalReturn - selectedEvent.cost;
    
    return {
        ev: ev,
        expectedGems: expectedGemsReturn,
        expectedPacks: expectedPacksReturn,
        packValueTotal: packValueTotal,
        totalReturn: totalReturn,
        probabilities: probabilities
    };
}

// Update display
function updateDisplay() {
    const result = calculateEV();
    const selectedEvent = eventData[eventSelect.value];
    
    // Update winrate display
    winrateDisplay.textContent = parseFloat(winrateSlider.value).toFixed(2) + '%';
    
    // Update EV display
    const evFormatted = (result.ev >= 0 ? '+' : '') + Math.round(result.ev);
    evValue.textContent = evFormatted;
    evValue.className = 'ev-value ' + (result.ev >= 0 ? 'ev-positive' : 'ev-negative');
    
    // Update breakdown
    entryCost.textContent = '-' + selectedEvent.cost;
    expectedGems.textContent = '+' + Math.round(result.expectedGems);
    expectedPacks.textContent = result.expectedPacks.toFixed(2);
    packValueDisplay.textContent = '+' + Math.round(result.packValueTotal);
    totalEv.textContent = evFormatted;
    
    // Update event details
    eventDetails.innerHTML = `
        <strong>${selectedEvent.name}</strong><br>
        Cost: ${selectedEvent.cost} ${selectedEvent.currency}<br>
        Format: Best of ${selectedEvent.maxLosses === 1 ? '3' : '1'}<br>
        Max Wins: ${selectedEvent.maxWins}<br>
        Max Losses: ${selectedEvent.maxLosses}
    `;
    
    updateChart(result);
}

// Update chart
function updateChart(result) {
    const selectedEvent = eventData[eventSelect.value];
    const labels = [];
    const evData = [];
    const probData = [];
    
    for (let wins = 0; wins <= selectedEvent.maxWins; wins++) {
        labels.push(`${wins} Wins`);
        const reward = selectedEvent.rewards[wins];
        const rewardValue = reward.gems + (reward.packs * parseFloat(packValueInput.value));
        const outcomeEV = rewardValue - selectedEvent.cost;
        evData.push(outcomeEV);
        probData.push((result.probabilities[wins] || 0) * 100);
    }
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'EV per Outcome',
                data: evData,
                backgroundColor: evData.map(val => 
                    val >= 0 ? 'rgba(68, 255, 68, 0.7)' : 'rgba(255, 68, 68, 0.7)'
                ),
                borderColor: evData.map(val => 
                    val >= 0 ? 'rgba(68, 255, 68, 1)' : 'rgba(255, 68, 68, 1)'
                ),
                borderWidth: 2,
                yAxisID: 'y'
            }, {
                label: 'Probability (%)',
                data: probData,
                type: 'line',
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 3,
                fill: false,
                yAxisID: 'y1',
                pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Expected Value (Gems)',
                        color: '#ffffff'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: '#ffd700'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    title: {
                        display: true,
                        text: 'Probability (%)',
                        color: '#ffd700'
                    }
                }
            }
        }
    });
}

// Initialize
updateDisplay();

// Event listeners
eventSelect.addEventListener('change', updateDisplay);
packValueInput.addEventListener('input', updateDisplay);
gemsGoldRatioInput.addEventListener('input', updateDisplay);
winrateSlider.addEventListener('input', updateDisplay);

};