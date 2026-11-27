// Shows the newest release, so publishing one on GitHub updates this page with nothing else to do.
// If GitHub can't answer, the download buttons keep pointing at its latest-release page, which always works.
(function () {
  var REPOSITORY = "Mukira56/Cerebra-Releases";
  var INSTALLER = /^Cerebra-Setup-.*-Windows-x64\.exe$/;

  function all(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }
  function fill(selector, text) { all(selector).forEach(function (node) { node.textContent = text; }); }
  function usDate(value) {
    var date = new Date(value);
    return isNaN(date) ? "" : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  fetch("https://api.github.com/repos/" + REPOSITORY + "/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
    .then(function (answer) { if (!answer.ok) throw new Error(String(answer.status)); return answer.json(); })
    .then(function (release) {
      var installer = (release.assets || []).filter(function (asset) { return INSTALLER.test(asset.name); })[0];
      if (!installer) return;
      all("[data-download]").forEach(function (link) { link.href = installer.browser_download_url; });
      fill("[data-version]", "Version " + String(release.tag_name || "").replace(/^v/, ""));
      fill("[data-date]", usDate(release.published_at));
      fill("[data-size]", Math.round(installer.size / 1048576) + " MB");
      if (release.body) {
        fill("[data-notes]", release.body);
        all("[data-notes-box]").forEach(function (node) { node.hidden = false; });
      }
      if (installer.digest) {
        fill("[data-hash]", String(installer.digest).replace(/^sha256:/, ""));
        all("[data-hash-box]").forEach(function (node) { node.hidden = false; });
      }
    })
    .catch(function () { /* the plain links above still work */ });
})();
