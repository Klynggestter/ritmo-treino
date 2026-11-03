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
    biceps: [
      exercise("Rosca bíceps sentada na máquina", "Parte da frente dos braços · 10–15 repetições", ["cotovelo"], "curl", "Mantenha os braços apoiados e evite balançar o tronco."),
      exercise("Rosca no cabo", "Bíceps · 10–15 repetições", ["cotovelo"], "curl", "Use uma carga que permita controlar a descida."),
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
    conditioning: ["cardio", "core", "glute", "cardio"],
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
  function makeSession(profile, partner, kind, variant, dayIndex) {
    const people=[profile, ...(partner?[partner]:[])];
    const minutes=Math.min(...people.map(person=>Number(person.minutes)||60));
    const cardioMinutes=Math.min(...people.map(person=>Number(person.cardioMinutes??15)));
    const count=minutes<=30?4:minutes<=45?5:minutes<=60?6:minutes<=75?7:8;
    const keys=(mixed[kind]||mixed.fullA).filter(key=>key!=="cardio").slice(0,count);
    if(profile.goal==="Mobilidade e postura"&&keys.length)keys[keys.length-1]="mobility";
    const members=people.map((person,index)=>({name:person.name||`Pessoa ${index+1}`,profile:person}));
    const exercises=keys.map((key,index)=>{
      const variations=members.map((member,personIndex)=>{
        const offset=variant*3+index+dayIndex+personIndex*2;
        let item=choose(key,offset,member.profile.equipment);
        const area=String(member.profile.injuryArea||"").toLowerCase();
        const catalog=member.profile.equipment==="Em casa sem equipamentos"?homeBare:member.profile.equipment==="Em casa com equipamentos"?homeGear:bank;
        const options=catalog[key]||bank[key]||bank.core;
        const alternatives=area&&area!=="nenhuma"?options.filter(option=>!option.areas.includes(area)):options;
        const adapted=!!(alternatives.length&&alternatives.length<options.length);
        const needsAttention=!!(area&&area!=="nenhuma"&&!alternatives.length&&item.areas.includes(area));
        if(adapted)item=alternatives[offset%alternatives.length];
        const sets=member.profile.experience==="Iniciante"?2:3;
        let detail=item.detail.replace(/\d+ séries/,`${sets} séries`);
        if(member.profile.goal==="Hipertrofia e força") detail=detail.replace(/8–12|10–15|8–10|6–10/,"6–10");
        if(member.profile.goal==="Resistência física") detail=detail.replace(/6–10|8–12|10–15|8–10/,"10–15");
        return {name:member.name,item:{...item,detail,kind:key},adapted,needsAttention,limitations:member.profile.limitations||""};
      });
      return {kind,key,members:variations};
    });
    if(cardioMinutes>0){
      exercises.push({kind:"cardio",key:"cardio",members:members.map((member,personIndex)=>{const cardio=choose("cardio",variant+dayIndex+personIndex,member.profile.equipment);return{name:member.name,item:{...cardio,detail:`${Number(member.profile.cardioMinutes??15)} minutos · ritmo confortável`,kind:"cardio"},adapted:false,needsAttention:false,limitations:member.profile.limitations||""};})});
    }
    return {title:titleFor[kind]||kind,icon:"◒",weekday:areas[dayIndex],index:dayIndex,minutes,exercises,kind,rest:false,cardioMinutes};
  }
  function buildWeek(profile, partner=null) {
    const days=Array.from({length:7},(_,index)=>({weekday:areas[index],index,rest:true,title:"Recuperação",icon:"☼",minutes:0,exercises:[]}));
    const fallback={2:[0,3],3:[0,2,4],4:[0,1,3,5],5:[0,1,3,4,5],6:[0,1,2,3,4,5]};
    const userDays=Array.isArray(profile.daysOfWeek)?profile.daysOfWeek.map(Number).filter(day=>day>=0&&day<7):fallback[Number(profile.days)]||fallback[3];
    const partnerDays=partner?(Array.isArray(partner.daysOfWeek)?partner.daysOfWeek.map(Number).filter(day=>day>=0&&day<7):fallback[Number(partner.days)]||fallback[3]):userDays;
    const sharedDays=[...new Set(userDays)].filter(day=>partnerDays.includes(day)).sort((a,b)=>a-b);
    if(partner&&sharedDays.length<2){days[0].scheduleWarning=true;days[0].warning="Escolham ao menos dois dias em comum para montar a semana juntos.";return days;}
    const requested=Math.max(2,Math.min(6,partner?Math.min(Number(profile.days)||3,Number(partner.days)||3):Number(profile.days)||3));
    const count=Math.max(2,Math.min(requested,sharedDays.length));
    const hasAdjacent=sharedDays.some((day,index)=>index>0&&day-sharedDays[index-1]===1)||(sharedDays[0]===0&&sharedDays.at(-1)===6);
    let schedule=weeks[count]||weeks[3];
    if(count===2&&hasAdjacent)schedule=[[0,"upperA","Parte superior"],[1,"lowerA","Parte inferior"]];
    if(count===3&&hasAdjacent)schedule=[[0,"pushA","Empurrar"],[1,"legsA","Pernas"],[2,"pullA","Puxar"]];
    schedule.forEach(([slot,kind,title],variant)=>{const day=sharedDays[slot];days[day]=makeSession(profile,partner,kind,variant,day);days[day].title=titleFor[kind]||title;});
    const people=[profile,...(partner?[partner]:[])];
    days.forEach(day=>{if(day.rest)day.cardio=people.map(person=>({name:person.name||"Atleta",minutes:Number(person.cardioMinutes??15)}));});
    return days;
  }
  window.TrainingPlanner={buildWeek,bank};
})();

