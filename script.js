// Variáveis de controle

const input = document.querySelector(".input");
const movies = document.querySelector(".movies");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const btnTheme = document.querySelector(".btn-theme");
const body = document.querySelector("body");
const highlightBackground = document.querySelector(".highlight__info");
const highlightGenre = document.querySelector(".highlight__genre-launch");

const trailer = document.querySelector(".highlight__video-link");
const video = document.querySelector(".highlight__video");
const title = document.querySelector(".highlight__title");
const rating = document.querySelector(".highlight__rating");
const genres = document.querySelector(".highlight__genres");
const launch = document.querySelector(".highlight__launch");
const description = document.querySelector(".highlight__description");

const modalFilmes = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");
const modalTitle = document.querySelector(".modal__title");
const modalImage = document.querySelector(".modal__img");
const modalDescription = document.querySelector(".modal__description");
const modalGenres = document.querySelector(".modal__genres");
const modalAverage = document.querySelector(".modal__average");

let filmes = [];
let paginas = 5;
const paginasMinimas = 0;
const paginasMaximas = 15;
let btnCor = "light";

// Mudança do tema claro/escuro

btnTheme.addEventListener("click", function () {
  if (btnCor === "light") {
    btnCor = "dark";
    btnTheme.src = "./assets/dark-mode.svg";
    btnPrev.src = "./assets/seta-esquerda-branca.svg";
    btnNext.src = "./assets/seta-direita-branca.svg";
    body.style.setProperty("--background-color", "#242424");
    body.style.setProperty("--input-color", "#FFF");
    body.style.setProperty("--input-background-color", "#FFF");
    body.style.setProperty("--input-border-color", "#FFF");
    highlightBackground.style.setProperty("background", "#454545");
    highlightGenre.style.setProperty("color", "rgba(255, 255, 255, 0.7)");
    description.style.setProperty("color", "rgba(255, 255, 255, 0.8)");
  } else {
    btnCor = "light";
    btnTheme.src = "./assets/light-mode.svg";
    btnPrev.src = "./assets/seta-esquerda-preta.svg";
    btnNext.src = "./assets/seta-direita-preta.svg";
    body.style.setProperty("--background-color", "#FFFF");
    body.style.setProperty("--input-color", "#000");
    body.style.setProperty("--input-background-color", "#979797");
    body.style.setProperty("--input-border-color", "#979797");
    highlightBackground.style.setProperty("background", "#FFF");
    highlightGenre.style.setProperty("color", "rgba(0, 0, 0, 0.8)");
    description.style.setProperty("color", "#000");
  }
});

//Funções para avançar ou retroceder filmes

btnNext.addEventListener("click", function () {
  if (paginas === paginasMaximas) {
    paginas = paginasMinimas;
  } else {
    paginas++;
  }
  exibirFilmes();
});

btnPrev.addEventListener("click", function () {
  if (paginas === paginasMinimas) {
    paginas = paginasMaximas;
  } else {
    paginas--;
  }
  exibirFilmes();
});

// Função para fechar modal

modalFilmes.addEventListener("click", function (event) {
  if (
    event.target.classList.value === "modal" ||
    event.target.classList.value === "modal__close"
  ) {
    modalFilmes.classList.add("hidden");
  }
});

// Função carregar filmes

function carregarFilmes() {
  fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
  )
    .then((resposta) => resposta.json())
    .then(({ results }) => {
      filmes = results;
      exibirFilmes();
    });
}

// Função procurar filme a partir do input

function procurarFilmes(procurar) {
  fetch(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${procurar}`
  )
    .then((resposta) => resposta.json())
    .then(({ results }) => {
      filmes = results;
      exibirFilmes();
    });
}

// Função exibir filmes

function exibirFilmes() {
  movies.innerHTML = "";
  for (let i = paginas; i < paginas + 5; i++) {
    const filme = filmes[i];
    const divDoFilme = document.createElement("div");
    const { id } = filme;
    divDoFilme.classList.add("movie");

    divDoFilme.addEventListener("click", function () {
      modalFilmes.classList.remove("hidden");
      fetch(
        `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
      )
        .then((resposta) => resposta.json())
        .then((modal) => {
          modalTitle.textContent = modal.title;
          modalImage.src = modal.backdrop_path;
          modalDescription.textContent = modal.overview;
          modalAverage.textContent = modal.vote_average;
          const categorys = modal.genres.map((category) => category.name);
          modalGenres.textContent = categorys[0];
        });
    });

    divDoFilme.style.backgroundImage = `url(${filme.poster_path})`;
    divDoFilme.style.width = "170px";
    divDoFilme.style.height = "300px";
    divDoFilme.style.backgroundSize = "cover";

    const divInfo = document.createElement("div");
    divInfo.classList.add("movie__info");

    const nomeDoFilme = document.createElement("span");
    nomeDoFilme.classList.add("movie__title");
    nomeDoFilme.textContent = filme.title;

    const classificacao = document.createElement("span");
    classificacao.classList.add("movie__rating");
    classificacao.textContent = filme.vote_average;

    const star = document.createElement("img");
    star.src = "./assets/estrela.svg";
    star.alt = "Estrela";

    const divAgrupar = document.createElement("div");

    divAgrupar.append(star, classificacao);
    divInfo.append(nomeDoFilme, divAgrupar);
    divDoFilme.append(divInfo);
    movies.append(divDoFilme);
  }
}

carregarFilmes();

fetch(
  "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
)
  .then((resposta) => resposta.json())
  .then(({ results }) => {
    const [video] = results;
    trailer.href = `https://www.youtube.com/watch?v=${video.key}`;
  });

fetch(
  "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
)
  .then((resposta) => resposta.json())
  .then((dataMovie) => {
    video.style.background = `linear-gradient(rgba(0,0,0,0.6) 100%, rgba(0,0,0,0.6) 100%),
        url("${dataMovie.backdrop_path}")`;
    video.style.width = "553px";
    video.style.height = "340px";
    video.style.backgroundSize = "cover";
    title.textContent = `${dataMovie.title}`;
    rating.textContent = `${dataMovie.vote_average}`;
    genres.textContent = `${dataMovie.genres
      .map((genero) => genero.name)
      .join(", ")}`;
    launch.textContent = `${new Date(dataMovie.release_date).toLocaleDateString(
      "pt-BR",
      { year: "numeric", month: "long", day: "numeric" }
    )}`;
    description.textContent = `${dataMovie.overview}`;
  });

// Função para limpar input e mostrar filme procurado

input.addEventListener("keydown", function (event) {
  if (event.code !== "Enter") {
    return;
  }

  paginas = 5;

  if (input.value) {
    procurarFilmes(input.value);
  } else {
    carregarFilmes();
  }

  input.value = "";
});
