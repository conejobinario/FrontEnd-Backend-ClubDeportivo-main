document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const msgDiv = document.getElementById("registerMessage");

    msgDiv.innerHTML = ""; // Limpiar alertas

    // Validación Nombre
    if (nombre.length === 0 || nombre.length > 100) {
        msgDiv.innerHTML = '<div class="alert alert-danger">El nombre es obligatorio (máx 100 caracteres).</div>';
        return;
    }

    // Validación Email (Acepta dominios como inacap.cl)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        msgDiv.innerHTML = '<div class="alert alert-danger">Correo no válido.</div>';
        return;
    }

    // Validación Contraseña (8 caracteres, letras y números)
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passRegex.test(password)) {
        msgDiv.innerHTML = '<div class="alert alert-danger">La contraseña debe tener mínimo 8 caracteres, letras y números.</div>';
        return;
    }

    if (password !== confirmPassword) {
        msgDiv.innerHTML = '<div class="alert alert-danger">Las contraseñas no coinciden.</div>';
        return;
    }

    // Lógica de registro (API)
    try {
        const respuesta = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                full_name: nombre,
                email: email,
                password: password,
                birth_date: document.getElementById("fecha_nac").value,
                metadata: { sports: [{ name: document.getElementById("deporte").value, frequency_per_week: 1 }] }
            })
        });
        const res = await respuesta.json();
        if (res.ok) {
            msgDiv.innerHTML = '<div class="alert alert-success">Registro exitoso. Redirigiendo...</div>';
            setTimeout(() => window.location.href = "index.html", 2000);
        } else {
            msgDiv.innerHTML = `<div class="alert alert-danger">${res.message || "Error al registrar"}</div>`;
        }
    } catch (err) {
        msgDiv.innerHTML = '<div class="alert alert-danger">Error de conexión con el servidor.</div>';
    }
});