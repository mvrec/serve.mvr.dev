/* 
| © Copyright 2025 https://artists.mixviberecords.com
| Author: Mix Vibe Records
| Version: 1.0.0.0
| Licensed Code With No Open Source Code
| Modern JS Upgrade
| MVR Developers
*/

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ===== UTILITY FUNCTIONS =====
  const $ = (selector, context = document) => (context ? context.querySelector(selector) : null);
  const $$ = (selector, context = document) => (context ? Array.from(context.querySelectorAll(selector)) : []);

  // Fade in/out helper
  function fadeToggle(element, show = true, duration = 300) {
    if (!element) return;
    if (show) {
      element.classList.remove("hidden");
      element.style.opacity = 0;
      element.offsetHeight; // force reflow
      element.style.transition = `opacity ${duration}ms`;
      element.style.opacity = 1;
    } else {
      element.style.transition = `opacity ${duration}ms`;
      element.style.opacity = 0;
      setTimeout(() => element.classList.add("hidden"), duration);
    }
  }

  // ===== PROFILE TAB SWITCHING =====
  const tabButtonsContainer = $("#profile__tabs");
  const tabContentsContainer = $("#tab-content") || document.getElementById("tab-contents");

  function showTab(tabId) {
    const allTabs = $$(".tab-content", tabContentsContainer);
    const allButtons = $$(".tab-button", tabButtonsContainer);
    const targetTab = $(`#content-${tabId}`, tabContentsContainer);
    const targetButton = $(`#tab-${tabId}`, tabButtonsContainer);

    if (!targetTab || !targetButton) return;

    allButtons.forEach((btn) => btn.classList.remove("active"));
    targetButton.classList.add("active");
    allTabs.forEach((tab) => fadeToggle(tab, false));
    setTimeout(() => fadeToggle(targetTab, true), 300);
  }

  $$(".tab-button", tabButtonsContainer).forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.id.replace("tab-", "");
      showTab(tabId);
    });
  });

  showTab("bio");

  // ===== Verified Toggle =====
  const vToggle = $("#v-toggle");
  if (vToggle) {
    vToggle.addEventListener("click", () => {
      showToast("Verified By Mix Vibe Records");
    });
  }

  // ===== PROFILE BACKGROUND IMAGE =====
  const pfImg = $(".profile-img");
  const target = $(".header-bg");
  if (pfImg && target) {
    target.style.background = `url('${pfImg.src}')`;
  }

  // ===== NON-CLAIMED PROFILE HANDLER =====
  function checkClaimed() {
    const pBody = $("#postBody");
    const vTogle = $("#v-toggle");
    const nickname = $(".artist__nickname");
    const headCover = $(".header-bg");
    const profileEle = $("#profile-dp");
    if (pBody && !pBody.classList.contains("verified-profile")) {
      const promo = $("#NonClaimPromo");
      if (promo) promo.style.display = "block";
      if (nickname) nickname.textContent = "NOT CLAIMED";

      [".artist_rmve", ".artist__code", ".artist__sinfo", ".artist__link"].forEach((sel) => {
        $$(sel).forEach((el) => el.remove());
      });

      if (headCover)
        headCover.style.background = "url(https://cdn.jsdelivr.net/gh/mvrec/serve.artists.dev@master/assets/img/mix_vibe_artists_share.webp)";
    } else {
      if (vTogle) vTogle.classList.remove("hidden");
      if (profileEle)
        profileEle.insertAdjacentHTML(
          "beforeend",
          `<div class="verified absolute bottom-2 right-2 p-1 rounded-full shadow-lg"><img alt="Verified Badge" class="w-7 h-7" src="https://cdn.jsdelivr.net/gh/mvrec/files.mvr.dev@master/img/svg/vfyd.svg"></div>`
        );
    }
  }
  checkClaimed();

  // ===== YOUTUBE Video TAB =====
  async function youTubeVideosTab() {
    const playChlSpan = $("span[data-yt-channel]");
    if (!playChlSpan) return;

    const playChlId = playChlSpan.getAttribute("data-yt-channel");
    if (!playChlId) return;

    const tabChlVideos = document.createElement("div");
    tabChlVideos.id = "content-yt-videos";
    tabChlVideos.className = "tab-content hidden";
    tabChlVideos.innerHTML = `
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-base! font-NPM">YouTube Videos</h2>
        <div class="flex items-center space-x-4">
          <a href="https://www.youtube.com/channel/${playChlId}?sub_confirmation=1" target="_blank" class="text-brand-500 hover:text-lime-300 text-sm">View All</a>
        </div>
      </div>
      <div id="yTvideos" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 yT-container"></div>
    `;
    tabContentsContainer.appendChild(tabChlVideos);

    const btn = document.createElement("button");
    btn.id = "tab-yt-videos";
    btn.className = "tab-button font-NPM pb-2 focus:outline-none";
    btn.textContent = "YT VIDEOS";
    btn.addEventListener("click", () => showTab("yt-videos"));
    tabButtonsContainer.appendChild(btn);

    const container = $("#yTvideos");

    // ===== Helpers =====
    function getYouTubeVideoId(url) {
      try {
        const u = new URL(url);

        if (u.pathname.startsWith("/shorts/")) {
          return u.pathname.split("/shorts/")[1].split("?")[0];
        }

        if (u.searchParams.get("v")) {
          return u.searchParams.get("v");
        }

        if (u.hostname === "youtu.be") {
          return u.pathname.slice(1);
        }
      } catch (e) {
        return null;
      }
      return null;
    }

    const checkThumbnail = (videoId) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve(
            img.width <= 120 ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          );
        img.onerror = () => resolve(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        setTimeout(() => resolve(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`), 2000);
      });

    // ===== Fetch Channel Feed =====
    try {
      const feedURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${playChlId}`
      )}`;

      const response = await fetch(feedURL);
      const data = await response.json();
      if (!data.items) return;

      for (const item of data.items) {
        const isShort = item.link.includes("/shorts/");
        const videoId = getYouTubeVideoId(item.link);
        if (!videoId) continue;
        const pubDate = new Date(item.pubDate);

        const day = ("0" + pubDate.getDate()).slice(-2);
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = monthNames[pubDate.getMonth()];

        const aspectClass = isShort ? "aspect-[9/16]" : "aspect-video";

        const a = document.createElement("a");
        a.href = `https://youtube.com/watch?v=${videoId}`;
        a.target = "_blank";
        a.className = "video-item group";

        a.innerHTML = `
        <div class="w-full ${aspectClass} rounded-lg overflow-hidden relative shadow-xl mb-3 bg-neutral-800 flex items-center justify-center">
          <img class="plyst-thumb w-full h-full object-cover object-center transition duration-300 group-hover:opacity-80" src="" alt="Thumbnail">
          ${
            isShort
              ? `<span class="absolute top-2 left-2 bg-red-600/90 text-white text-sm font-medium px-2 py-0.5 rounded">SHORTS</span><svg class="absolute w-10 h-10 text-brand-500 opacity-80 group-hover:opacity-100 transition duration-300" viewBox="0 0 98.94 122.88" style="enable-background:new 0 0 98.94 122.88">
	<path d="M63.49 2.71c11.59-6.04 25.94-1.64 32.04 9.83 6.1 11.47 1.65 25.66-9.94 31.7l-9.53 5.01c8.21.3 16.04 4.81 20.14 12.52 6.1 11.47 1.66 25.66-9.94 31.7l-50.82 26.7c-11.59 6.04-25.94 1.64-32.04-9.83-6.1-11.47-1.65-25.66 9.94-31.7l9.53-5.01c-8.21-.3-16.04-4.81-20.14-12.52-6.1-11.47-1.65-25.66 9.94-31.7l50.82-26.7zM36.06 42.53l30.76 18.99-30.76 18.9V42.53z" fill="#f40407"></path>
	<path d="M36.06,42.53 V 80.42 L 66.82,61.52Z" fill="#fff"></path>
</svg>` : `<svg class="absolute w-10 h-10 text-brand-500 opacity-80 group-hover:opacity-100 transition duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" fill="red"></path></svg>`
          }
          
        </div>
        <p class="text-base! font-syne font-medium truncate">${item.title}</p>
        <p class="text-sm text-gray-400 truncate">${day} ${month}</p>
      `;

        container.appendChild(a);
        a.querySelector(".plyst-thumb").src = await checkThumbnail(videoId);
      }
    } catch (err) {
      console.error("Error fetching channel videos:", err);
    }
  }
  youTubeVideosTab();

  // ===== YOUTUBE PLAYLIST TAB =====
  async function youTubePlaylistVideosTab() {
    const playlistSpan = $("span[data-yt-playlist]");
    if (!playlistSpan) return;

    const playlistIds = playlistSpan
      .getAttribute("data-yt-playlist")
      .split(",")
      .map((id) => id.trim());
    if (!playlistIds.length) return;

    const tabVideos = document.createElement("div");
    tabVideos.id = "content-ytp-videos";
    tabVideos.className = "tab-content hidden";
    tabVideos.innerHTML = `
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-base! font-NPM">Featured YouTube Playlist${playlistIds.length > 1 ? "'s" : ""}</h2>
        <div class="flex items-center space-x-4">
        </div>
      </div>
      <div id="yTpvideos" class="yTp-container"></div>
    `;
    tabContentsContainer.appendChild(tabVideos);

    const btn = document.createElement("button");
    btn.id = "tab-ytp-videos";
    btn.className = "tab-button font-NPM pb-2 focus:outline-none";
    btn.textContent = "PLAYLIST VIDEOS";
    btn.addEventListener("click", () => showTab("ytp-videos"));
    tabButtonsContainer.appendChild(btn);

    const container = $("#yTpvideos");

    const checkThumbnail = (videoId) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve(
            img.width <= 120 ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          );
        img.onerror = () => resolve(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        setTimeout(() => resolve(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`), 2000);
      });

    for (const playlistId of playlistIds) {
      try {
        const feedURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
          `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
        )}`;
        const response = await fetch(feedURL);
        const data = await response.json();
        if (!data.items || !data.feed) continue;

        const section = document.createElement("div");
        section.className = "bottom border-gray-600 [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-4 [&:not(:first-child)]:mt-4";
        section.innerHTML = `
          <div class="playlist-header mb-3">
            <h2 class="text-sm! font-NPM"><a href="https://youtube.com/playlist?list=${playlistId}" target="_blank">${data.feed.title} <i class="fas fa-external-link-alt"></i></a></h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 playlist-videos"></div>
        `;
        container.appendChild(section);

        const videoRow = $(".playlist-videos", section);

        for (const item of data.items) {
          const videoId = item.link.split("v=")[1];
          const pubDate = new Date(item.pubDate);
          const day = ("0" + pubDate.getDate()).slice(-2);
          const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
          const month = monthNames[pubDate.getMonth()];

          const a = document.createElement("a");
          a.href = `https://youtube.com/watch?v=${videoId}`;
          a.target = "_blank";
          a.className = "video-item";
          a.innerHTML = `
            <div class="w-full aspect-video rounded-lg overflow-hidden relative shadow-xl mb-3 bg-neutral-800 flex items-center justify-center">
              <img class="plyst-thumb w-full h-full object-cover transition duration-300 group-hover:opacity-80" src="" alt="Playlist Thumbnail">
              <svg class="absolute w-10 h-10 text-brand-500 opacity-80 group-hover:opacity-100 transition duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 9v2H8V9h8zm0 4v2H8v-2h8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <p class="text-base! font-syne font-medium truncate">${item.title}</p>
            <p class="text-sm text-gray-400 truncate">${day} ${month}</p>
          `;
          videoRow.appendChild(a);
          a.querySelector(".plyst-thumb").src = await checkThumbnail(videoId);
        }
      } catch (err) {
        console.error("Error fetching playlist:", err);
      }
    }
  }
  youTubePlaylistVideosTab();

  // ===== PICK Spotify =====
  function pinnedStatus() {
    const targetSpan = $("span[data-pin-track], span[data-pin-album]");
    const pImage = $(".profile-img");
    const sptyIframe = $("#data-pin");

    if (targetSpan) {
      let pinId = targetSpan.getAttribute("data-pin-track");
      let embedType = "track";
      if (!pinId) {
        pinId = targetSpan.getAttribute("data-pin-album");
        embedType = "album";
      }
      if (pinId) {
        if (pImage) pImage.classList.add("artist-pick");
        if (sptyIframe) {
          sptyIframe.src = `https://open.spotify.com/embed/${embedType}/${pinId}?theme=0`;
        }
      }
    }
  }
  pinnedStatus();

  // ===== PICK MODAL =====
  const modal = $("#artist-pick-modal");
  const closeBtn = $("#artist-pick-close");

  // PICK OPEN MODAL
  function openArtistPickModal() {
    if (modal) {
      modal.classList.remove("modal-hidden");
      modal.classList.add("modal-visible");
      document.addEventListener("keydown", handleEscKey);
    }
  }

  // PICK CLOSE MODAL
  function closeArtistPickModal() {
    if (modal) {
      modal.classList.remove("modal-visible");
      modal.classList.add("modal-hidden");
      document.removeEventListener("keydown", handleEscKey);
    }
  }

  // PICK Close on ESC key
  function handleEscKey(event) {
    if (event.key === "Escape") {
      closeArtistPickModal();
    }
  }

  // PICK Close on click outside modal content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeArtistPickModal();
    }
  });

  // PICK Close button
  if (closeBtn) {
    closeBtn.addEventListener("click", closeArtistPickModal);
  }

  // PICK When profile is clicked
  const aPk = $(".artist-pick");
  if (aPk) {
    aPk.addEventListener("click", () => {
      openArtistPickModal();
    });
  }
});
