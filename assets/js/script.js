"use strict";

/**
 * 
  toda la información de la música
 */

const musicData = [
  {
    backgroundImage: "./assets/images/poster-1.jpg",
    posterUrl: "./assets/images/poster-1.jpg",
    title: "Happy Moments (Master)",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x Tonion",
    musicPath: "./assets/music/music-1.mp3",
  },
  {
    backgroundImage: "./assets/images/poster-2.jpg",
    posterUrl: "./assets/images/poster-2.jpg",
    title: "We Are Going To Be Ok (Master)",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x Jhove",
    musicPath: "./assets/music/music-2.mp3",
  },
  {
    backgroundImage: "./assets/images/poster-3.jpg",
    posterUrl: "./assets/images/poster-3.jpg",
    title: "Winter Meadow",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit x  juniorodeo",
    musicPath: "./assets/music/music-3.mp3",
  },
  {
    backgroundImage: "./assets/images/poster-4.jpg",
    posterUrl: "./assets/images/poster-4.jpg",
    title: "From Where We Started",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit",
    musicPath: "./assets/music/music-4.mp3",
  },
  {
    backgroundImage: "./assets/images/poster-5.jpg",
    posterUrl: "./assets/images/poster-5.jpg",
    title: "Where I Found You",
    album: "No Spirit",
    year: 2022,
    artist: "No Spirit",
    musicPath: "./assets/music/music-5.mp3",
  },
];

/* agregar eventListnere en todos los elementos que se pasan */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/* playlist
agregar toda la música en la lista de reproducción, desde 'musicData'
*/

const playlist = document.querySelector("[data-music-list]");

for (let i = 0, len = musicData.length; i < len; i++) {
  playlist.innerHTML += `
  <li>
    <button class="music-item ${i === 0 ? "playing" : ""
    }" data-playlist-toggler data-playlist-item="${i}">
      <img src="${musicData[i].posterUrl}" width="800" height="800" alt="${musicData[i].title
    } Album Poster"
        class="img-cover">

      <div class="item-icon">
        <span class="material-symbols-rounded">equalizer</span>
      </div>
    </button>
  </li>
  `;
}

/* playlist modal sidebar toggle
mostrar la barra lateral modal 'lista de reproducción' al hacer clic en el botón de lista de reproducción en la barra superior de la aplicación
y ocultar al hacer clic en la superposición o en cualquier elemento de la lista de reproducción
*/

const playlistSideModal = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlaylist = function () {
  playlistSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
};

addEventOnElements(playlistTogglers, "click", togglePlaylist);

/* playlist item
eliminar el estado activo de la última vez que se reprodujo música
y agregue el estado activo en la música en la que se hizo clic
*/

const playlistItems = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlaylistItem = function () {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
};

addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlaylistItem();
});

/* player
cambiar toda la información visual en el reproductor, según la música actual
*/

const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerAlbum = document.querySelector("[data-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

const audioSource = new Audio(musicData[currentMusic].musicPath);

const changePlayerInfo = function () {
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.setAttribute(
    "alt",
    `${musicData[currentMusic].title} Album Poster`
  );
  document.body.style.backgroundImage = `url(${musicData[currentMusic].backgroundImage})`;
  playerTitle.textContent = musicData[currentMusic].title;
  playerAlbum.textContent = musicData[currentMusic].album;
  playerYear.textContent = musicData[currentMusic].year;
  playerArtist.textContent = musicData[currentMusic].artist;

  audioSource.src = musicData[currentMusic].musicPath;

  audioSource.addEventListener("loadeddata", updateDuration);
  playMusic();
};

addEventOnElements(playlistItems, "click", changePlayerInfo);

/* actualizar la duración  */

const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

/* pasar segundos y obtener formato de timcode */
const getTimecode = function (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration - minutes * 60);
  const timecode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return timecode;
};

const updateDuration = function () {
  playerSeekRange.max = Math.ceil(audioSource.duration);
  playerDuration.textContent = getTimecode(Number(playerSeekRange.max));
};

audioSource.addEventListener("loadeddata", updateDuration);

/* play music
reproducir y pausar la música al hacer clic en el botón de reproducción
*/

const playBtn = document.querySelector("[data-play-btn]");

let playInterval;

const playMusic = function () {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
};

playBtn.addEventListener("click", playMusic);

/* actualizar el tiempo de ejecución mientras se reproduce música */

const playerRunningTime = document.querySelector("[data-running-time");

const updateRunningTime = function () {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);

  updateRangeFill();
  isMusicEnd();
};

/* rango

cambie el ancho de 'rangeFill', mientras cambia el valor del rango
*/

const ranges = document.querySelectorAll("[data-range]");
const rangeFill = document.querySelector("[data-range-fill]");

const updateRangeFill = function () {
  let element = this || ranges[0];

  const rangeValue = (element.value / element.max) * 100;
  element.nextElementSibling.style.width = `${rangeValue}%`;
};

addEventOnElements(ranges, "input", updateRangeFill);

/* buscar musica

busca la canción mientras cambias el rango de búsqueda del reproductor
*/

const seek = function () {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
};

playerSeekRange.addEventListener("input", seek);

/* musica final */

const isMusicEnd = function () {
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    audioSource.currentTime = 0;
    playerSeekRange.value = audioSource.currentTime;
    playerRunningTime.textContent = getTimecode(audioSource.currentTime);
    updateRangeFill();
  }
};

/* saltar a la siguiente canción */

const playerSkipNextBtn = document.querySelector("[data-skip-next]");

const skipNext = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= musicData.length - 1 ? (currentMusic = 0) : currentMusic++;
  }

  changePlayerInfo();
  changePlaylistItem();
};

playerSkipNextBtn.addEventListener("click", skipNext);

/* saltar a la canción anterior*/

const playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

const skipPrev = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic <= 0 ? (currentMusic = musicData.length - 1) : currentMusic--;
  }

  changePlayerInfo();
  changePlaylistItem();
};

playerSkipPrevBtn.addEventListener("click", skipPrev);

/* canción aletoria */

/** obtener un número aleatorio para la reproducción aleatoria */
const getRandomMusic = () => Math.floor(Math.random() * musicData.length);

const shuffleMusic = () => (currentMusic = getRandomMusic());

const playerShuffleBtn = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffle = function () {
  playerShuffleBtn.classList.toggle("active");

  isShuffled = isShuffled ? false : true;
};

playerShuffleBtn.addEventListener("click", shuffle);

/* repetir canción */

const playerRepeatBtn = document.querySelector("[data-repeat]");

const repeat = function () {
  if (!audioSource.loop) {
    audioSource.loop = true;
    this.classList.add("active");
  } else {
    audioSource.loop = false;
    this.classList.remove("active");
  }
};

playerRepeatBtn.addEventListener("click", repeat);

/* volumen de la música

aumentar o disminuir el volumen de la música cuando cambia el rango de volumen */

const playerVolumeRange = document.querySelector("[data-volume]");
const playerVolumeBtn = document.querySelector("[data-volume-btn]");

const changeVolume = function () {
  audioSource.volume = playerVolumeRange.value;
  audioSource.muted = false;

  if (audioSource.volume <= 0.1) {
    playerVolumeBtn.children[0].textContent = "volume_mute";
  } else if (audioSource.volume <= 0.5) {
    playerVolumeBtn.children[0].textContent = "volume_down";
  } else {
    playerVolumeBtn.children[0].textContent = "volume_up";
  }
};

playerVolumeRange.addEventListener("input", changeVolume);

/* silenciar canción */

const muteVolume = function () {
  if (!audioSource.muted) {
    audioSource.muted = true;
    playerVolumeBtn.children[0].textContent = "volume_off";
  } else {
    changeVolume();
  }
};

playerVolumeBtn.addEventListener("click", muteVolume);
