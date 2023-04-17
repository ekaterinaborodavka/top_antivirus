"use strict";

const requestURL = "https://veryfast.io/t/front_test_api.php";
const userAgent = navigator.userAgent;

const cards = document.querySelector(".cards");
const iconDownload = document.querySelector(".icon_download");

const getData = () => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", requestURL);

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(JSON.parse(xhr.response));
      }
    };
    xhr.onerror = () => {
      reject(xhr.response);
    };
    xhr.send();
  });
};

getData()
  .then((data) => createCard(data.result.elements))
  .catch((err) => console.log(err));

window.addEventListener("load", () => {
  if (userAgent.indexOf("Firefox") > -1) {
    iconDownload.src = "./img/icon_download_up.svg";
  } else {
    iconDownload.src = "./img/icon_download_down.svg";
  }
});

const createElement = (type, elementClass, text) => {
  const element = document.createElement(type);
  element.setAttribute("class", elementClass);
  if (text) {
    element.innerHTML = text;
  }
  return element;
};

const createCard = (elements) => {
  elements.forEach((el) => {
    const { is_best, amount_html, amount, license_name, price_key, name_prod, link } = el;

    const monthly = license_name.includes("Monthly");

    const card = createElement("div", "card");
    const cardAmountBest = createElement("div", "card_amount_best", "Best Value");
    const discountPercent = createElement("div", "card_amount_discount_percent", price_key);
    const discountImg = createElement("img", "card_amount_discount");
    discountImg.src = "./img/discount.svg";
    discountImg.alt = " discount";

    const cardAmount = createElement("div", "card_amount");
    const cardAmountPriceWrapper = createElement("div", "card_amount_price_wrapper");
    const cardAmountPrice = createElement("span", "card_amount_price", `$${amount}`);
    const cardAmountPer = createElement("span", "card_amount_per", monthly ? "/mo" : "/per year");
    const cardAmountOld = createElement("div", "card_amount_old", "$9.99");

    cardAmountPriceWrapper.appendChild(cardAmountPrice);
    cardAmountPriceWrapper.appendChild(cardAmountPer);
    amount_html && cardAmountPriceWrapper.appendChild(cardAmountOld);

    const cardInfo = createElement("div", "card_info");
    const cardInfoName = createElement("span", "card_info_name", name_prod);
    const cardInfoLicence = createElement("span", "card_info_licence", license_name);
    const cardInfoLink = createElement("a", "card_info_link");
    const cardInfoLinkText = createElement("span", "card_info_link_text", "download");
    const cardInfoLinkImg = createElement("img", "card_info_link_img");
    cardInfoLinkImg.src = "./img/download.svg";
    cardInfoLinkImg.alt = "download";

    cardInfoLink.appendChild(cardInfoLinkText);
    cardInfoLink.href = link;
    cardInfoLink.appendChild(cardInfoLinkImg);
    cardInfo.appendChild(cardInfoName);
    cardInfo.appendChild(cardInfoLicence);
    cardInfo.appendChild(cardInfoLink);
    cardInfoLink.download = true;

    cardInfoLink.addEventListener("click", () => {
      iconDownload.classList.remove("hidden");
      setTimeout(() => {
        iconDownload.classList.add("hidden");
      }, 15000);
    });

    cardAmount.appendChild(cardAmountPriceWrapper);

    is_best && card.appendChild(cardAmountBest);
    card.appendChild(discountPercent);
    amount_html && card.appendChild(discountImg);
    card.appendChild(cardAmount);
    card.appendChild(cardInfo);
    cards.appendChild(card);
  });
};
