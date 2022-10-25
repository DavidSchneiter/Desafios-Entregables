const socket = io("http://localhost:8080");

const productForm = document.getElementById("product-form");
const productsContainer = document.getElementById("products");

const chatForm = document.getElementById("chat");
const chatContainer = document.getElementById("chatContainer");

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const formValues = Object.fromEntries(formData);
  productForm.reset();
  socket.emit("new product", formValues);
});

socket.on("all products", (allProducts) => {
  productosRenderizados(allProducts);
});

const productosRenderizados = async (products) => {
  const res = await fetch("/views/table.template.hbs");
  const template = await res.text();
  const compiledTemplate = Handlebars.compile(template);
  const html = compiledTemplate({ products });
  productsContainer.innerHTML = html;
};

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(chatForm);
  const formValues = Object.fromEntries(formData);
  chatForm.reset();
  socket.emit("new message", formValues);
});

socket.on("all message", (allMessage) => {
  mensajesRenderizados(allMessage);
});

const mensajesRenderizados = async (messages) => {
  const res = await fetch("/views/chat.template.hbs");
  const template = await res.text();
  const compiledTemplate = Handlebars.compile(template);
  const html = compiledTemplate({ messages });
  chatContainer.innerHTML = html;
};
