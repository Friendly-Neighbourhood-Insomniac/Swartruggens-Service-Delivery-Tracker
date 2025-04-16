// Main application logic and event handlers

// Handle new ticket form submission
document.getElementById('new-ticket-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const reporterName = document.getElementById('reporter-name').value;
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const location = document.getElementById('location').value;
    
    if (!location) {
        alert('Please select a location on the map');
        return;
    }
    
    try {
        await room.collection('ticket').create({
            title,
            category,
            description,
            location,
            resolved: false,
            reporter: reporterName,
            created_at: new Date().toISOString(),
            timestamp: Date.now()
        });
        
        // Reset form
        this.reset();
        if (selectedLocation) {
            map.removeLayer(selectedLocation);
            selectedLocation = null;
        }
        
        // Show active tickets tab
        document.querySelector('.tabs button[data-tab="active"]').click();
    } catch (error) {
        console.error('Error creating ticket:', error);
        alert('Error creating ticket. Please try again.');
    }
});

// Tab switching functionality
document.querySelectorAll('.tabs button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.tabs button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const tabId = this.dataset.tab;
        const contentId = tabId === 'report' ? 'report-form' : `${tabId}-tickets`;
        document.getElementById(contentId).classList.add('active');
    });
});

// Subscribe to ticket changes
room.collection('ticket').subscribe(function(tickets) {
    renderTickets();
    renderGauges();
});

// Initialize app
seedMockData().then(() => { 
    renderGauges();
    renderTickets();
});
