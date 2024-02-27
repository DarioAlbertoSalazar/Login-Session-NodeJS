document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  obtenerYRenderizarTareas();
});

// Función para obtener y renderizar los datos de las tareas
function obtenerYRenderizarTareas() {
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

      const userId = localStorage.getItem("id");

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
          const tbody = document.querySelector("tbody");
          const tableRows = data
            .map((obj) => {
              if (obj.title) {
                return `<tr><td>${obj.title}</td><td>${obj.description}</td><td><button class="edit-btn">Edit</button><button class="delete-btn">Delete</button></td></tr>`;
              }
            })
            .join("");

          tbody.innerHTML = tableRows;

          // Restablecer eventos de botones de edición y eliminación
          restablecerEventos(data);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

// Función para restablecer eventos de botones de edición y eliminación
function restablecerEventos(data) {
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
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const deleteTaskId = data[index].id;
      eliminarElemento(deleteTaskId);
      console.log("Eliminar elemento en la posición", index);
    });
  });
}

// add new value
document.getElementById("taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const userId = localStorage.getItem("id");

  fetch("/task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, UserId: userId }),
  })
    .then((response) => response.json())
    .then(() => {
      obtenerYRenderizarTareas(); // Recargar datos después de agregar una tarea
      document.getElementById("title").value = ""; // Limpiar el campo del título
      document.getElementById("description").value = ""; // Limpiar el campo de descripción
    })
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
    .then(() => {
      obtenerYRenderizarTareas(); // Recargar datos después de editar una tarea
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
    .then(() => {
      obtenerYRenderizarTareas(); // Recargar datos después de eliminar una tarea
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
