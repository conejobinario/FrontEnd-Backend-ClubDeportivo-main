document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    // Detecta si hay una letra repetida más de 4 veces seguidas (ej: "aaaaa", "jjjjj")
    function tieneRepeticionExcesiva(texto) {
        return /(.)\1{4,}/.test(texto);
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar mensaje previo
        registerMessage.textContent = '';
        registerMessage.className = 'mt-3 text-center text-danger';

        // Capturar datos
        const full_name = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const birth_date = document.getElementById('fecha_nac').value;
        const deporte = document.getElementById('deporte').value.trim();

        // 1. Validar que el nombre no esté vacío
        if (full_name === '') {
            registerMessage.textContent = 'El nombre es obligatorio.';
            return;
        }

        // 2. Validar largo del nombre (máximo 100 caracteres)
        if (full_name.length > 100) {
            registerMessage.textContent = 'El nombre no puede tener más de 100 caracteres.';
            return;
        }

        // 3. Validar que el nombre solo tenga letras y espacios (sin números ni símbolos)
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!soloLetras.test(full_name)) {
            registerMessage.textContent = 'El nombre solo puede contener letras.';
            return;
        }

        // 4. Validar que el nombre no tenga letras repetidas excesivamente (ej: "aaaaaa")
        if (tieneRepeticionExcesiva(full_name)) {
            registerMessage.textContent = 'El nombre ingresado no parece válido.';
            return;
        }

        // 5. Validar que el email no esté vacío y tenga formato válido
        if (email === '') {
            registerMessage.textContent = 'El correo electrónico es obligatorio.';
            return;
        }

        if (email.length > 150) {
            registerMessage.textContent = 'El correo no puede tener más de 150 caracteres.';
            return;
        }

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatoEmail.test(email)) {
            registerMessage.textContent = 'El correo electrónico no tiene un formato válido.';
            return;
        }

        // 6. Validar que el correo no tenga letras repetidas excesivamente (ej: "jaaaaaaa@jaaaa.cl")
        if (tieneRepeticionExcesiva(email)) {
            registerMessage.textContent = 'El correo ingresado no parece válido.';
            return;
        }

        // 7. Validar fecha de nacimiento
        if (birth_date === '') {
            registerMessage.textContent = 'La fecha de nacimiento es obligatoria.';
            return;
        }

        const fechaNacimiento = new Date(birth_date);
        const hoy = new Date();
        const anioMinimo = new Date('1900-01-01');

        // No puede ser una fecha futura
        if (fechaNacimiento > hoy) {
            registerMessage.textContent = 'La fecha de nacimiento no puede ser una fecha futura.';
            return;
        }

        // No puede ser antes de 1900
        if (fechaNacimiento < anioMinimo) {
            registerMessage.textContent = 'La fecha de nacimiento no puede ser anterior al año 1900.';
            return;
        }

        // El usuario debe tener al menos 5 años (para evitar registros absurdos)
        const edadMinima = new Date();
        edadMinima.setFullYear(edadMinima.getFullYear() - 5);
        if (fechaNacimiento > edadMinima) {
            registerMessage.textContent = 'Debes tener al menos 5 años para registrarte.';
            return;
        }

        // 8. Validar contraseña: mínimo 8, máximo 100 caracteres
        if (password.length < 8) {
            registerMessage.textContent = 'La contraseña debe tener al menos 8 caracteres.';
            return;
        }

        if (password.length > 100) {
            registerMessage.textContent = 'La contraseña no puede tener más de 100 caracteres.';
            return;
        }

        // 9. Validar que la contraseña sea alfanumérica (letras y números)
        const tieneLetra = /[a-zA-Z]/.test(password);
        const tieneNumero = /[0-9]/.test(password);
        if (!tieneLetra || !tieneNumero) {
            registerMessage.textContent = 'La contraseña debe contener letras y números.';
            return;
        }

        // 10. Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            registerMessage.textContent = 'Las contraseñas no coinciden.';
            return;
        }

        // 11. Validar deporte
        if (deporte === '') {
            registerMessage.textContent = 'El deporte de interés es obligatorio.';
            return;
        }

        if (deporte.length > 50) {
            registerMessage.textContent = 'El deporte no puede tener más de 50 caracteres.';
            return;
        }

        // 12. Enviar a la API
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name,
                    email,
                    password,
                    role: 'user',
                    must_change_password: false,
                    birth_date: birth_date,
                    metadata: {
                        sports: [
                            {
                                name: deporte,
                                frequency_per_week: 3
                            }
                        ]
                    }
                })
            });

            const data = await response.json();

            if (response.ok) {
                registerMessage.className = 'mt-3 text-center text-success';
                registerMessage.textContent = '¡Registro exitoso! Redirigiendo al login...';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                registerMessage.textContent = data.message || 'Error en el registro de usuario.';
            }

        } catch (error) {
            console.error('Error:', error);
            registerMessage.textContent = 'No se pudo conectar con el servidor backend.';
        }
    });
});