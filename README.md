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

**CRUD integrado à API**
- ➕ Cadastrar Pokémon.
- ✏️ Editar Pokémon.
- 🗑️ Excluir Pokémon (com confirmação).

**Extras**
- ⭐ Favoritos (salvos no `localStorage` do navegador) e filtro "somente favoritos".
- 🎲 Pokémon aleatório.
- 📊 Ordenação por ID, nome e por cada atributo.
- 🧑‍🚀 Área de treinadores, com insígnias e time de cada um (Pokémon repetidos aparecem agrupados, ex.: "Venonat x3").
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
│   │   ├── config/          # CORS e carga inicial dos dados (DataSeeder)
│   │   ├── controller/      # PokemonController (endpoints REST)
│   │   ├── model/           # Pokemon, Stats, PokemonType
│   │   ├── repository/      # PokemonRepository (Spring Data MongoDB)
│   │   ├── service/         # PokemonService (regras de negócio)
│   │   └── PokedexApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── pokedex-data.json   # dados usados na carga inicial
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/      # SearchBar, TypeFilter, PokemonList, PokemonCard,
│   │   │                    # PokemonDetails, PokemonForm, TrainersPanel, ...
│   │   ├── css/             # estilos dos componentes
│   │   ├── hooks/           # usePokemons (acesso à API)
│   │   ├── services/        # api.js (chamadas HTTP)
│   │   ├── utils/           # data.js, typeColors.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Script_Pokedex.sql       # script de dados fornecido na atividade
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

Na primeira execução, com a coleção vazia, o backend importa os Pokémon do arquivo `src/main/resources/pokedex-data.json` e exibe no console:

```text
151 Pokémon importados para o MongoDB.
```

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

### Exemplo de documento

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

Os dados ficam na coleção **`pokemons`** do MongoDB, no modelo de documentos, com os atributos e os tipos **embutidos** em cada Pokémon. Assim, uma única consulta traz tudo o que a interface precisa, sem junções como no modelo relacional do `Script_Pokedex.sql`.

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

## 👥 Autore

- Alexandre Sampaio Guimarães Ribeiro