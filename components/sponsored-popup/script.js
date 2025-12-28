var spWrap = document.getElementById("spWrap"),
  spAccept = document.getElementById("spAccept"),
  spErrMes = "Cookie can't be set! Please unblock this site from the cookie setting of your browser.";
if (runSmallPop !== null) {
  if (runSmallPop) {
    spAccept.onclick = () => {
      (document.cookie = "SponsordSmallPop=Accepted; max-age=86400; path=/"), document.cookie ? spWrap.classList.add("a") : alert(spErrMes);
    };
    let spConsent = document.cookie.indexOf("SponsordSmallPop=Accepted");
    if (spConsent != -1) {
      spWrap.classList.remove("v");
    } else {
     setTimeout(function() {
      spWrap.classList.add("v");
    }, 6000);
    }
  }
}
