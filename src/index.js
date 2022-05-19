const DoggyBar = document.querySelector("#dog-bar");
const pupInfo = document.querySelector("#dog-info");
const pupURL = "http://localhost:3000/pups";
const goodDogFilter = document.querySelector("#good-dog-filter");
const IS_GOOD_DOG_ATTRIBUTE_NAME = "isGoodDog";
fetch(pupURL)
  .then((response) => response.json())
  .then((pups) => pups.forEach((pup) => renderPups(pup)));

function renderPups(pup) {
  const pupSpan = document.createElement("span");

  const pupID = pup.id;
  const pupName = pup.name;
  let isGooddog = pup.isGoodDog;
  const img = document.createElement("img");
  const h2 = document.createElement("h2");
  const goodPupButton = document.createElement("button");

  h2.textContent = pup.name;
  img.src = pup.image;
  img.alt = pup.name;

  pupSpan.id = pupID;
  pupSpan.textContent = pupName;
  pupSpan.setAttribute(IS_GOOD_DOG_ATTRIBUTE_NAME, isGooddog);

  pupSpan.addEventListener("click", (e) => {
    if (pup.isGoodDog === true) {
      goodPupButton.textContent = "Good Dog!";
    } else {
      goodPupButton.textContent = "Bad Dog!";
    }
    pupInfo.innerHTML = " ";
    pupInfo.append(img, h2, goodPupButton);
  });

  goodPupButton.addEventListener("click", (e) => {
    e.target.parentNode.className = "active";

    if (e.target.parentNode.className === "active") {
      if (goodPupButton.textContent === "Good Dog!") {
        goodPupButton.textContent = "Bad Dog!";
        isGooddog = false;
      } else if (goodPupButton.textContent === "Bad Dog!") {
        goodPupButton.textContent = "Good Dog!";
        isGooddog = true;
      }

      fetch(`${pupURL}/${pupID}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          isGoodDog: isGooddog,
        }),
      })
        .then((response) => response.json())
        .then((reponsePup) => {
          const spanElemnt = document.getElementById(`${pupID}`);
          e.target.parentNode.className = "";
          spanElemnt.setAttribute(
            IS_GOOD_DOG_ATTRIBUTE_NAME,
            reponsePup.isGoodDog
          );
          pup.isGoodDog = reponsePup.isGoodDog;
        });
    }
  });

  DoggyBar.appendChild(pupSpan);
}

goodDogFilter.addEventListener("click", () => {
  const allSpans = document.querySelectorAll("span");
  const allSpansArray = Array.from(allSpans);
  if (goodDogFilter.textContent === "Filter good dogs: OFF") {
    goodDogFilter.textContent = "Filter good dogs: ON";
    allSpansArray.forEach((span) => {
      if (span.getAttribute(IS_GOOD_DOG_ATTRIBUTE_NAME) === "true") {
        span.style.display = "";
      } else if (span.getAttribute(IS_GOOD_DOG_ATTRIBUTE_NAME) === "false") {
        span.style.display = "none";
      }
    });
  } else if (goodDogFilter.textContent === "Filter good dogs: ON") {
    goodDogFilter.textContent = "Filter good dogs: OFF";
    allSpansArray.forEach((span) => {
      span.style.display = "";
    });
  }
});
