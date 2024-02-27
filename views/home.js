document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  fetch("/home", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("id", data.id);
      document.querySelector("h1").innerHTML = `Bienvenido ${data.user}`;
    });
});

const userId = localStorage.getItem("id"); // Obtener el userId del localStorage

fetch(`/tasks/${userId}`, {
  method: "GET",
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
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
      .join("");

    tbody.innerHTML = tableRows;

    //edit button
    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        const editTaskId = data[index].id;

        const nuevoTitulo = prompt("Introduce el nuevo título:");
        if (nuevoTitulo !== null) {
          const nuevaDescripcion = prompt("Introduce la nueva descripción:");
          if (nuevaDescripcion !== null) {
            editarElemento(editTaskId, {
              title: nuevoTitulo,
              description: nuevaDescripcion,
            });
          }
        }
      });
    });

    //delete button
    let taskIds = [];
    taskIds = data.map((task) => task.id);
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        const deleteTaskId = data[index].id;
        eliminarElemento(deleteTaskId);
        console.log("Eliminar elemento en la posición", index);
      });
    });
  });

// add new value
document.getElementById("taskForm").addEventListener("submit", (event) => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const userId = localStorage.getItem("id");

  fetch("/task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, UserId: userId }),
  })
    .then((response) => response.json())
    .catch((err) => console.error("Error al agregar la tarea: ", err));
});

function editarElemento(id, nuevosDatos) {
  fetch(`/task/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevosDatos),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al editar el elemento");
      }
    })
    .then((data) => {
      console.log("edit", data.message);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error de red:", error);
    });
}

function eliminarElemento(id) {
  fetch(`/task/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al eliminar el elemento");
      }
    })
    .then((data) => {
      console.log(data.message);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error de red:", error);
    });
}

document.getElementById("close").addEventListener("click", () => {
  localStorage.clear();
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  window.location.href = "./login.html"; 
});