# Pokédex Full Stack — React + Spring Boot + MongoDB

Aplicação **full stack** que transforma a Pokédex desenvolvida na Atividade 03 (React + Vite) em um sistema completo: o front-end consome uma **API REST em Spring Boot**, que persiste os dados em um banco **MongoDB (Atlas)**.

Projeto desenvolvido para a disciplina **DIAW — Desenvolvimento e Integração de Aplicações Web**, do curso de Engenharia de Software da **PUC Minas** (campus Lourdes).

```text
React + Vite  ──►  Spring Boot REST API  ──►  MongoDB Atlas
 (frontend)            (backend)               (banco de dados)
```

---

## ✨ Funcionalidades

**Pokédex**
- Lista de Pokémon em cards, com ID, nome, tipos e os 6 atributos (HP, Attack, Defense, Special Attack, Special Defense e Speed).
- Pesquisa por **nome** ou **ID**, atualizada conforme o usuário digita.
- Filtro por **tipo** (os tipos são calculados a partir dos Pokémon cadastrados).
- Modal de **detalhes** com barras de atributos.
- Mensagem amigável quando nenhum Pokémon é encontrado.
- Estados de **carregamento** e de **erro** quando o backend não está disponível.

**Pokémon integrados à API**
- ✏️ Editar Pokémon.
- 🗑️ Excluir Pokémon (com confirmação).
- O cadastro de novos Pokémon não está disponível na interface; o endpoint `POST /api/pokemons` continua existindo na API.

**Extras**
- ⭐ Favoritos (salvos no `localStorage` do navegador) e filtro "somente favoritos".
- 🎲 Pokémon aleatório.
- 📊 Ordenação por ID, nome e por cada atributo.
- 🧑‍🚀 **CRUD de treinadores**: cada pessoa pode criar o seu próprio treinador, informando o nome e escolhendo o time (até 6 Pokémon, com busca por nome ou ID), além de editar e excluir treinadores. Os times aparecem com Pokémon repetidos agrupados (ex.: "Venonat x3").
- 🎨 Cores por tipo, tema escuro e layout responsivo.

---

## 🛠️ Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end | React, Vite, JavaScript (JSX), CSS |
| Back-end | Java 25, Spring Boot 4, Spring Web, Spring Data MongoDB, Maven |
| Banco de dados | MongoDB Atlas |

---

## 📁 Estrutura do projeto

```text
Pokedex/
├── backend/
│   ├── src/main/java/com/pokedex/
│   │   ├── config/          # CORS, DataSeeder e SqlInsertParser (carga a partir do .sql)
│   │   ├── controller/      # PokemonController e TrainerController (endpoints REST)
│   │   ├── model/           # Pokemon, Stats, PokemonType, Trainer
│   │   ├── repository/      # PokemonRepository e TrainerRepository (Spring Data MongoDB)
│   │   ├── service/         # PokemonService e TrainerService (regras de negócio)
│   │   └── PokedexApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── Script_Pokedex.sql  # cópia do script, lida na carga inicial
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/      # SearchBar, TypeFilter, PokemonList, PokemonCard,
│   │   │                    # PokemonDetails, PokemonForm, TrainersPanel, TrainerForm, ...
│   │   ├── css/             # estilos dos componentes
│   │   ├── hooks/           # usePokemons e useTrainers (acesso à API)
│   │   ├── services/        # api.js (chamadas HTTP)
│   │   ├── utils/           # data.js, typeColors.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Script_Pokedex.sql       # script de dados fornecido na atividade (fonte dos dados)
└── README.md
```

---

## ✅ Pré-requisitos

- [Java JDK](https://adoptium.net/) 17 ou superior (o projeto foi desenvolvido com Java 25)
- [Node.js](https://nodejs.org/) 18 ou superior (inclui o `npm`)
- Uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/atlas)
- Maven não precisa ser instalado: o projeto usa o Maven Wrapper (`mvnw`)

---

## 🗄️ Configuração do MongoDB Atlas

1. Crie uma conta em [mongodb.com/atlas](https://www.mongodb.com/atlas) e um cluster gratuito (**M0**).
2. Em **Database Access**, crie um usuário e uma senha para o banco.
   - Prefira uma senha só com letras e números. Se ela tiver caracteres especiais (`@`, `#`, `/`, `:`), é preciso codificá-los na string de conexão (por exemplo, `@` vira `%40`).
3. Em **Network Access**, libere o seu IP (**Add Current IP Address**). Para testes, é possível usar `0.0.0.0/0`.
4. Clique em **Connect → Drivers → Java** e copie a string de conexão, que tem este formato:

   ```text
   mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/
   ```

5. Monte a sua string, trocando `<senha>` pela senha real e acrescentando o nome do banco (`/pokedex`) antes do `?`:

   ```text
   mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/pokedex?retryWrites=true&w=majority
   ```

> 🔐 **A string de conexão contém a senha do banco e não deve ser publicada no GitHub.** Ela é lida pela variável de ambiente `MONGODB_URI` e não está escrita em nenhum arquivo do repositório.

O banco `pokedex` e a coleção `pokemons` são criados automaticamente na primeira execução do backend.

---

## ▶️ Como executar

### 1. Clonar o repositório

```bash
git clone <URL-DO-REPOSITORIO>
cd Pokedex
```

### 2. Backend (Spring Boot)

Em um terminal, dentro da pasta `backend/`:

**Linux / macOS / Git Bash:**

```bash
cd backend
export MONGODB_URI="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/pokedex?retryWrites=true&w=majority"
./mvnw spring-boot:run
```

**Windows (PowerShell):**

```powershell
cd backend
$env:MONGODB_URI="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/pokedex?retryWrites=true&w=majority"
.\mvnw.cmd spring-boot:run
```

Na primeira execução, com a coleção `pokemons` vazia, o backend lê o `Script_Pokedex.sql` (em `src/main/resources`), converte as tabelas relacionais em documentos e os grava no MongoDB, exibindo no console:

```text
151 Pokémon importados do Script_Pokedex.sql para o MongoDB.
```

Nas execuções seguintes, como a coleção já tem dados, nada é importado de novo.

A API fica disponível em **http://localhost:8080**. Para conferir, abra `http://localhost:8080/api/pokemons` no navegador.

> Se a variável `MONGODB_URI` não for definida, o backend tenta conectar em um MongoDB local (`mongodb://localhost:27017/pokedex`).

### 3. Frontend (React + Vite)

Em **outro terminal**, dentro da pasta `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço exibido no terminal, normalmente **http://localhost:5173**.

> O backend precisa estar rodando antes de abrir o front-end. Caso contrário, a tela exibe uma mensagem de erro de carregamento.

Para apontar o front-end para outro endereço de API, crie um arquivo `frontend/.env` (não versionado):

```text
VITE_API_URL=http://localhost:8080/api
```

---

## 🌐 API REST

URL base: `http://localhost:8080/api`

| Método | Endpoint | Descrição | Resposta |
|---|---|---|---|
| `GET` | `/pokemons` | Lista todos os Pokémon, ordenados por ID | `200` |
| `GET` | `/pokemons/{id}` | Busca um Pokémon pelo ID | `200` / `404` |
| `POST` | `/pokemons` | Cadastra um Pokémon (o ID é gerado automaticamente) | `201` |
| `PUT` | `/pokemons/{id}` | Atualiza um Pokémon | `200` / `404` |
| `DELETE` | `/pokemons/{id}` | Remove um Pokémon | `204` / `404` |

### Treinadores

| Método | Endpoint | Descrição | Resposta |
|---|---|---|---|
| `GET` | `/trainers` | Lista todos os treinadores | `200` |
| `GET` | `/trainers/{id}` | Busca um treinador pelo ID | `200` / `404` |
| `POST` | `/trainers` | Cadastra um treinador (o ID é gerado automaticamente) | `201` / `400` |
| `PUT` | `/trainers/{id}` | Atualiza um treinador | `200` / `400` / `404` |
| `DELETE` | `/trainers/{id}` | Remove um treinador | `204` / `404` |

Regras de validação (`400`): nome obrigatório, insígnias não negativas, no máximo 6 Pokémon no time e todos os IDs do time precisam existir na coleção de Pokémon.

Exemplo de corpo (`POST /api/trainers`):

```json
{ "name": "Ash", "badges": 9, "pokemonIds": [25, 3, 6] }
```

### Exemplo de documento de Pokémon

```json
{
  "id": 152,
  "name": "Chikorita",
  "stats": {
    "hp": 45,
    "attack": 49,
    "defense": 65,
    "specialAttack": 49,
    "specialDefense": 65,
    "speed": 45
  },
  "types": [
    { "id": 4, "name": "Grass" }
  ]
}
```

### Exemplo de requisição (`POST /api/pokemons`)

O campo `id` não é enviado: o backend usa o maior ID existente + 1.

```bash
curl -X POST http://localhost:8080/api/pokemons \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Chikorita",
        "stats": { "hp": 45, "attack": 49, "defense": 65,
                   "specialAttack": 49, "specialDefense": 65, "speed": 45 },
        "types": [ { "id": 4, "name": "Grass" } ]
      }'
```

---

## 🧱 Modelagem dos dados

Os dados vêm do `Script_Pokedex.sql`, que está no modelo relacional, e são adaptados para o modelo de documentos do MongoDB, na coleção **`pokemons`**:

| Script SQL | MongoDB |
|---|---|
| Tabela `Pokemon` (nome e 6 atributos) | Um documento por Pokémon: `name` e o objeto `stats` |
| Tabelas `Rel_Pokemon_Type` + `Types` | Lista `types` embutida em cada documento |

Assim, uma única consulta traz tudo o que a interface precisa, sem junções. Pokémon sem tipo no script (como o Mew) ficam com `types` vazio.

As tabelas `Trainers` e `Rel_Trainer_Pokemon` viram a coleção **`trainers`**: um documento por treinador, com `name`, `badges` e `pokemonIds` (lista de IDs do time, na ordem do script e com repetições permitidas, como o Koga com três Venonat).

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` (`id`) | número | Número do Pokémon |
| `name` | texto | Nome |
| `stats` | objeto | `hp`, `attack`, `defense`, `specialAttack`, `specialDefense`, `speed` |
| `types` | lista de objetos | Tipos, cada um com `id` e `name` (pode ser vazia, como no Mew) |

---

## 🖼️ Imagens dos Pokémon

As imagens são carregadas da **PokéAPI**, repositório público de sprites hospedado no GitHub, a partir do **ID** do Pokémon:

```text
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
```

Nenhuma imagem é armazenada no banco de dados ou no repositório. A exibição exige conexão com a internet. Um Pokémon cadastrado com um ID que não existe na PokéAPI aparece sem imagem ou com a imagem do Pokémon real que tem aquele número.

- Fonte: [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
- Documentação da API: [pokeapi.co](https://pokeapi.co/)

---

## 🧯 Problemas comuns

| Sintoma | Causa provável e solução |
|---|---|
| A tela mostra "Não foi possível carregar os Pokémon" | O backend não está rodando ou falhou ao iniciar. Confira o terminal do backend. |
| O log mostra `localhost:27017` e *Connection refused* | A variável `MONGODB_URI` não foi definida no terminal em que o backend foi iniciado. |
| `Failed looking up SRV record` | O host da string de conexão está errado (por exemplo, ainda com o valor de exemplo). |
| `Authentication failed` | Usuário ou senha incorretos, ou senha com caracteres especiais sem codificação. |
| *Timed out* com o endereço do Atlas | O seu IP não está liberado em **Network Access** (o IP pode mudar ao trocar de rede). |
| Erro de CORS no navegador | O front precisa rodar em `http://localhost:5173`, a origem liberada em `CorsConfig`. |
| Imports `com.fasterxml.jackson` não encontrados | Com o Spring Boot 4, o Jackson usa o pacote `tools.jackson.databind`. |
| Propriedade `spring.data.mongodb.uri` ignorada | No Spring Boot 4, a propriedade é `spring.mongodb.uri`. |

---

## 🎓 Informações da disciplina

- **Disciplina:** DIAW — Desenvolvimento e Integração de Aplicações Web
- **Curso:** Engenharia de Software
- **Instituição:** PUC Minas — campus Lourdes
- **Atividade:** 04 — Pokédex com Spring Boot + MongoDB

## 👤 Autor

- Alexandre Sampaio Guimarães Ribeiro