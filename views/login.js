document.getElementById("signInForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
  
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: pass }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
            console.log(data)
            localStorage.setItem("token", data.token)
            window.location.href = "/home.html";
        } else {
          alert("Tu usuario o contraseña es incorrecto");
        }
      })
      .catch((err) => console.error("Error: ", err));
  });
  