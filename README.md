# Ritmo — treino a dois

Aplicativo web instalável (PWA) para vocês usarem no iPhone como ícone de app. Inclui perfil, plano semanal conjunto, treino com ilustrações, check-in com foto, alimentação ligada ao foco do perfil, acompanhamento diário e chat privado para duas contas.

## Publicar online sem pagar

O app é hospedado no GitHub Pages e usa o Supabase para login, banco de dados, chat e fotos. A página e o código são públicos; os dados do casal ficam protegidos por autenticação e políticas do banco.

### 1. Criar o banco e o login no Supabase

1. Entre em [supabase.com](https://supabase.com) e crie uma conta gratuita. Crie um projeto no plano Free e guarde a senha do banco em um lugar seguro.
2. Quando o projeto terminar de iniciar, abra **SQL Editor → New query**.
3. No seu computador, abra `supabase/schema.sql`, copie o arquivo inteiro, cole no editor SQL e clique em **Run**. Isso prepara login, tabelas, fotos privadas e as regras de acesso do casal.
4. No painel do projeto, abra **Connect** (ou **Settings → API Keys**). Copie **Project URL** e **Publishable key** (ou a chave `anon` legada). Confira que a URL do projeto termina em `.supabase.co`, não `.supabase.com`. Não copie a chave `service_role`/`secret`.

Ao atualizar o app com campos novos no banco (por exemplo, duração de cardio), execute novamente o `supabase/schema.sql`; as alterações de coluna usam `IF NOT EXISTS`.

### 2. Configurar e publicar os arquivos no GitHub Pages

1. Abra `supabase-config.js` no seu computador. Substitua `COLE_A_URL_DO_SEU_PROJETO` pela URL copiada e `COLE_A_CHAVE_PUBLISHABLE_OU_ANON` pela chave publishable. Salve o arquivo. Essa chave de navegador é pública por projeto; nunca use a chave secreta/service_role aqui.
2. Entre em [github.com](https://github.com), crie uma conta gratuita e um repositório novo, por exemplo `ritmo-treino`. Para GitHub Pages no plano gratuito, o repositório precisa ser **público**.
3. Envie para esse repositório os arquivos e pastas deste projeto: `index.html`, `styles.css`, `app.js`, `training.js`, `social.js`, `supabase-config.js`, `manifest.webmanifest`, `sw.js`, `assets` e `supabase`. Não envie dados pessoais.
4. No repositório, abra **Settings → Pages**. Em **Build and deployment**, escolha **Deploy from a branch**; selecione a branch `main` e a pasta `/ (root)`; clique em **Save**.
5. Aguarde o endereço aparecer nessa tela. Ele será parecido com `https://SEU-USUARIO.github.io/ritmo-treino/`.

### 3. Permitir o endereço no Supabase

1. Volte ao Supabase e abra **Authentication → URL Configuration**.
2. Em **Site URL**, coloque o endereço publicado completo.
3. Em **Redirect URLs**, adicione também o mesmo endereço. Salve.
4. Em **Authentication → Sign In / Providers → Email**, deixe o provedor de e-mail habilitado. Com confirmação de e-mail ligada, cada um precisa abrir o e-mail recebido antes de entrar no app. Se não usarem confirmação, desative-a nessa opção do Supabase.

### 4. Criar o espaço só de vocês

1. Abra o endereço publicado no Safari do iPhone e entre em **Chat**.
2. Crie uma conta com seu e-mail e uma senha. Confirme o e-mail se solicitado.
3. Toque em **Criar grupo e gerar convite** e envie o código somente para sua esposa.
4. Ela abre o mesmo endereço, cria a própria conta, confirma o e-mail se solicitado e cola o código em **Entrar no grupo**.
5. Cada um preenche seu perfil. Escolham dias de treino em comum; o plano monta a rotina compartilhada e adapta as opções conforme os perfis.
6. Depois que as duas contas estiverem criadas, você pode voltar ao Supabase em **Authentication → Settings** e desligar **Allow new users to sign up**. Vocês continuam entrando normalmente, mas novas contas não poderão ser criadas no projeto. [Configuração de autenticação](https://supabase.com/docs/guides/auth/general-configuration)

### 5. Instalar como ícone no iPhone

No iPhone de cada um: abra o link no Safari → toque em **Compartilhar** → **Adicionar à Tela de Início** → confirme **Adicionar**. O ícone abre o Ritmo numa janela própria. Chat, login e sincronização precisam de internet.

## O que é público e o que é privado

O repositório e a página do GitHub Pages são públicos no plano gratuito, então outras pessoas podem ver o código, abrir a página e criar uma conta. Isso não as coloca no grupo de vocês: o banco exige autenticação e as regras do projeto limitam os perfis, mensagens e check-ins aos integrantes do mesmo grupo de duas pessoas. As fotos ficam em armazenamento privado. Não coloque nome, peso, e-mail, senha ou foto no código. Para manter também o código/repositório privado, GitHub Pages no plano gratuito não atende a esse requisito.

O Supabase Free oferece cotas adequadas para uso leve de duas pessoas, mas projetos com pouca atividade por uma semana podem ser pausados e precisam ser reativados no painel. Cotas e regras podem mudar: [planos e cotas](https://supabase.com/docs/guides/platform/billing-on-supabase) · [pausa por inatividade](https://supabase.com/docs/guides/platform/free-project-pausing).

## Como o plano de treino trata observações e lesões

- Uma observação em texto livre serve de contexto: não bloqueia a rotina nem pausa exercícios automaticamente.
- Se uma região estiver selecionada no perfil, o gerador tenta escolher outra variação do mesmo padrão de movimento que não esteja marcada para aquela região. Se o catálogo não tiver alternativa, o exercício continua visível com aviso para vocês avaliarem; o app não determina segurança clínica.
- Parem se um movimento causar dor e busquem orientação profissional. O app não é ferramenta de diagnóstico ou reabilitação.
- O plano considera dias juntos, duração, equipamento, experiência e objetivo. As ilustrações são esquemas educativos originais, não vídeos validados de execução.
- A área de alimentação organiza hábitos gerais; não calcula calorias nem prescreve dieta individual.
- A tela de alimentação agora mostra um exemplo diário flexível ajustado ao foco informado no perfil, sem metas calóricas.
- Os cartões da semana permitem marcar um treino como concluído e renomear o dia. O nome escolhido fica salvo neste aparelho; as marcações usam a data e aparecem desmarcadas na semana seguinte.
- A área de progresso inclui medalhas por treinos, sequência e tempo de cardio. Para medalhas de tempo, registre os minutos no check-in.

As recomendações são uma base educativa inspirada na posição do ACSM de 2026, não uma cópia de rotinas de fisiculturistas nem uma prescrição médica. [Posição do ACSM](https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/)

