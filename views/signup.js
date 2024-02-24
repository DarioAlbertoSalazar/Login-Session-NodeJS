document.getElementById("signUpForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
  //   const usernameRegex = /^[a-zA-Z]+$/;

  //   if (!usernameRegex.test(username)) {
  //     alert("El nombre de usuario solo puede contener letras.");
  //     return;
  // }
  
    fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: pass }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Usuario creado exitosamente");
          window.location.href = "/login.html";
        } else {
          alert("Algo salio mal, intenta nuevamente o cambia tus credenciales");
        }
      })
      .catch((err) => console.error("Error: ", err));
  });  

  document.getElementById("LoginForm").addEventListener("click", () => {
    window.location.href = "./login.html";
  });