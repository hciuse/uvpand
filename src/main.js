const randomUserId = () => {
  return Math.floor(Math.random() * 1000000);
};

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId") || randomUserId();
sessionStorage.setItem("userId", userId);
document.getElementById("user-id").innerText = userId;
document.getElementById("startBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  sessionStorage.setItem("startTime", Date.now().toString());
  window.location.href = "experiment/";
});
