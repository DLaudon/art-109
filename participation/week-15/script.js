
const dogButton = document.getElementById("dog-button");
const dogImage = document.getElementById("dog-image");

const metroButton = document.getElementById("metro-button");
const metroImage = document.getElementById("metro-image");

dogButton.addEventListener("click", function () {
    dogImage.classList.toggle("hidden");
});

metroButton.addEventListener("click", function () {
    metroImage.classList.toggle("hidden");
});
