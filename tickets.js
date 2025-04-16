// Functions related to ticket rendering and management

// Function to seed mock data
async function seedMockData() {
    if (room.collection('ticket').getList().length === 0) {  
        console.log("Adding mock tickets...");
        for (const ticket of MockTickets) {
            try {
                await room.collection('ticket').create(ticket);
            } catch (error) {
                console.error('Error seeding ticket:', error);
            }
        }
    }
}

// Function to calculate grades for service categories
function calculateGrades() {
    const tickets = room.collection('ticket').getList();
    const activeTickets = tickets.filter(t => !t.resolved);
    
    // Count tickets per category
    const counts = {};
    for (const category in categories) {
        counts[category] = activeTickets.filter(t => t.category === category).length;
    }
    
    // Mock calculation - in a real app you'd have more sophisticated metrics
    const grades = {};
    for (const category in categories) {
        const count = counts[category];
        if (count === 0) grades[category] = 'A+';
        else if (count < 3) grades[category] = 'A';
        else if (count < 5) grades[category] = 'B';
        else if (count < 10) grades[category] = 'C';
        else grades[category] = 'D';
    }
    
    return grades;
}

// Render gauges
function renderGauges() {
    const grades = calculateGrades();
    const container = document.getElementById('gauges');
    container.innerHTML = '';
    
    for (const category in categories) {
        const grade = grades[category];
        
        const gaugeDiv = document.createElement('div');
        gaugeDiv.className = 'gauge-card';
        gaugeDiv.innerHTML = `
            <div class="card gauge-title">
                <span class="color-indicator" style="background: ${categories[category].color}"></span>
                ${categories[category].name}
            </div>
            <div>
                <canvas id="gauge-${category}" width="210" height="140"></canvas>
                Grade: <span class="grade-value">${grade}</span>
            </div>
            <div class="performance">${grade === 'A+' ? 'Outstanding' : grade <= 'B' ? 'Satisfactory' : grade <= 'D' ? 'Poor' : 'Critical'}</div>
        `;
        container.appendChild(gaugeDiv);
        
        // Render gauge chart
        const ctx = document.getElementById(`gauge-${category}`).getContext('2d');
        const value = 100 - (25 * (grade.charCodeAt(0) - 65)); // Convert grade to value
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [value, 100 - value],
                    backgroundColor: [categories[category].color, '#eee'],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '70%',
                rotation: -90,
                circumference: 180,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }
}

// Render tickets
function renderTickets() {
    const tickets = room.collection('ticket').getList();
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Separate active and resolved tickets
    const activeTickets = tickets.filter(t => !t.resolved);
    const resolvedTickets = tickets.filter(t => t.resolved);
    
    // Render active tickets
    const activeList = document.getElementById('ticket-list');
    activeList.innerHTML = '';
    activeTickets.forEach(ticket => {
        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'ticket';
        ticketDiv.innerHTML = `
            <div class="ticket-title">
                <span>${ticket.title}</span>
                <span class="badge" style="background-color: ${categories[ticket.category].color}">
                    ${categories[ticket.category].name}
                </span>
            </div>
            <div>${ticket.description}</div>
            <div style="font-size: 0.8rem; color: #777; margin-top: 0.5rem;">
                Reported by ${ticket.reporter || "Anonymous"} on ${new Date(ticket.created_at).toLocaleString()}
            </div>
            <div class="ticket-actions">
                <button data-id="${ticket.id}" class="resolve-btn">Mark as Resolved</button>
            </div>
        `;
        activeList.appendChild(ticketDiv);
        
        // Add marker to map
        const [lat, lng] = ticket.location.split(',').map(Number);
        const marker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'custom-icon',
                html: `<div style="background-color: ${categories[ticket.category].color}; 
                        width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;
                        display: flex; align-items: center; justify-content: center;
                        color: white; font-weight: bold;">${categories[ticket.category].letter}</div>`
            })
        }).addTo(map)
        .bindPopup(`
            <strong>${ticket.title}</strong><br>
            Category: ${categories[ticket.category].name}<br>
            ${ticket.description}
        `);
        markers.push(marker);
    });
    
    // Render resolved tickets
    const resolvedList = document.getElementById('resolved-list');
    resolvedList.innerHTML = '';
    resolvedTickets.forEach(ticket => {
        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'ticket resolved';
        ticketDiv.innerHTML = `
            <div class="ticket-title">
                <span>${ticket.title}</span>
                <span class="badge" style="background-color: ${categories[ticket.category].color}">
                    ${categories[ticket.category].name}
                </span>
            </div>
            <div>${ticket.description}</div>
            <div style="font-size: 0.8rem; color: #777; margin-top: 0.5rem;">
                Reported by ${ticket.reporter || "Anonymous"}, resolved on ${new Date(ticket.resolved_at).toLocaleString()}
            </div>
        `;
        resolvedList.appendChild(ticketDiv);
    });
    
    // Add event listeners to resolve buttons
    document.querySelectorAll('.resolve-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const ticketId = this.getAttribute('data-id');
            await room.collection('ticket').update(ticketId, {
                resolved: true,
                resolved_at: new Date().toISOString()
            });
        });
    });
}
