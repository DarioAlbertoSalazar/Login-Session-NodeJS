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
    .then((data)=>{
      document.querySelector("h1").innerHTML = `Bienvenido ${data.user}`
    })
  });
  