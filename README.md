<h1>Talker Manager</h1>
<p>Este projeto foi desenvolvido em outubro de 2022 durante meus estudos na <a href="https://www.betrybe.com/">Trybe</a>.</p>

<br/>

<h2>O quê foi desenvolvido</h2>
<p>Foi desenvolvido um CRUD (Create, Read, Update e Delete) de palestrantes utilizando o módulo <a href="https://nodejs.org/api/fs.html">fs</a> para ler e escrever arquivos.<p>
<br/>
  
<h2>O quê foi avaliado</h2>
<ul>
  <li>Aderência do código às especificações;</li>
  <li>Organização do código. Uso de middlewares e routers.</li>
</ul>

<br/>

<h2>Endpoints</h2>

 <h3>/login</h3>

| Método | Função | Corpo |
|---|---|---|
|POST| Realiza login e retorna o token | { "email": string, "password": string } |

<hr/>

<h3>/talker</h3>

| Método | Função | Corpo |
|---|---|---|
|GET| Retorna todas as pessoas palestrantes | |
|POST| Cadastra pessoa palestrante | { "name": string, "age": number, "talk": { "watchedAt": string(DD/MM/YYYY), "rate": number } } |

<h3>/talker/:id</h3>

| Método | Função | Corpo |
|---|---|---|
|GET| Retorna pessoa palestrante com base no id | |
|PUT| Edita pessoa palestrante com base no id | { "name": string, "age": number, "talk": { "watchedAt": string(DD/MM/YYYY), "rate": number } } |
|DELETE| Deleta pessoa palestrante com base no id | |

<h3>/talker/search?q=searchTerm</h3>

| Método | Função | Corpo |
|---|---|---|
|GET| Retorna palestrantes que contenham em seu nome o termo pesquisado | |

<br/>

<h2>Guia de instalação</h2> 
<ol>
  <li>
    <p>Clone o repositório</p>
    <pre>git clone git@github.com:celso-rodrigo/talker-manager.git</pre>
  </li>
  <li>
    <p>Abra a pasta do repositório</p>
  </li>
  <li>
    <p>Instale as dependências</p>
    <pre>npm install</pre>
  </li>
  <li>
    <p>Inicie o projetot</p>
    <pre>npm start</pre>
  </li>
</ol>
