/* Rotinas educativas para adultos saudáveis. Exercícios não são prescrições clínicas. */
(() => {
  const exercise = (name, detail, areas, demo, cue) => ({ name, detail, areas, demo, cue });
  const bank = {
    squat: [
      exercise("Leg press", "Empurre a plataforma com os pés · quadríceps e glúteos · 8–12 repetições", ["joelho", "quadril"], "squat", "Mantenha o quadril apoiado no encosto e não trave os joelhos no final."),
      exercise("Agachamento segurando um halter à frente", "Segure um halter junto ao peito e agache · quadríceps e glúteos · 8–12 repetições", ["joelho", "quadril", "costas"], "squat", "Desça só até onde controla o tronco e mantenha o peso próximo ao corpo."),
      exercise("Agachamento na máquina hack", "Quadríceps e glúteos · 8–12 repetições", ["joelho", "quadril"], "squat", "Ajuste os pés na plataforma, apoie as costas e use uma amplitude confortável."),
      exercise("Agachamento até o banco", "Quadríceps e glúteos · 8–12 repetições", ["joelho", "quadril"], "squat", "Toque o banco com controle e suba sem impulso."),
    ],
    hinge: [
      exercise("Terra romeno com halteres", "Leve o quadril para trás com os halteres nas pernas · posterior e glúteos · 8–12 repetições", ["costas", "quadril", "joelho"], "hinge", "Mantenha os halteres perto das pernas e pare antes de perder o controle."),
      exercise("Coice de glúteo na máquina", "Glúteos · 10–15 repetições", ["quadril"], "hinge", "Empurre a plataforma para trás sem arquear a lombar."),
      exercise("Coice de glúteo no cabo", "Glúteos e posterior · 10–15 repetições", ["costas", "quadril"], "hinge", "Empurre o quadril para trás e termine em pé, sem inclinar a lombar."),
    ],
    chest: [
      exercise("Supino na máquina", "Empurre os pegadores para a frente · peito e tríceps · 8–12 repetições", ["ombro", "cotovelo"], "push", "Ajuste os pegadores à altura do peito; use amplitude confortável."),
      exercise("Supino com halteres", "Peitoral e tríceps · 8–12 repetições", ["ombro", "cotovelo"], "push", "Mantenha os punhos alinhados e desça apenas até onde não há dor."),
      exercise("Supino inclinado na máquina", "Peitoral · 8–12 repetições", ["ombro", "cotovelo"], "push", "Ajuste o banco antes de começar; não force o ombro no fundo."),
      exercise("Flexão inclinada", "Peitoral e tríceps · 8–12 repetições", ["ombro", "cotovelo"], "push", "Mantenha o corpo alinhado e escolha uma altura que permita controle."),
    ],
    row: [
      exercise("Remada com peito apoiado", "Puxe os pegadores em direção ao tronco · costas e bíceps · 8–12 repetições", ["ombro", "cotovelo", "costas"], "pull", "Mantenha o peito no apoio; puxe sem elevar os ombros e controle a volta."),
      exercise("Remada sentada no cabo", "Costas e bíceps · 8–12 repetições", ["ombro", "cotovelo", "costas"], "pull", "Mantenha o tronco estável e evite embalar o corpo."),
      exercise("Remada unilateral no cabo", "Costas · 8–12 por lado", ["ombro", "cotovelo", "costas"], "pull", "Mantenha o ombro confortável e o tronco voltado para frente."),
      exercise("Remada baixa na máquina", "Costas e bíceps · 8–12 repetições", ["ombro", "cotovelo", "costas"], "pull", "Faça o movimento sem impulso e sem encolher os ombros."),
    ],
    verticalPull: [
      exercise("Puxada alta na frente", "Puxe a barra de cima até a parte alta do peito · costas e bíceps · 8–12 repetições", ["ombro", "cotovelo"], "pull", "Puxe à frente do corpo; evite levar a barra atrás da nuca."),
      exercise("Puxada na máquina com pegada neutra", "Costas · 8–12 repetições", ["ombro", "cotovelo"], "pull", "Puxe os pegadores para baixo, na frente do corpo; mantenha o pescoço relaxado."),
      exercise("Barra assistida", "Costas e bíceps · 6–10 repetições", ["ombro", "cotovelo"], "pull", "Ajuste a assistência para manter cada repetição controlada."),
    ],
    hamstring: [
      exercise("Mesa flexora", "Posterior de coxa · 10–15 repetições", ["joelho"], "curl", "Ajuste o eixo da máquina ao joelho e controle a volta."),
      exercise("Cadeira flexora", "Posterior de coxa · 10–15 repetições", ["joelho"], "curl", "Use amplitude confortável e evite tirar o quadril do assento."),
      exercise("Puxar a bola com os calcanhares", "Parte de trás das coxas · 8–12 repetições", ["joelho", "quadril"], "curl", "Deite de costas, apoie os calcanhares na bola e traga-a devagar em sua direção."),
    ],
    glute: [
      exercise("Elevação pélvica na máquina", "Apoie as costas e eleve o quadril · glúteos · 8–12 repetições", ["quadril", "costas"], "hinge", "Termine com o quadril estendido sem hiperestender a lombar."),
      exercise("Máquina abdutora — abrir as pernas", "Glúteos · 12–15 repetições", ["quadril"], "open", "Abra as pernas com controle, sem balançar o tronco."),
      exercise("Coice de glúteo no cabo", "Empurre a perna para trás · glúteos · 10–15 por lado", ["quadril", "costas"], "hinge", "Mantenha o tronco estável e use uma amplitude confortável."),
    ],
    shoulder: [
      exercise("Elevação lateral na máquina", "Ombros · 10–15 repetições", ["ombro", "cotovelo"], "raise", "Suba só até uma altura confortável, sem impulso."),
      exercise("Crucifixo inverso na máquina", "Parte de trás dos ombros · 10–15 repetições", ["ombro", "cotovelo"], "open", "Mantenha o pescoço relaxado e controle a volta."),
      exercise("Puxada do cabo em direção ao rosto", "Ombros e costas · 10–15 repetições", ["ombro", "cotovelo"], "pull", "Use carga leve, puxe na altura do rosto e pare se houver desconforto no ombro."),
    ],
    forearms: [
      exercise("Rosca inversa com barra", "Antebraços e braquiorradial · 10–15 repetições", ["cotovelo"], "curl", "Use carga leve e mantenha os punhos alinhados."),
      exercise("Flexão de punho com halteres", "Antebraços · 12–15 repetições", ["cotovelo"], "curl", "Apoie os antebraços e mova apenas os punhos, sem dor."),
    ],
    biceps: [
      exercise("Rosca bíceps sentada na máquina", "Parte da frente dos braços · 10–15 repetições", ["cotovelo"], "curl", "Mantenha os braços apoiados e evite balançar o tronco."),
      exercise("Rosca direta na polia baixa", "Bíceps · 10–15 repetições", ["cotovelo"], "curl", "Use a barra reta na polia baixa, mantenha os cotovelos junto ao tronco e controle a volta."),
      exercise("Rosca martelo na polia com corda", "Bíceps, braquial e antebraço · 10–15 repetições", ["cotovelo"], "curl", "Use a corda na polia baixa e mantenha a pegada neutra, com as palmas voltadas uma para a outra."),
      exercise("Rosca martelo com halteres", "Bíceps e antebraço · 8–12 repetições", ["cotovelo"], "curl", "Mantenha os punhos neutros e os cotovelos próximos ao corpo."),
    ],
    triceps: [
      exercise("Tríceps na corda", "Tríceps · 10–15 repetições", ["cotovelo", "ombro"], "push", "Mantenha os cotovelos confortáveis junto ao tronco."),
      exercise("Tríceps na máquina", "Tríceps · 10–15 repetições", ["cotovelo", "ombro"], "push", "Ajuste o assento e use amplitude confortável."),
      exercise("Extensão de tríceps no cabo", "Tríceps · 10–15 repetições", ["cotovelo", "ombro"], "push", "Evite abrir os cotovelos ou arquear a lombar."),
    ],
    calves: [
      exercise("Panturrilha sentada", "Panturrilhas · 10–15 repetições", ["tornozelo"], "calf", "Faça a subida e a descida sem quicar."),
      exercise("Panturrilha no leg press", "Panturrilhas · 10–15 repetições", ["tornozelo", "joelho"], "calf", "Use amplitude confortável e mantenha o joelho destravado."),
    ],
    core: [
      exercise("Segurar o cabo à frente sem girar o tronco", "Abdômen · 8–12 por lado", ["costas"], "core", "Mantenha o tronco estável; escolha uma resistência leve no início."),
      exercise("Alternância de braço e perna deitada", "Abdômen · 8–10 por lado", ["costas"], "core", "Mantenha a lombar confortável; estenda devagar um braço e a perna oposta."),
      exercise("Prancha com as mãos no banco", "Abdômen · 20–40 segundos", ["ombro", "costas"], "core", "Apoie as mãos em um banco firme, alinhe o corpo e pare se sentir dor."),
    ],
    mobility: [
      exercise("Gato e camelo em quatro apoios", "Mobilidade da coluna · 8–10 repetições", [], "core", "Em quatro apoios, arredonde e depois alongue as costas devagar, sem forçar."),
      exercise("Deslizar os braços na parede", "Mobilidade dos ombros · 8–10 repetições", [], "raise", "Encoste os braços na parede e suba apenas até onde for confortável."),
      exercise("Mobilidade de quadril em pé", "Quadril · 8–10 movimentos por lado", [], "open", "Segure em um apoio firme e faça movimentos pequenos e controlados."),
    ],
    cardio: [
      exercise("Caminhada na esteira", "Cardio leve a moderado · 15 minutos", [], "walk", "Escolha um ritmo que permita conversar e ajuste a inclinação ao conforto."),
      exercise("Bicicleta ergométrica", "Cardio leve a moderado · 15 minutos", [], "walk", "Ajuste o banco para uma pedalada confortável."),
      exercise("Elíptico", "Cardio leve a moderado · 15 minutos", [], "walk", "Comece leve e aumente o ritmo apenas se estiver confortável."),
    ],
  };
  const homeBare={
    squat:[exercise("Agachamento até uma cadeira", "Quadríceps e glúteos · 8–12 repetições", ["joelho","quadril"], "squat", "Use uma cadeira firme, mova devagar e pare numa amplitude confortável.")],
    hinge:[exercise("Ponte de glúteos no chão", "Glúteos · 10–15 repetições", ["quadril","costas"], "hinge", "Suba o quadril sem arquear a lombar.")],
    chest:[exercise("Flexão inclinada na parede", "Peitoral · 8–12 repetições", ["ombro","cotovelo"], "push", "Use uma parede estável e mantenha o corpo alinhado.")],
    row:[exercise("Remada isométrica com toalha", "Costas · 15–25 segundos", ["ombro","cotovelo"], "pull", "Puxe a toalha sem prender em objeto que possa soltar.")],
    verticalPull:[exercise("Anjo reverso deitado", "Costas e postura · 8–12 repetições", ["ombro"], "pull", "Faça sem carga e sem forçar a amplitude do ombro.")],
    hamstring:[exercise("Caminhada de calcanhares a partir da ponte", "Posterior de coxa · 6–10 repetições", ["joelho","quadril"], "curl", "Mantenha o quadril confortável e encurte a amplitude se necessário.")],
    glute:[exercise("Abrir a perna deitada de lado", "Glúteos · 10–15 por lado", ["quadril"], "open", "Mantenha o quadril empilhado e mova sem impulso.")],
    shoulder:[exercise("Deslizamento de braços na parede", "Mobilidade leve · 8–10 repetições", ["ombro"], "raise", "Não force; interrompa se houver dor.")],
    biceps:[exercise("Rosca isométrica com toalha", "Bíceps · 15–25 segundos", ["cotovelo"], "curl", "Use esforço leve e pare se houver dor no braço.")],
    triceps:[exercise("Flexão inclinada com mãos próximas", "Tríceps · 6–10 repetições", ["ombro","cotovelo"], "push", "Use parede ou apoio firme e reduza a amplitude se necessário.")],
    calves:[exercise("Elevação de panturrilha em pé", "Panturrilhas · 10–15 repetições", ["tornozelo"], "calf", "Use apoio estável e evite quicar.")],
    core:[exercise("Alternância de braço e perna deitada", "Abdômen · 8–10 por lado", ["costas"], "core", "Mova devagar e mantenha a lombar confortável.")],
    cardio:[exercise("Caminhada ao ar livre", "Cardio leve a moderado · 15 minutos", [], "walk", "Escolha um ritmo confortável e um trajeto seguro.")],
  };
  const homeGear={
    squat:[exercise("Agachamento com mochila", "Quadríceps e glúteos · 8–12 repetições", ["joelho","quadril","costas"], "squat", "Use mochila fechada e leve; controle a descida.")],
    hinge:[exercise("Terra romeno com halteres", "Leve o quadril para trás com halteres nas pernas · posterior e glúteos · 8–12 repetições", ["costas","quadril","joelho"], "hinge", "Mantenha os halteres próximos das pernas e pare antes de perder o controle.")],
    chest:[exercise("Supino no chão com halteres", "Peitoral e tríceps · 8–12 repetições", ["ombro","cotovelo"], "push", "Use amplitude confortável; o chão limita a descida.")],
    row:[exercise("Remada com um halter", "Puxe o halter em direção ao quadril · costas · 8–12 por lado", ["ombro","cotovelo","costas"], "pull", "Apoie a mão numa superfície estável e não gire o tronco.")],
    verticalPull:[exercise("Puxada de halter deitada", "Costas e peito · 8–12 repetições", ["ombro","cotovelo"], "pull", "Use carga leve e amplitude confortável; pare se houver desconforto no ombro.")],
    hamstring:[exercise("Flexão de joelho com toalha no chão", "Posterior de coxa · 6–10 repetições", ["joelho","quadril"], "curl", "Use piso que permita deslizar e faça uma amplitude controlada.")],
    glute:[exercise("Elevação pélvica com halter", "Glúteos · 8–12 repetições", ["quadril","costas"], "hinge", "Posicione a carga com proteção e evite arquear a lombar.")],
    shoulder:[exercise("Elevação lateral com halteres leves", "Ombros · 10–15 repetições", ["ombro","cotovelo"], "raise", "Suba apenas até uma amplitude sem dor.")],
    biceps:[exercise("Rosca com halteres", "Bíceps · 10–15 repetições", ["cotovelo"], "curl", "Mantenha os cotovelos estáveis e controle a descida.")],
    triceps:[exercise("Extensão de tríceps com elástico", "Tríceps · 10–15 repetições", ["cotovelo","ombro"], "push", "Prenda o elástico com segurança antes de começar.")],
    calves:[exercise("Elevação de panturrilha com halteres", "Panturrilhas · 10–15 repetições", ["tornozelo"], "calf", "Segure carga leve e use apoio firme.")],
    core:[exercise("Alternância de braço e perna deitada", "Abdômen · 8–10 por lado", ["costas"], "core", "Mova devagar e mantenha a lombar confortável.")],
    cardio:[exercise("Caminhada ao ar livre", "Cardio leve a moderado · 15 minutos", [], "walk", "Escolha um ritmo confortável e um trajeto seguro.")],
  };
  const mixed = {
    fullA: ["squat", "chest", "row", "hinge", "verticalPull", "hamstring", "shoulder", "core", "biceps", "cardio"],
    fullB: ["squat", "verticalPull", "chest", "glute", "row", "hamstring", "triceps", "calves", "core", "cardio"],
    fullC: ["squat", "row", "chest", "hinge", "verticalPull", "glute", "shoulder", "biceps", "core", "cardio"],
    upperA: ["chest", "row", "verticalPull", "shoulder", "triceps", "biceps", "shoulder", "core", "cardio"],
    upperB: ["chest", "verticalPull", "row", "shoulder", "biceps", "triceps", "row", "core", "cardio"],
    lowerA: ["squat", "hinge", "hamstring", "glute", "calves", "core", "squat", "cardio"],
    lowerB: ["squat", "glute", "hinge", "hamstring", "calves", "core", "squat", "cardio"],
    pushA: ["chest", "chest", "shoulder", "triceps", "chest", "core", "cardio"],
    pushB: ["chest", "shoulder", "chest", "triceps", "shoulder", "core", "cardio"],
    pullA: ["verticalPull", "row", "shoulder", "biceps", "row", "core", "cardio"],
    pullB: ["row", "verticalPull", "shoulder", "biceps", "verticalPull", "core", "cardio"],
    legsA: ["squat", "hinge", "hamstring", "glute", "calves", "core", "squat", "cardio"],
    legsB: ["squat", "glute", "hamstring", "hinge", "calves", "core", "squat", "cardio"],
    conditioning: ["mobility", "core"],
  };
  const weeks = {
    2: [[0,"fullA","Corpo todo A"],[1,"fullB","Corpo todo B"]],
    3: [[0,"fullA","Corpo todo A"],[1,"fullB","Corpo todo B"],[2,"fullC","Corpo todo C"]],
    4: [[0,"upperA","Parte superior A"],[1,"lowerA","Parte inferior A"],[2,"upperB","Parte superior B"],[3,"lowerB","Parte inferior B"]],
    5: [[0,"upperA","Parte superior A"],[1,"lowerA","Parte inferior A"],[2,"upperB","Parte superior B"],[3,"lowerB","Parte inferior B"],[4,"conditioning","Condicionamento e core"]],
    6: [[0,"pushA","Empurrar A"],[1,"pullA","Puxar A"],[2,"legsA","Pernas A"],[3,"pushB","Empurrar B"],[4,"pullB","Puxar B"],[5,"legsB","Pernas B"]],
  };
  const titleFor = {fullA:"Corpo inteiro A",fullB:"Corpo inteiro B",fullC:"Corpo inteiro C",upperA:"Tronco · peito, costas e braços A",upperB:"Tronco · peito, costas e braços B",lowerA:"Pernas e glúteos A",lowerB:"Pernas e glúteos B",pushA:"Peito, ombros e tríceps A",pushB:"Peito, ombros e tríceps B",pullA:"Costas e bíceps A",pullB:"Costas e bíceps B",legsA:"Pernas e glúteos A",legsB:"Pernas e glúteos B",conditioning:"Condicionamento e core"};
  const areas = ["segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado","domingo"];
  function choose(key, variant, equipment="Academia completa") { const catalog=equipment==="Em casa sem equipamentos"?homeBare:equipment==="Em casa com equipamentos"?homeGear:bank;const options=catalog[key]||bank[key]||bank.core;return options[variant%options.length]; }
  const muscleKeys={"Quadríceps":["squat"],"Glúteos":["glute"],"Posteriores de coxa":["hamstring","hinge"],"Panturrilhas":["calves"],"Peito":["chest"],"Costas":["row","verticalPull"],"Ombros":["shoulder"],"Bíceps":["biceps"],"Antebraços":["forearms"],"Tríceps":["triceps"],"Abdômen e core":["core"]};
  function keysForMuscles(names=[]){return names.flatMap(name=>muscleKeys[name]||[]);}
  function makeSession(profile, kind, variant, dayIndex, primaryGroups, secondaryGroups) {
    const minutes=Number(profile.minutes)||60;const cardioMinutes=Number(profile.cardioMinutes??15);
    const count=minutes<=30?4:minutes<=45?5:minutes<=60?6:minutes<=75?7:8;
    const base=(mixed[kind]||mixed.fullA).filter(key=>key!=="cardio");
    const focused=keysForMuscles(primaryGroups);
    const secondary=keysForMuscles(secondaryGroups);
    const wantsGlutes=[...primaryGroups,...secondaryGroups].includes("Glúteos");
    const safeBase=wantsGlutes?base:base.filter(key=>key!=="glute");
    let keys=[...new Set([...focused,...safeBase,...secondary])];
    if(profile.goal==="Mobilidade e postura")keys=["mobility",...keys.filter(key=>key!=="mobility")];
    keys=keys.slice(0,count);
    const primarySet=new Set(focused),secondarySet=new Set(secondary);
    const baseSets=profile.experience==="Iniciante"?2:3;
    const volume=profile.volumeLevel||"Moderado";
    const exercises=keys.map((key,index)=>{
      const offset=variant*3+index+dayIndex;
      let item=choose(key,offset,profile.equipment);
      const area=String(profile.injuryArea||"").toLowerCase();
      const catalog=profile.equipment==="Em casa sem equipamentos"?homeBare:profile.equipment==="Em casa com equipamentos"?homeGear:bank;
      const options=catalog[key]||bank[key]||bank.core;
      const alternatives=area&&area!=="nenhuma"?options.filter(option=>!option.areas.includes(area)):options;
      const adapted=!!(alternatives.length&&alternatives.length<options.length);
      const needsAttention=!!(area&&area!=="nenhuma"&&!alternatives.length&&item.areas.includes(area));
      if(adapted)item=alternatives[offset%alternatives.length];
      const prioritized=primarySet.has(key),secondaryPriority=secondarySet.has(key);
      const adjustment=volume==="Alto"&&prioritized?1:volume==="Baixo"?-1:0;
      const sets=Math.max(1,Math.min(5,baseSets+adjustment));
      let detail=item.detail.replace(/\d+ séries/,`${sets} séries`);
      if(profile.goal==="Hipertrofia e força") detail=detail.replace(/8–12|10–15|8–10|6–10/,"6–12");
      if(profile.goal==="Resistência física") detail=detail.replace(/6–10|8–12|10–15|8–10/,"10–15");
      if(profile.intensityLevel==="Leve")detail+=` · esforço confortável (3–4 repetições em reserva)`;
      else if(profile.intensityLevel==="Desafiadora")detail+=` · esforço firme, sem perder a técnica (1–3 em reserva)`;
      const priority=prioritized?"Prioridade principal":secondaryPriority?"Prioridade secundária":"Complementar";
      return {kind:key,key,members:[{name:profile.name||"Atleta",userId:profile.userId||null,item:{...item,detail,kind:key},sets,priority,adapted,needsAttention,limitations:profile.limitations||""}]};
    });
    if(cardioMinutes>0){const item=choose("cardio",variant+dayIndex,profile.equipment);exercises.push({kind:"cardio",key:"cardio",members:[{name:profile.name||"Atleta",userId:profile.userId||null,item:{...item,detail:`${cardioMinutes} minutos · ritmo confortável`,kind:"cardio"},sets:0,priority:"Complementar",adapted:false,needsAttention:false,limitations:profile.limitations||""}]});}
    return {title:titleFor[kind]||kind,icon:"◒",weekday:areas[dayIndex],index:dayIndex,minutes,exercises,kind,rest:false,cardioMinutes,primaryGroups,secondaryGroups};
  }
  function buildWeek(profile) {
    const days=Array.from({length:7},(_,index)=>({weekday:areas[index],index,rest:true,title:"Recuperação",icon:"☼",minutes:0,exercises:[]}));
    const fallback={1:[0],2:[0,3],3:[0,2,4],4:[0,1,3,5],5:[0,1,2,4,5],6:[0,1,2,3,4,5],7:[0,1,2,3,4,5,6]};
    const workoutDays=Array.isArray(profile.daysOfWeek)&&profile.daysOfWeek.length?[...new Set(profile.daysOfWeek.map(Number).filter(day=>day>=0&&day<7))].sort((a,b)=>a-b):fallback[Number(profile.days)]||fallback[3];
    const count=Math.max(1,Math.min(7,workoutDays.length||Number(profile.days)||3));
    const primary=[...new Set([profile.focusMuscle,...(profile.primaryMuscles||[])].filter(Boolean))].slice(0,3),secondary=(profile.secondaryMuscles||[]).filter(group=>!primary.includes(group)).slice(0,4);
    const pref=profile.trainingSplit||"Automática";
    let split;
    if(count===1)split=["fullA"];
    else if(count===7&&pref==="Corpo todo")split=["fullA","conditioning","fullB","conditioning","fullC","conditioning","conditioning"];
    else if(count===7&&pref==="Superior / inferior")split=["upperA","lowerA","conditioning","upperB","lowerB","conditioning","conditioning"];
    else if(count===7)split=["pushA","pullA","legsA","pushB","pullB","legsB","conditioning"];
    else if(pref==="Corpo todo"&&count<=3)split=Array.from({length:count},(_,i)=>["fullA","fullB","fullC"][i%3]);
    else if(pref==="Corpo todo")split=Array.from({length:count},(_,i)=>i%2?"conditioning":["fullA","fullB","fullC"][Math.floor(i/2)%3]);
    else if(pref==="Automática"&&count<=3)split=Array.from({length:count},(_,i)=>["fullA","fullB","fullC"][i%3]);
    else if(pref==="Superior / inferior")split=Array.from({length:count},(_,i)=>i===4?"conditioning":i%2?"lowerA":i%4===2?"upperB":"upperA");
    else if(pref==="Push / pull / pernas"||count>=6)split=Array.from({length:count},(_,i)=>["pushA","pullA","legsA","pushB","pullB","legsB"][i%6]);
    else if(count===4)split=["upperA","lowerA","upperB","lowerB"];
    else if(count===5)split=["upperA","lowerA","upperB","lowerB","conditioning"];
    else split=["upperA","lowerA","upperB","lowerB","fullC"];
    const titleMap={fullA:"Corpo todo A",fullB:"Corpo todo B",fullC:"Corpo todo C",upperA:"Tronco A",upperB:"Tronco B",lowerA:"Membros inferiores A",lowerB:"Membros inferiores B",pushA:"Empurrar A",pushB:"Empurrar B",pullA:"Puxar A",pullB:"Puxar B",legsA:"Pernas A",legsB:"Pernas B",conditioning:"Mobilidade e recuperação ativa"};
    workoutDays.slice(0,count).forEach((dayIndex,slot)=>{
      const kind=split[slot]||"fullA";
      const rotatedPrimary=primary.length?[primary[slot%primary.length],...primary.filter((_,i)=>i!==slot%primary.length)]:[];
      const focus=kind==="conditioning"?[]:rotatedPrimary.slice(0,2);
      const focusedKeys=keysForMuscles(focus);
      const base=(mixed[kind]||mixed.fullA).filter(key=>key!=="cardio");
      const secondaryKeys=kind==="conditioning"?[]:keysForMuscles(secondary);
      const prioritizedBase=[...focusedKeys,...base,...secondaryKeys];
      mixed[`__custom_${slot}`]=prioritizedBase;
      const day=makeSession(profile,`__custom_${slot}`,slot,dayIndex,focus,secondary);
      day.title=titleMap[kind]||"Treino";day.split=kind;days[dayIndex]=day;
    });
    days.forEach(day=>{if(day.rest)day.cardio=Number(profile.cardioMinutes??15)>0?[{name:profile.name||"Atleta",minutes:Number(profile.cardioMinutes??15)}]:[];});
    return days;
  }
  window.TrainingPlanner={buildWeek,bank};
})();

