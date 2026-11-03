const STORE_KEY = "ritmo.data.v1";
const PHOTO_DB = "ritmo.photos.v1";
const PHOTO_STORE = "checkins";
const weekdays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const weekdayNames = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
const defaultWeekdays = {2:[0,3],3:[0,2,4],4:[0,1,3,5],5:[0,1,3,4,5],6:[0,1,2,3,4,5]};
const goals = ["Saúde e bem-estar", "Emagrecimento", "Hipertrofia e força", "Definição e condicionamento", "Resistência física", "Mobilidade e postura"];
const templates = {
  standard: [
    { title: "Corpo todo A", icon: "◒", exercises: [["Agachamento", "3 séries · 8–12 repetições"], ["Supino", "3 séries · 8–12 repetições"], ["Remada", "3 séries · 8–12 repetições"], ["Levantamento romeno", "2 séries · 8–12 repetições"], ["Prancha", "3 séries · 20–40 segundos"]] },
    { title: "Corpo todo B", icon: "⌁", exercises: [["Leg press", "3 séries · 8–12 repetições"], ["Desenvolvimento", "3 séries · 8–12 repetições"], ["Puxada na frente", "3 séries · 8–12 repetições"], ["Elevação pélvica", "3 séries · 8–12 repetições"], ["Caminhada inclinada", "10–15 minutos"]] },
    { title: "Corpo todo C", icon: "◉", exercises: [["Afundo assistido", "2 séries · 8–10 por lado"], ["Supino inclinado", "3 séries · 8–12 repetições"], ["Remada unilateral", "3 séries · 8–12 por lado"], ["Mesa flexora", "3 séries · 10–15 repetições"], ["Dead bug", "3 séries · 8–10 por lado"]] },
    { title: "Parte superior", icon: "↗", exercises: [["Supino", "3 séries · 8–12 repetições"], ["Remada", "3 séries · 8–12 repetições"], ["Desenvolvimento", "2 séries · 8–12 repetições"], ["Puxada na frente", "3 séries · 8–12 repetições"], ["Rosca e tríceps", "2 séries · 10–15 repetições"]] },
    { title: "Parte inferior", icon: "↘", exercises: [["Agachamento", "3 séries · 8–12 repetições"], ["Levantamento romeno", "3 séries · 8–12 repetições"], ["Leg press", "2 séries · 10–15 repetições"], ["Mesa flexora", "3 séries · 10–15 repetições"], ["Panturrilha", "3 séries · 12–15 repetições"]] },
    { title: "Movimento leve", icon: "✳", exercises: [["Caminhada ou bicicleta", "20–30 minutos em ritmo confortável"], ["Circuito leve de corpo todo", "2 voltas, sem pressa"], ["Mobilidade", "5–10 minutos"]] },
  ],
  endurance: [
    { title: "Corpo todo + cardio", icon: "◒", exercises: [["Agachamento goblet", "3 séries · 10–12 repetições"], ["Remada sentada", "3 séries · 10–12 repetições"], ["Supino com halteres", "3 séries · 10–12 repetições"], ["Levantamento romeno leve", "2 séries · 10–12 repetições"], ["Cardio moderado", "12–20 minutos"]] },
    { title: "Cardio + core", icon: "✳", exercises: [["Cardio contínuo moderado", "20–30 minutos"], ["Step-up baixo", "2 séries · 10 por lado"], ["Pallof press", "3 séries · 10 por lado"], ["Dead bug", "3 séries · 8 por lado"], ["Alongamento leve", "5 minutos"]] },
  ],
  mobility: [
    { title: "Mobilidade e core", icon: "⌁", exercises: [["Mobilidade de quadril e torácica", "2 voltas · ritmo confortável"], ["Bird-dog", "3 séries · 8 por lado"], ["Dead bug", "3 séries · 8 por lado"], ["Ponte de glúteos", "3 séries · 12 repetições"], ["Caminhada leve", "10–20 minutos"]] },
    { title: "Força geral leve", icon: "◉", exercises: [["Agachamento até um banco", "2 séries · 8–10 repetições"], ["Remada com elástico", "2 séries · 10–12 repetições"], ["Flexão inclinada", "2 séries · 8–10 repetições"], ["Elevação de panturrilha", "2 séries · 12 repetições"], ["Prancha curta", "3 séries · 15–25 segundos"]] },
  ],
};
let data = loadData();
let pickedPhoto = null;
let toastTimer;

function loadData() {
  try { return { profile: null, partner: null, checkins: [], done: {}, nutrition:{}, ...(JSON.parse(localStorage.getItem(STORE_KEY)) || {}) }; }
  catch { return { profile: null, partner: null, checkins: [], done: {}, nutrition:{} }; }
}
function saveData() { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
function escapeHTML(value = "") { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }
function todayKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`; }
function dayName(date = new Date()) { return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date); }
function shortDate(key) { return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${key}T12:00:00`)).replace(" de ", " "); }
function bmi() { const p = data.profile; return p ? Number(p.weight) / ((Number(p.height) / 100) ** 2) : 0; }
function bmiLabel(value = bmi()) { return value < 18.5 ? "abaixo da faixa de referência" : value < 25 ? "na faixa de referência" : value < 30 ? "acima da faixa de referência" : "bem acima da faixa de referência"; }
function currentCheckin() { return data.checkins.find((item) => item.date === todayKey()); }
function weekDates() {
  const today = new Date(); const day = (today.getDay() + 6) % 7; const monday = new Date(today); monday.setDate(today.getDate() - day);
  return Array.from({ length: 7 }, (_, index) => { const date = new Date(monday); date.setDate(monday.getDate() + index); return date; });
}
function planDays() {
  const p = data.profile || { days: 3, minutes: 60, cardioMinutes: 15, experience: "Iniciante", goal: goals[0] };
  return window.TrainingPlanner.buildWeek(p,data.partner);
}
function sessionsThisWeek() { const dates = new Set(weekDates().map(todayKey)); return data.checkins.filter((item) => dates.has(item.date)).length; }
function nextWorkout() { const week=planDays();const today=(new Date().getDay()+6)%7;for(let offset=0;offset<7;offset++){const item=week[(today+offset)%7];if(!item.rest)return item;}return null; }
function sharedDays(){const requested=data.partner?Math.min(Number(data.profile?.days)||3,Number(data.partner.days)||3):Number(data.profile?.days)||3;if(!data.partner)return requested;const own=data.profile?.daysOfWeek||defaultWeekdays[Number(data.profile?.days)]||defaultWeekdays[3];const other=data.partner.daysOfWeek||defaultWeekdays[Number(data.partner.days)]||defaultWeekdays[3];return Math.min(requested,own.filter(day=>other.includes(day)).length);}
function sharedMinutes(){return data.partner?Math.min(Number(data.profile?.minutes)||60,Number(data.partner.minutes)||60):Number(data.profile?.minutes)||60;}
function streakCount() {
  const dates = new Set(data.checkins.map((item) => item.date)); let streak = 0; const cursor = new Date();
  if (!dates.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (dates.has(todayKey(cursor))) { streak++; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}
function setActiveNav(route) {
  const key = route.split("/")[1] || "inicio";
  document.querySelectorAll("[data-nav]").forEach((item) => item.classList.toggle("active", item.dataset.nav === key || (key === "treino" && item.dataset.nav === "plano")));
}
function render() {
  if (!location.hash) location.hash = "#/inicio";
  const route = location.hash.replace(/^#/, "");
  document.getElementById("avatar-initial").textContent = (data.profile?.name || "R").trim().charAt(0).toUpperCase();
  setActiveNav(route);
  if (route === "/perfil") renderProfile();
  else if (route === "/plano") renderPlan();
  else if (route === "/checkin") renderCheckin();
  else if (route === "/progresso") renderProgress();
  else if (route === "/nutricao") renderNutrition();
  else if (route === "/chat") window.RitmoSocial?.renderChat(document.getElementById("app"));
  else if (route.startsWith("/treino/")) renderWorkout(Number(route.split("/")[2]));
  else renderHome();
  document.getElementById("app").focus({ preventScroll: true });
}
function profileForm(target="profile", edit=false) {
  const p = data[target] || {};
  const options=(items,selected)=>items.map(item=>`<option value="${escapeHTML(item)}" ${String(item)===String(selected)?"selected":""}>${escapeHTML(item)}</option>`).join("");
  const selectedDays=new Set((p.daysOfWeek?.length?p.daysOfWeek:(defaultWeekdays[Number(p.days)||3]||defaultWeekdays[3])).map(Number));
  return `<form id="profile-form" class="card form-card wizard" data-target="${target}">
    <div class="wizard-progress"><span id="wizard-label">CONHECENDO VOCÊ · 1 DE 4</span><div class="progress-track"><span id="wizard-fill" style="width:25%"></span></div></div>
    <section class="profile-step active" data-step="0"><div class="eyebrow">SOBRE VOCÊ</div><h2>Como a gente te chama?</h2><p>Esses dados formam a base do seu plano.</p><div class="form-grid">
      <div class="field full"><label for="name">Seu nome</label><input id="name" name="name" autocomplete="given-name" placeholder="Ex.: Pedro" value="${escapeHTML(p.name||"")}" required maxlength="30"></div>
      <div class="field"><label for="age">Idade</label><input id="age" name="age" type="number" min="13" max="110" placeholder="27" value="${escapeHTML(p.age||"")}" required></div>
      <div class="field"><label for="weight">Peso (kg)</label><input id="weight" name="weight" type="number" min="25" max="350" step="0.1" placeholder="88" value="${escapeHTML(p.weight||"")}" required></div>
      <div class="field"><label for="height">Altura (cm)</label><input id="height" name="height" type="number" min="100" max="230" placeholder="180" value="${escapeHTML(p.height||"")}" required></div>
    </div></section>
    <section class="profile-step" data-step="1"><div class="eyebrow">SEU OBJETIVO E SUA SEMANA</div><h2>O que você quer construir?</h2><p>Escolha o foco e a rotina que vocês conseguem manter juntos.</p><div class="form-grid">
      <div class="field full"><label for="goal">Objetivo principal</label><select id="goal" name="goal">${options(goals,p.goal||"Hipertrofia e força")}</select></div>
      <div class="field"><label for="days">Dias juntos/semana</label><select id="days" name="days">${options([2,3,4,5,6],p.days||3)}</select></div>
      <div class="field"><label for="minutes">Minutos por sessão</label><select id="minutes" name="minutes">${options([30,45,60,75,90],p.minutes||75)}</select></div>
      <div class="field"><label for="cardioMinutes">Cardio diário (min)</label><select id="cardioMinutes" name="cardioMinutes">${options([0,10,15,20,30],p.cardioMinutes??15)}</select></div>
      <div class="field"><label for="targetDate">Data-alvo (opcional)</label><input id="targetDate" name="targetDate" type="date" value="${escapeHTML(p.targetDate||"")}"></div>
      <div class="field full"><label>Quais dias vocês conseguem treinar juntos?</label><div class="weekday-picker">${weekdayNames.map((day,index)=>`<label><input type="checkbox" name="weekdays" value="${index}" ${selectedDays.has(index)?"checked":""}><span>${day}</span></label>`).join("")}</div></div>
    </div><p class="form-note">A data ajuda a planejar revisões; não dá para garantir um resultado físico até um dia específico. Selecione o mesmo calendário nos dois perfis.</p></section>
    <section class="profile-step" data-step="2"><div class="eyebrow">EXPERIÊNCIA E ACESSO</div><h2>O que funciona para você?</h2><p>O plano deve combinar com seu nível e com o lugar onde vocês treinam.</p><div class="form-grid">
      <div class="field full"><label for="experience">Experiência com musculação</label><select id="experience" name="experience">${options(["Iniciante","Intermediário","Avançado"],p.experience||"Iniciante")}</select></div>
      <div class="field full"><label for="equipment">Onde vocês treinam?</label><select id="equipment" name="equipment">${options(["Academia completa","Academia de condomínio","Em casa com equipamentos","Em casa sem equipamentos"],p.equipment||"Academia completa")}</select></div>
      <div class="field full"><label for="likes">Exercícios que você gosta ou quer aprender <span class="soft-label">(opcional)</span></label><textarea id="likes" name="likes" placeholder="Ex.: máquinas, halteres, caminhada">${escapeHTML(p.likes||"")}</textarea></div>
    </div></section>
    <section class="profile-step" data-step="3"><div class="eyebrow">SEGURANÇA E ALIMENTAÇÃO</div><h2>Tem algo que o plano precisa respeitar?</h2><p>Conte sobre limitações. O app não diagnostica nem substitui orientação profissional.</p><div class="form-grid">
      <div class="field full"><label for="injuryArea">Região com lesão ou dor atual</label><select id="injuryArea" name="injuryArea">${options(["Nenhuma","ombro","cotovelo","costas","quadril","joelho","tornozelo"],p.injuryArea||"Nenhuma")}</select></div>
    <div class="field full"><label for="limitations">Observações de contexto <span class="soft-label">(opcional)</span></label><textarea id="limitations" name="limitations" placeholder="Ex.: observação para testar sugestões; movimentos que incomodam">${escapeHTML(p.limitations||"")}</textarea></div>
      <div class="field full"><label for="nutritionGoal">Interesse em alimentação</label><select id="nutritionGoal" name="nutritionGoal">${options(["Quero hábitos gerais","Quero perder gordura","Quero ganhar massa","Quero manter meu peso","Prefiro não incluir agora"],p.nutritionGoal||"Quero hábitos gerais")}</select></div>
      <div class="field full"><label for="foodNotes">Preferências, alergias ou restrições <span class="soft-label">(opcional)</span></label><textarea id="foodNotes" name="foodNotes" placeholder="Ex.: vegetariano, intolerância à lactose">${escapeHTML(p.foodNotes||"")}</textarea></div>
    </div><p class="form-note">Observações livres não pausam exercícios. Uma região marcada tenta orientar a escolha de outra variação; quando não existe alternativa no catálogo, o app mantém o exercício visível para vocês avaliarem. Isso não substitui avaliação profissional. A parte alimentar começa com hábitos gerais, sem dieta clínica. Ao conectar o grupo, vocês dois poderão ver os perfis, inclusive peso e observações.</p></section>
    <div class="wizard-actions"><button class="button button-light wizard-back" type="button" hidden>← Voltar</button><button class="button button-dark wizard-next" type="button">Continuar →</button><button class="button button-dark wizard-submit" type="submit" hidden>${edit?"Salvar respostas":"Montar treino do casal"} →</button></div>
  </form>`;
}
function renderHome() {
  const root = document.getElementById("app");
  if (!data.profile) {
    root.innerHTML = `<div class="eyebrow">SEU ESPAÇO DE MOVIMENTO</div><h1 class="page-title">Um passo de cada vez.</h1><p class="subhead">Organize seus treinos no seu ritmo. Primeiro, vamos montar seu perfil.</p><div class="hero"><div><span class="hero-kicker">BEM-VINDO AO RITMO</span><h1>Consistência também é conquista.</h1><p>Um plano que cabe na sua semana, sem promessas milagrosas.</p></div><a class="button" href="#/perfil">Começar meu perfil <span>→</span></a></div><div class="section-row"><h2>Seu app, do seu jeito</h2></div><div class="card"><div class="workout-info"><strong>Treinos, check-ins e evolução</strong><span>Suas informações ficam salvas localmente neste aparelho.</span></div></div>`;
    return;
  }
  const p = data.profile; const today = currentCheckin(); const next = nextWorkout(); const progress = Math.min(100, Math.round(sessionsThisWeek() / sharedDays() * 100));
  const week = weekDates().map((date) => { const key = todayKey(date); const check = data.checkins.some((item) => item.date === key); const isToday = key === todayKey(); return `<div class="week-day"><span>${new Intl.DateTimeFormat("pt-BR",{weekday:"narrow"}).format(date)}</span><span class="week-dot ${check?"checked":""} ${isToday?"today":""}">${check?"✓":date.getDate()}</span></div>`; }).join("");
  root.innerHTML = `<div class="eyebrow">${escapeHTML(dayName())} · ${new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"long"}).format(new Date())}</div>
    <h1 class="page-title">Oi, ${escapeHTML(p.name)}${data.partner?` e ${escapeHTML(data.partner.name)}`:""}.</h1><p class="subhead">${data.partner?"Um plano para vocês treinarem lado a lado, cada um no seu ritmo.":"Vamos cuidar do seu ritmo hoje?"}</p>
    <div class="hero"><div><span class="hero-kicker">${today ? "VOCÊ JÁ MARCOU PRESENÇA HOJE" : "UM TREINO DE CADA VEZ"}</span><h1>${today ? "Boa! Seu check-in já está no histórico." : "Seu próximo passo está esperando."}</h1><p>${today ? "A consistência se constrói assim." : `${escapeHTML(next?.title || "Treino")}, cerca de ${p.minutes} minutos.`}</p></div><a class="button" href="#/${today ? "checkin" : "checkin"}">${today ? "Ver check-in" : "Fazer check-in"}<span>→</span></a></div>
    <div class="section-row"><h2>Esta semana</h2><a class="text-link" href="#/progresso">Ver progresso →</a></div>
    <div class="card"><div class="week-strip">${week}</div><div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px"><strong>${sessionsThisWeek()} de ${sharedDays()} treinos</strong><span class="soft-label">meta semanal do casal</span></div><div class="progress-track"><span style="width:${progress}%"></span></div></div>
    <div class="stats-grid"><div class="stat-card streak-card"><div><div class="stat-value">${streakCount()} <span style="font-size:17px">dias</span></div><div class="stat-label">sequência de check-ins</div></div><span class="streak-icon">✳</span></div><div class="stat-card"><div class="stat-value">${data.checkins.length}</div><div class="stat-label">treinos registrados</div></div></div>
    <div class="section-row"><h2>Seu plano</h2><a class="text-link" href="#/plano">Semana completa →</a></div>
    <a class="card workout-card" href="#/treino/${next?.index ?? 0}"><span class="workout-symbol">${next?.icon || "◒"}</span><span class="workout-info"><strong>${escapeHTML(next?.title || "Corpo todo")}</strong><span>${sharedDays()} dias por semana · ${sharedMinutes()} min por sessão${data.partner?` · ${escapeHTML(data.partner.name)} junto`:""}</span></span><span class="arrow">›</span></a>
    <div class="goal-card"><span class="goal-icon">✦</span><div><strong>${escapeHTML(p.goal)}</strong><small>Seu objetivo guia seu plano inicial</small></div></div>
    <a class="card workout-card nutrition-link" href="#/nutricao"><span class="workout-symbol">◌</span><span class="workout-info"><strong>Alimentação e hábitos</strong><span>${escapeHTML(p.nutritionGoal||"Orientações gerais")}</span></span><span class="arrow">›</span></a>
    ${groupCard()}`;
}
function groupCard() { return `<a class="group-card group-card-link" href="#/chat"><div class="group-card-head"><strong>Seu espaço a dois</strong><span class="group-tag">CHAT PRIVADO</span></div><p>Combinem treinos, mandem mensagem e compartilhem check-ins depois de conectar as duas contas.</p></a>`; }
function movementGraphic(type="squat") {
  const figures={
    squat:`<g class="pose-one"><circle cx="31" cy="20" r="7"/><path d="M31 28v24m0-17-13 12m13-12 13 12M31 52 20 76m11-24 11 24"/></g><g class="pose-two"><circle cx="81" cy="32" r="7"/><path d="m77 40 8 16m-5-11-13 4m13-4 12 8m-7 3-14 8m14-8 9 13"/></g>`,
    hinge:`<g class="pose-one"><circle cx="31" cy="20" r="7"/><path d="M31 28v24m0-17-13 12m13-12 13 12M31 52 20 76m11-24 11 24"/></g><g class="pose-two"><circle cx="81" cy="28" r="7"/><path d="m76 35 15 12m-11-8-13 9m18-1 14 2m-22-2-8 27m13-26 8 26"/></g>`,
    push:`<path class="bench" d="M16 60h40m-35 0v14m30-14v14"/><g class="pose-one"><circle cx="33" cy="38" r="6"/><path d="M39 42h22m-15 0-8 17m17-17 9 17M50 41l5-17m2 17 2-17m-5-2h8"/></g><g class="pose-two"><circle cx="89" cy="38" r="6"/><path d="M83 42H62m15 0 8 17m-17-17-9 17M73 41l-7-20m-4 0h8m4 20 7-20m-4 0h8"/></g>`,
    pull:`<g class="pose-one"><circle cx="31" cy="24" r="7"/><path d="M31 32v29m0-20-17 6m17-6 17 6m-17 12-10 17m10-17 10 17"/></g><g class="pose-two"><circle cx="83" cy="24" r="7"/><path d="M83 32v29m0-20-10 13m10-13 10 13m-10 7-10 17m10-17 10 17"/></g><path class="cable" d="M14 38h14m72 0H86"/>`,
    curl:`<g class="pose-one"><circle cx="31" cy="20" r="7"/><path d="M31 28v26m0-18-11 20m11-20 10 18m-10 0L22 76m9-22 10 22m-11-32v14"/></g><g class="pose-two"><circle cx="83" cy="20" r="7"/><path d="M83 28v26m0-18-10 18m10-18 11 18m-11 0-9 22m9-22 10 22m-11-32 8-10 7 5"/></g>`,
    raise:`<g class="pose-one"><circle cx="31" cy="20" r="7"/><path d="M31 28v27m0-18-11 18m11-18 11 18m-11 0L22 76m9-21 11 21"/></g><g class="pose-two"><circle cx="83" cy="20" r="7"/><path d="M83 28v27m0-18-16-8m16 8 16-8m-16 26-9 21m9-21 10 21"/></g>`,
    core:`<g class="pose-one"><circle cx="24" cy="46" r="6"/><path d="M30 47h42m-35 0-13 18m48-18 12 18m-12-18 7-16m-49 16-7-16"/></g><g class="pose-two"><circle cx="84" cy="46" r="6"/><path d="M78 47H48m23 0 13 18m-45-18-12 18m12-18-7-16m49 16 7-16"/></g>`,
    calf:`<g class="pose-one"><circle cx="31" cy="18" r="7"/><path d="M31 26v27m0-18-12 12m12-12 12 12m-12 6-9 23m9-23 9 23"/></g><g class="pose-two"><circle cx="83" cy="18" r="7"/><path d="M83 26v27m0-18-12 12m12-12 12 12m-12 6-9 17 5 6m4-23 9 17-5 6"/></g>`,
    open:`<g class="pose-one"><circle cx="31" cy="20" r="7"/><path d="M31 28v27m0-18-12 15m12-15 12 15m-12 3L22 76m9-21 11 21"/></g><g class="pose-two"><circle cx="83" cy="20" r="7"/><path d="M83 28v27m0-18-17-8m17 8 17-8m-17 26-9 21m9-21 10 21"/></g>`,
    walk:`<g class="pose-one"><circle cx="31" cy="20" r="7"/><path d="M31 28v25m0-17-11 12m11-12 11 8m-11 9-12 15m12-15 13 10"/></g><g class="pose-two"><circle cx="83" cy="20" r="7"/><path d="M83 28v25m0-17-11 8m11-8 11 12m-11-12 12-15m-12 15-14 15"/></g>`
  };
  const scene=figures[type]||figures.squat;
  return `<svg class="movement-svg" viewBox="0 0 120 90" role="img" aria-label="Ilustração esquemática em duas fases do movimento"><path class="floor" d="M8 78h104"/>${scene}<path class="motion-arrow" d="M53 34h14m-5-5 5 5-5 5"/></svg>`;
}
function renderPlan() {
  if (!data.profile) { location.hash = "#/perfil"; return; }
  const plan = planDays();
  document.getElementById("app").innerHTML = `<div class="eyebrow">PLANO DO CASAL</div><h1 class="page-title">Uma semana com espaço para recuperar.</h1><p class="subhead">${escapeHTML(data.profile.goal)} · ${data.partner?`${escapeHTML(data.profile.name)} e ${escapeHTML(data.partner.name)}`:"adicione o perfil da sua esposa na área de Chat"} · ${sharedDays()} dias juntos</p><div class="days-list">${plan.map((day)=>day.rest?`<article class="card day-card rest-card"><div class="day-card-head"><strong>${day.weekday} <span>☼</span></strong><span>${day.scheduleWarning?"Ajustem os dias":"Recuperação"}</span></div><div class="exercise-chips">${day.warning?escapeHTML(day.warning):day.cardio?.some(person=>person.minutes>0)?`Cardio leve planejado · ${day.cardio.map(person=>`${escapeHTML(person.name)} ${person.minutes} min`).join(" · ")}`:"Dia sem musculação"}</div>${day.cardio?.some(person=>person.minutes>0)?`<div class="day-card-actions"><span class="soft-label">Recuperar e manter movimento leve</span><a class="small-button" href="#/treino/${day.index}">Ver dia →</a></div>`:""}</article>`:`<article class="card day-card"><div class="day-card-head"><strong>${day.weekday} <span style="font-size:18px;margin-left:5px">${day.icon}</span></strong><span>${day.minutes} min aprox.</span></div><div class="exercise-chips">${day.exercises.slice(0,4).map((item)=>escapeHTML(item.members[0]?.item?.name||item.key)).join(" · ")}</div><div class="day-card-actions"><span class="soft-label">${day.exercises.length} blocos, incluindo cardio</span><a class="small-button" href="#/treino/${day.index}">Ver sessão →</a></div></article>`).join("")}</div><div class="notice">A organização prioriza alternância de grupos e dias de recuperação. O ACSM recomenda que adultos saudáveis trabalhem os principais grupos musculares pelo menos duas vezes por semana; o plano ainda precisa ser individualizado para vocês dois.</div>`;
}
function renderWorkout(index) {
  if (!data.profile) { location.hash = "#/perfil"; return; }
  const plan = planDays(); const day = plan[index]; if (!day) { location.hash = "#/plano"; return; }
  if(day.rest){document.getElementById("app").innerHTML=`<a class="back-link" href="#/plano">← Voltar ao plano</a><div class="detail-hero"><span class="hero-kicker">DIA DE RECUPERAÇÃO</span><h1>${escapeHTML(day.weekday)}</h1><p>Descanso também faz parte da organização da semana.</p></div><div class="card"><strong>Movimento leve opcional</strong><p class="form-note">${(day.cardio||[]).map(person=>`${escapeHTML(person.name)}: caminhada ou bicicleta confortável por ${person.minutes} min`).join("<br>")}</p></div><div class="notice">Se houver dor ou fadiga fora do comum, priorize descanso e procure orientação adequada.</div>`;return;}
  const key = `${todayKey()}-${index}`;
  const checks = day.exercises.map((block,exerciseIndex) => {const participants=block.members.map(member=>member.blocked?`<div class="partner-line"><strong>${escapeHTML(member.name)}</strong><small>Movimento pausado para revisar a limitação informada.</small></div>`:`<div class="partner-line"><strong>${escapeHTML(member.name)} · ${escapeHTML(member.item.name)}</strong><small>${escapeHTML(member.item.detail)}</small></div>`).join("");const first=block.members.find(member=>!member.blocked)?.item;const cue=first?.cue||"Movimente-se apenas numa amplitude confortável.";return `<div class="exercise-card ${data.done[`${key}-${exerciseIndex}`]?"done":""}"><label class="exercise"><span class="exercise-number">${String(exerciseIndex+1).padStart(2,"0")}</span><span class="exercise-main">${participants}</span><input type="checkbox" data-exercise="${exerciseIndex}" ${data.done[`${key}-${exerciseIndex}`]?"checked":""} aria-label="Marcar bloco ${exerciseIndex+1} como concluído"></label>${first?`<details class="exercise-detail"><summary>Ver ilustração e orientação</summary><div class="exercise-demo">${movementGraphic(first.demo)}<p>${escapeHTML(cue)}</p><small>Esquema didático original. Confirme a execução com um profissional.</small></div></details>`:""}</div>`;}).join("");
  const restrictions=day.exercises.some(block=>block.members.some(member=>member.blocked));
  document.getElementById("app").innerHTML = `<a class="back-link" href="#/plano">← Voltar ao plano</a><div class="detail-hero"><span class="hero-kicker">${day.weekday.toUpperCase()} · ${day.minutes} MIN APROX.</span><h1>${escapeHTML(day.title)}</h1><p>${day.exercises.length} blocos · mesma sessão, opções individuais e carga própria</p></div><div class="section-row" style="margin-top:20px"><h2>Sessão juntos</h2><span class="soft-label">Marquem o bloco ao concluir</span></div><div class="exercise-list">${checks}</div>${restrictions?`<div class="notice">A limitação informada ocultou movimentos que carregam essa região para a pessoa indicada. Isso não é uma substituição clínica: confirmem com um profissional quais movimentos são seguros.</div>`:""}<div class="notice">As ilustrações são esquemas educativos. Se um movimento causar dor, parem e procurem orientação. Ajustem cada carga individualmente.</div><a href="#/checkin" class="button button-dark button-block">Registrar treino com foto <span>→</span></a>`;
}
function renderCheckin() {
  if (!data.profile) { location.hash = "#/perfil"; return; }
  const today = currentCheckin(); const root = document.getElementById("app");
  if (today) {
    root.innerHTML = `<div class="eyebrow">${escapeHTML(dayName())} · CHECK-IN FEITO</div><h1 class="page-title">Presença marcada.</h1><p class="subhead">O registro aparece no histórico do casal quando o grupo online está conectado. Um novo fica disponível amanhã.</p><div id="today-checkin" class="checkin-success"><span class="photo-pill">✓ HOJE, ${escapeHTML(today.time)}</span><strong style="display:block;margin-top:10px;font:700 17px Manrope,sans-serif">${escapeHTML(today.activity)}</strong><img id="today-photo" alt="Foto do check-in de hoje" style="display:none"><div class="soft-label">${escapeHTML(today.caption || "Treino feito. Mais um passo na sua semana.")}</div></div><div class="section-row"><h2>Últimos registros</h2></div>${renderHistory()}<div class="shared-history"></div>${groupCard()}`;
    showPhoto(today.id, "today-photo"); appendSharedFeed(root); return;
  }
  const options = planDays().filter(day=>!day.rest).map((day) => `<option>${escapeHTML(day.title)}</option>`).join("");
  const social=window.RitmoSocial?.state;const participants=social?.user&&social?.group?social.profiles.map(profile=>`<label class="participant-option"><input type="checkbox" name="participants" value="${escapeHTML(profile.user_id)}" checked><span>${escapeHTML(profile.display_name||"Atleta")}</span></label>`).join(""):`<span class="soft-label">Conecte as duas contas no Chat para compartilhar o registro.</span>`;
  root.innerHTML = `<div class="eyebrow">MARQUE SUA PRESENÇA</div><h1 class="page-title">Vocês apareceram.</h1><p class="subhead">Guarde o treino e compartilhe com quem estava junto. O horário é registrado automaticamente.</p><div class="checkin-hero"><span class="checkin-hero-icon">✳</span><div><strong>Seu dia começa de novo à meia-noite</strong><span>Um check-in por pessoa por dia · foto privada do casal</span></div></div>
    <form id="checkin-form" class="card form-card"><div class="field"><label for="activity">O que você fez?</label><select id="activity" name="activity">${options}<option>Corrida ou caminhada</option><option>Outro exercício</option></select></div><div class="field"><label for="caption">Uma nota sobre hoje <span class="soft-label">(opcional)</span></label><input id="caption" name="caption" maxlength="100" placeholder="Ex.: treino de pernas com a turma"></div>
    ${social?.group?`<div class="field"><label>Quem treinou?</label><div class="participant-list">${participants}</div></div>`:""}
    <div class="field"><label>Uma foto para registrar o treino</label><label class="photo-picker" id="photo-picker"><input id="photo" name="photo" type="file" accept="image/*" capture="environment" required aria-label="Tirar ou escolher uma foto"><img class="photo-preview" id="photo-preview" alt="Prévia da foto escolhida"><span class="photo-placeholder"><b>＋</b><span><strong>Toque para tirar ou escolher uma foto</strong><br>Privada para vocês quando o grupo estiver conectado</span></span></label></div><p class="form-note">No iPhone, o iOS pode oferecer a câmera ou a biblioteca. Vocês controlam o convite do grupo.</p><button class="button button-dark button-block" type="submit">Fazer check-in <span>→</span></button></form>
    <div class="section-row"><h2>Seu histórico</h2></div>${renderHistory()}<div class="shared-history"></div>${groupCard()}`;
  appendSharedFeed(root);
}
async function appendSharedFeed(root){try{const items=await window.RitmoSocial?.listCheckins(20);if(!items?.length)return;const host=root.querySelector(".shared-history");if(!host)return;const state=window.RitmoSocial.state;const today=items.find(item=>item.local_date===todayKey()&&item.participant_ids?.includes(state.user?.id));if(today&&!currentCheckin()){const form=root.querySelector("#checkin-form");if(form)form.hidden=true;const note=document.createElement("div");note.className="checkin-success shared-today";note.innerHTML=`<span class="photo-pill">✓ CHECK-IN DO CASAL · ${escapeHTML(new Intl.DateTimeFormat("pt-BR",{hour:"2-digit",minute:"2-digit"}).format(new Date(today.occurred_at)))}</span><strong style="display:block;margin-top:10px">${escapeHTML(today.activity)}</strong><p>${escapeHTML(today.participantNames.join(" e "))} · ${escapeHTML(today.displayName)} registrou</p>${today.photoUrl?`<img src="${escapeHTML(today.photoUrl)}" alt="Foto privada do treino">`:""}`;form?.before(note);}
    host.innerHTML=`<div class="section-row"><h2>Compartilhado no grupo</h2></div><div class="timeline">${items.map(item=>`<article class="history-item"><div class="history-date"><b>${new Date(`${item.local_date}T12:00:00`).getDate()}</b><small>${new Intl.DateTimeFormat("pt-BR",{month:"short"}).format(new Date(`${item.local_date}T12:00:00`)).replace(".","")}</small></div><div class="history-content">${item.photoUrl?`<img src="${escapeHTML(item.photoUrl)}" alt="Foto compartilhada do treino">`:""}<div><strong>${escapeHTML(item.activity)}</strong><small>${escapeHTML(item.participantNames.join(" e "))} · ${escapeHTML(item.displayName)} · ${new Intl.DateTimeFormat("pt-BR",{hour:"2-digit",minute:"2-digit"}).format(new Date(item.occurred_at))}</small></div></div></article>`).join("")}</div>`;
  }catch(error){console.warn("Não foi possível carregar o feed compartilhado",error);}}
function renderHistory() {
  const history = [...data.checkins].sort((a,b)=>b.timestamp-a.timestamp).slice(0,8);
  if (!history.length) return `<div class="card empty-state"><div class="empty-icon">◷</div><strong>Seu histórico começa aqui</strong><span>Faça um check-in depois do treino.</span></div>`;
  return `<div class="timeline">${history.map((item) => `<article class="history-item"><div class="history-date"><b>${new Date(`${item.date}T12:00:00`).getDate()}</b><small>${new Intl.DateTimeFormat("pt-BR",{month:"short"}).format(new Date(`${item.date}T12:00:00`)).replace(".","")}</small></div><div class="history-content"><img id="photo-${escapeHTML(item.id)}" alt="Foto do treino" style="display:none"><div><strong>${escapeHTML(item.activity)}</strong><small>${shortDate(item.date)} · ${escapeHTML(item.time)}</small></div></div></article>`).join("")}</div>`;
}
function renderProgress() {
  if (!data.profile) { location.hash = "#/perfil"; return; }
  const thisWeek = sessionsThisWeek(); const streak = streakCount(); const max = Math.max(1, ...weekDates().map((date)=>data.checkins.filter((item)=>item.date===todayKey(date)).length));
  const bars = weekDates().map((date)=>{ const count=data.checkins.filter((item)=>item.date===todayKey(date)).length; const h=count?Math.max(18,Math.round(count/max*66)):6; return `<div class="bar-day ${todayKey(date)===todayKey()?"today":""}"><i class="${count?"on":""}" style="height:${h}px"></i>${new Intl.DateTimeFormat("pt-BR",{weekday:"narrow"}).format(date)}</div>`; }).join("");
  document.getElementById("app").innerHTML = `<div class="eyebrow">CADA TREINO CONTA</div><h1 class="page-title">Seu progresso.</h1><p class="subhead">Acompanhe a frequência e celebre o que você já fez.</p><div class="stats-grid"><div class="stat-card"><div class="stat-value">${thisWeek}<span style="font-size:15px"> / ${data.profile.days}</span></div><div class="stat-label">check-ins nesta semana</div></div><div class="stat-card streak-card"><div><div class="stat-value">${streak}</div><div class="stat-label">dias seguidos</div></div><span class="streak-icon">✳</span></div></div><div class="section-row"><h2>Semana atual</h2><span class="soft-label">check-ins por dia</span></div><div class="progress-bars">${bars}</div><div class="section-row"><h2>Seu histórico</h2><a class="text-link" href="#/checkin">Ver check-ins →</a></div>${renderHistory()}<div class="notice">A frequência ajuda a visualizar consistência, mas não mede sozinha os resultados físicos. Sono, alimentação, recuperação e características individuais também contam.</div>`;
  data.checkins.slice(0,8).forEach((item)=>showPhoto(item.id,`photo-${item.id}`));
}
function renderNutrition(){
  if(!data.profile){location.hash="#/perfil";return;}const saved=data.nutrition?.[todayKey()]||{};const p=data.profile;
  document.getElementById("app").innerHTML=`<a class="back-link" href="#/inicio">← Voltar ao início</a><div class="eyebrow">HÁBITOS, NÃO DIETA MILAGROSA</div><h1 class="page-title">Alimentação que cabe na vida real.</h1><p class="subhead">Foco escolhido: ${escapeHTML(p.nutritionGoal||"Quero hábitos gerais")}. O app não vai inventar calorias ou prometer um corpo até uma data.</p><div class="nutrition-card"><span class="group-tag">GUIA GERAL</span><h2>Comece pela base.</h2><p>O Guia Alimentar brasileiro recomenda que alimentos in natura ou minimamente processados formem a base da alimentação, com variedade e preparações que façam sentido para sua rotina.</p><div class="meal-examples"><span>Arroz e feijão</span><span>Ovos, peixe ou carnes</span><span>Frutas e verduras</span><span>Água ao longo do dia</span></div><a class="text-link" href="https://www.gov.br/saude/pt-br/assuntos/saude-brasil/publicacoes-para-promocao-a-saude/guia_alimentar_populacao_brasileira_2ed.pdf/view" target="_blank" rel="noreferrer">Guia Alimentar do Ministério da Saúde ↗</a></div><div class="section-row"><h2>Hábitos de hoje</h2><span class="soft-label">salvos neste aparelho</span></div><form id="nutrition-form" class="card form-card"><label class="habit-row"><input type="checkbox" name="plants" ${saved.plants?"checked":""}><span>Incluí frutas, verduras ou legumes</span></label><label class="habit-row"><input type="checkbox" name="homeMeal" ${saved.homeMeal?"checked":""}><span>Fiz pelo menos uma refeição com comida de verdade</span></label><label class="habit-row"><input type="checkbox" name="water" ${saved.water?"checked":""}><span>Deixei água por perto durante o dia</span></label><div class="field" style="margin-top:16px"><label for="meal-note">Anotação opcional</label><textarea id="meal-note" name="note" placeholder="O que ajudou ou atrapalhou sua rotina hoje?">${escapeHTML(saved.note||"")}</textarea></div><button class="button button-dark button-block">Salvar hábitos de hoje</button></form><div class="nutrition-card nutrition-warning"><h2>Personalização responsável</h2><p>Para sugerir metas individuais de energia, proteína ou perda de peso, faltam dados e contexto clínico; um IMC e uma data-alvo não bastam. Se houver doença, alergia ou histórico alimentar delicado, converse com nutricionista. A gente pode ampliar esta área para organizar preferências e preparar perguntas para a consulta.</p><p>${p.foodNotes?`Preferências anotadas: ${escapeHTML(p.foodNotes)}`:"Ainda não há restrições alimentares registradas."}</p></div>`;
}
function renderProfile() {
  const root=document.getElementById("app");
  if (!data.profile) { root.innerHTML=`<div class="eyebrow">VAMOS COMEÇAR</div><h1 class="page-title">Primeiro, você.</h1><p class="subhead">Vamos fazer algumas perguntas rápidas para começar uma rotina que caiba na vida real.</p>${profileForm("profile",false)}<div class="notice">O IMC é apenas uma referência geral, não um diagnóstico. Para menores de 20 anos, a interpretação é diferente.</div>`; return; }
  const p=data.profile; const value=bmi();
  const personCard=person=>`<div class="card">${[["Nome",person.name],["Objetivo",person.goal],["Disponibilidade",`${person.days} dias · ${person.minutes} min`],["Experiência",person.experience],["Limitação informada",person.injuryArea&&person.injuryArea!=="Nenhuma"?person.injuryArea:(person.limitations||"Nenhuma")]].map(([label,val])=>`<div class="profile-row"><span>${escapeHTML(label)}</span><strong>${escapeHTML(val||"—")}</strong></div>`).join("")}</div>`;
  root.innerHTML=`<div class="eyebrow">SEU ESPAÇO</div><h1 class="page-title">Perfis do casal.</h1><p class="subhead">Cada pessoa preenche suas próprias informações. O plano conjunto respeita os dois perfis.</p><div class="bmi-card"><div><div class="soft-label">IMC DE REFERÊNCIA · ${escapeHTML(p.name)}</div><div class="bmi-value">${value.toFixed(1)}</div></div><div class="bmi-note">${p.age<20?"Para menores de 20 anos, a interpretação depende de idade e sexo.":`${bmiLabel(value)} para adultos.`} Não é diagnóstico.</div></div><div class="section-row"><h2>${escapeHTML(p.name)}</h2></div>${personCard(p)}${data.partner?`<div class="section-row"><h2>${escapeHTML(data.partner.name)}</h2><span class="group-tag">TREINA COM VOCÊ</span></div>${personCard(data.partner)}`:`<div class="group-card"><div class="group-card-head"><strong>Convide sua esposa</strong><span class="group-tag">DUAS CONTAS</span></div><p>Ela cria a própria conta em Chat, preenche o perfil dela e entra no grupo com seu código. Assim o plano consegue considerar as diferenças entre vocês.</p><a class="small-button" href="#/chat">Abrir Chat e conectar →</a></div>`}<div class="section-row"><h2>Seu perfil</h2></div><button class="button button-dark button-block" id="edit-profile">Editar minhas respostas</button><div class="notice">${data.partner?"O perfil da sua esposa só pode ser alterado pela conta dela.":"Se houver lesão, a rotina sinaliza a região em vez de tentar adivinhar uma reabilitação."} Os dados sincronizados online ficam no grupo privado.</div><div id="profile-edit" style="display:none;margin-top:18px">${profileForm("profile",true)}</div>`;
}
function openPhotoDb() {
  return new Promise((resolve,reject)=>{ const request=indexedDB.open(PHOTO_DB,1); request.onupgradeneeded=()=>request.result.createObjectStore(PHOTO_STORE); request.onsuccess=()=>resolve(request.result); request.onerror=()=>reject(request.error); });
}
async function savePhoto(id, blob) { const db=await openPhotoDb(); return new Promise((resolve,reject)=>{ const tx=db.transaction(PHOTO_STORE,"readwrite"); tx.objectStore(PHOTO_STORE).put(blob,id); tx.oncomplete=()=>{db.close();resolve();}; tx.onerror=()=>{db.close();reject(tx.error);}; }); }
async function showPhoto(id, elementId) {
  try { const db=await openPhotoDb(); const blob=await new Promise((resolve,reject)=>{const request=db.transaction(PHOTO_STORE).objectStore(PHOTO_STORE).get(id);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);}); db.close(); if(blob){const image=document.getElementById(elementId);if(image){image.src=URL.createObjectURL(blob);image.style.display="block";}} } catch { /* Sem IndexedDB, os dados do treino continuam acessíveis. */ }
}
function notify(message) { const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400); }
function compressPhoto(file) {
  return new Promise((resolve)=>{ if(!file.type.startsWith("image/")){resolve(file);return;} const url=URL.createObjectURL(file);const image=new Image();image.onload=()=>{const scale=Math.min(1,1440/Math.max(image.width,image.height));const canvas=document.createElement("canvas");canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext("2d").drawImage(image,0,0,canvas.width,canvas.height);canvas.toBlob((blob)=>{URL.revokeObjectURL(url);resolve(blob||file);},"image/jpeg",0.82);};image.onerror=()=>{URL.revokeObjectURL(url);resolve(file);};image.src=url;});
}
function moveWizard(form,step){const max=form.querySelectorAll(".profile-step").length-1;const next=Math.max(0,Math.min(max,step));form.querySelectorAll(".profile-step").forEach((panel,index)=>panel.classList.toggle("active",index===next));form.querySelector("#wizard-label").textContent=`CONHECENDO VOCÊ · ${next+1} DE ${max+1}`;form.querySelector("#wizard-fill").style.width=`${((next+1)/(max+1))*100}%`;form.querySelector(".wizard-back").hidden=next===0;form.querySelector(".wizard-next").hidden=next===max;form.querySelector(".wizard-submit").hidden=next!==max;}
function syncWeekdayPicker(form,count){const controls=[...form.querySelectorAll('input[name="weekdays"]')];let selected=controls.filter(control=>control.checked).map(control=>Number(control.value));if(selected.length>count)selected=selected.slice(0,count);for(const day of (defaultWeekdays[count]||defaultWeekdays[3]))if(selected.length<count&&!selected.includes(day))selected.push(day);controls.forEach(control=>{control.checked=selected.includes(Number(control.value));});}
document.addEventListener("click",async(event)=>{
  const routeButton=event.target.closest("[data-route]");if(routeButton){location.hash=`#${routeButton.dataset.route}`;return;}
  if(event.target.id==="edit-profile"){const section=document.getElementById("profile-edit");section.style.display=section.style.display==="none"?"block":"none";return;}
  const wizardButton=event.target.closest(".wizard-next,.wizard-back");if(wizardButton){const form=wizardButton.closest("form");const active=Number(form.querySelector(".profile-step.active")?.dataset.step||0);if(wizardButton.classList.contains("wizard-next")){const fields=[...form.querySelectorAll(`.profile-step[data-step="${active}"] [required]`)];if(fields.some(field=>!field.reportValidity()))return;}moveWizard(form,active+(wizardButton.classList.contains("wizard-next")?1:-1));return;}
  const exercise=event.target.closest("[data-exercise]");if(exercise){const route=location.hash.replace(/^#/,"");const index=Number(route.split("/")[2]);const key=`${todayKey()}-${index}-${exercise.dataset.exercise}`;data.done[key]=exercise.checked;saveData();exercise.closest(".exercise").classList.toggle("done",exercise.checked);}
});
document.addEventListener("change",(event)=>{if(event.target.id==="photo"){pickedPhoto=event.target.files?.[0]||null;const picker=document.getElementById("photo-picker");const preview=document.getElementById("photo-preview");if(pickedPhoto){preview.src=URL.createObjectURL(pickedPhoto);picker.classList.add("has-photo");}else{picker.classList.remove("has-photo");}}if(event.target.id==="days")syncWeekdayPicker(event.target.form,Number(event.target.value));});
document.addEventListener("submit",async(event)=>{
  if(event.target.id==="nutrition-form"){
    event.preventDefault();const form=new FormData(event.target);data.nutrition[todayKey()]={plants:form.has("plants"),homeMeal:form.has("homeMeal"),water:form.has("water"),note:String(form.get("note")||"").trim()};saveData();notify("Hábitos de hoje salvos neste aparelho");
  }
  if(event.target.id==="profile-form"){
    event.preventDefault();const form=new FormData(event.target);const target=event.target.dataset.target||"profile";const days=Number(form.get("days"));const weekdaysSelected=form.getAll("weekdays").map(Number).sort((a,b)=>a-b);if(weekdaysSelected.length!==days){moveWizard(event.target,1);notify("Marque exatamente o número de dias que vocês conseguem treinar juntos");return;}data[target]={name:String(form.get("name")).trim(),age:Number(form.get("age")),weight:Number(form.get("weight")),height:Number(form.get("height")),goal:String(form.get("goal")),days,daysOfWeek:weekdaysSelected,minutes:Number(form.get("minutes")),cardioMinutes:Number(form.get("cardioMinutes")||0),targetDate:String(form.get("targetDate")||""),experience:String(form.get("experience")),equipment:String(form.get("equipment")||"Academia completa"),likes:String(form.get("likes")||"").trim(),injuryArea:String(form.get("injuryArea")||"Nenhuma"),limitations:String(form.get("limitations")||"").trim(),nutritionGoal:String(form.get("nutritionGoal")||"Quero hábitos gerais"),foodNotes:String(form.get("foodNotes")||"").trim()};saveData();const synced=await window.RitmoSocial?.saveProfile(data[target]);notify(synced?"Perfil salvo e sincronizado":"Perfil salvo neste aparelho; conecte o grupo no Chat para sincronizar");location.hash="#/inicio";
  }
  if(event.target.id==="checkin-form"){
    event.preventDefault();if(currentCheckin()){notify("Você já fez check-in hoje");render();return;}const form=new FormData(event.target);const file=form.get("photo");if(!file||!file.size){notify("Escolha uma foto para continuar");return;}const button=event.target.querySelector("button[type=submit]");button.disabled=true;button.textContent="Salvando check-in…";
    const now=new Date();const item={id:crypto.randomUUID?crypto.randomUUID():`${now.getTime()}-${Math.random().toString(16).slice(2)}`,date:todayKey(now),timestamp:now.getTime(),time:new Intl.DateTimeFormat("pt-BR",{hour:"2-digit",minute:"2-digit"}).format(now),activity:String(form.get("activity")),caption:String(form.get("caption")||"").trim()};
    const participants=[...event.target.querySelectorAll('input[name="participants"]:checked')].map(input=>input.value);
    try{const photo=await compressPhoto(file);let synced=false;let syncFailed=false;try{if(await window.RitmoSocial?.hasCheckinToday())throw new Error("Você ou sua esposa já registrou este check-in hoje.");synced=!!(await window.RitmoSocial?.publishCheckin({activity:item.activity,caption:item.caption,photo,participants,date:item.date}));}catch(syncError){if(syncError.message?.includes("já registrou"))throw syncError;syncFailed=!!window.RitmoSocial?.state?.group;console.warn("Check-in mantido localmente; sincronização pendente",syncError);}await savePhoto(item.id,photo);data.checkins.push(item);saveData();pickedPhoto=null;notify(synced?"Check-in compartilhado com sua esposa ✳":syncFailed?"Check-in salvo aqui, mas não foi compartilhado":"Check-in salvo neste aparelho");location.hash="#/checkin";}catch(error){button.disabled=false;button.textContent="Tentar salvar novamente";notify(error.message||"Não foi possível guardar a foto. Verifique o espaço no aparelho.");}
  }
});
window.addEventListener("hashchange",render);
window.addEventListener("ritmo:social-ready",(event)=>{const state=event.detail;if(state?.user&&state?.group){const own=state.profiles.find(item=>item.user_id===state.user.id);const other=state.profiles.find(item=>item.user_id!==state.user.id);if(own)data.profile=window.RitmoSocial.appProfile(own);else if(data.profile)window.RitmoSocial.saveProfile(data.profile);data.partner=window.RitmoSocial.appProfile(other);saveData();if(location.hash!=="#/chat")render();}});
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
window.RitmoSocial?.bootstrap();
function refreshAtLocalMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
  setTimeout(() => { render(); refreshAtLocalMidnight(); }, next.getTime() - now.getTime());
}
refreshAtLocalMidnight();
