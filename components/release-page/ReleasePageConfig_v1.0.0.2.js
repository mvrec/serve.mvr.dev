/* Copyright © 2025 https://www.mixviberecords.com
* Licensed Code With No Open Source Code
* jQuery Code - © Mix Vibe Records */

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

function splitArtists(artists) {
    return {
        main: artists.filter((a) => a.tag !== "Feat"),
        feat: artists.filter((a) => a.tag === "Feat"),
    };
}

function formatArtistNames(artists) {
    if (!artists || !artists.length) return "";

    const { main, feat } = splitArtists(artists);
    let output = "";

    // Main artists
    if (main.length === 1) {
        output = main[0].name;
    } else if (main.length === 2) {
        output = `${main[0].name} & ${main[1].name}`;
    } else if (main.length > 2) {
        output =
            `${main[0].name} & ${main[1].name}, ` +
            main
                .slice(2)
                .map((a) => a.name)
                .join(", ");
    }

    // Feat artists
    if (feat.length) {
        output += " feat. " + feat.map((a) => a.name).join(", ");
    }

    return output;
}

function formatArtistLinks(artists) {
    if (!artists || !artists.length) return "";

    const { main, feat } = splitArtists(artists);
    const link = (a) => `<a href="${a.href}" target="_blank" class="text-gray-300 hover:text-brand-500 transition-colors">${a.name}</a>`;
    let output = "";

    // Main artists
    if (main.length === 1) {
        output = link(main[0]);
    } else if (main.length === 2) {
        output = `${link(main[0])} & ${link(main[1])}`;
    } else if (main.length > 2) {
        output = `${link(main[0])} & ${link(main[1])}, ` + main.slice(2).map(link).join(", ");
    }

    // Feat artists
    if (feat.length) {
        output += " feat. " + feat.map(link).join(", ");
    }

    return output;
}

function setAudioSource(url) {
    const audio = document.getElementById("release-audio");
    const source = document.getElementById("release-audio-src");

    // Reset UI state
    audio.pause();
    audio.currentTime = 0;

    // Set new source
    source.src = url;

    // Reload audio
    audio.load();

    // Reset play button UI
    document.getElementById("play-icon").classList.replace("fa-pause", "fa-play");
    document.getElementById("btn-text").textContent = "Preview";
    document.getElementById("progress-bar").style.width = "0%";
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [year, month, day] = dateStr.split("-");
    const monthName = months[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} ${monthName} ${year}`;
}

function songInfo() {
    const artistData = trackInfo.artists;

    // Artists
    $(".trk-aTst-nMe").html(formatArtistLinks(artistData));
    $(".aBm-aTst").html(formatArtistNames(artistData));

    // Audio (AUTO reload)
    setAudioSource(trackInfo.source);

    // Artwork
    $(".aBm-PGbg").css("background-image", `url(${trackInfo.artwork})`);
    $(".coverart").attr("src", trackInfo.artwork);
    $(".add-fav-btn").attr("data-coverartimg", trackInfo.artwork);

    // Metadata
    $(".aBm-lbL").html(trackInfo.recordLabel);
    $(".aBm-RDte").html(formatDate(trackInfo.releaseDate));
    $(".shrturl, #getlink1").val(trackInfo.shorturl);

    // Update Countdown Date
    $(".countdown").attr("data-date", trackInfo.releaseDate);
    // Reset countdown visibility in case it was hidden by previous logic
    $(".countdown").removeClass("hidden");
    $("#pFm-bTns").addClass("hidden");

    $("#credits-content").append(`
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Artist(s)</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${formatArtistLinks(artistData)}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Composer(s)</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${trackInfo.composer}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Producer(s)</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${trackInfo.producer}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Lyricist(s)</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${trackInfo.lyricist}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Language</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${trackInfo.language}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Release Date</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${formatDate(trackInfo.releaseDate)}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Length</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${trackInfo.length}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Record Label</span>
    <span class="text-sm break-words text-brand-500 sm:text-right">${trackInfo.recordLabel}</span>
</div>`);
}

function audioPlayer() {
    const audio = document.getElementById("release-audio");
    const playIcon = document.getElementById("play-icon");
    const btnText = document.getElementById("btn-text");
    const progressBar = document.getElementById("progress-bar");
    const audioprogressBar = document.getElementById("audio-progress-bar");
    const playerContainer = document.getElementById("audio-player-container");

    $("#play-pause-btn").off("click").on("click", toggleAudio);

    function toggleAudio() {
        if (audio.paused) {
            audio.play();
            playIcon.classList.replace("fa-play", "fa-pause");
            btnText.textContent = "Playing";
            playerContainer.classList.add("playing");
        } else {
            audio.pause();
            playIcon.classList.replace("fa-pause", "fa-play");
            btnText.textContent = "Preview";
            playerContainer.classList.remove("playing");
        }
    }

    audio.ontimeupdate = () => {
        if (!audio.duration) return;
        progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
        audioprogressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    };

    audio.onended = () => {
        playIcon.classList.replace("fa-pause", "fa-play");
        btnText.textContent = "Preview";
        playerContainer.classList.remove("playing");
        progressBar.style.width = "0%";

    };
}

songInfo();
audioPlayer();

// Initialize all countdowns
// <div class="countdown" data-date="year-month-day" data-time="23:00"></div>
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
            const [year, month, day] = dateStr.split("-").map(Number);
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

