// Dynamic Petition Counter - Fetches real data from Change.org
function setupPetitionCounter() {
    const counter = document.getElementById('petition-counter');
    const lastUpdated = document.getElementById('last-updated');

    if (!counter || !lastUpdated) return;

    let currentCount = 2220; // Current actual count
    let updateInterval = 60000; // 1 minute
    let lastFetchTime = Date.now();

    // Function to fetch actual petition count
    async function fetchPetitionCount() {
        const petitionUrl = 'https://www.change.org/p/bits-pilani-administration-preserve-bits-pilani-s-0-attendance-policy-reject-mandatory-attendance';

        // Try multiple CORS proxies in case one fails
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://cors-anywhere.herokuapp.com/'
        ];

        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl + encodeURIComponent(petitionUrl), {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    }
                });

                if (!response.ok) continue;

                const html = await response.text();

                // Extract signature count from the HTML using multiple patterns
                const patterns = [
                    /([0-9,]+)\s*(?:supporters?|signatures?|people have signed)/i,
                    /data-signers-count="([0-9,]+)"/i,
                    /"signers_count":([0-9]+)/i,
                    /supporters-count[^>]*>([0-9,]+)/i,
                    /([0-9,]+)\s*people/i
                ];

                for (const pattern of patterns) {
                    const match = html.match(pattern);
                    if (match) {
                        const newCount = parseInt(match[1].replace(/,/g, ''));
                        if (!isNaN(newCount) && newCount > 1000) { // Sanity check
                            console.log(`Fetched count: ${newCount} using proxy: ${proxyUrl}`);
                            return newCount;
                        }
                    }
                }

            } catch (error) {
                console.log(`Proxy ${proxyUrl} failed:`, error.message);
                continue;
            }
        }

        console.log('All proxies failed, using cached value');
        return null; // Return null if all proxies failed
    }

    function updateAllCounters(count) {
        // Get all counter elements
        const allCounters = [
            document.getElementById('petition-counter'),
            document.getElementById('petition-counter-sidebar'),
            document.getElementById('modal-counter'),
            document.getElementById('petition-counter-main')
        ];

        // Update all counters with the same value
        allCounters.forEach(counterElement => {
            if (counterElement) {
                // Add animation effect only to main counter
                if (counterElement === counter) {
                    counterElement.style.transform = 'scale(1.1)';
                    counterElement.style.color = '#c0392b';

                    setTimeout(() => {
                        counterElement.textContent = count.toLocaleString();
                        counterElement.style.transform = 'scale(1)';
                        counterElement.style.color = '#e74c3c';
                    }, 200);
                } else {
                    // Update other counters without animation
                    counterElement.textContent = count.toLocaleString();
                }
            }
        });
    }

    async function updateCounter() {
        const fetchedCount = await fetchPetitionCount();

        if (fetchedCount && fetchedCount !== currentCount) {
            // Real update from petition site
            currentCount = fetchedCount;
            updateAllCounters(currentCount);
            lastFetchTime = Date.now();

            if (lastUpdated) {
                lastUpdated.textContent = 'Live from Change.org';
                lastUpdated.classList.add('live');

                // Remove live indicator after 10 seconds
                setTimeout(() => {
                    lastUpdated.classList.remove('live');
                    lastUpdated.textContent = 'Just updated';
                }, 10000);
            }
        } else {
            // No change or fetch failed, update timestamp only
            const minutesAgo = Math.floor((Date.now() - lastFetchTime) / 60000);
            if (lastUpdated) {
                lastUpdated.classList.remove('live');
                lastUpdated.textContent = minutesAgo === 0 ? 'Just updated' : `${minutesAgo} min ago`;
            }
        }
    }

    // Initial load
    updateAllCounters(currentCount);
    updateCounter();

    // Check for updates every minute
    setInterval(updateCounter, updateInterval);
    
    // Add hover effect to counter
    counter.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.color = '#c0392b';
    });
    
    counter.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.color = '#e74c3c';
    });
}

// Social Sharing Functions
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('BREAKING: BITS Pilani scraps 0% attendance policy! Students feel deceived. Help preserve BITS culture:');
    const hashtags = encodeURIComponent('SaveBITSFreedom,NoToMandatoryAttendance,BITSianCultureMatters');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('BITS Pilani Scraps 0% Attendance Policy - Students Launch Emergency Petition');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
}

function shareOnWhatsApp() {
    const text = encodeURIComponent('BREAKING: BITS Pilani is changing its 0% attendance policy! Students feel deceived. Help preserve BITS culture: ' + window.location.href + ' #SaveBITSFreedom');
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareOnInstagram() {
    // Instagram doesn't support direct URL sharing, so we copy to clipboard
    navigator.clipboard.writeText(window.location.href + '\n\n#SaveBITSFreedom #NoToMandatoryAttendance #BITSianCultureMatters').then(() => {
        alert('Link copied to clipboard! You can now paste it in your Instagram story or post.');
    });
}

function shareOnReddit() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('BITS Pilani Administration Scraps 0% Attendance Policy - Students Feel Deceived');
    window.open(`https://reddit.com/submit?url=${url}&title=${title}`, '_blank');
}

function shareOnTelegram() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('BREAKING: BITS Pilani is changing its 0% attendance policy! Students feel deceived. Help preserve BITS culture:');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
}

function shareViaEmail() {
    const subject = encodeURIComponent('URGENT: Help Save BITS Freedom - Attendance Policy Crisis');
    const body = encodeURIComponent(`Dear Friend,

BITS Pilani is planning to implement a mandatory 50% attendance policy, going against the freedom and independence this institute has always stood for.

This threatens the academic freedom and unique culture that generations of students have cherished. We need your support to preserve the BITSian identity.

Read the full story: ${window.location.href}

Please sign the petition: https://chng.it/fD4NCYZXL9

#SaveBITSFreedom #NoToMandatoryAttendance #BITSianCultureMatters

Thank you for your support!`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

// Smooth Scrolling for Navigation
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight +
                                  document.querySelector('.main-navigation').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;

                // Remove active class from all nav links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active Navigation Highlighting
function setupActiveNavigation() {
    const sections = document.querySelectorAll('.section, #home');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight +
                           document.querySelector('.main-navigation').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Breaking News Animation Control - Removed

// Lazy Loading for Images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Reading Progress Bar
function setupProgressBar() {
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Petition Modal Functions
function showPetitionModal() {
    const modal = document.getElementById('petitionModal');
    const modalCounter = document.getElementById('modal-counter');
    const mainCounter = document.getElementById('petition-counter');

    if (modalCounter && mainCounter) {
        modalCounter.textContent = mainCounter.textContent;
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePetitionModal() {
    const modal = document.getElementById('petitionModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Random Popup System
function setupRandomPopups() {
    const popupMessages = [
        "<strong>Alert:</strong> 50% attendance policy being implemented for 2025 batch",
        "<strong>Breaking:</strong> Professors already hinting about attendance in classes",
        "<strong>Exposed:</strong> Taking worst IIT aspects while charging 3x more",
        "<strong>Urgent:</strong> This will spread to all batches if we don't stop it now",
        "<strong>Hypocrisy:</strong> IIT charges ₹10L/4yrs, BITS charges ₹30L/4yrs",
        "<strong>Cultural change:</strong> 60+ years of freedom being altered",
        "<strong>False promises:</strong> VC praised 0% attendance just months ago",
        "<strong>Preserve BITS culture:</strong> Don't want IIT policies in BITS",
        "<strong>Join the resistance:</strong> 2200+ students already signed",
        "<strong>Act now:</strong> Sign before they implement this policy"
    ];

    let popupShown = false;
    let lastPopupTime = 0;

    function showRandomPopup() {
        const now = Date.now();
        const timeSinceLastPopup = now - lastPopupTime;

        // Show popup only if 30 seconds have passed and user has scrolled
        if (timeSinceLastPopup > 30000 && window.pageYOffset > 500 && !popupShown) {
            const popup = document.getElementById('randomPopup');
            const message = document.getElementById('popupMessage');
            const randomMessage = popupMessages[Math.floor(Math.random() * popupMessages.length)];

            message.innerHTML = randomMessage;
            popup.style.display = 'block';

            // Auto-hide after 5 seconds
            setTimeout(() => {
                closeRandomPopup();
            }, 5000);

            popupShown = true;
            lastPopupTime = now;

            // Reset popup availability after 2 minutes
            setTimeout(() => {
                popupShown = false;
            }, 120000);
        }
    }

    // Check for popup opportunity every 10 seconds
    setInterval(showRandomPopup, 10000);

    // Also trigger on scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(showRandomPopup, 2000);
    });
}

function closeRandomPopup() {
    const popup = document.getElementById('randomPopup');
    popup.style.display = 'none';
}

// Petition Modal Triggers
function setupPetitionTriggers() {
    // Show modal when user has read 50% of content
    let modalTriggered = false;

    window.addEventListener('scroll', function() {
        if (modalTriggered) return;

        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercent > 50) {
            setTimeout(() => {
                showPetitionModal();
                modalTriggered = true;
            }, 2000);
        }
    });

    // Show modal when user tries to leave the page
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !modalTriggered) {
            showPetitionModal();
            modalTriggered = true;
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('petitionModal');
    if (event.target === modal) {
        closePetitionModal();
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupPetitionCounter();
    setupSmoothScrolling();
    setupActiveNavigation();
    setupLazyLoading();
    setupProgressBar();
    setupRandomPopups();
    setupPetitionTriggers();

    // Add some interactive effects
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach(widget => {
        widget.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        });

        widget.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });

    // Add transition effects to widgets
    widgets.forEach(widget => {
        widget.style.transition = 'all 0.3s ease';
    });

    // Add hover effects to section items
    const sectionItems = document.querySelectorAll('.analysis-item, .bitsian-spirit, .learning-philosophy, .demands-box');
    sectionItems.forEach(item => {
        item.style.transition = 'all 0.3s ease';
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
    });
});
