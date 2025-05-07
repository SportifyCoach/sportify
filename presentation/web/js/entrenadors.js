/*--------------------------------------------------
  UI + API wrapper per al registre d'entrenadors
--------------------------------------------------*/
const API_BASE = '/api/entrenadors';   // endpoint que crearem a la tasca 2
const form     = document.getElementById('frmEntrenador');
const msg      = document.getElementById('msg');

if (form) form.addEventListener('submit', handleSubmit);

async function handleSubmit(ev) {
  ev.preventDefault();
  msg.textContent = '';

  const data = Object.fromEntries(new FormData(form));

  try {
    const res = await fetch(API_BASE, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(data),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(error || 'Error inesperat');
    }

    msg.style.color = 'green';
    msg.textContent = 'Sol·licitud enviada! L’administrador la revisarà.';
    form.reset();
  } catch (e) {
    msg.style.color = 'red';
    msg.textContent = e.message;
  }
}
