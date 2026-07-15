const PASSWORD = "matrimonio2027";
const RSVP_FORM_URL = "https://forms.gle/REEMPLAZAR_CON_TU_FORM";

const gifts = [
  { name: "Un cartón de la lotería de Wisconsin 🍀🍀", price: 5.00 },
  { name: "Una cerveza para cada uno 🥂💑", price: 10.00 },
  { name: "2 entradas (student discount!) a la Madison Symphony Orchestra 🎶🎻", price: 30.00 },
  { name: "Pack de quesos de Wisconsin 🥰🔍", price: 50.00 },
  { name: "1 hora de clases de inglés 🙏🕰️", price: 60.00 },
  { name: "Una noche de hospedaje en algún lugar de Europa 🛏️🍷", price: 60.00 },
  { name: "Un libro de Teoría de Juegos 📚💡", price: 70.00 },
  { name: "Un libro de Termodinámica 📚🌌", price: 70.00 },
  { name: "Clases de salsa por un mes 🎷🎶", price: 80.00 },
  { name: "Una cena deliciosa en la Luna de Miel 🍽️", price: 90.00 },
  { name: "Brunch de lujo 🍳🍽️", price: 100.00 },
  { name: "Subir el Empire State en Nueva York 🌆🌃", price: 120.00 },
  { name: "Una noche de hospedaje en Nueva York 🛁🍷", price: 150.00 },
  { name: "Una noche de hospedaje en Vancouver 🛏️🚲", price: 150.00 },
  { name: "Tour por Teotihuacán ⛰️🌿", price: 200.00 },
  { name: "Entradas a un concierto de SOAD en Chicago 🎵🎤", price: 250.00 },
  { name: "Viaje por tierra a Toronto 🚗", price: 300.00 },
  { name: "Pasajes a Vancouver ✈️🚲", price: 400.00 },
  { name: "Pasajes a Nueva York ✈️🍷", price: 500.00 },
  { name: "Viaje por Yosemite National Park ⛰️🌄", price: 600.00 }
];

const authScreen = document.getElementById("auth-screen");
const siteContent = document.getElementById("site-content");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const authError = document.getElementById("auth-error");
const lockAgain = document.getElementById("lock-again");
const giftList = document.getElementById("gift-list");
const totalUsd = document.getElementById("total-usd");

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function unlockSite() {
  document.body.classList.remove("locked");
  authScreen.classList.add("hidden");
  siteContent.classList.remove("hidden");
  localStorage.setItem("wedding_invitation_unlocked", "true");
  window.scrollTo({ top: 0 });
}

function lockSite() {
  document.body.classList.add("locked");
  siteContent.classList.add("hidden");
  authScreen.classList.remove("hidden");
  localStorage.removeItem("wedding_invitation_unlocked");
  passwordInput.value = "";
  passwordInput.focus();
  window.scrollTo({ top: 0 });
}

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (normalize(passwordInput.value) === normalize(PASSWORD)) {
    authError.textContent = "";
    unlockSite();
  } else {
    authError.textContent = "Clave incorrecta. Intenta nuevamente.";
    passwordInput.select();
  }
});

lockAgain.addEventListener("click", lockSite);

if (localStorage.getItem("wedding_invitation_unlocked") === "true") {
  unlockSite();
}

document.querySelectorAll('a[href="https://forms.gle/REEMPLAZAR_CON_TU_FORM"]').forEach((link) => {
  link.href = RSVP_FORM_URL;
});

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value) + " USD";
}

function renderGifts() {
  giftList.innerHTML = "";
  gifts.forEach((gift, index) => {
    const row = document.createElement("article");
    row.className = "gift-row";
    row.innerHTML = `
      <div class="gift-name">${gift.name}</div>
      <div class="qty-control" aria-label="Cantidad para ${gift.name}">
        <button type="button" class="qty-minus" data-index="${index}" aria-label="Restar">−</button>
        <input type="number" min="0" step="1" value="0" inputmode="numeric" data-index="${index}" aria-label="Cantidad" />
        <button type="button" class="qty-plus" data-index="${index}" aria-label="Sumar">+</button>
      </div>
      <div class="gift-price">${money(gift.price)}</div>
    `;
    giftList.appendChild(row);
  });
  updateTotal();
}

function getQuantities() {
  return Array.from(giftList.querySelectorAll("input[type='number']")).map((input) => {
    const value = Number.parseInt(input.value, 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  });
}

function updateTotal() {
  const quantities = getQuantities();
  const total = quantities.reduce((sum, qty, index) => sum + qty * gifts[index].price, 0);
  totalUsd.textContent = money(total);
}

giftList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const index = button.dataset.index;
  const input = giftList.querySelector(`input[data-index="${index}"]`);
  const current = Number.parseInt(input.value, 10) || 0;

  if (button.classList.contains("qty-minus")) {
    input.value = Math.max(0, current - 1);
  }
  if (button.classList.contains("qty-plus")) {
    input.value = current + 1;
  }
  updateTotal();
});

giftList.addEventListener("input", (event) => {
  const input = event.target.closest("input[type='number']");
  if (!input) return;
  const value = Number.parseInt(input.value, 10);
  input.value = Number.isFinite(value) && value > 0 ? value : 0;
  updateTotal();
});

renderGifts();
