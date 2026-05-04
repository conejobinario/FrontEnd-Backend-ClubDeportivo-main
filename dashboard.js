const loggedUser = JSON.parse(localStorage.getItem("user"));

if (loggedUser) {
    // Primero verificamos si el elemento userName existe en la página actual
    const userNameElement = document.getElementById('userName');
    
    // Solo si existe, le inyectamos el correo (esto evita que el código se rompa en Admin o Coach)
    if (userNameElement) {
        userNameElement.textContent = loggedUser.user;
    }
} else {
    // Si no hay sesión, expulsa al index
    window.location.href = "index.html";
}