# L&O Nexus — Demonstração estática (front-end)

Protótipo navegável em **HTML, CSS e JavaScript puro**, sem build, sem dependências e sem
backend, feito para portfólio/demonstração no GitHub Pages.

## O que este projeto é

Uma reprodução visual e de navegação da interface do **L&O Nexus**, o portal de operações
real do projeto, que é construído em **Laravel 13** com autenticação própria, banco de
dados, controle de acesso por papel e integração com Power BI e SharePoint (ver
[especificação completa do sistema real](../lo-nexus/docs/)).

Aqui você encontra:

- Layout e identidade visual (paleta "boost neon", tema claro/escuro alternável,
  tipografia, componentes) copiados de `resources/css/app.css` do app real;
- Navegação por **Áreas** (grupos colapsáveis na barra lateral) + módulos gerais
  (Dashboards, Sistemas, Documentos, Comunicados), replicando a estrutura real de navegação;
- Telas de Visão Geral, Dashboards, Sistemas, Documentos e Comunicados, navegáveis;
- Dados **fictícios** (prefixo `[DEMO]`), carregados de arquivos JSON estáticos em `data/`
  — inspirados na estrutura real (categorias, tipos de integração, chips de status), mas com
  nomes de sistemas e conteúdo de comunicados inventados, para não expor informação
  operacional real em um repositório público;
- Favoritos e estado do menu lateral/tema persistidos apenas no `localStorage` do seu
  navegador — conveniência de protótipo, não um recurso real do sistema;
- Uma tela de login **puramente visual**, que não valida nem envia nenhuma credencial.

## O que este projeto **não é**

Este protótipo **não tem servidor, não tem banco de dados e não autentica ninguém**.
Ele não deve ser confundido com o sistema real nem usado como se fosse:

- Não há login funcional, sessão, papéis ou permissões;
- Não há controle de acesso a documento, dashboard ou dado nenhum — tudo o que aparece
  aqui é público a qualquer pessoa que abra a página;
- Não há registro de acesso, auditoria ou LGPD — porque não há nada para registrar;
- Os itens marcados `[DEMO]` são fictícios e não representam dados reais da operação.

Se você está procurando a implementação funcional, ela está em `../lo-nexus` (Laravel 13,
documentação completa em `docs/`).

## Como rodar localmente

Não precisa de servidor Node nem PHP — é só abrir `index.html` no navegador, ou servir a
pasta com qualquer servidor estático:

```bash
npx serve .
# ou
python -m http.server 8000
```

## Estrutura

```
lo-nexus-demo/
├── index.html          Visão Geral
├── dashboards.html      Catálogo de dashboards
├── sistemas.html        Central de sistemas
├── documentos.html      Catálogo de documentos
├── comunicados.html      Avisos e alertas
├── login.html           Tela de login (mock, sem autenticação)
├── css/styles.css       Tokens de design e estilos
├── js/app.js             Menu, favoritos (localStorage) e carregamento de dados
└── data/*.json           Dados fictícios do protótipo
```

## Publicando no GitHub Pages

1. Criar um repositório (ex: `lo-nexus-demo`) e enviar este conteúdo;
2. Settings → Pages → Deploy from branch → `main` / raiz;
3. A URL pública servirá diretamente estes arquivos estáticos.
