const API = "https://jsonplaceholder.typicode.com/posts";
const LIMIT = 5;

const fetchBtn = document.getElementById("fetch-btn");
const fetchStatus = document.getElementById("fetch-status");
const feed = document.getElementById("feed");

const postForm = document.getElementById("post-form");
const titleField = document.getElementById("post-title");
const bodyField = document.getElementById("post-body");
const sendBtn = document.getElementById("send-btn");
const sendStatus = document.getElementById("send-status");

function showMessage(target, text, kind) {
    target.textContent = text;
    target.className = kind ? `msg ${kind}` : "msg";
}

function buildCard(item) {
    const card = document.createElement("div");
    card.className = "card";

    const head = document.createElement("div");
    head.className = "card-head";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = item.title;

    const id = document.createElement("span");
    id.className = "card-id";
    id.textContent = `id ${item.id}`;

    head.append(title, id);

    const text = document.createElement("p");
    text.className = "card-text";
    text.textContent = item.body;

    card.append(head, text);
    return card;
}

async function fetchFeed() {
    fetchBtn.disabled = true;
    showMessage(fetchStatus, "Идёт загрузка...");
    feed.textContent = "";

    try {
        const res = await fetch(`${API}?_limit=${LIMIT}`);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const items = await res.json();
        for (const item of items) {
            feed.appendChild(buildCard(item));
        }
        showMessage(fetchStatus, `В ленте записей: ${items.length}`, "ok");
    } catch (err) {
        showMessage(fetchStatus, `Лента недоступна. ${err.message}`, "err");
    } finally {
        fetchBtn.disabled = false;
    }
}

async function sendPost(title, body) {
    sendBtn.disabled = true;
    showMessage(sendStatus, "Публикуем...");

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, userId: 1 }),
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        const created = await res.json();
        showMessage(
            sendStatus,
            `Готово. id ${created.id}, заголовок: ${created.title}`,
            "ok"
        );
        postForm.reset();
    } catch (err) {
        showMessage(sendStatus, `Не удалось опубликовать. ${err.message}`, "err");
    } finally {
        sendBtn.disabled = false;
    }
}

fetchBtn.addEventListener("click", fetchFeed);

postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleField.value.trim();
    const body = bodyField.value.trim();

    if (!title || !body) {
        showMessage(sendStatus, "Заполните заголовок и содержимое", "err");
        return;
    }

    sendPost(title, body);
});
