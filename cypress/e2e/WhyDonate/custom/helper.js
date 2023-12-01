export function generateDynamicFundraiserName() {
    const adjectives = [
        "Empowering", "Transformative", "Inspirational", "Hopeful", "Life-Changing",
        "Resilient", "Compassionate", "Sustainable", "Inclusive", "Impactful",
        "Innovative", "Positive", "Empathetic", "Caring", "Dedicated",
        "Visionary", "Collaborative", "Motivated", "Diverse", "Philanthropic",
        "Charitable", "Resourceful", "Generous", "Courageous", "Dynamic",
        "Progressive", "Forward-Thinking", "Change-Making", "Supportive", "Educational",
        "Environmental", "Heartfelt", "Outreach", "Community-Led", "Grassroots",
        "Trailblazing", "Resolute", "Inspirited", "Empowering", "Transformative",
        "Inspirational", "Hopeful", "Life-Changing", "Resilient", "Compassionate",
        "Sustainable", "Inclusive", "Impactful", "Innovative", "Positive"
    ];

    const topics = [
        "Clean Water", "Hunger Relief", "Mental Health Support", "Disaster Relief", "Arts and Culture",
        "Children's Education", "Senior Care", "LGBTQ Rights", "Women's Empowerment", "Refugee Aid",
        "Environmental Education", "Medical Research", "Wildlife Conservation", "Sports Programs", "Youth Mentorship",
        "Homelessness Prevention", "Sustainable Agriculture", "Education for All", "STEM Education", "Human Rights Advocacy",
        "Disaster Preparedness", "Clean Energy", "Animal Rescue", "Clean Air Initiatives", "Poverty Alleviation",
        "Cultural Preservation", "Indigenous Rights", "LGBTQ Youth Support", "Community Gardens", "Music Education",
        "Technology Access", "Veterans Support", "Ocean Conservation", "Youth Empowerment", "Arts Therapy",
        "Green Transportation", "Racial Equality", "Accessible Housing", "Refugee Resettlement", "Recycling Programs",
        "Eco-Friendly Initiatives", "Literacy Programs", "Food Security", "Humanitarian Aid", "Elderly Care",
        "Conservation Projects", "Creative Arts", "Community Cleanups", "Disaster Recovery", "STEM for Girls"
    ];

    // Randomly select an adjective and a topic
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // Generate the dynamic fundraiser name
    const fundraiserName = `${randomAdjective} ${randomTopic} ${new Date().getTime()}`;

    return fundraiserName;
}

export function getVideoIdFromUrl(url) {
    const youTubePatterns = [
        /youtube\.com\/watch\?v=([\w-]+)/,
        /youtu\.be\/([\w-]+)/,
        /youtube\.com\/watch\?.*v=([\w-]+)/,
        /youtube-nocookie\.com\/embed\/([\w-]+)/
    ];

    const vimeoPatterns = [
        /vimeo\.com\/(\d+)/,
        /player\.vimeo\.com\/video\/(\d+)/
    ];

    let videoId = null;

    // Check YouTube patterns
    for (const pattern of youTubePatterns) {
        const match = url.match(pattern);
        if (match) {
            videoId = match[1];
            break;
        }
    }

    // Check Vimeo patterns
    if (!videoId) {
        for (const pattern of vimeoPatterns) {
            const vimeoMatch = url.match(pattern);
            if (vimeoMatch) {
                videoId = vimeoMatch[1];
                break;
            }
        }
    }

    return videoId;
}
export const defaultEmail = 'cypress.whydonate@gmail.com'
export const defaultPassword = "Demo@123"
