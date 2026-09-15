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

## Publicar pelo GitHub e Netlify

1. Crie um repositório vazio no GitHub e envie esta pasta para ele.
2. No Netlify, escolha **Add new project → Import an existing project** e conecte o repositório.
3. O Netlify lerá `netlify.toml`: o build é `npm run build`, o diretório publicado é `dist` e o portal é executado por uma Edge Function.
4. Defina o domínio final no Netlify antes de divulgar o site.

### Banco das votações e da comunidade

O ambiente atual usa Cloudflare D1 para votos, palpites, notas e grupos. D1 não é disponibilizado automaticamente em um deploy do Netlify. Para impedir votos falsos ou dados descartáveis, a adaptação do Netlify deixa essas rotas indisponíveis até existir um serviço persistente.

No painel do Netlify, crie a variável de ambiente:

```text
PORTAL_BACKEND_ORIGIN=https://api.seu-dominio.com
```

A Edge Function encaminhará somente as rotas persistentes para esse serviço. Notícias, calendário, páginas, vídeos, SEO e idiomas continuam sendo servidos pelo próprio projeto. Uma implantação definitiva pode manter um Worker público para os dados ou migrar as tabelas de `drizzle/` para um Postgres compatível.

## Estrutura

- `src/`: portal, estilos, scripts, fontes e integrações.
- `drizzle/`: migrações do banco atual.
- `netlify/edge-functions/`: adaptador para o Netlify.
- `.github/workflows/ci.yml`: build e validação automáticos no GitHub.
- `.openai/hosting.json`: configuração da implantação atual em Sites.

Este é um projeto independente, sem vínculo oficial com o Clube de Regatas do Flamengo. Notícias e imagens permanecem atribuídas às fontes indicadas no portal.
