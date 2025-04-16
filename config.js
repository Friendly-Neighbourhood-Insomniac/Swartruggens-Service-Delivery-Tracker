// Configuration and constants
const room = new WebsimSocket();

// Categories configuration
const categories = {
    electricity: { name: 'Electricity', color: '#f39c12', letter: 'B' },
    water: { name: 'Water', color: '#3498db', letter: 'A' },
    roads: { name: 'Roads', color: '#e74c3c', letter: 'C' },
    waste: { name: 'Waste Management', color: '#9b59b6', letter: 'B' },
    health: { name: 'Health Services', color: '#2ecc71', letter: 'A-' },
    other: { name: 'Other', color: '#95a5a6', letter: 'D' }
};

// Random names for mock data
const names = ["John Doe", "", "Zanele M", "Elias", "Mandla", "Kagiso", "Lebo", "Pieter", " ", "Vuyo"];

// Mock tickets data
const MockTickets = [
    {
        title: "Street light outage",
        category: "electricity",
        description: "Three street lights out for past week",
        location: "-25.65183,26.693",
        resolved: false,
        reporter: names[Math.floor(Math.random() * names.length)],
        created_at: new Date(1685553600000).toISOString(),
        timestamp: 1685553600000
    },
    {
        title: "Pothole on Main St",
        category: "roads",
        description: "Large pothole forming at Main Street intersection",
        location: "-25.649,26.694",
        resolved: false,
        reporter: names[Math.floor(Math.random() * names.length)],
        created_at: new Date(1685553600000 + 3600000).toISOString(),
        timestamp: 1685553600000 + 3600000
    },
    {
        title: "Water leak",
        category: "water",
        description: "Constant water leak in front of main square",
        location: "-25.652,26.691",
        resolved: false,
        reporter: names[Math.floor(Math.random() * names.length)],
        created_at: new Date(1685553600000 + 7200000).toISOString(),
        timestamp: 1685553600000 + 7200000
    },
    {
        title: "Uncollected garbage",
        category: "waste",
        description: "Uncollected garbage for weeks",
        location: "-25.653,26.690",
        resolved: false,
        reporter: names[Math.floor(Math.random() * names.length)],
        created_at: new Date(1685553600000 + 10800000).toISOString(),
        timestamp: 1685553600000 + 10800000
    }
];
