/* Copyright © 2025 https://www.mixviberecords.com
* Compatibility Bridge for ReleasePageConfig.js
* This script ensures both 'releaseMeta' and 'trackInfo' formats are available 
* to guarantee backwards compatibility across all pages and scripts.
*/

// If only releaseMeta is defined, generate the legacy trackInfo format
if (typeof window.trackInfo === 'undefined' && typeof window.releaseMeta !== 'undefined') {
    window.trackInfo = {
        artists: window.releaseMeta.tracks[0].artists,
        sptfyid: "track:" + (window.releaseMeta.tracks[0].sptfytrackid || window.releaseMeta.sptfyalbumid),
        song: window.releaseMeta.tracks[0].song,
        artwork: window.releaseMeta.artwork,
        source: window.releaseMeta.tracks[0].source || window.releaseMeta.source,
        recordLabel: window.releaseMeta.recordLabel,
        musicID: window.releaseMeta.catno || window.releaseMeta.musicID, // Fallback for older references
        catno: window.releaseMeta.catno,
        shorturl: window.releaseMeta.shorturl,
        releaseDate: window.releaseMeta.releaseDate,
        writter: window.releaseMeta.writter,
        producer: window.releaseMeta.tracks[0].producer,
        composer: window.releaseMeta.tracks[0].composer,
        lyricist: window.releaseMeta.tracks[0].lyricist,
        language: window.releaseMeta.language,
        length: window.releaseMeta.tracks[0].length
    };
} 
// If only trackInfo is defined, generate the new releaseMeta format
else if (typeof window.releaseMeta === 'undefined' && typeof window.trackInfo !== 'undefined') {
    window.releaseMeta = {
        tracks: [{
            song: window.trackInfo.song || "",
            artists: window.trackInfo.artists || [],
            sptfytrackid: window.trackInfo.sptfyid ? window.trackInfo.sptfyid.replace("track:", "") : "",
            isrc: "",
            version: "",
            length: window.trackInfo.length || "",
            producer: window.trackInfo.producer || "",
            composer: window.trackInfo.composer || "",
            lyricist: window.trackInfo.lyricist || "",
            source: window.trackInfo.source || ""
        }],
        releasetype: "Single",
        sptfyalbumid: window.trackInfo.sptfyid ? window.trackInfo.sptfyid.replace("track:", "") : "",
        artwork: window.trackInfo.artwork || "",
        source: window.trackInfo.source || "",
        catno: window.trackInfo.musicID || window.trackInfo.catno || "",
        upc: "",
        recordLabel: window.trackInfo.recordLabel || "",
        shorturl: window.trackInfo.shorturl || "",
        releaseDate: window.trackInfo.releaseDate || "",
        writter: window.trackInfo.writter || "",
        language: window.trackInfo.language || "",
        tags: window.trackInfo.tags || ""
    };
}

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

    const formatSpotifyStyle = (arr) => {
        if (arr.length === 1) return arr[0].name;
        if (arr.length === 2) return `${arr[0].name} & ${arr[1].name}`;

        const allButLast = arr.slice(0, -1).map(a => a.name).join(", ");
        const last = arr[arr.length - 1].name;

        return `${allButLast} & ${last}`;
    };

    let output = "";

    // Main artists
    if (main.length) {
        output = formatSpotifyStyle(main);
    }

    // Featured artists
    if (feat.length) {
        output += ` feat. ${formatSpotifyStyle(feat)}`;
    }

    return output;
}

function formatArtistLinks(artists) {
    if (!artists || !artists.length) return "";

    const { main, feat } = splitArtists(artists);

    const link = (a) =>
        `<a href="${a.href}" target="_blank" class="text-gray-300 hover:text-brand-500 transition-colors">${a.name}</a>`;

    const formatSpotifyStyle = (arr) => {
        if (arr.length === 1) return link(arr[0]);
        if (arr.length === 2) return `${link(arr[0])} & ${link(arr[1])}`;

        const allButLast = arr.slice(0, -1).map(link).join(", ");
        const last = link(arr[arr.length - 1]);

        return `${allButLast} & ${last}`;
    };

    let output = "";

    // Main artists
    if (main.length) {
        output = formatSpotifyStyle(main);
    }

    // Featured artists
    if (feat.length) {
        output += ` feat. ${formatSpotifyStyle(feat)}`;
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
    const [day, month, year] = dateStr.split("-");
    const monthName = months[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} ${monthName} ${year}`;
}

function songInfo() {
    const track0 = releaseMeta.tracks[0];
    const artistData = track0.artists;

    // Artists
    $(".trk-aTst-nMe").html(formatArtistLinks(artistData));
    $(".aBm-aTst").html(formatArtistNames(artistData));

    // Audio (AUTO reload)
    setAudioSource(track0.source || releaseMeta.source);

    // Artwork
    $(".aBm-PGbg").css("background-image", `url(${releaseMeta.artwork})`);
    $("#cover-art-img").attr("src", releaseMeta.artwork);
    $(".add-fav-btn").attr("data-coverartimg", releaseMeta.artwork);

    // Metadata
    $(".aBm-lbL").html(releaseMeta.recordLabel);
    $(".aBm-RDte").html(formatDate(releaseMeta.releaseDate));
    $(".shrturl").html(releaseMeta.shorturl);

    // Update Countdown Date
    $(".countdown").attr("data-date", releaseMeta.releaseDate);
    // Reset countdown visibility in case it was hidden by previous logic
    $(".countdown").removeClass("hidden");
    $("#pFm-bTns").addClass("hidden");
    $("#play-pause-btn").addClass("hidden");

    $("#credits-content").append(`
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Artist(s)</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${formatArtistLinks(artistData)}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Composer(s)</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${track0.composer}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Producer(s)</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${track0.producer}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Lyricist(s)</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${track0.lyricist}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Language</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${releaseMeta.language}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Release Date</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${formatDate(releaseMeta.releaseDate)}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Length</span>
    <span class="text-sm break-words text-gray-400 sm:text-right">${track0.length}</span>
</div>
<div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-2 gap-1">
    <span class="text-gray-400 uppercase text-[10px] font-bold tracking-wider shrink-0">Record Label</span>
    <span class="text-sm break-words text-brand-500 sm:text-right">${releaseMeta.recordLabel === 'Mix Vibe Audion' ? 'Mix Vibe Audion (A Mix Vibe Records Imprint)' : releaseMeta.recordLabel}</span>
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
        <a href="${artist.instagram}" target="_blank" rel="noopener" class="group flex items-center justify-between bg-[radial-gradient(circle_at_top,rgba(201,244,80,0.05),rgba(255,255,255,0.02))] backdrop-blur-md border border-white/5 px-3 md:px-4 py-3 rounded-lg shadow-md neon-card hover:bg-white/5 transition-all">
            <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-brand-500 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-icon lucide-circle-user"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
                <span class="font-medium text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">
                    ${artist.name}
                </span>
            </div>

            <div class="text-gray-400 group-hover:text-brand-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path><path d="m21 3-9 9" class="s-1"></path><path d="M15 3h6v6" class="s-1"></path></svg>
            </div>
        </a>
    `).join("");
}

var countdowns, releaseContent;
function initializeCountdowns() {
    countdowns = getElements(".countdown");
    releaseContent = getElement("#pFm-bTns");

    if (countdowns.length === 0) {
        releaseContent.classList.remove("hidden");
        const playBtn = getElement("#play-pause-btn");
        if (playBtn) playBtn.classList.remove("hidden");
        return;
    }

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
  <span class="mx-4 text-gray-500 text-sm font-medium">SUPPORT ARTISTS</span>
  <div class="flex-grow border-t border-white/5"></div>
</div>

<div class="flex flex-row flex-wrap justify-center gap-4 mt-4">
    <div class="w-full max-w-md p-4 space-y-4">
        ${renderArtistsInstagram(releaseMeta.tracks[0].artists)}
        <div class="flex items-center w-full mt-6">
            <div class="flex-grow border-t border-white/5"></div>
            <span class="mx-4 text-gray-500 text-sm font-medium">LABEL</span>
            <div class="flex-grow border-t border-white/5"></div>
        </div>
        <div class="flex flex-row flex-wrap justify-center gap-4 mt-4">
            <a href="https://www.youtube.com/MixVibeRec?sub_confirmation=1" target="_blank" rel="noopener" class="px-4 py-1.5 text-sm font-medium text-red-500 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full hover:bg-red-500 hover:text-black transition flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg> MVR <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg> Subscribe
            </a>
            <a href="https://www.youtube.com/@MixVibeAudion?sub_confirmation=1" target="_blank" rel="noopener" class="px-4 py-1.5 text-sm font-medium text-red-500 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full hover:bg-red-500 hover:text-black transition flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg> MVA <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg> Subscribe
            </a>
             <a href="https://open.spotify.com/user/9swsq4eb9bfrmh7w9h6jgadpo/playlists" target="_blank" rel="noopener"
                class="px-4 py-1.5 text-sm font-medium text-green-500 bg-green-500/10 backdrop-blur-md border border-green-500/10 rounded-full hover:bg-green-500 hover:text-black transition flex items-center justify-center">
                <i class="fab fa-spotify mr-2"></i> Playlists
            </a>
        </div>
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
                if (releaseContent) releaseContent.classList.remove("hidden");
                const playBtn = document.getElementById("play-pause-btn");
                if (playBtn) playBtn.classList.remove("hidden");
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
            console.log(countdowns);
            element.classList.add("hidden");
            if (releaseContent) releaseContent.classList.remove("hidden");
            const playBtn = document.getElementById("play-pause-btn");
            if (playBtn) playBtn.classList.remove("hidden");
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


