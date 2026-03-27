/* Copyright © 2025 https://www.mixviberecords.com
* Licensed Code With No Open Source Code
* jQuery Code - © 2025 Mix Vibe Records */

// <div class="countdown" data-date="25-10-2024" data-time="23:00"></div>
// Safe DOM selection function
function getElement(selector, parent = document) {
    try {
        return parent.querySelector(selector);
    } catch (e) {
        console.error("Invalid selector:", selector, e);
        return null;
    }
}

// Safe DOM selection for multiple elements
function getElements(selector, parent = document) {
    try {
        return parent.querySelectorAll(selector);
    } catch (e) {
        console.error("Invalid selector:", selector, e);
        return [];
    }
}

function renderArtistsInstagram(artists) {
    return artists.map(artist => `
        <div class="flex items-center justify-between bg-[radial-gradient(circle_at_top,rgba(201,244,80,0.05),rgba(255,255,255,0.02))] backdrop-blur-md border border-white/5 px-3 md:px-4 py-3 rounded-lg shadow-md neon-card">
            <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span class="font-medium text-sm md:text-base text-gray-300">
                    ${artist.name}
                </span>
            </div>

            <a href="${artist.instagram}" target="_blank" rel="noopener"
                class="px-4 py-1.5 text-sm font-medium text-white bg-white/5 backdrop-blur-md border border-white/5 rounded-full hover:bg-brand-500 hover:text-black transition">
                Follow
            </a>
        </div>
    `).join("");
}


// Initialize all countdowns
function initializeCountdowns() {
    const countdowns = getElements(".countdown");

    countdowns.forEach((countdownEl) => {
        // Skip if already initialized
        if (countdownEl.dataset.initialized) return;
        countdownEl.dataset.initialized = "true";

        const title = countdownEl.getAttribute("data-title") || "";

        // Create countdown structure
        countdownEl.innerHTML = `
<h6 class="font-cd text-center text-base md:text-lg font-medium tracking-wider mb-6 text-white animate-pulse">${title}</h6>
 <div class="countdown-container flex flex-row flex-wrap justify-center gap-4 px-4">
    <div class="countdown-unit day flex flex-col items-center bg-[radial-gradient(circle_at_top,rgba(201,244,80,0.15),rgba(255,255,255,0.02))] backdrop-blur-md border border-white/5 px-3 md:px-4 py-3 rounded-lg shadow-md  neon-card">
        <div class="countdown-number text-xl sm:text-3xl font-extrabold text-brand-500 drop-shadow-[0_0_7px_rgba(201,244,1,0.4)]">00</div>
        <div class="countdown-label text-xs sm:text-sm uppercase text-gray-400">days</div>
    </div>
    <div class="countdown-unit hour flex flex-col items-center bg-[radial-gradient(circle_at_top,rgba(201,244,80,0.15),rgba(255,255,255,0.02))] backdrop-blur-md border border-white/5 px-3 md:px-4 py-3 rounded-lg shadow-md neon-card">
        <div class="countdown-number text-xl sm:text-3xl font-extrabold text-brand-500 drop-shadow-[0_0_7px_rgba(201,244,1,0.4)]">00</div>
        <div class="countdown-label text-xs sm:text-sm uppercase text-gray-400">hours</div>
    </div>
    <div class="countdown-unit min flex flex-col items-center bg-[radial-gradient(circle_at_top,rgba(201,244,80,0.15),rgba(255,255,255,0.02))] backdrop-blur-md border border-white/5 px-3 md:px-4 py-3 rounded-lg shadow-md neon-card">
        <div class="countdown-number text-xl sm:text-3xl font-extrabold text-brand-500 drop-shadow-[0_0_7px_rgba(201,244,1,0.4)]">00</div>
        <div class="countdown-label text-xs sm:text-sm uppercase text-gray-400">mins</div>
    </div>
    <div class="countdown-unit sec flex flex-col items-center bg-[radial-gradient(circle_at_top,rgba(201,244,80,0.15),rgba(255,255,255,0.02))] backdrop-blur-md border border-white/5 px-3 md:px-4 py-3 rounded-lg shadow-md neon-card">
        <div class="countdown-number text-xl sm:text-3xl font-extrabold text-brand-500 drop-shadow-[0_0_7px_rgba(201,244,1,0.4)]">00</div>
        <div class="countdown-label text-xs sm:text-sm uppercase text-gray-400">secs</div>
    </div>
 </div>
<!-- Artists -->
<div class="flex items-center w-full mt-6">
  <div class="flex-grow border-t border-white/5"></div>
  <span class="mx-4 text-gray-500 text-sm font-medium">SUPPORT</span>
  <div class="flex-grow border-t border-white/5"></div>
</div>

<div class="flex flex-row flex-wrap justify-center gap-4 mt-4">
    <div class="w-full max-w-md p-4 space-y-4">
        ${renderArtistsInstagram(trackInfo.artists)}
    </div>
</div> `;

        // Get target date/time
        const dateStr = countdownEl.getAttribute("data-date") || "";
        const timeStr = countdownEl.getAttribute("data-time") || "00:00";

        try {
            const [day, month, year] = dateStr.split("-").map(Number);
            const [hours, minutes] = timeStr.split(":").map(Number);

            const targetDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

            // Validate date
            if (isNaN(targetDate.getTime())) {
                throw new Error("Invalid date");
            }

            // Check if countdown should be expired
            if (Date.now() >= targetDate) {
                countdownEl.classList.add("hidden");
                const releaseContent = getElement("#pFm-bTns");
                if (releaseContent) releaseContent.classList.remove("hidden");
                return;
            }

            // Start countdown
            startCountdown(countdownEl, targetDate);
            // Rerender song info
            //  songInfo();
        } catch (e) {
            console.error("Error initializing countdown:", e);
            countdownEl.innerHTML = '<div class="text-danger">Invalid date format</div>';
        }
    });
}

function startCountdown(element, targetDate) {
    function update() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            element.classList.add("hidden");
            const releaseContent = getElement("#pFm-bTns");
            if (releaseContent) releaseContent.classList.remove("hidden");
            return;
        }

        // Calculate time units
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        // Update display
        const pad = (n) => n.toString().padStart(2, "0");
        getElement(".day .countdown-number", element).textContent = pad(days);
        getElement(".hour .countdown-number", element).textContent = pad(hours);
        getElement(".min .countdown-number", element).textContent = pad(mins);
        getElement(".sec .countdown-number", element).textContent = pad(secs);

        requestAnimationFrame(update);
    }

    update();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCountdowns);
} else {
    initializeCountdowns();
}

// jQuery version (optional)
if (typeof jQuery !== "undefined") {
    $(document).ready(function () {
        $(".countdown").each(function () {
            if (!this.dataset.initialized) {
                initializeCountdowns();
            }
        });
    });
}