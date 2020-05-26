export default function () {
  const iconMenu = document.getElementById("icon-menu");
  const mainMenu = document.getElementById("main-menu__nav");

  if(!iconMenu || !mainMenu)
    return;

  function toggleMenu() {
    mainMenu.classList.toggle("is-open");
  }
  function removeMenu() {
    mainMenu.classList.remove("is-open");
  }

  const mediumBp = matchMedia("(min-width:768px)");
  function closeMenu(mediaQueryList) {
    mediaQueryList.matches ? removeMenu() : null;
  }

  closeMenu(mediumBp);
  mediumBp.addListener(closeMenu);
  iconMenu.addEventListener("click", toggleMenu);
}
