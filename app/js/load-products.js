/**
 * Product Loader - Loads all 11 products from organisms-v2.json
 * Converts featured cards to standard for "original" version
 */

// All 11 products from organisms-v2.json
const allProducts = [
    {
        id: 1,
        name: "Special Offers",
        type: "featured",
        htmlFeatured: `<div class="ds-card ds-card-featured"><div class="content-card-box"><div class="ds-card__image ds-card__image--featured" style="background: #5d2661;"><h1 class="featured-card-heading">Special Offers</h1></div><div class="card-content"><h2 class="card-title" style="font-weight: 600; font-size: 16px; margin-bottom: 8px;">Special Offers</h2><p class="card-description">Save big with limited time offers, available now for your device</p></div></div></div>`,
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="Special Offers" src="https://marketplace.uds.lenovo.com/media/special_offers_partner.svg"><div class="card-content"><h2 class="card-title">Save big with limited time offers, available now for your device</h2></div></div></div>`
    },
    {
        id: 2,
        name: "Microsoft",
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="Microsoft" src="https://marketplace.uds.lenovo.com/media/microsoft_thumbnail.svg"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Productivity</span></div><h2 class="card-title">Microsoft products are a comprehensive suite of software and services designed to enhance productivity, creativity, and communication.</h2></div></div></div>`
    },
    {
        id: 3,
        name: "McAfee",
        type: "featured",
        htmlFeatured: `<div class="ds-card ds-card-featured"><div class="content-card-box"><div class="ds-card__image ds-card__image--featured" style="background: #c8102e;"><img src="https://marketplace.uds.lenovo.com/media/mcafee_white_logo.svg" alt="McAfee" class="featured-card-logo" style="filter: brightness(0) invert(1); max-width: 160px;"></div><div class="card-content"><h2 class="card-title" style="font-weight: 600; font-size: 16px; margin-bottom: 8px;">McAfee</h2><p class="card-description">Lenovo recommends McAfee - Comprehensive protection for your identity, privacy, devices and life online.</p></div></div></div>`,
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="McAfee" src="https://marketplace.uds.lenovo.com/media/mcafee_partner.svg"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Security</span><span class="ds-chips">Privacy</span></div><h2 class="card-title">Lenovo recommends McAfee - Comprehensive protection for your identity, privacy, devices and life online.</h2></div></div></div>`
    },
    {
        id: 4,
        name: "Dropbox",
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="Dropbox" src="https://marketplace.uds.lenovo.com/media/dropbox_partner_thumbnail.svg"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Storage</span></div><h2 class="card-title">Dropbox brings everything—traditional files, cloud content, and web shortcuts—together in one place.</h2></div></div></div>`
    },
    {
        id: 5,
        name: "Norton",
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="Norton" src="https://marketplace.uds.lenovo.com/media/norton_partner.svg"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Privacy</span><span class="ds-chips">Security</span></div><h2 class="card-title">Cybersecurity solutions that protect against malware, online threats, and identity theft.</h2></div></div></div>`
    },
    {
        id: 6,
        name: "CyberLink",
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="CyberLink" src="https://marketplace.uds.lenovo.com/media/cyberlink_partner.svg"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Video editing</span></div><h2 class="card-title">Award-Winning Video Editing, Photo Editing & Multimedia Software</h2></div></div></div>`
    },
    {
        id: 7,
        name: "Foxit",
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="Foxit" src="https://marketplace.uds.lenovo.com/media/foxit_partner.svg"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Productivity</span></div><h2 class="card-title">Powerful desktop PDF solutions to create and edit PDF documents and integrated with Foxit eSign.</h2></div></div></div>`
    },
    {
        id: 8,
        name: "Absolute Security",
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="Absolute Security" src="https://marketplace.uds.lenovo.com/media/Absolute_Partner_logo.svg"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Anti-Theft</span><span class="ds-chips">Security</span></div><h2 class="card-title">Absolute keeps you connected and in control of your data and device.</h2></div></div></div>`
    },
    {
        id: 9,
        name: "Google Workspace",
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="Google Workspace" src="https://marketplace.uds.lenovo.com/media/google_workspace_partner.png"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Collaboration</span><span class="ds-chips">Startups</span></div><h2 class="card-title">Flexible, helpful business collaboration solutions for all the ways work is changing. Get access to business versions of Google Meet, Chat, Drive, Docs, Sheets, and more.</h2></div></div></div>`
    },
    {
        id: 10,
        name: "Google Play Games",
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="Google Play Games" src="https://marketplace.uds.lenovo.com/media/GooglePlayGames_Partner_thumbnail.svg"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Entertainment</span><span class="ds-chips">Free</span></div><h2 class="card-title">Lenovo recommends Google Play Games. Play mobile and PC games, and get rewards from Google Play Points</h2></div></div></div>`
    },
    {
        id: 11,
        name: "Liner",
        htmlStandard: `<div class="ds-card ds-card-outline"><div class="content-card-box"><img class="ds-card__image" alt="Liner" src="https://marketplace.uds.lenovo.com/media/liner_lenovo_thumbnail.svg"><div class="card-content"><div class="card-category-container"><span class="ds-chips">Productivity</span><span class="ds-chips">Research</span></div><h2 class="card-title">AI search engine for academic research - explore concepts, find academic papers, get citations.</h2></div></div></div>`
    }
];

/**
 * Load products into a container
 * @param {string} containerId - ID of the container element
 * @param {boolean|object} options - Either boolean (useFeatured) or options object
 *   - useFeatured: boolean - Use featured card versions
 *   - addCountdownBadge: boolean - Add countdown badges to featured cards
 */
function loadProducts(containerId, options = false) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }

    // Support legacy boolean parameter or new options object
    const config = typeof options === 'boolean'
        ? { useFeatured: options, addCountdownBadge: false }
        : { useFeatured: false, addCountdownBadge: false, ...options };

    container.innerHTML = ''; // Clear existing content

    allProducts.forEach(product => {
        const div = document.createElement('div');

        // Use featured version if available and requested, otherwise use standard
        let html = config.useFeatured && product.htmlFeatured
            ? product.htmlFeatured
            : product.htmlStandard;

        // Add countdown badge to featured cards if requested
        if (config.addCountdownBadge && config.useFeatured && product.htmlFeatured) {
            // Insert countdown badge into featured cards
            html = html.replace(
                '<div class="ds-card ds-card-featured">',
                '<div class="ds-card ds-card-featured" style="position: relative;"><div class="product-countdown-badge"><div>Ends In</div><div class="badge-time">--:--</div></div>'
            );
        }

        div.innerHTML = html;
        const card = div.firstElementChild;

        // Extract categories from chips and add as data attribute
        const chips = card.querySelectorAll('.ds-chips');
        const categories = Array.from(chips).map(chip => chip.textContent.trim()).join(',');
        if (categories) {
            card.dataset.category = categories;
        }

        container.appendChild(card);
    });

    console.log(`✅ Loaded ${allProducts.length} products into ${containerId} (featured: ${config.useFeatured}, badges: ${config.addCountdownBadge})`);
}

// Export for use in other scripts
window.loadProducts = loadProducts;
window.allProducts = allProducts;
