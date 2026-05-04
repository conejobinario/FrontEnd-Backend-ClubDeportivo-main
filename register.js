document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        
        // Limpiar mensajes previos
        registerMessage.textContent = '';
        registerMessage.className = 'mt-3 text-center text-danger';

        // Capturar datos del formulario
        const full_name = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const birth_date = document.getElementById('fecha_nac').value;
        const deporte = document.getElementById('deporte').value;

        // 1. Validación de longitud (mínimo 8)
        if (password.length < 8) {
            registerMessage.textContent = 'La contraseña debe tener al menos 8 caracteres.';
            return;
        }

        // 2. Validación alfanumérica (letras y números)
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (!hasLetter || !hasNumber) {
            registerMessage.textContent = 'La contraseña debe ser alfanumérica (letras y números).';
            return;
        }

        // 3. Validación de coincidencia
        if (password !== confirmPassword) {
            registerMessage.textContent = 'Las contraseñas no coinciden.';
            return;
        }

        try {
            // 4. Llamada a la API
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name,
                    email,
                    password,
                    role: 'user', // Siempre 'user' para el formulario de registro
                    birth_date,
                    metadata: {
                        sports: [
                            { name: deporte, frequency_per_week: 3 }
                        ]
                    }
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Éxito: Mostrar mensaje verde y redirigir
                registerMessage.className = 'mt-3 text-center text-success';
                registerMessage.textContent = '¡Registro exitoso! Redirigiendo al login...';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                // Error del servidor: Mostrar mensaje en el DOM
                registerMessage.textContent = data.message || 'Error en el registro de usuario.';
            }
        } catch (error) {
            console.error('Error:', error);
            registerMessage.textContent = 'No se pudo conectar con el servidor backend.';
        }
    });
});