const routes={
 pt:{
  home:'/',news:'/noticias',matches:'/jogos',videos:'/videos',votes:'/torcida',community:'/comunidade',groups:'/grupos'
 },
 en:{
  home:'/en',news:'/en/news',matches:'/en/matches',videos:'/en/videos',votes:'/en/vote',community:'/en/community',groups:'/en/groups'
 },
 es:{
  home:'/es',news:'/es/noticias',matches:'/es/partidos',videos:'/es/videos',votes:'/es/votar',community:'/es/comunidad',groups:'/es/grupos'
 }
};

const copy={
 pt:{
  home:{title:'Flamengo: notícias, jogos, torcida e história | Nação Rubro-Negra',description:'Portal independente do Flamengo com notícias recentes, placar, agenda, escalações, vídeos históricos, votações e comunidade.'},
  news:{kicker:'ÚLTIMAS DO FLAMENGO',title:'NOTÍCIAS DA NAÇÃO.',lead:'Manchetes organizadas por horário, com fonte e atualização automática.',meta:'Flamengo hoje: últimas notícias | Nação Rubro-Negra',description:'Últimas notícias do Flamengo organizadas por horário, com fontes identificadas e atualização automática.'},
  matches:{kicker:'CENTRAL DE JOGOS',title:'DIA DE FLAMENGO.',lead:'Placar, agenda, cronômetro, lances, escalações e palpites no mesmo lugar.',meta:'Jogos do Flamengo: placar, escalação e agenda | Nação Rubro-Negra',description:'Acompanhe jogos do Flamengo, placar, horário, local, escalações, lances e palpites da torcida.'},
  videos:{kicker:'ARQUIVO RUBRO-NEGRO',title:'JOGOS QUE VIRARAM LENDA.',lead:'Grandes noites do Flamengo para assistir sem sair do portal.',meta:'Vídeos históricos do Flamengo | Nação Rubro-Negra',description:'Assista no portal a vídeos de jogos históricos do Flamengo, incluindo 1981, 2011 e a Libertadores de 2019.'},
  votes:{kicker:'A NAÇÃO DECIDE',title:'SEU VOTO ENTRA EM CAMPO.',lead:'Escolha, confirme e veja o ranking da torcida mudar.',meta:'Votações do Flamengo e ranking da torcida | Nação Rubro-Negra',description:'Vote nos jogadores do Flamengo e acompanhe rankings reais da torcida.'},
  community:{kicker:'ARQUIBANCADA ABERTA',title:'A CONVERSA CONTINUA AQUI.',lead:'Opiniões impopulares, debate de escalação e bate-papo rubro-negro.',meta:'Comunidade do Flamengo: opiniões, escalação e chat | Nação Rubro-Negra',description:'Participe de opiniões impopulares, debate a escalação do Flamengo e converse com outros rubro-negros.'},
  groups:{kicker:'NAÇÃO SEM FRONTEIRAS',title:'GRUPOS RUBRO-NEGROS.',lead:'Encontre torcedores da sua região e entre pelo WhatsApp.',meta:'Grupos de WhatsApp do Flamengo | Nação Rubro-Negra',description:'Diretório moderado de grupos de WhatsApp de torcedores do Flamengo por região e tema.'}
 },
 en:{
  home:{title:'Flamengo news, matches, supporters and history | Nação Rubro-Negra',description:'An independent Flamengo portal with recent news, scores, fixtures, lineups, historic videos, polls and community.'},
  news:{kicker:'LATEST FLAMENGO NEWS',title:'NEWS FROM THE NATION.',lead:'Headlines ordered by time, with sources and automatic updates.',meta:'Flamengo latest news | Nação Rubro-Negra',description:'Latest Flamengo news ordered by time, with identified sources and automatic updates.'},
  matches:{kicker:'MATCH CENTRE',title:'FLAMENGO MATCHDAY.',lead:'Scores, fixtures, countdown, events, lineups and predictions in one place.',meta:'Flamengo matches, scores and lineups | Nação Rubro-Negra',description:'Follow Flamengo matches, scores, kickoff times, venues, lineups, events and supporter predictions.'},
  videos:{kicker:'RED-AND-BLACK ARCHIVE',title:'MATCHES THAT BECAME LEGEND.',lead:'Great Flamengo nights to watch without leaving the portal.',meta:'Historic Flamengo videos | Nação Rubro-Negra',description:'Watch videos of historic Flamengo matches inside the portal.'},
  votes:{kicker:'SUPPORTERS DECIDE',title:'YOUR VOTE ENTERS THE PITCH.',lead:'Choose, confirm and watch the supporter ranking move.',meta:'Flamengo polls and supporter rankings | Nação Rubro-Negra',description:'Vote for Flamengo players and follow real supporter rankings.'},
  community:{kicker:'OPEN STANDS',title:'THE CONVERSATION LIVES HERE.',lead:'Unpopular opinions, lineup debate and red-and-black chat.',meta:'Flamengo community, opinions and chat | Nação Rubro-Negra',description:'Share unpopular opinions, debate Flamengo lineups and chat with other supporters.'},
  groups:{kicker:'SUPPORTERS EVERYWHERE',title:'RED-AND-BLACK GROUPS.',lead:'Find supporters in your region and join through WhatsApp.',meta:'Flamengo WhatsApp groups | Nação Rubro-Negra',description:'A moderated directory of Flamengo supporter WhatsApp groups by region and topic.'}
 },
 es:{
  home:{title:'Noticias, partidos, hinchada e historia de Flamengo | Nação Rubro-Negra',description:'Portal independiente de Flamengo con noticias, resultados, calendario, alineaciones, vídeos históricos, votaciones y comunidad.'},
  news:{kicker:'ÚLTIMAS DE FLAMENGO',title:'NOTICIAS DE LA HINCHADA.',lead:'Titulares por horario, con fuente y actualización automática.',meta:'Últimas noticias de Flamengo | Nação Rubro-Negra',description:'Últimas noticias de Flamengo ordenadas por horario, con fuentes identificadas y actualización automática.'},
  matches:{kicker:'CENTRAL DE PARTIDOS',title:'DÍA DE FLAMENGO.',lead:'Marcador, calendario, cronómetro, jugadas, alineaciones y pronósticos.',meta:'Partidos de Flamengo, resultados y alineaciones | Nação Rubro-Negra',description:'Sigue los partidos de Flamengo, resultados, horarios, lugares, alineaciones, jugadas y pronósticos.'},
  videos:{kicker:'ARCHIVO ROJINEGRO',title:'PARTIDOS QUE SE HICIERON LEYENDA.',lead:'Grandes noches de Flamengo sin salir del portal.',meta:'Vídeos históricos de Flamengo | Nação Rubro-Negra',description:'Mira vídeos de partidos históricos de Flamengo dentro del portal.'},
  votes:{kicker:'LA HINCHADA DECIDE',title:'TU VOTO ENTRA AL CAMPO.',lead:'Elige, confirma y mira cómo cambia el ranking.',meta:'Votaciones de Flamengo y ranking de la hinchada | Nação Rubro-Negra',description:'Vota por los jugadores de Flamengo y sigue rankings reales de la hinchada.'},
  community:{kicker:'GRADA ABIERTA',title:'LA CONVERSACIÓN SIGUE AQUÍ.',lead:'Opiniones impopulares, debate de alineación y chat rojinegro.',meta:'Comunidad de Flamengo, opiniones y chat | Nação Rubro-Negra',description:'Comparte opiniones impopulares, debate la alineación de Flamengo y conversa con otros hinchas.'},
  groups:{kicker:'HINCHADA SIN FRONTERAS',title:'GRUPOS ROJINEGROS.',lead:'Encuentra hinchas de tu región y entra por WhatsApp.',meta:'Grupos de WhatsApp de Flamengo | Nação Rubro-Negra',description:'Directorio moderado de grupos de WhatsApp de hinchas de Flamengo por región y tema.'}
 }
};

const byPath=new Map();
for(const [locale,views] of Object.entries(routes))for(const [view,path] of Object.entries(views))byPath.set(path,{locale,view,path});

export const portalPaths=[...byPath.keys()];
export function resolvePortalRoute(path){return byPath.get(path)||null;}
export function portalPath(locale,view){return routes[locale]?.[view]||routes.pt[view]||'/';}
export function portalRouteMeta(route){const value=copy[route.locale][route.view];return {title:value.meta||value.title,description:value.description};}

export function portalAlternates(view){return {pt:portalPath('pt',view),en:portalPath('en',view),es:portalPath('es',view)};}

function routeBanner(route){
 if(route.view==='home')return '';
 const value=copy[route.locale][route.view];
 return '<section class="route-banner wrap" aria-labelledby="route-title"><span>'+value.kicker+'</span><h1 id="route-title">'+value.title+'</h1><p>'+value.lead+'</p></section>';
}

export function decoratePortalRoute(value,route){
 let html=value.replace('<body data-locale="'+route.locale+'">','<body data-locale="'+route.locale+'" data-view="'+route.view+'">').replace('<section id="route-banner"></section>',routeBanner(route));
 const viewLinks={inicio:'home',noticias:'news',jogos:'matches',videos:'videos',torcida:'votes',comunidade:'community',grupos:'groups'};
 for(const [anchor,view] of Object.entries(viewLinks))html=html.replaceAll('href="#'+anchor+'"','href="'+portalPath(route.locale,view)+'"');
 html=html.replace(/(data-lang="(?:pt|en|es)" href="[^"]*") aria-current="page"/g,'$1');
 for(const locale of Object.keys(routes))html=html.replace(new RegExp('data-lang="'+locale+'" href="[^"]*"','g'),'data-lang="'+locale+'" href="'+portalPath(locale,route.view)+'"'+(locale===route.locale?' aria-current="page"':''));
 html=html.replaceAll('data-view-link="'+route.view+'"','data-view-link="'+route.view+'" aria-current="page"');
 return html;
}
