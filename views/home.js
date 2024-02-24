document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  fetch("/home", {
    method: "GET",
    headers: {
      Athorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("id", data.id);
      document.querySelector("h1").innerHTML = `Bienvenido ${data.user}`;
    });
});

fetch("/task", {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const tbody = document.querySelector("tbody"); // Obtener la referencia al tbody de la tabla

    // Crear una cadena HTML para todas las filas de la tabla
    const tableRows = data
      .map((obj) => {
        if (obj.title) {
          return `<tr><td>${obj.title}</td><td>${obj.description}</td><td><button class="edit-btn">Edit</button><button class="delete-btn">Delete</button></td></tr>`;
        }
      })
      .join(""); // Unir todas las filas en una sola cadena HTML

    // Establecer la cadena HTML de las filas en el tbody
    tbody.innerHTML = tableRows;
    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        // Aquí puedes implementar la lógica para editar el elemento correspondiente
        console.log("Editar elemento en la posición", index);
      });
    });
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        // Aquí puedes implementar la lógica para eliminar el elemento correspondiente
        console.log("Eliminar elemento en la posición", index);
      });
    });
  });


document.getElementById("taskForm").addEventListener("submit", (event) => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  fetch("/task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  })
    .then((response) => response.json())
    .then((data) => {
    })
    .catch((err) => console.error("Error al agregar la tarea: ", err));
});
