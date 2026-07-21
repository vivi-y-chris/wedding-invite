// Cambia esta clave por la que quieras enviar a tus invitados.
// Esta es una protección simple: la clave queda en el código público de GitHub Pages.
const PASSWORD = "matrimonio2027";

// Cambia este link por tu Google Form real.
const RSVP_FORM_URL = "https://forms.gle/REEMPLAZAR_CON_TU_FORM";

const GIFTS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxvIHU3_uW6cjDtWIwDA2lSuqUg7ggZ_21KIrgBF4iGz7I7vtVYD-WjBuSMBrx4-L10zg/exec";

const giftForm = document.getElementById("gift-form");
const guestName = document.getElementById("guest-name");
const guestMessage = document.getElementById("guest-message");
const giftFormStatus = document.getElementById("gift-form-status");

function getSelectedGifts() {
  const quantities = getQuantities();

  return gifts
    .map((gift, index) => {
      const quantity = quantities[index];
      if (quantity <= 0) return null;

      return {
        name: gift.name,
        quantity: quantity,
        unitPrice: gift.price,
        subtotal: quantity * gift.price
      };
    })
    .filter(Boolean);
}

function getTotalAmount() {
  return getSelectedGifts().reduce((sum, gift) => sum + gift.subtotal, 0);
}

giftForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const selectedGifts = getSelectedGifts();
  const total = getTotalAmount();

  if (selectedGifts.length === 0) {
    giftFormStatus.textContent = "Please select at least one gift.";
    return;
  }

  const payload = {
    name: guestName.value,
    message: guestMessage.value,
    totalUsd: total,
    selectedGifts: selectedGifts
  };

  giftFormStatus.textContent = "Sending...";

  try {
    await fetch(GIFTS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify(payload)
    });

    giftFormStatus.textContent = "Thank you! Your gift selection was sent.";
    giftForm.reset();
  } catch (error) {
    giftFormStatus.textContent = "Something went wrong. Please try again.";
  }
});

const gifts = [
  { name: "A Wisconsin lottery ticket 🍀🍀", price: 5.00 },
  { name: "A beer for each of us 🥂💑", price: 10.00 },
  { name: "A Wisconsin cheese pack 🥰🔍", price: 20.00 },
  { name: "2 tickets (student discount!) to the Madison Symphony Orchestra 🎶🎻", price: 30.00 },
  { name: "1 hour of English lessons 🙏🕰️", price: 40.00 },
  { name: "A one-night stay somewhere in Europe 🛏️🍷", price: 50.00 },
  { name: "A Game Theory book 📚💡", price: 60.10 },
  { name: "A Thermodynamics book 📚🌌", price: 60.00 },
  { name: "One month of salsa lessons 🎷🎶", price: 70.00 },
  { name: "A fancy brunch 🍳🍽️", price: 80.00 },
  { name: "A delicious dinner on our honeymoon 🍽️", price: 90.00 },
  { name: "Tickets to the top of the Empire State Building in New York 🌆🌃", price: 100.00 },
  { name: "A one-night stay in New York 🛁🍷", price: 150.00 },
  { name: "A tour of Teotihuacán ⛰️🌿", price: 200.00 },
  { name: "Tickets to a SOAD concert in Chicago 🎵🎤", price: 250.00 },
  { name: "A road trip to Toronto 🚗", price: 300.00 },
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
    const card = document.createElement("article");
    card.className = "gift-card-item";

    card.innerHTML = `
      <div class="gift-card-top">
        <h3 class="gift-name">${gift.name}</h3>
        <div class="gift-price">${money(gift.price)}</div>
      </div>

      <div class="gift-card-bottom">
        <span class="qty-label">Quantity</span>
        <div class="qty-control" aria-label="Quantity for ${gift.name}">
          <button type="button" class="qty-minus" data-index="${index}" aria-label="Restar">−</button>
          <input type="number" min="0" step="1" value="0" inputmode="numeric" data-index="${index}" aria-label="Quantity" />
          <button type="button" class="qty-plus" data-index="${index}" aria-label="Sumar">+</button>
        </div>
      </div>
    `;

    giftList.appendChild(card);
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
