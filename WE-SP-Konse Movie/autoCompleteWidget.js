const createAutoCompleteWidget = ({
  autoCompleteWidget,
  renderData,
  onItemSelection,
  selectedItem,
  fetchData,
}) => {
  autoCompleteWidget.innerHTML = `
        <label><b>Search</b></label>
        <br>
        <input type="text">
        <br>
        <div class="dropdown">
            <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
            </div>
        </div>

`;

  // getting input tag to perform auto search function
  const input = autoCompleteWidget.querySelector("input");
  const dropDown = autoCompleteWidget.querySelector(".dropdown");
  const resultMenu = autoCompleteWidget.querySelector(".results");

  const inputCallBack = async (e) => {
    const results = await fetchData(e.target.value);

    if (!results.length) {
      dropDown.classList.remove("is-active");
      return;
    }
    resultMenu.innerHTML = "";
    dropDown.classList.add("is-active");

    for (let result of results) {
      let item = document.createElement("a");

      item.classList.add("dropdown-item");
      item.innerHTML = renderData(result);

      resultMenu.appendChild(item);
      item.addEventListener("click", (e) => {
        input.value = selectedItem(result);
        dropDown.classList.remove("is-active");
        onItemSelection(result);
      });
    }
  };

  input.addEventListener("input", deBounce(inputCallBack, 500));

  document.addEventListener("click", (e) => {
    if (!autoCompleteWidget.contains(e.target)) {
      dropDown.classList.remove("is-active");
    }
  });
};
