(() => {
  let clientPromise;
  let realtimeChannel;
  let state={client:null,user:null,group:null,memberIds:[],profiles:[],messages:[]};
  const html=(value="")=>String(value).replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  function announce(){window.dispatchEvent(new CustomEvent("ritmo:social-ready",{detail:state}));}
  const config=()=>window.RITMO_SUPABASE_CONFIG||{};
  const ready=()=>{const c=config();return c.url?.startsWith("https://")&&c.anonKey&&!c.anonKey.startsWith("COLE_");};
  async function getClient(){
    if(!ready())throw new Error("Configure URL e chave publishable do Supabase em supabase-config.js.");
    if(!clientPromise)clientPromise=import("https://esm.sh/@supabase/supabase-js@2").then(({createClient})=>createClient(config().url,config().anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
    state.client=await clientPromise;return state.client;
  }
  async function loadState(){
    const client=await getClient();
    const {data:{user}}=await client.auth.getUser();state.user=user;
    if(!user){state.group=null;state.memberIds=[];state.profiles=[];announce();return state;}
    const {data:membership,error:memberError}=await client.from("ritmo_members").select("group_id,user_id").eq("user_id",user.id).maybeSingle();
    if(memberError)throw memberError;
    if(!membership){state.group=null;state.memberIds=[];state.profiles=[];announce();return state;}
    const {data:group,error:groupError}=await client.from("ritmo_groups").select("id,name,invite_code,workout_titles").eq("id",membership.group_id).single();
    if(groupError)throw groupError;
    const {data:members,error:profilesError}=await client.from("ritmo_members").select("user_id").eq("group_id",group.id);
    if(profilesError)throw profilesError;
    state.group=group;state.memberIds=(members||[]).map((item)=>item.user_id);
    const {data:profiles,error:profileError}=await client.from("ritmo_profiles").select("*").in("user_id",state.memberIds);
    if(profileError)throw profileError;state.profiles=profiles||[];announce();return state;
  }
  async function bootstrap(){try{if(!ready())return null;await loadState();return state;}catch{return null;}}
  async function saveProfile(profile){
    try{if(!ready())return false;const client=await getClient();const {data:{user}}=await client.auth.getUser();if(!user)return false;
      const row={user_id:user.id,display_name:profile.name,age:profile.age,weight_kg:profile.weight,height_cm:profile.height,goal:profile.goal,days_per_week:profile.days,training_weekdays:profile.daysOfWeek||[0,2,4],session_minutes:profile.minutes,experience:profile.experience,equipment:profile.equipment||null,likes:profile.likes||null,injury_area:profile.injuryArea||null,limitations:profile.limitations||null,cardio_minutes:profile.cardioMinutes??15,target_date:profile.targetDate||null,nutrition_goal:profile.nutritionGoal||null,food_notes:profile.foodNotes||null,updated_at:new Date().toISOString()};
      const {error}=await client.from("ritmo_profiles").upsert(row,{onConflict:"user_id"});if(error)throw error;await loadState();return true;
    }catch(error){console.warn("Perfil não sincronizado:",error.message);return false;}
  }
  async function saveWorkoutTitles(titles){
    try{if(!ready()||!state.user||!state.group)return false;const {error}=await state.client.from("ritmo_groups").update({workout_titles:titles||{}}).eq("id",state.group.id);if(error)throw error;state.group.workout_titles=titles||{};announce();return true;}catch(error){console.warn("Nomes dos treinos não sincronizados:",error.message);return false;}
  }
  function groupSetup(){return `<div class="eyebrow">ESPAÇO PRIVADO A DOIS</div><h1 class="page-title">Conectem suas contas.</h1><p class="subhead">Cada um entra com seu próprio e-mail. Depois, uma pessoa cria o grupo e compartilha o convite com a outra.</p><div class="card form-card"><form id="social-auth"><div class="field"><label for="social-email">E-mail</label><input type="email" id="social-email" name="email" autocomplete="email" required></div><div class="field"><label for="social-password">Senha</label><input type="password" id="social-password" name="password" autocomplete="current-password" minlength="8" required></div><button class="button button-dark button-block" name="authAction" value="login">Entrar</button><button class="button button-light button-block" name="authAction" value="signup" style="margin-top:9px">Criar minha conta</button></form><p id="social-note" class="form-note">Usaremos Supabase com políticas privadas: só integrantes do grupo poderão ler as mensagens, perfis e fotos.</p></div>`;}
  function groupActions(){return `<div class="eyebrow">GRUPO DE DUAS PESSOAS</div><h1 class="page-title">Criem seu espaço.</h1><p class="subhead">Uma pessoa cria o grupo e envia o código à outra.</p><div class="card form-card"><form id="create-group"><div class="field"><label for="group-name">Nome do grupo</label><input id="group-name" value="Nosso treino" maxlength="50"></div><button class="button button-dark button-block">Criar grupo e gerar convite</button></form><div class="divider"></div><form id="join-group"><div class="field"><label for="invite-code">Código recebido</label><input id="invite-code" autocomplete="off" minlength="32" maxlength="32" placeholder="Cole o código de convite"></div><button class="button button-light button-block">Entrar no grupo</button></form><p class="form-note">O código é privado. Envie apenas para sua esposa.</p></div>`;}
  function chatView(){
    const own=state.profiles.find((p)=>p.user_id===state.user?.id);
    const title=state.group?.name||"Nosso treino";
    return `<div class="eyebrow">CONVERSA PRIVADA · ${html(title.toUpperCase())}</div><h1 class="page-title">Entre uma série e outra.</h1><p class="subhead">Mensagens disponíveis para as duas contas deste grupo.</p><div class="chat-members card">${state.profiles.map((profile)=>`<span class="group-tag">${html(profile.display_name||"Atleta")}</span>`).join(" ")}<button class="small-button" id="copy-invite" type="button">Copiar convite</button></div><div id="chat-feed" class="chat-feed">${state.messages.length?state.messages.map((message)=>`<article class="chat-message ${message.sender_id===state.user.id?"mine":""}"><small>${html(message.sender_id===state.user.id?(own?.display_name||"Você"):(state.profiles.find((p)=>p.user_id===message.sender_id)?.display_name||"Parceira"))} · ${new Intl.DateTimeFormat("pt-BR",{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"short"}).format(new Date(message.created_at))}</small><p>${html(message.body)}</p></article>`).join(""):`<div class="empty-state"><div class="empty-icon">♡</div><strong>Primeira mensagem</strong><span>Combinem o próximo treino.</span></div>`}</div><form id="send-message" class="chat-compose"><input id="message-body" maxlength="2000" placeholder="Escreva uma mensagem…" autocomplete="off" required><button class="button button-dark" aria-label="Enviar mensagem">↑</button></form><button class="text-link logout-button" id="social-logout" type="button">Sair desta conta</button>`;
  }
  async function loadMessages(){
    const client=state.client;const {data,error}=await client.from("ritmo_messages").select("id,group_id,sender_id,body,created_at").eq("group_id",state.group.id).order("created_at",{ascending:false}).limit(100);if(error)throw error;state.messages=(data||[]).reverse();
  }
  function appProfile(row){return row?{name:row.display_name,age:row.age,weight:row.weight_kg,height:row.height_cm,goal:row.goal,days:row.days_per_week,daysOfWeek:row.training_weekdays||[],minutes:row.session_minutes,experience:row.experience,equipment:row.equipment,likes:row.likes,injuryArea:row.injury_area||"Nenhuma",limitations:row.limitations||"",cardioMinutes:row.cardio_minutes??15,targetDate:row.target_date||"",nutritionGoal:row.nutrition_goal||"Quero hábitos gerais",foodNotes:row.food_notes||""}:null;}
  async function hasCheckinToday(){if(!ready())return false;const client=await getClient();await loadState();if(!state.user||!state.group)return false;const now=new Date();const localDate=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;const {data,error}=await client.from("ritmo_checkins").select("id").eq("group_id",state.group.id).eq("local_date",localDate).contains("participant_ids",[state.user.id]).limit(1);if(error)throw error;return !!data?.length;}
  async function publishCheckin({activity,caption,photo,participants,date,durationMinutes}){
    if(!ready())return false;const client=await getClient();if(!state.user||!state.group)await loadState();if(!state.user||!state.group)return false;
    const id=crypto.randomUUID();const path=`${state.group.id}/${state.user.id}/${id}.jpg`;
    const {error:uploadError}=await client.storage.from("ritmo-private").upload(path,photo,{contentType:photo.type||"image/jpeg",upsert:false});if(uploadError)throw uploadError;
    const participantIds=[...new Set([state.user.id,...(participants||[])])];
    const {error}=await client.from("ritmo_checkins").insert({group_id:state.group.id,user_id:state.user.id,activity,caption,duration_minutes:durationMinutes||null,photo_path:path,local_date:date,participant_ids:participantIds});
    if(error){await client.storage.from("ritmo-private").remove([path]);throw error;}return true;
  }
  async function listCheckins(limit=20){
    if(!ready())return [];const client=await getClient();if(!state.group)await loadState();if(!state.group)return [];
    const {data,error}=await client.from("ritmo_checkins").select("id,group_id,user_id,activity,caption,duration_minutes,photo_path,local_date,participant_ids,occurred_at").eq("group_id",state.group.id).order("occurred_at",{ascending:false}).limit(limit);if(error)throw error;
    const names=new Map(state.profiles.map(profile=>[profile.user_id,profile.display_name]));
    return Promise.all((data||[]).map(async(item)=>{let photoUrl="";if(item.photo_path){const result=await client.storage.from("ritmo-private").createSignedUrl(item.photo_path,3600);photoUrl=result.data?.signedUrl||"";}return {...item,durationMinutes:item.duration_minutes||0,photoUrl,displayName:names.get(item.user_id)||"Atleta",participantNames:(item.participant_ids||[]).map(id=>names.get(id)||"Atleta")};}));
  }
  function subscribe(root){
    if(realtimeChannel)state.client.removeChannel(realtimeChannel);
    realtimeChannel=state.client.channel(`ritmo-chat-${state.group.id}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"ritmo_messages",filter:`group_id=eq.${state.group.id}`},async()=>{try{await loadMessages();if(location.hash==="#/chat"){root.innerHTML=chatView();bindChat(root);scrollChat();}}catch{}}).subscribe();
  }
  function scrollChat(){const feed=document.getElementById("chat-feed");if(feed)feed.scrollTop=feed.scrollHeight;}
  function bindChat(root){
    root.querySelector("#send-message")?.addEventListener("submit",async(event)=>{event.preventDefault();const body=root.querySelector("#message-body").value.trim();if(!body)return;const button=event.submitter;button.disabled=true;const {error}=await state.client.from("ritmo_messages").insert({group_id:state.group.id,sender_id:state.user.id,body});button.disabled=false;if(error){showError(root,error.message);return;}root.querySelector("#message-body").value="";await loadMessages();root.innerHTML=chatView();bindChat(root);scrollChat();});
    root.querySelector("#copy-invite")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(state.group.invite_code);showError(root,"Convite copiado. Envie só para sua esposa.",true);}catch{showError(root,`Código: ${state.group.invite_code}`,true);}});
    root.querySelector("#social-logout")?.addEventListener("click",async()=>{if(realtimeChannel)state.client.removeChannel(realtimeChannel);await state.client.auth.signOut();renderChat(root);});
    scrollChat();
  }
  function showError(root,message,positive=false){let note=root.querySelector("#social-note");if(!note){note=document.createElement("p");note.id="social-note";note.className="form-note";root.prepend(note);}note.textContent=message;note.style.color=positive?"#42654d":"#9a3d32";}
  document.addEventListener("click",(event)=>{const button=event.target.closest('#social-auth button[name="authAction"]');if(button)button.form.dataset.authAction=button.value;},true);
  document.addEventListener("submit",async(event)=>{
    if(event.target?.id!=="social-auth")return;
    event.preventDefault();event.stopImmediatePropagation();
    const form=event.target;const root=document.getElementById("app");const buttons=[...form.querySelectorAll('button[name="authAction"]')];
    const action=event.submitter?.value||form.dataset.authAction||"login";const fields=new FormData(form);const email=String(fields.get("email")||"").trim();const password=String(fields.get("password")||"");
    buttons.forEach(button=>button.disabled=true);showError(root,action==="signup"?"Criando sua conta…":"Entrando…",true);
    try{
      const result=action==="signup"?await state.client.auth.signUp({email,password}):await state.client.auth.signInWithPassword({email,password});
      if(result.error){showError(root,result.error.message);return;}
      if(action==="signup"&&!result.data.session){showError(root,"Conta criada. Abra o e-mail de confirmação e depois volte para entrar.",true);return;}
      await renderChat(root);
    }catch(error){
      const message=error?.message||"Não foi possível concluir o acesso.";
      showError(root,/fetch|network|failed/i.test(message)?"Não consegui alcançar o Supabase. Confira a URL do projeto (ela termina em .supabase.co) e tente novamente.":message);
    }finally{buttons.forEach(button=>button.disabled=false);}
  },true);
  async function renderChat(root){
    if(!ready()){root.innerHTML=`<div class="eyebrow">ESPAÇO PRIVADO A DOIS</div><h1 class="page-title">Chat e treinos juntos.</h1><p class="subhead">A conexão online ainda precisa ser configurada.</p><div class="card form-card"><strong>Para ativar sem pagar nesta fase</strong><p class="form-note">Crie um projeto Supabase gratuito, rode o arquivo <code>supabase/schema.sql</code> e coloque a URL e a chave publishable em <code>supabase-config.js</code>. O projeto fica no GitHub Pages; mensagens e fotos ficam em tabelas privadas protegidas por RLS.</p><p class="form-note">Não publique uma chave service_role. A chave publishable é pública por projeto; a proteção vem das políticas do banco.</p></div>`;return;}
    root.innerHTML=`<div class="empty-state"><div class="empty-icon">◌</div><strong>Conectando seu espaço privado…</strong></div>`;
    try{await loadState();if(!state.user){root.innerHTML=groupSetup();root.querySelector("#social-auth").addEventListener("submit",async(event)=>{event.preventDefault();const form=new FormData(event.target);const email=String(form.get("email"));const password=String(form.get("password"));const action=event.submitter?.value||"login";const result=action==="signup"?await state.client.auth.signUp({email,password}):await state.client.auth.signInWithPassword({email,password});if(result.error){showError(root,result.error.message);return;}if(action==="signup"&&!result.data.session){showError(root,"Confira seu e-mail para confirmar a conta e depois entre.",true);return;}renderChat(root);});return;}
      if(!state.group){root.innerHTML=groupActions();root.querySelector("#create-group").addEventListener("submit",async(event)=>{event.preventDefault();const name=root.querySelector("#group-name").value.trim()||"Nosso treino";const {error}=await state.client.rpc("ritmo_create_group",{group_name:name});if(error){showError(root,error.message);return;}await renderChat(root);});root.querySelector("#join-group").addEventListener("submit",async(event)=>{event.preventDefault();const code=root.querySelector("#invite-code").value.trim();const {error}=await state.client.rpc("ritmo_join_group",{code});if(error){showError(root,error.message);return;}await renderChat(root);});return;}
      await loadMessages();root.innerHTML=chatView();bindChat(root);subscribe(root);
    }catch(error){root.innerHTML=`<div class="eyebrow">CONEXÃO</div><h1 class="page-title">Não conectou ainda.</h1><p class="subhead">${html(error.message||"Tente de novo em alguns instantes.")}</p><button id="social-retry" class="button button-dark">Tentar novamente</button>`;root.querySelector("#social-retry").onclick=()=>renderChat(root);}
  }
  window.RitmoSocial={bootstrap,saveProfile,saveWorkoutTitles,renderChat,hasCheckinToday,publishCheckin,listCheckins,appProfile,get state(){return state;}};
})();

