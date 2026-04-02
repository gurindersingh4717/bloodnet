const donors = [
  { name: "Arjun Singh", group: "O-", city: "Amritsar", distance: "2.1 km", lastDonation: "18 days ago", status: "Available", note: "Verified donor, can travel nearby." },
  { name: "Simran Kaur", group: "A+", city: "Ludhiana", distance: "4.8 km", lastDonation: "42 days ago", status: "Available", note: "Active donor and hospital-ready." },
  { name: "Karan Bedi", group: "B+", city: "Jalandhar", distance: "1.4 km", lastDonation: "9 days ago", status: "Busy", note: "Resting after recent donation." },
  { name: "Ritika Sharma", group: "AB+", city: "Patiala", distance: "3.6 km", lastDonation: "60 days ago", status: "Available", note: "Prefers emergency calls only." },
  { name: "Harpreet Gill", group: "O+", city: "Bathinda", distance: "5.2 km", lastDonation: "27 days ago", status: "Available", note: "Ready to support local blood bank." },
  { name: "Naveen Verma", group: "A-", city: "Mohali", distance: "6.3 km", lastDonation: "75 days ago", status: "Busy", note: "Currently unavailable." },
  { name: "Amanpreet Kaur", group: "AB-", city: "Chandigarh", distance: "3.1 km", lastDonation: "33 days ago", status: "Available", note: "Verified and willing to help." },
  { name: "Deepak Joshi", group: "O-", city: "Sirhind", distance: "8.1 km", lastDonation: "90 days ago", status: "Available", note: "Universal donor profile." }
];

const donorList = document.getElementById("donorList");
const searchInput = document.getElementById("searchInput");
const cityInput = document.getElementById("cityInput");
const bloodButtons = document.getElementById("bloodButtons");
const searchBtn = document.getElementById("searchBtn");
const toast = document.getElementById("toast");

const requestForm = document.getElementById("requestForm");
const donorForm = document.getElementById("donorForm");

const starsWrap = document.getElementById("stars");

let activeGroup = "All";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function createStarField() {
  const count = 80;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.opacity = Math.random() * 0.8 + 0.2;
    star.style.transform = `scale(${Math.random() * 1.3 + 0.5})`;
    starsWrap.appendChild(star);
  }
}

function donorCardTemplate(donor) {
  const statusClass = donor.status === "Available" ? "green" : "gray";
  return `
    <div class="donor-card">
      <div class="donor-top">
        <div>
          <h4>${donor.name}</h4>
          <div class="donor-meta">
            <span class="tag red">${donor.group}</span>
            <span>?? ${donor.city}</span>
            <span>??? ${donor.distance}</span>
          </div>
        </div>
        <span class="tag ${statusClass}">${donor.status}</span>
      </div>

      <div class="donor-meta" style="margin-top:12px;">
        <span>?? Last donation: ${donor.lastDonation}</span>
      </div>

      <p style="margin-top:12px; color: rgba(245,247,255,0.72); line-height:1.6; font-size:14px;">
        ${donor.note}
      </p>

      <div class="donor-actions">
        <button class="small-btn call" data-action="call" data-name="${donor.name}">Call</button>
        <button class="small-btn msg" data-action="msg" data-name="${donor.name}">Message</button>
        <button class="small-btn" data-action="save" data-name="${donor.name}">Save</button>
      </div>
    </div>
  `;
}

function renderDonors(list) {
  donorList.innerHTML = list.map(donorCardTemplate).join("");
  bindDonorButtons();
}

function bindDonorButtons() {
  donorList.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const action = btn.dataset.action;
      if (action === "call") showToast(`Calling ${name}...`);
      if (action === "msg") showToast(`Message sent to ${name}.`);
      if (action === "save") showToast(`${name} saved to shortlist.`);
    });
  });
}

function filterDonors() {
  const blood = searchInput.value.trim().toUpperCase();
  const city = cityInput.value.trim().toLowerCase();

  const filtered = donors.filter((donor) => {
    const bloodMatch = !blood || donor.group.includes(blood) || blood === "ALL";
    const cityMatch = !city || donor.city.toLowerCase().includes(city);
    const groupMatch = activeGroup === "All" || donor.group === activeGroup;
    return bloodMatch && cityMatch && groupMatch;
  });

  renderDonors(filtered.length ? filtered : []);
  if (!filtered.length) {
    donorList.innerHTML = `
      <div class="donor-card">
        <h4>No donors found</h4>
        <p style="margin-top:10px; color: rgba(245,247,255,0.72); line-height:1.6;">
          Try another blood group or city name.
        </p>
      </div>
    `;
  }

  showToast(`Search updated: ${filtered.length} donor(s) found`);
}

bloodButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".blood-btn");
  if (!btn) return;

  document.querySelectorAll(".blood-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeGroup = btn.dataset.group;
  filterDonors();
});

searchBtn.addEventListener("click", filterDonors);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") filterDonors();
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") filterDonors();
});

requestForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const patientName = document.getElementById("patientName").value.trim();
  const bloodGroup = document.getElementById("bloodGroup").value;
  showToast(`Emergency request sent for ${patientName} (${bloodGroup})`);
  requestForm.reset();
});

donorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const donorName = document.getElementById("donorName").value.trim();
  const donorCity = document.getElementById("donorCity").value.trim();
  const donorBlood = document.getElementById("donorBlood").value;
  const donorPhone = document.getElementById("donorPhone").value.trim();
  const lastDonation = document.getElementById("lastDonation").value.trim() || "Not mentioned";
  const availableStatus = document.getElementById("availableStatus").value;
  const donorNote = document.getElementById("donorNote").value.trim() || "New donor added from registration form.";

  donors.unshift({
    name: donorName,
    group: donorBlood,
    city: donorCity,
    distance: "Nearby",
    lastDonation,
    status: availableStatus,
    note: `${donorNote} • Contact: ${donorPhone}`
  });

  renderDonors(donors);
  donorForm.reset();
  showToast(`${donorName} added successfully`);
});

createStarField();
renderDonors(donors);

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  document.querySelectorAll(".bg-orb, .ripple").forEach((el, index) => {
    const speed = 0.02 + index * 0.01;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});