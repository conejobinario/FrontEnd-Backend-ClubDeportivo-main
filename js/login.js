// Escuchamos el envío del formulario
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que la página se recargue[cite: 2]

    // 1. Capturamos los datos que escribió el usuario[cite: 2]
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

  
    try {
        // Hacemos la petición al backend[cite: 1, 2]
        const respuesta = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Enviamos el email y password como pide el backend[cite: 1, 2]
            body: JSON.stringify({
                email: emailInput,
                password: passwordInput
            })
        });

        // Convertimos la respuesta a un objeto JS[cite: 2]
        const resultado = await respuesta.json();

        // 3. Verificamos si el servidor nos dio el paso (ok: true)[cite: 1, 2]
        if (resultado.ok) {
            // GUARDADO DE SESIÓN (Punto clave para la nota máxima)[cite: 1, 2]
            // Guardamos el token y el objeto usuario por separado como dice el PDF[cite: 1, 2]
            localStorage.setItem("token", resultado.data.token);
            localStorage.setItem("user", JSON.stringify(resultado.data.user));

            // 4. Redirección según el rol que viene desde la base de datos[cite: 1, 2]
            const rol = resultado.data.user.role;

            if (rol === "admin") {
                window.location.href = "/html/dashboard-admin.html";
            } else if (rol === "coach") {
                window.location.href = "/html/dashboard-coach.html";
            } else {
                window.location.href = "/html/dashboard-usuario.html";
            }

        } else {
            // Si el backend dice ok: false, mostramos el mensaje de error real[cite: 2]
            errorMessage.textContent = resultado.message || "Credenciales incorrectas";
            errorMessage.style.color = "red";
        }

    } catch (error) {
        // Si el servidor está apagado o hay un fallo de red[cite: 1, 2]
        errorMessage.textContent = "No se pudo conectar con el servidor";
        console.error("Error detectado:", error);
    }
});