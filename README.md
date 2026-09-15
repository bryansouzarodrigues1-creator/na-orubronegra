# Nação Rubro-Negra

Portal independente para a torcida do Flamengo, com notícias organizadas por data, agenda, placar, escalações, palpites, notas dos jogadores, votações do elenco, memória histórica e diretório de grupos.

## Rodar e validar

Requisitos: Node.js 22 e npm.

```bash
npm ci
npm run build
npm run validate
```

O artefato principal é gerado em `dist/server/index.js`.

## Publicar no Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/bryansouzarodrigues1-creator/na-orubronegra)

Também é possível escolher **Add new project → Import an existing project** e conectar este repositório. O Netlify lerá `netlify.toml`, executará `npm run build` com Node.js 22 e publicará o portal por uma Edge Function. Nenhuma configuração de diretório precisa ser preenchida manualmente.

Depois do primeiro deploy:

1. Abra o endereço `*.netlify.app` e confira notícias, jogos, vídeos e idiomas.
2. Configure o domínio final antes de indexar o portal no Google.
3. Para habilitar votos, palpites, notas, grupos e comunidade, configure o backend persistente descrito abaixo.

### Banco das votações e da comunidade

O ambiente atual usa Cloudflare D1 para votos, palpites, notas e grupos. D1 não é disponibilizado automaticamente em um deploy do Netlify. Para impedir votos falsos ou dados descartáveis, a adaptação do Netlify deixa essas rotas indisponíveis até existir um serviço persistente.

No painel do Netlify, crie a variável de ambiente:

```text
PORTAL_BACKEND_ORIGIN=https://api.seu-dominio.com
```

Se o backend exigir autenticação entre servidores, adicione também `PORTAL_BACKEND_TOKEN` no painel. Não salve tokens no GitHub.

A Edge Function encaminhará somente as rotas persistentes para esse serviço. Notícias, calendário, páginas, vídeos, SEO e idiomas continuam sendo servidos pelo próprio projeto. Uma implantação definitiva pode manter um Worker público para os dados ou migrar as tabelas de `drizzle/` para um Postgres compatível.

## Estrutura

- `src/`: portal, estilos, scripts, fontes e integrações.
- `drizzle/`: migrações do banco atual.
- `netlify/edge-functions/`: adaptador para o Netlify.
- `netlify/static/`: diretório público mínimo; as páginas são produzidas pela Edge Function.
- `.github/workflows/ci.yml`: build e validação automáticos no GitHub.
- `.openai/hosting.json`: configuração da implantação atual em Sites.

Este é um projeto independente, sem vínculo oficial com o Clube de Regatas do Flamengo. Notícias e imagens permanecem atribuídas às fontes indicadas no portal.
