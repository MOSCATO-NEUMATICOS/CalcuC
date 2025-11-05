// Base de datos de modelos y piezas
const baseDatos = {
    modelos: {
        toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Fortuner'],
        honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'City'],
        ford: ['Fiesta', 'Focus', 'Mustang', 'Ranger', 'Explorer'],
        chevrolet: ['Cruze', 'Malibu', 'Equinox', 'Silverado', 'Suburban'],
        nissan: ['Sentra', 'Altima', 'Qashqai', 'Pathfinder', 'Frontier'],
        volkswagen: ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Touareg'],
        hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona'],
        kia: ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride']
    },
    piezas: [
        { nombre: 'Amortiguador Delantero', tiempo: 1.5, marca: 'todos' },
        { nombre: 'Amortiguador Trasero', tiempo: 1.5, marca: 'todos' },
        { nombre: 'Resorte Delantero', tiempo: 1.0, marca: 'todos' },
        { nombre: 'Resorte Trasero', tiempo: 1.0, marca: 'todos' },
        { nombre: 'Rótula Superior', tiempo: 1.2, marca: 'todos' },
        { nombre: 'Rótula Inferior', tiempo: 1.2, marca: 'todos' },
        { nombre: 'Brazo de Control', tiempo: 1.5, marca: 'todos' },
        { nombre: 'Barra Estabilizadora', tiempo: 2.0, marca: 'todos' },
        { nombre: 'Alineación de Suspensión', tiempo: 1.0, marca: 'todos' },
        { nombre: 'Pastillas de Freno', tiempo: 0.75, marca: 'todos' },
        { nombre: 'Discos de Freno', tiempo: 1.25, marca: 'todos' }
    ]
};

// Array de piezas seleccionadas
let piezasSeleccionadas = [];

// Cargar datos del localStorage
function cargarDatos() {
    const piezasGuardadas = localStorage.getItem('piezasCustom');
    if (piezasGuardadas) {
        const nuevasPiezas = JSON.parse(piezasGuardadas);
        baseDatos.piezas = [...baseDatos.piezas, ...nuevasPiezas];
    }
}

// Guardar datos en localStorage
function guardarEnLocalStorage() {
    const piezasCustom = baseDatos.piezas.filter(p => !p.predefinida);
    localStorage.setItem('piezasCustom', JSON.stringify(piezasCustom));
}

// Cargar modelos según marca
function cargarModelos() {
    const marca = document.getElementById('marca').value;
    const selectModelo = document.getElementById('modelo');
    
    selectModelo.innerHTML = '<option value="">-- Selecciona un modelo --</option>';
    
    if (marca && baseDatos.modelos[marca]) {
        baseDatos.modelos[marca].forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.toLowerCase();
            option.textContent = modelo;
            selectModelo.appendChild(option);
        });
    }
}

// Cargar piezas
function cargarPiezas() {
    const selectPieza = document.getElementById('pieza');
    const marca = document.getElementById('marca').value;
    
    selectPieza.innerHTML = '<option value="">-- Selecciona una pieza --</option>';
    
    baseDatos.piezas.forEach((pieza, index) => {
        if (pieza.marca === 'todos' || pieza.marca === marca) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${pieza.nombre} (${pieza.tiempo}h)`;
            selectPieza.appendChild(option);
        }
    });
}

// Agregar pieza seleccionada
function agregarPieza() {
    const selectPieza = document.getElementById('pieza');
    const indice = selectPieza.value;
    
    if (!indice) {
        alert('Por favor selecciona una pieza');
        return;
    }
    
    const pieza = baseDatos.piezas[indice];
    const piezaExistente = piezasSeleccionadas.find(p => p.nombre === pieza.nombre);
    
    if (piezaExistente) {
        alert('Esta pieza ya está agregada');
        return;
    }
    
    piezasSeleccionadas.push({
        nombre: pieza.nombre,
        tiempo: pieza.tiempo,
        cantidad: 1,
        lado: 'ambos'
    });
    
    selectPieza.value = '';
    renderizarPiezas();
    calcular();
}

// Renderizar piezas seleccionadas
function renderizarPiezas() {
    const container = document.getElementById('piezasSeleccionadas');
    
    if (piezasSeleccionadas.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay piezas seleccionadas</p>';
        return;
    }
    
    container.innerHTML = piezasSeleccionadas.map((pieza, index) => `
        <div class="pieza-card">
            <div class="pieza-card-header">
                <span class="pieza-nombre">${pieza.nombre}</span>
                <button onclick="eliminarPieza(${index})" class="btn-eliminar">Eliminar</button>
            </div>
            
            <div class="form-group-card">
                <label>Cantidad:</label>
                <div class="cantidad-control">
                    <button onclick="modificarCantidad(${index}, -1)" class="btn-menos">−</button>
                    <span class="cantidad-display">${pieza.cantidad}</span>
                    <button onclick="modificarCantidad(${index}, 1)" class="btn-mas">+</button>
                </div>
            </div>
            
            <div class="form-group-card">
                <label>Lado:</label>
                <div class="lado-selector">
                    <button onclick="cambiarLado(${index}, 'izquierdo')" class="lado-btn ${pieza.lado === 'izquierdo' ? 'active' : ''}">
                        Izquierdo
                    </button>
                    <button onclick="cambiarLado(${index}, 'derecho')" class="lado-btn ${pieza.lado === 'derecho' ? 'active' : ''}">
                        Derecho
                    </button>
                    <button onclick="cambiarLado(${index}, 'ambos')" class="lado-btn ${pieza.lado === 'ambos' ? 'active' : ''}">
                        Ambos
                    </button>
                </div>
            </div>
            
            <div class="pieza-tiempo">
                ⏱️ Tiempo: ${calcularTiempoPieza(pieza)} horas
            </div>
        </div>
    `).join('');
}

// Calcular tiempo de una pieza
function calcularTiempoPieza(pieza) {
    let tiempo = pieza.tiempo * pieza.cantidad;
    
    if (pieza.lado === 'ambos') {
        tiempo *= 2;
    }
    
    return tiempo.toFixed(1);
}

// Modificar cantidad
function modificarCantidad(index, cambio) {
    if (piezasSeleccionadas[index].cantidad + cambio > 0) {
        piezasSeleccionadas[index].cantidad += cambio;
        renderizarPiezas();
        calcular();
    }
}

// Cambiar lado
function cambiarLado(index, lado) {
    piezasSeleccionadas[index].lado = lado;
    renderizarPiezas();
    calcular();
}

// Eliminar pieza
function eliminarPieza(index) {
    piezasSeleccionadas.splice(index, 1);
    renderizarPiezas();
    calcular();
}

// Calcular totales
function calcular() {
    let tiempoTotal = 0;
    
    piezasSeleccionadas.forEach(pieza => {
        tiempoTotal += parseFloat(calcularTiempoPieza(pieza));
    });
    
    const tarifaHoraria = parseFloat(document.getElementById('tarifaHoraria').value) || 0;
    const costoTotal = tiempoTotal * tarifaHoraria;
    
    document.getElementById('tiempoTotal').textContent = tiempoTotal.toFixed(1) + ' h';
    document.getElementById('costoTotal').textContent = '$' + costoTotal.toFixed(2);
}

// Guardar nueva pieza
function guardarNuevaPieza() {
    const nombre = document.getElementById('nombrePieza').value.trim();
    const tiempo = parseFloat(document.getElementById('tiempoPieza').value);
    const marca = document.getElementById('marcaPieza').value;
    
    const mensajeDiv = document.getElementById('mensajeGuardado');
    
    if (!nombre || !tiempo || tiempo <= 0) {
        mensajeDiv.className = 'mensaje error';
        mensajeDiv.textContent = '❌ Por favor completa todos los campos correctamente';
        return;
    }
    
    baseDatos.piezas.push({
        nombre: nombre,
        tiempo: tiempo,
        marca: marca,
        predefinida: false
    });
    
    guardarEnLocalStorage();
    cargarPiezas();
    
    // Limpiar formulario
    document.getElementById('nombrePieza').value = '';
    document.getElementById('tiempoPieza').value = '';
    document.getElementById('marcaPieza').value = 'todos';
    
    mensajeDiv.className = 'mensaje exito';
    mensajeDiv.textContent = '✅ Pieza guardada correctamente';
    
    setTimeout(() => {
        mensajeDiv.className = 'mensaje';
    }, 3000);
}

// Generar reporte
function generarReporte() {
    const marca = document.getElementById('marca').value || 'No especificada';
    const modelo = document.getElementById('modelo').value || 'No especificado';
    const ano = document.getElementById('ano').value || 'No especificado';
    const tarifaHoraria = document.getElementById('tarifaHoraria').value;
    let tiempoTotal = 0;
    
    piezasSeleccionadas.forEach(pieza => {
        tiempoTotal += parseFloat(calcularTiempoPieza(pieza));
    });
    
    const costoTotal = tiempoTotal * tarifaHoraria;
    
    let reporte = `
╔════════════════════════════════════════════════════════════╗
║           REPORTE DE TRABAJO DE SUSPENSIÓN                 ║
╚════════════════════════════════════════════════════════════╝

VEHÍCULO:
  Marca: ${marca.toUpperCase()}
  Modelo: ${modelo.toUpperCase()}
  Año: ${ano}

PIEZAS A CAMBIAR:
───────────────────────────────────────────────────────────────
`;
    
    piezasSeleccionadas.forEach((pieza, index) => {
        const tiempoPieza = calcularTiempoPieza(pieza);
        reporte += `
${index + 1}. ${pieza.nombre.toUpperCase()}
   Cantidad: ${pieza.cantidad}
   Lado: ${pieza.lado.toUpperCase()}
   Tiempo: ${tiempoPieza}h
`;
    });
    
    reporte += `
───────────────────────────────────────────────────────────────

RESUMEN:
  Tiempo Total: ${tiempoTotal.toFixed(1)} horas
  Tarifa Horaria: $${tarifaHoraria}
  Costo Total: $${costoTotal.toFixed(2)}

Fecha: ${new Date().toLocaleDateString('es-ES')}
Hora: ${new Date().toLocaleTimeString('es-ES')}
───────────────────────────────────────────────────────────────
`;
    
    alert(reporte);
    console.log(reporte);
}

// Exportar a PDF
function exportarPDF() {
    const marca = document.getElementById('marca').value || 'No especificada';
    const modelo = document.getElementById('modelo').value || 'No especificado';
    const ano = document.getElementById('ano').value || 'No especificado';
    const tarifaHoraria = document.getElementById('tarifaHoraria').value;
    let tiempoTotal = 0;
    
    piezasSeleccionadas.forEach(pieza => {
        tiempoTotal += parseFloat(calcularTiempoPieza(pieza));
    });
    
    const costoTotal = tiempoTotal * tarifaHoraria;
    
    let contenido = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #667eea; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #667eea; color: white; }
        .resumen { margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px; }
        .total { font-size: 1.3em; font-weight: bold; color: #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚙️ REPORTE DE TRABAJO DE SUSPENSIÓN</h1>
        <p>Calculadora Profesional de Mano de Obra</p>
    </div>
    
    <div style="margin-bottom: 20px;">
        <h3>INFORMACIÓN DEL VEHÍCULO</h3>
        <p><strong>Marca:</strong> ${marca}</p>
        <p><strong>Modelo:</strong> ${modelo}</p>
        <p><strong>Año:</strong> ${ano}</p>
    </div>
    
    <h3>PIEZAS A CAMBIAR</h3>
    <table>
        <thead>
            <tr>
                <th>Pieza</th>
                <th>Cantidad</th>
                <th>Lado</th>
                <th>Tiempo (horas)</th>
            </tr>
        </thead>
        <tbody>
            ${piezasSeleccionadas.map(pieza => `
                <tr>
                    <td>${pieza.nombre}</td>
                    <td>${pieza.cantidad}</td>
                    <td>${pieza.lado}</td>
                    <td>${calcularTiempoPieza(pieza)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="resumen">
        <h3>RESUMEN FINANCIERO</h3>
        <p><strong>Tiempo Total de Trabajo:</strong> <span class="total">${tiempoTotal.toFixed(1)} horas</span></p>
        <p><strong>Tarifa Horaria:</strong> <span class="total">$${tarifaHoraria}</span></p>
        <p><strong>Costo Total de Mano de Obra:</strong> <span class="total">$${costoTotal.toFixed(2)}</span></p>
    </div>
    
    <div class="footer">
        <p>Reporte generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
        <p>© 2024 Calculadora de Suspensión</p>
    </div>
</body>
</html>
    `;
    
    const blob = new Blob([contenido], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_Suspension_${new Date().getTime()}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Limpiar todo
function limpiarTodo() {
    if (confirm('¿Estás seguro de que deseas limpiar todo?')) {
        piezasSeleccionadas = [];
        document.getElementById('marca').value = '';
        document.getElementById('modelo').value = '';
        document.getElementById('ano').value = '';
        document.getElementById('pieza').value = '';
        document.getElementById('tarifaHoraria').value = '50';
        renderizarPiezas();
        calcular();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    cargarPiezas();
});