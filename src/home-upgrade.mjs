const CREST='https://a.espncdn.com/i/teamlogos/soccer/500/819.png';

const intro=`<div id="intro" class="intro" hidden aria-label="Abertura Flamengo — Portal do Torcedor">
 <div class="intro-stripes" aria-hidden="true"></div>
 <div class="intro-lockup">
  <img class="intro-crest" src="${CREST}" alt="">
  <div class="intro-copy"><strong>FLAMENGO</strong><span>PORTAL DO TORCEDOR</span></div>
 </div>
</div>
`;


const matchVisuals=`<section class="flamengo-visual-strip" aria-label="Experiências da central rubro-negra">
 <article class="flamengo-visual visual-score">
  <svg viewBox="0 0 360 220" role="img" aria-label="Ilustração de um placar rubro-negro em um estádio">
   <defs><linearGradient id="stadiumGlow" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e0001b"/><stop offset="1" stop-color="#5b0010"/></linearGradient></defs>
   <path class="v-crowd" d="M0 70C56 30 112 42 180 54s124-16 180 14v152H0z"/>
   <path class="v-light" d="M48 0h9l18 61H29zM303 0h9l19 61h-47z"/>
   <rect class="v-screen" x="72" y="35" width="216" height="118" rx="10"/>
   <text class="v-kicker" x="180" y="61" text-anchor="middle">DIA DE FLAMENGO</text>
   <text class="v-team" x="119" y="107" text-anchor="middle">FLA</text><text class="v-x" x="180" y="106" text-anchor="middle">×</text><text class="v-team" x="241" y="107" text-anchor="middle">RIVAL</text>
   <rect class="v-red" x="94" y="122" width="172" height="5" rx="3"/>
   <path class="v-pitch" d="M38 178h284v42H38z"/><circle class="v-pitch-line" cx="180" cy="199" r="17"/><path class="v-pitch-line" d="M180 178v42M38 199h284"/>
  </svg>
  <div><span>PLACAR</span><strong>O jogo começa aqui.</strong><small>Horário, local, resultado e lances em uma leitura rápida.</small></div>
 </article>
 <article class="flamengo-visual visual-lineup">
  <svg viewBox="0 0 360 220" role="img" aria-label="Ilustração de uma prancheta tática com a escalação do Flamengo">
   <rect class="v-board" x="42" y="16" width="276" height="188" rx="18"/>
   <path class="v-field-line" d="M180 31v157M63 109h234M180 81a28 28 0 1 0 0 56 28 28 0 1 0 0-56M63 64h42v90H63M255 64h42v90h-42"/>
   <g class="v-dots"><circle cx="87" cy="109" r="10"/><circle cx="132" cy="70" r="10"/><circle cx="132" cy="109" r="10"/><circle cx="132" cy="150" r="10"/><circle cx="181" cy="58" r="10"/><circle cx="181" cy="91" r="10"/><circle cx="181" cy="128" r="10"/><circle cx="181" cy="164" r="10"/><circle cx="233" cy="74" r="10"/><circle cx="244" cy="111" r="10"/><circle cx="233" cy="149" r="10"/></g>
   <path class="v-arrow" d="M207 164c34-12 43-35 44-62m0 0-12 13m12-13 9 15"/>
  </svg>
  <div><span>ESCALAÇÃO</span><strong>Prancheta com contexto.</strong><small>Confirmada quando a fonte publica; provável quando usamos a última base disponível.</small></div>
 </article>
 <article class="flamengo-visual visual-prediction">
  <svg viewBox="0 0 360 220" role="img" aria-label="Ilustração de torcedores montando um palpite de placar">
   <path class="v-crowd-back" d="M0 162c38-28 68-24 98 0 34-34 73-32 108 0 32-28 67-26 102 0 17-13 35-18 52-12v70H0z"/>
   <rect class="v-ticket" x="62" y="30" width="236" height="118" rx="16"/>
   <text class="v-kicker" x="180" y="58" text-anchor="middle">PALPITE DA NAÇÃO</text>
   <rect class="v-score-box" x="93" y="77" width="64" height="52" rx="9"/><rect class="v-score-box" x="203" y="77" width="64" height="52" rx="9"/>
   <text class="v-score" x="125" y="114" text-anchor="middle">2</text><text class="v-x" x="180" y="111" text-anchor="middle">×</text><text class="v-score" x="235" y="114" text-anchor="middle">1</text>
   <circle class="v-head" cx="99" cy="177" r="16"/><path class="v-shirt" d="M71 220v-22c0-19 13-30 28-30s29 11 29 30v22"/>
   <circle class="v-head" cx="260" cy="177" r="16"/><path class="v-shirt" d="M232 220v-22c0-19 13-30 28-30s29 11 29 30v22"/>
  </svg>
  <div><span>PALPITE</span><strong>Seu placar, sem enrolação.</strong><small>Monte em poucos toques e acompanhe o ranking quando o serviço global estiver ativo.</small></div>
 </article>
</section>`;

const voteVisual=`<div class="vote-visual" aria-label="Votação da torcida rubro-negra">
 <svg viewBox="0 0 760 250" role="img" aria-label="Ilustração de uma torcida do Flamengo erguendo um troféu">
  <path class="vote-crowd" d="M0 156c74-51 133-36 188 5 53-62 132-61 190 0 54-54 127-52 188 3 57-42 123-41 194 4v82H0z"/>
  <g class="vote-rays"><path d="M380 0v63M254 26l61 57M506 26l-61 57M191 97l91 22M569 97l-91 22"/></g>
  <path class="vote-cup" d="M334 54h92v31c0 41-20 70-46 70s-46-29-46-70zM353 155h54v18h-54zM330 173h100v22H330z"/>
  <path class="vote-handle" d="M334 70h-28c-2 39 16 56 43 60M426 70h28c2 39-16 56-43 60"/>
  <text x="380" y="112" text-anchor="middle" class="vote-crf">CRF</text>
  <circle class="fan-head" cx="196" cy="174" r="19"/><path class="fan-shirt" d="M155 250v-40c0-28 18-45 41-45s42 17 42 45v40"/>
  <circle class="fan-head" cx="565" cy="174" r="19"/><path class="fan-shirt" d="M524 250v-40c0-28 18-45 41-45s42 17 42 45v40"/>
 </svg>
 <div><span>UM TOQUE. UM VOTO.</span><strong>A arquibancada vira ranking.</strong><p>Escolha um jogador e acompanhe o resultado real. Se a conexão com o banco cair, o voto fica protegido neste aparelho.</p></div>
</div>`;

const communityVisual=`<div class="community-visual" aria-label="Debate da torcida">
 <svg viewBox="0 0 920 360" role="img" aria-label="Dois torcedores do Flamengo conversando e discutindo futebol">
  <defs><linearGradient id="fanBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1a0509"/><stop offset=".55" stop-color="#080808"/><stop offset="1" stop-color="#3d0008"/></linearGradient></defs>
  <rect class="cv-bg" width="920" height="360" rx="26"/>
  <path class="cv-stand" d="M0 280c107-64 204-39 300 6 107-72 221-68 320 4 108-69 200-61 300 2v68H0z"/>
  <g class="cv-fan left"><circle class="cv-skin" cx="236" cy="126" r="48"/><path class="cv-hair" d="M189 117c3-45 28-67 57-63 31 4 44 28 39 56-18-14-45-18-73-8z"/><path class="cv-body" d="M137 360v-103c0-62 42-98 99-98s99 36 99 98v103"/><path class="cv-stripe" d="M150 225h172v31H146zM138 288h196v32H138z"/><path class="cv-arm" d="M319 231c44-28 69-33 98-21l-9 31c-23-6-43 2-76 28z"/><circle class="cv-skin" cx="414" cy="224" r="15"/></g>
  <g class="cv-fan right"><circle class="cv-skin" cx="684" cy="126" r="48"/><path class="cv-hair" d="M638 117c8-48 35-68 66-61 28 6 39 30 31 57-19-13-43-16-72-7z"/><path class="cv-body" d="M585 360v-103c0-62 42-98 99-98s99 36 99 98v103"/><path class="cv-stripe" d="M598 225h172v31H594zM586 288h196v32H586z"/><path class="cv-arm" d="M600 228c-44-24-74-28-101-13l12 29c22-8 43-2 76 24z"/><circle class="cv-skin" cx="496" cy="228" r="15"/></g>
  <g class="cv-bubble one"><rect x="83" y="32" width="250" height="72" rx="18"/><path d="M266 101l-5 27 30-27"/><text x="208" y="62" text-anchor="middle">QUEM TEM QUE SER TITULAR?</text><text x="208" y="84" text-anchor="middle">A escalação divide a Nação.</text></g>
  <g class="cv-bubble two"><rect x="587" y="28" width="248" height="72" rx="18"/><path d="M650 98l15 26 15-26"/><text x="711" y="59" text-anchor="middle">E O SEU PALPITE?</text><text x="711" y="82" text-anchor="middle">Fala aí antes da bola rolar.</text></g>
  <circle class="cv-ball" cx="460" cy="300" r="28"/><path class="cv-ball-line" d="M439 285l21-12 21 12-8 24h-26zM460 273v-18M439 285l-16-7M481 285l16-7M447 309l-11 14M473 309l11 14"/>
 </svg>
 <div class="community-visual-copy"><span>DOIS LADOS. A MESMA CAMISA.</span><strong>Debate de arquibancada, não formulário.</strong><p>Opinião, escalação e chat foram desenhados para parecer conversa de torcedor: rápido, direto e com identidade rubro-negra.</p></div>
</div>`;

const liveboard=`<div id="match-liveboard" class="match-liveboard" aria-live="polite">
 <div class="liveboard-loading"><span></span> Preparando o placar do Mengão…</div>
</div>`;

const navigation=()=>`<nav id="navigation" aria-label="Seções">${mobileLanguages}
 <a data-view-link="news" href="#noticias">NOTÍCIAS</a>
 <a data-view-link="matches" href="#jogos">JOGOS</a>
 <a data-view-link="community" href="#comunidade">COMUNIDADE</a>
 <a data-view-link="videos" href="#videos">VÍDEOS</a>
 <a data-view-link="votes" href="#torcida">VOTAÇÕES</a>
 <a data-view-link="groups" href="#grupos">GRUPOS</a>
 <a href="/historia">HISTÓRIA</a>
</nav>`;

const portalMap=`<nav class="portal-map wrap" aria-label="Áreas do portal">
 <a class="portal-sector sector-match" data-view-link="matches" href="#jogos"><img src="/*COVER_MATCHDAY*/" alt="" loading="eager" fetchpriority="high"><span>01 · DIA DE JOGO</span><strong>PLACAR,<br>ESCALAÇÃO<br>E PALPITE.</strong><small>Viver o próximo jogo →</small></a>
 <a class="portal-sector" data-view-link="community" href="#comunidade"><img src="/*COVER_DISCUSSION*/" alt="" loading="lazy"><span>02 · ARQUIBANCADA</span><strong>OPINIÃO,<br>DEBATE<br>E CHAT.</strong><small>Entrar na resenha →</small></a>
 <a class="portal-sector" data-view-link="videos" href="#videos"><img src="/*COVER_VIDEOS*/" alt="" loading="lazy"><span>03 · MEMÓRIA</span><strong>VÍDEOS<br>HISTÓRICOS.</strong><small>Rever jogos eternos →</small></a>
 <a class="portal-sector" data-view-link="votes" href="#torcida"><img src="/*COVER_VOTES*/" alt="" loading="lazy"><span>04 · A NAÇÃO DECIDE</span><strong>VOTAÇÕES<br>E RANKINGS.</strong><small>Colocar meu voto no placar →</small></a>
 <a class="portal-sector" data-view-link="groups" href="#grupos"><img src="/*COVER_GROUPS*/" alt="" loading="lazy"><span>05 · PELO MUNDO</span><strong>GRUPOS DA<br>TORCIDA.</strong><small>Encontrar minha Nação →</small></a>
 <a class="portal-sector" href="/historia"><img src="/*COVER_HISTORY*/" alt="" loading="lazy"><span>06 · ARQUIVO</span><strong>HISTÓRIA<br>RUBRO-NEGRA.</strong><small>Entrar na memória →</small></a>
</nav>`;

const matchdayNow=`<div class="matchday-now">
 <section id="match-pulse" class="match-pulse is-waiting" aria-labelledby="match-pulse-title" aria-live="polite">
  <div class="pulse-head"><div><span class="eyebrow">RADAR DA PARTIDA</span><h3 id="match-pulse-title">O JOGO EM MOVIMENTO</h3></div><button id="goal-sound" class="goal-sound" type="button" aria-pressed="false"><span aria-hidden="true">♪</span><b>ATIVAR SOM DE GOL</b></button></div>
  <div class="pitch-visual" aria-label="Representação visual do lance mais recente">
   <span class="pitch-line center"></span><span class="pitch-circle"></span><span class="pitch-area left"></span><span class="pitch-area right"></span>
   <div id="event-marker" class="event-marker"><span></span></div>
   <div id="event-call" class="event-call"><small>ENTRA NO AR COM A BOLA ROLANDO</small><strong>Placar e lances em atualização automática</strong><span>Finalização, escanteio, falta, cartão, substituição e gol.</span></div>
  </div>
  <ol id="match-events" class="match-events"><li><time>—</time><span><b>CENTRAL PRONTA</b> Acompanhamento aparece aqui quando o jogo começar.</span></li></ol>
  <p id="pulse-source" class="pulse-source">Fonte esportiva identificada · pode haver pequeno atraso</p>
 </section>
 <section class="flatv-live" aria-labelledby="flatv-title">
  <div class="flatv-copy"><span class="eyebrow">VOZ OFICIAL DO MENGÃO</span><h3 id="flatv-title">NARRAÇÃO DA FLA TV</h3><p>Quando a FlaTV abrir uma live do Flamengo, a narração aparece aqui sem prometer imagens da partida.</p></div>
  <div id="flatv-frame" class="flatv-frame"><div class="flatv-poster"><img class="flatv-cover" src="/*COVER_MATCHDAY*/" alt="Torcida rubro-negra e estádio em noite de jogo"><div class="flatv-poster-copy"><span>CHECANDO A FLA TV…</span><button id="flatv-play" type="button" disabled>PROCURANDO LIVE</button><small id="flatv-status">Consultando o canal oficial.</small></div></div></div>
  <a class="flatv-fallback" href="https://www.youtube.com/@flamengo/live" target="_blank" rel="noopener">Abrir a página de lives da FlaTV ↗</a>
 </section>
</div>`;

const goalFlash=`<div id="goal-flash" class="goal-flash" hidden aria-live="assertive" aria-atomic="true"><img src="${CREST}" alt=""><div><span>GOOOOOOL</span><strong>DO FLAMENGO!</strong><small id="goal-flash-score"></small></div></div>`;

const trustbar=`<div class="portal-trust"><div class="wrap"><span><i></i> ATUALIZAÇÃO AUTOMÁTICA</span><span>JOGOS E ESCALAÇÕES · ESPN</span><span>AGENDA · FLAMENGO</span><span>VOTOS REAIS DA TORCIDA</span></div></div>`;

const mobileHub=`<section class="mobile-hub" aria-label="Acesso rápido ao portal">
 <div class="mobile-hub-head"><span>ACOMPANHE O MENGÃO</span><a href="#jogos">CENTRAL DE JOGOS →</a></div>
 <div id="mobile-match" class="mobile-match" aria-live="polite"><div class="mobile-match-loading"><i></i> Carregando o próximo jogo…</div></div>
 <nav class="mobile-quick" aria-label="Atalhos principais">
  <a href="#noticias"><span aria-hidden="true">▰</span><b>NOTÍCIAS</b></a>
  <a href="#jogos"><span aria-hidden="true">◆</span><b>JOGOS</b></a>
  <a href="#comunidade"><span aria-hidden="true">◉</span><b>COMUNIDADE</b></a>
  <a href="#videos"><span aria-hidden="true">▶</span><b>VÍDEOS</b></a>
 </nav>
</section>`;

const mobileDock=`<nav class="mobile-dock" aria-label="Navegação principal">
 <a data-view-link="home" href="#inicio" data-dock="inicio"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-7 9 7v9h-6v-6H9v6H3z"></path></svg><span>INÍCIO</span></a>
 <a data-view-link="news" href="#noticias" data-dock="noticias"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM7 8h5v4H7zm7 0h3M14 12h3M7 15h10"></path></svg><span>NOTÍCIAS</span></a>
 <a data-view-link="matches" href="#jogos" data-dock="jogos"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4zM8 7V4m8 3V4M4 11h16"></path></svg><span>JOGOS</span></a>
 <a data-view-link="community" href="#comunidade" data-dock="comunidade"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4zM8 9h8M8 12h5"></path></svg><span>CHAT</span></a>
 <button id="mobile-more" aria-label="Abrir menu completo" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg><span>MAIS</span></button>
</nav>`;

const mobileLanguages=`<div class="mobile-language" aria-label="Idioma"><span>IDIOMA</span><div><a data-lang="pt" href="/">PT</a><a data-lang="en" href="/en">EN</a><a data-lang="es" href="/es">ES</a></div></div>`;
const navBackdrop=`<button id="nav-backdrop" class="nav-backdrop" aria-label="Fechar menu" hidden></button>`;

const communityShare=`<aside class="community-share"><div class="wrap"><div><span class="eyebrow">A NAÇÃO CABE NO SEU GRUPO</span><strong>LEVE O PORTAL PARA O WHATSAPP.</strong><p>Compartilhe jogos, notícias e votações sem tirar ninguém da conversa.</p></div><button id="share-portal" class="whatsapp-button">COMPARTILHAR O PORTAL ↗</button></div></aside>`;

const videoDialog=`<dialog id="video-player" class="video-dialog"><button class="close" aria-label="Fechar vídeo">×</button><div class="video-shell"><div id="video-frame" class="video-frame"></div><div class="video-info"><span class="eyebrow">ARQUIVO RUBRO-NEGRO</span><h2 id="video-title">Momento histórico</h2><p>O vídeo é reproduzido aqui no portal. O conteúdo e os anúncios do player são fornecidos pelo YouTube.</p><a id="video-youtube" target="_blank" rel="noopener">Abrir no YouTube ↗</a></div></div></dialog>`;

const craque=`<div class="craque-callout">
 <div class="craque-trophy" aria-hidden="true">★</div>
 <div class="craque-copy"><span>VOTAÇÃO PRINCIPAL</span><h3>ELEJA O CRAQUE DO FLAMENGO</h3><p>Escolha um jogador, confirme seu voto e acompanhe a disputa da torcida em tempo real.</p></div>
 <div id="poll-leader" class="poll-leader"><span>A votação está aberta</span><strong>QUEM VAI LIDERAR?</strong></div>
 <a class="craque-vote" href="#poll-question">VOTAR AGORA ↓</a>
</div>`;

const communityZone=`<section id="comunidade" class="community-zone">
 <div class="wrap">
  <div class="section-heading community-heading"><div><span class="eyebrow">VOZ DA ARQUIBANCADA</span><h2>CONVERSA<br>RUBRO-NEGRA<span>.</span></h2></div><div class="fan-identity"><small>VOCÊ ENTRA COMO</small><button id="fan-alias" type="button">Preparando apelido…</button></div></div>
  ${communityVisual}
  <nav class="community-tabs" role="tablist" aria-label="Áreas da comunidade">
   <button type="button" role="tab" aria-selected="true" data-community-tab="opinions"><span>01</span><b>OPINIÕES IMPOPULARES</b><small>Faz sentido ou não?</small></button>
   <button type="button" role="tab" aria-selected="false" data-community-tab="lineup"><span>02</span><b>DEBATE DE ESCALAÇÃO</b><small>Quem merece a vaga?</small></button>
   <button type="button" role="tab" aria-selected="false" data-community-tab="chat"><span>03</span><b>BATE-PAPO DA NAÇÃO</b><small>Conversa em atualização contínua</small></button>
  </nav>
  <div class="community-stage">
   <section class="community-pane" data-community-pane="opinions" aria-labelledby="opinions-title">
    <div class="community-compose opinion-compose"><div><span class="eyebrow">SOLTE A BRABA</span><h3 id="opinions-title">QUAL OPINIÃO SUA DIVIDE A NAÇÃO?</h3></div><label><span class="sr-only">Sua opinião impopular</span><textarea id="opinion-text" maxlength="220" placeholder="Ex.: Eu mudaria o esquema mesmo depois de uma vitória…"></textarea></label><div class="compose-action"><small><b id="opinion-count">0</b>/220</small><button id="opinion-submit" type="button">PUBLICAR OPINIÃO →</button></div><p id="opinion-status" class="small" role="status"></p></div>
    <div class="feed-bar"><div><b>O QUE ESTÁ DIVIDINDO A TORCIDA</b><span id="community-stats">Só entram votos reais</span></div><div class="feed-sort"><button type="button" data-opinion-sort="hot" aria-pressed="true">EM DEBATE</button><button type="button" data-opinion-sort="new" aria-pressed="false">MAIS NOVAS</button></div></div>
    <div id="opinions-feed" class="opinion-feed" aria-live="polite"><div class="loading">Abrindo a arquibancada…</div></div>
   </section>
   <section class="community-pane" data-community-pane="lineup" aria-labelledby="lineup-debate-title" hidden>
    <div class="lineup-debate-head"><div><span class="eyebrow">MONTANDO O TIME</span><h3 id="lineup-debate-title">QUEM PRECISA COMEÇAR JOGANDO?</h3><p id="lineup-debate-game">Escolha um nome e deixe uma frase. Sem formulário demorado.</p></div><span class="debate-whistle" aria-hidden="true">XI</span></div>
    <div id="lineup-picks" class="lineup-picks"><div class="loading">Buscando o elenco…</div></div>
    <div class="lineup-compose"><label><span id="lineup-choice">Escolha um jogador acima</span><input id="lineup-take" maxlength="180" placeholder="Por quê? Uma frase já basta (opcional)"></label><button id="lineup-submit" type="button" disabled>DEFENDER ESSA ESCOLHA →</button><p id="lineup-status" class="small" role="status"></p></div>
    <div id="lineup-feed" class="opinion-feed lineup-feed" aria-live="polite"><div class="loading">Carregando o debate…</div></div>
   </section>
   <section class="community-pane chat-pane" data-community-pane="chat" aria-labelledby="chat-title" hidden>
    <div class="chat-top"><div><span class="live-chat-dot"></span><span class="eyebrow">SALA DA NAÇÃO</span><h3 id="chat-title">BATE-PAPO RUBRO-NEGRO</h3></div><p>Novas mensagens entram automaticamente. Sem números inventados de pessoas online.</p></div>
    <ol id="chat-feed" class="chat-feed" aria-live="polite"><li class="loading">Abrindo a conversa…</li></ol>
    <form id="chat-form" class="chat-compose"><label><span class="sr-only">Mensagem para o bate-papo</span><input id="chat-message" maxlength="240" autocomplete="off" placeholder="Mande sua mensagem para a Nação…"></label><button type="submit">ENVIAR</button></form>
    <div class="chat-foot"><span id="chat-status" role="status">Atualização a cada 5 segundos</span><button id="chat-refresh" type="button">↻ ATUALIZAR</button></div>
   </section>
  </div>
  <p class="community-rules">Respeito é regra: sem links, ataques pessoais ou spam. Conteúdo denunciado pode sair do ar para revisão.</p>
 </div>
</section>
<dialog id="alias-dialog" class="alias-dialog"><button class="close" aria-label="Fechar">×</button><span class="eyebrow">SEU NOME NA ARQUIBANCADA</span><h2>COMO A NAÇÃO VAI TE CHAMAR?</h2><p>O portal já criou um apelido. Mude apenas se quiser.</p><form id="alias-form"><label>Apelido<input id="alias-input" maxlength="24" required></label><button class="primary">SALVAR APELIDO</button></form></dialog>`;

const portalAd=`<aside class="advert wrap portal-ad" aria-label="Espaço de publicidade"><span>PUBLICIDADE</span><div>Espaço reservado</div><small>Responsivo</small></aside>`;

export function upgradeHome(value,covers={}){
 return value
  .replace(/<div id="intro"[\s\S]*?(?=<div class="topline">)/,intro)
  .replace('</header>','</header>'+trustbar+navBackdrop)
  .replace(/<nav id="navigation" aria-label="Seções">[\s\S]*?<\/nav>/,navigation())
  .replace('<div class="header-actions">','<div class="header-actions"><nav class="language-switcher desktop-language" aria-label="Idioma"><a data-lang="pt" href="/">PT</a><a data-lang="en" href="/en">EN</a><a data-lang="es" href="/es">ES</a></nav>')
  .replace('<main id="inicio">','<main id="inicio"><span id="conteudo" class="content-anchor" tabindex="-1"></span>'+mobileHub+'<section id="route-banner"></section>')
  .replace(/<nav class="archive-entry wrap">[\s\S]*?<\/nav>/,portalMap)
  .replace('<div id="matches" class="match-grid">',matchVisuals+liveboard+matchdayNow+'<div id="matches" class="match-grid">')
  .replace('<div class="poll-tabs"',voteVisual+craque+'<div class="poll-tabs"')
  .replace('<section id="grupos"',communityZone+communityShare+'<section id="grupos"')
  .replace('</div></div><aside class="group-submit">','</div><button id="more-groups" class="wide-button" hidden>CARREGAR MAIS GRUPOS ↓</button></div><aside class="group-submit">')
  .replace('href="https://youtu.be/MAK86Imhwww?si=PhTPpIa4SHjAJSOv" target="_blank" rel="noopener"','href="https://www.youtube.com/watch?v=MAK86Imhwww" data-video="MAK86Imhwww" data-video-title="Flamengo 3 × 0 Liverpool · Mundial 1981"')
  .replace('href="https://youtu.be/zeJ3KpmgIwA?si=yefLOQiLpiHKlUEr" target="_blank" rel="noopener"','href="https://www.youtube.com/watch?v=zeJ3KpmgIwA" data-video="zeJ3KpmgIwA" data-video-title="Flamengo 2 × 1 River Plate · Libertadores 2019"')
  .replace('href="https://youtu.be/ycpt3nSK4QE?si=-jJ2-m4kgJo4Cpgi" target="_blank" rel="noopener"','href="https://www.youtube.com/watch?v=ycpt3nSK4QE" data-video="ycpt3nSK4QE" data-video-title="Santos 4 × 5 Flamengo · Brasileiro 2011"')
  .replaceAll('Assistir no YouTube ↗','ASSISTIR AQUI ▶')
  .replace('<dialog id="details">',videoDialog+'<dialog id="details">')
  .replace('<div id="toast"',mobileDock+goalFlash+'<div id="toast"')
  .replace('<section class="ratings-panel"><div class="ratings-copy">','<details class="ratings-panel"><summary><span>DÊ SUA NOTA</span><strong>Avaliar os jogadores</strong><small>Opcional · abre depois do jogo</small></summary><div class="ratings-body"><div class="ratings-copy">')
  .replace('</div></section><p class="small match-sources">','</div></div></details><p class="small match-sources">')
  .replace('<div class="player-tools">','<details class="player-finder"><summary>PROCURAR OUTRO JOGADOR</summary><div class="player-tools">')
  .replace('</select></div><p id="roster-date"','</select></div></details><p id="roster-date"')
  .replace('<aside class="group-submit"><span class="eyebrow">CADASTRE O SEU</span>','<details class="group-submit"><summary><span>CADASTRAR MEU GRUPO</span><small>Abre o envio para análise</small></summary><div class="group-submit-body"><span class="eyebrow">CADASTRE O SEU</span>')
  .replace('</form></aside></div></div></section>','</form></div></details></div></div></section>')
  .replace('AGENDA RUBRO-NEGRA','PRÓXIMO JOGO E RESULTADOS')
  .replace('CENTRAL DE<br>JOGOS','DIA DE<br>FLAMENGO')
  .replace('PRANCHETA','TIME EM CAMPO')
  .replace('ESCALAÇÃO DO JOGO','ESCALAÇÕES')
  .replace('TERMÔMETRO DA NAÇÃO','PALPITE DA TORCIDA')
  .replace('QUEM VENCE?','QUAL VAI SER O PLACAR?')
  .replace('APITO FINAL','DÊ SUA NOTA')
  .replace('NOTAS DA NAÇÃO','AVALIE O TIME')
  .replace('OPINIÃO TEM NOME E ROSTO','A ESCOLHA É DA TORCIDA')
  .replace('A NAÇÃO<br>DECIDE','CRAQUE DA<br>TORCIDA')
  .replace('★ Melhor do elenco','🏆 Eleger o craque')
  .replace('Quem é o melhor do elenco?','Quem merece o troféu da torcida?')
  .replace('CONFIRMAR VOTO ↗','DAR MEU VOTO ↗')
  .replace('Selecione um jogador para votar.','Toque em um jogador e confirme.')
  .replace('Dê uma nota de 1 a 10. A média só mostra votos reais da torcida.','Avalie só quem quiser. Arraste a nota e ela será salva ao soltar.')
  .replace('Agenda e local: site oficial do Flamengo. Escalações e probabilidades aparecem somente quando disponibilizadas pela fonte identificada. Palpites e notas são da torcida.','Jogos e locais vêm do Flamengo e da ESPN. Escalações confirmadas vêm da ficha da partida. Em jogos futuros, o time aparece como provável e mostra qual partida serviu de base. Palpites e notas são da torcida.')
  .replace('Buscando jogos do Flamengo…','Buscando placar, horário e escalações…')
  .replace('</div><div id="lineup" aria-live="polite">','</div><aside id="where-to-watch" class="where-to-watch" aria-live="polite"><span class="eyebrow">ONDE ACOMPANHAR</span><strong>Consultando a ficha da partida…</strong></aside><div id="lineup" aria-live="polite">')
  .replace('/*COVER_MATCHDAY*/',covers.matchday||'')
  .replace('/*COVER_MATCHDAY*/',covers.matchday||'')
  .replace('/*COVER_DISCUSSION*/',covers.discussion||'')
  .replace('/*COVER_VIDEOS*/',covers.videos||'')
  .replace('/*COVER_VOTES*/',covers.votes||'')
  .replace('/*COVER_GROUPS*/',covers.groups||'')
  .replace('/*COVER_HISTORY*/',covers.history||'')
  .replace('</main>',portalAd+'</main>');
}
