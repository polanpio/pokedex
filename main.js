// select screens & fields
const imagesWrapper = document.querySelector(".images-wrapper");
const welcomeMsg = document.querySelector(".welcome-msg");
const statsLi = document.querySelectorAll(".stat");
const stats = document.querySelector(".stats");
const pokemonImgFront = document.querySelector(".pokemon-img.front");
const pokemonImgBack = document.querySelector(".pokemon-img.back");
const smallDisplay = document.querySelector(".small-display");
const longDisplayParagraph = document.querySelector(".long-display p");
const longDisplayWeight = document.querySelector(".long-display ul li:nth-child(1)");
const longDisplayHeight = document.querySelector(".long-display ul li:nth-child(2)");
const smallScreenLeft = document.querySelector(".small-screen-left");
const smallScreenRight = document.querySelector(".small-screen-right");

// select buttons
const rightArrow = document.getElementById("right-cross");
const leftArrow = document.getElementById("left-cross");
const upArrow = document.getElementById("top-cross");
const downArrow = document.getElementById("bottom-cross");
const bigButton = document.querySelector(".big-button");
const idNumbers = document.querySelectorAll(".id-number");
const clearSearchButton = document.getElementById("grid-button-white-1");
const searchButton = document.getElementById("grid-button-white-2");

//variables
let pokemonIdSearch = 0;
const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

const TYPES = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];

// helper function
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const toInt = (string) => {
  return Number.parseInt(string, 10);
}

//general functions
const nextPokemonId = () => {
  pokemonIdSearch += 1;
}

const previousPokemonId = () => {
  if (pokemonIdSearch > 1) {
    pokemonIdSearch -= 1;
  } else {
    return;
  }
}

const hideWelcomeMsg = () => {
  welcomeMsg.classList.add("hide");
  imagesWrapper.classList.remove("hide");
  pokemonImgBack.classList.remove("hide");
  pokemonImgFront.classList.remove("hide");
}

const displayPokemon = (data) => {
  const typeFirst = data.types[0].type.name;
  smallScreenLeft.classList.add(typeFirst);
  let typeSecond = "";
  if (data.types[1] === undefined || data.types[1] === null) {
    typeSecond = false;
  } else {
    typeSecond = data.types[1].type.name;
    smallScreenRight.classList.add(typeSecond);
  }
  if (imagesWrapper.classList.contains("hide")) {
    hideWelcomeMsg();
  }
  smallDisplay.textContent = capitalize(data.name);
  smallScreenLeft.textContent = capitalize(typeFirst);
  smallScreenRight.textContent = typeSecond ? capitalize(typeSecond) : "";
  longDisplayWeight.textContent = `Weight: ${toInt(data.weight) / 10} kg`;
  longDisplayHeight.textContent = `Height: ${toInt(data.height) / 10} m`;
  longDisplayParagraph.textContent = `#${data.id.toString().padStart(3, "0")}`;
  pokemonImgFront.src = data.sprites.front_default || "";
  pokemonImgBack.src = data.sprites.back_default || "";
}

const displayStats = (data) => {
  let count = 0;
  statsLi.forEach((stat) => {
    const name = data.stats[count].stat.name;
    const baseStat = data.stats[count].base_stat;
    const row = `${capitalize(name)}: ${baseStat}`;
    count++;
    stat.textContent = row;
  })
}

const clearFields = () => {
  smallDisplay.textContent = "";
  longDisplayWeight.textContent = "";
  longDisplayHeight.textContent = "";
  longDisplayParagraph.textContent = "";
  smallScreenLeft.textContent = "";
  smallScreenRight.textContent = "";
}

const restWelcomeMsg = () => {
  if (welcomeMsg.classList.contains("hide")) {
    welcomeMsg.classList.remove("hide");
    imagesWrapper.classList.add("hide");
    pokemonImgBack.classList.add("hide");
    pokemonImgFront.classList.add("hide");
  }
}

const resetPokedex = () => {
  pokemonIdSearch = 0;
  restTypeColor();
  clearStats();
  clearFields();
  restWelcomeMsg();
};

const restTypeColor = () => {
  for (const type of TYPES) {
    smallScreenLeft.classList.remove(type);
    smallScreenRight.classList.remove(type);
  }
}

const clearStats = () => {
  stats.classList.add("hide");
  statsLi.forEach((stat) => {
    stat.textContent = "";
  })
}

const hideImages = () => {
  imagesWrapper.classList.add("hide");
  pokemonImgBack.classList.add("hide");
  pokemonImgFront.classList.add("hide");
  stats.classList.remove("hide");
}

const showImages = () => {
  imagesWrapper.classList.remove("hide");
  pokemonImgBack.classList.remove("hide");
  pokemonImgFront.classList.remove("hide");
  stats.classList.add("hide");
}

const toggleStats = () => {
  if (welcomeMsg.classList.contains("hide") && stats.classList.contains("hide")) {
    hideImages();
    const searchId = longDisplayParagraph.textContent.substring(1);
    pokemonIdSearch = toInt(searchId);
    let url = `${baseUrl}${pokemonIdSearch}`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      displayStats(data);
    });
  } else {
    showImages();
  }
}

//event listeners
rightArrow.addEventListener("click", () => {
  if (pokemonIdSearch > 898) {
    return;
  } else {
    nextPokemonId();
    let url = `${baseUrl}${pokemonIdSearch}`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      restTypeColor();
      clearStats();
      displayPokemon(data);
    });
  }
});

leftArrow.addEventListener("click", () => {
  if (pokemonIdSearch === 0) {
    return;
  } else {
    previousPokemonId();
    let url = `${baseUrl}${pokemonIdSearch}`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      restTypeColor();
      clearStats();
      displayPokemon(data);
    });
  }
});


upArrow.addEventListener("click", () => {
  if (pokemonIdSearch === 0) {
    return;
  } else {
    toggleStats();
  }
});

downArrow.addEventListener("click", () => {
  if (pokemonIdSearch === 0) {
    return;
  } else {
    toggleStats();
  }
});

bigButton.addEventListener("click", resetPokedex);

idNumbers.forEach((idNumber) => idNumber.addEventListener("click", (event) =>{
  if (welcomeMsg.classList.contains("hide")) {
    return;
  }
  longDisplayParagraph.textContent += event.currentTarget.textContent;
}))

clearSearchButton.addEventListener("click", () => {
  if (welcomeMsg.classList.contains("hide")) {
    return;
  }
  longDisplayParagraph.textContent = "";
})

searchButton.addEventListener("click", () => {
  if (longDisplayParagraph.textContent === "") {
    return;
  } else if (toInt(longDisplayParagraph.textContent) > 898) {
    longDisplayParagraph.textContent = "ERROR"
  } else {
    const searchId = longDisplayParagraph.textContent
    pokemonIdSearch = toInt(searchId);
    let url = `${baseUrl}${pokemonIdSearch}`;
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      restTypeColor();
      displayPokemon(data);
    });
  }
});