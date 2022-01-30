const toaster = (color, value) => {
  const id =
    Date.now() +
    Math.floor(Math.random() * 100) +
    Math.floor(Math.random() * 1000);

  var wrapper = document.getElementById("toasts");
  const toast = document.createElement("div");

  // Id
  var idAttr = document.createAttribute("id");
  idAttr.value = "toast_" + id;
  toast.setAttributeNode(idAttr);

  // Class
  var classAttr = document.createAttribute("class");
  classAttr.value = color;
  toast.setAttributeNode(classAttr);

  // Content
  const content = document.createTextNode(value);
  toast.appendChild(content);

  if (color == "red") {
    toast.insertAdjacentHTML(
      "beforeend",
      `<div><span class="mdi mdi-alert-circle"></span></div>`
    );
  }
  if (color == "green") {
    toast.insertAdjacentHTML(
      "beforeend",
      `<div><span class="mdi mdi-check-circle"></span></div>`
    );
  }

  // Append
  wrapper.appendChild(toast);

  if (wrapper.childNodes.length == 5) {
    wrapper.removeChild(wrapper.childNodes[0]);
  }

  setTimeout(function () {
    if (document.querySelector("#toast_" + id)) {
      document.querySelector("#toast_" + id).remove();
    }
  }, 3000);
};
export default toaster;
