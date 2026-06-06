/**
 * MOTOR DE EVALUACIÓN MACROECONÓMICA FAMILIAR v16.7
 * Desarrollo por: ROJAS REBECA
 */

let esCargaInicial = true;

// CONTROL DINÁMICO DE VISUALIZACIÓN DE TRANSPORTE
function toggleTransportFields() {
    const type = document.getElementById('inTransportType').value;
    const pubGroup = document.getElementById('groupPublicTransport');
    const perGroup = document.getElementById('groupPersonalTransport');

    if (!pubGroup || !perGroup) return;

    if (type === 'ambos') {
        pubGroup.style.display = 'block';
        perGroup.style.display = 'block';
    } else if (type === 'publico') {
        pubGroup.style.display = 'block';
        perGroup.style.display = 'none';
        document.getElementById('inGasHist').value = 0;
        document.getElementById('inGasNow').value = 0;
    } else if (type === 'personal') {
        pubGroup.style.display = 'none';
        perGroup.style.display = 'block';
        document.getElementById('inBusHist').value = 0;
        document.getElementById('inBusNow').value = 0;
    }
}

// CONTROL DINÁMICO DE SELECCIÓN DE VIVIENDA
function toggleHousingField() {
    const type = document.getElementById('inHousingType').value;
    const costGroup = document.getElementById('groupHousingCost');
    const label = document.getElementById('lblHousingCost');
    const input = document.getElementById('inHouse');

    if (!costGroup || !label || !input) return;

    if (type === 'alquiler') {
        costGroup.style.display = 'flex';
        label.innerText = "Canon de Alquiler Mensual (Bs.)";
    } else if (type === 'hipoteca') {
        costGroup.style.display = 'flex';
        label.innerText = "Cuota Hipotecaria Mensual (Bs.)";
    } else {
        costGroup.style.display = 'none';
        input.value = 0;
    }
}

// FUNCIÓN DE VALIDACIÓN EN TIEMPO REAL (Resuelve el atasco de setCustomValidity)
function validarDemografia() {
    const inputMiembros = document.getElementById('inMembers');
    const inputAbuelos = document.getElementById('inElderly');
    const inputNinos = document.getElementById('inChildren');

    if (!inputMiembros || !inputAbuelos || !inputNinos) return true;

    // Reseteamos el error de inmediato para que el navegador nos deje escribir
    inputMiembros.setCustomValidity("");

    const miembrosTotales = parseInt(inputMiembros.value) || 0;
    const adultosMayores = parseInt(inputAbuelos.value) || 0;
    const ninosDependientes = parseInt(inputNinos.value) || 0;

    // Si los campos están vacíos o están en proceso de edición, no bloquear
    if (inputMiembros.value === "") return true;

    // Ejecutar la prueba matemática
    if ((adultosMayores + ninosDependientes) > miembrosTotales) {
        inputMiembros.setCustomValidity("La suma de niños y adultos mayores no puede ser mayor que el total de miembros.");
        return false;
    }

    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    toggleTransportFields();
    toggleHousingField();

    const form = document.getElementById('auditForm');
    const outArea = document.getElementById('outputArea');
    const btnDemo = document.getElementById('btnDemoCase');

    // ESCUCHADORES EN TIEMPO REAL: Limpian y validan cada vez que el usuario escribe
    document.getElementById('inMembers')?.addEventListener('input', validarDemografia);
    document.getElementById('inElderly')?.addEventListener('input', validarDemografia);
    document.getElementById('inChildren')?.addEventListener('input', validarDemografia);

    // BOTÓN DE DEMOSTRACIÓN AUTOMÁTICA
    if (btnDemo && form) {
        btnDemo.addEventListener('click', () => {
            document.getElementById('inMembers').value = 4;
            document.getElementById('inElderly').value = 1;
            document.getElementById('inChildren').value = 2;
            document.getElementById('inPets').value = 1;
            document.getElementById('inDisability').value = 'no';

            document.getElementById('inIncome').value = 3500;
            document.getElementById('inExtra').value = 400;
            document.getElementById('inLaborStability').value = 'temporal';

            document.getElementById('inTransportType').value = 'ambos';
            toggleTransportFields();
            document.getElementById('inBusHist').value = 240;
            document.getElementById('inBusNow').value = 380;
            document.getElementById('inGasHist').value = 300;
            document.getElementById('inGasNow').value = 520;

            document.getElementById('inGasType').value = 'garrafa';
            document.getElementById('inGasCost').value = 45;
            document.getElementById('inLuz').value = 110;
            document.getElementById('inAgua').value = 65;
            document.getElementById('inNet').value = 150;

            document.getElementById('inFoodHist').value = 1600;
            document.getElementById('inFoodNow').value = 2350;
            document.getElementById('inHousingType').value = 'alquiler';
            toggleHousingField();
            document.getElementById('inHouse').value = 1200;
            document.getElementById('inDebt').value = 300;

            // Forzar limpieza antes del submit de la demo
            validarDemografia();
            form.dispatchEvent(new Event('submit'));
        });
    }

    if (!form || !outArea) return;

    form.addEventListener('submit', (e) => {
        // Doble verificación antes de procesar
        if (!validarDemografia()) {
            form.reportValidity();
            e.preventDefault();
            return;
        }

        e.preventDefault();

        // Validar que no haya negativos
        const todosLosInputs = form.querySelectorAll('input[type="number"]');
        for (let input of todosLosInputs) {
            input.setCustomValidity("");
            if (input.value !== "" && parseFloat(input.value) < 0) {
                input.setCustomValidity("El valor debe ser superior o igual a 0");
                form.reportValidity();
                return; 
            }
        }

        // Estructura de datos limpia
        const model = {
            members: parseInt(document.getElementById('inMembers')?.value) || 1,
            elderly: parseInt(document.getElementById('inElderly')?.value) || 0,
            children: parseInt(document.getElementById('inChildren')?.value) || 0,
            pets: parseInt(document.getElementById('inPets')?.value) || 0,
            isDisability: document.getElementById('inDisability')?.value === 'si',
            
            sueldoTotal: (parseFloat(document.getElementById('inIncome')?.value) || 0) + 
                         (parseFloat(document.getElementById('inExtra')?.value) || 0),
            laborStability: document.getElementById('inLaborStability')?.value || 'estable',
            
            transType: document.getElementById('inTransportType')?.value || 'publico',
            busH: parseFloat(document.getElementById('inBusHist')?.value) || 0,
            busN: parseFloat(document.getElementById('inBusNow')?.value) || 0,
            gasH: parseFloat(document.getElementById('inGasHist')?.value) || 0,
            gasN: parseFloat(document.getElementById('inGasNow')?.value) || 0,
            
            gasType: document.getElementById('inGasType')?.value || 'garrafa',
            gasCost: parseFloat(document.getElementById('inGasCost')?.value) || 0,
            luz: parseFloat(document.getElementById('inLuz')?.value) || 0,
            agua: parseFloat(document.getElementById('inAgua')?.value) || 0,
            net: parseFloat(document.getElementById('inNet')?.value) || 0,
            
            foodH: parseFloat(document.getElementById('inFoodHist')?.value) || 0,
            foodN: parseFloat(document.getElementById('inFoodNow')?.value) || 0,
            housingType: document.getElementById('inHousingType')?.value || 'propia',
            house: parseFloat(document.getElementById('inHouse')?.value) || 0,
            debt: parseFloat(document.getElementById('inDebt')?.value) || 0
        };

        // Cálculos financieros
        const serviciosTotales = model.luz + model.agua + model.net + model.gasCost;
        const totalHistDoc = model.busH + model.gasH + model.foodH + serviciosTotales + model.house + model.debt;
        const totalNowDoc = model.busN + model.gasN + model.foodN + serviciosTotales + model.house + model.debt;
        
        const inflacionHogar = totalHistDoc > 0 ? (((totalNowDoc - totalHistDoc) / totalHistDoc) * 100) : 0;
        const saldoDisponible = model.sueldoTotal - totalNowDoc;
        const ratioGastoIngreso = model.sueldoTotal > 0 ? (totalNowDoc / model.sueldoTotal) : 2;

        let factorRiesgoLaboral = 0;
        let textoLaboralExplicativo = "Ingresos Estables / Fijos.";
        if (model.laborStability === 'independiente') { factorRiesgoLaboral = 15; textoLaboralExplicativo = "Totalmente Independiente / Variable."; }
        if (model.laborStability === 'temporal') { factorRiesgoLaboral = 10; textoLaboralExplicativo = "Contratos Temporales / Consultorías."; }

        let colorClaseDinamica = "dyn-verde";
        let semaforoClase = "v-verde";
        let semaforoTitulo = "Presupuesto Bajo Control";
        let semaforoMensaje = "Estructura en equilibrio. Tus ingresos actuales logran mitigar los incrementos de precios.";
        
        let explicacionSituacion = "";
        let recomendacionesMejora = "";
        let impactoFamiliar = "";

        if (saldoDisponible >= 0 && ratioGastoIngreso <= 0.75) {
            colorClaseDinamica = "dyn-verde";
            semaforoClase = "v-verde";
            semaforoTitulo = "Presupuesto Bajo Control";
            semaforoMensaje = "Estructura en equilibrio. Tus ingresos actuales logran mitigar los incrementos de precios y mantienes un remanente de ahorro.";
            explicacionSituacion = `Tu hogar se encuentra en una situación de <strong>superávit financiero</strong>. A pesar del encarecimiento generalizado de la canasta alimentaria y los servicios de transporte local, el volumen de tus ingresos combinados cubre la totalidad de tus obligaciones sin necesidad de recurrir al endeudamiento regular.`;
            impactoFamiliar = `Para las familias con ingresos fijos o independientes en esta franja, la inflación actual representa una reducción marginal en la capacidad de ahorro superfluo, pero no pone en peligro ninguna necesidad básica.`;
            recomendacionesMejora = `
                <li><strong>Construcción de Blindaje:</strong> Destina un mínimo del 15% de tu saldo libre mensual a un fondo de contingencia líquido de emergencia.</li>
                <li><strong>Abastecimiento Inteligente:</strong> Adelanta la compra de bienes no perecederos al por mayor en mercados centrales antes de nuevos picos estacionales inflacionarios.</li>
            `;
        } 
        else if (saldoDisponible >= 0 && ratioGastoIngreso > 0.75 && ratioGastoIngreso <= 1) {
            colorClaseDinamica = "dyn-amarillo";
            semaforoClase = "v-amarillo";
            semaforoTitulo = "Alerta: Presupuesto Bajo Presión";
            semaforoMensaje = "Atención. El costo de manutención consume casi la totalidad de tus recursos disponibles, limitando seriamente tu respuesta ante emergencias.";
            explicacionSituacion = `Tu presupuesto se encuentra en un estado de <strong>estrés o equilibrio precario</strong>. Estás en un punto de "empate técnico": todo lo que ingresa al hogar se diluye de manera inmediata en gastos de subsistencia, transporte y pasivos financieros. Tu capacidad de ahorro real se ha reducido a cero.`;
            impactoFamiliar = `Este escenario afecta drásticamente la resiliencia del núcleo. Cualquier gasto imprevisto (médico, averías mecánicas o estructurales) obligará a la familia a recortar porciones alimentarias o incurrir en deudas de alto riesgo.`;
            recomendacionesMejora = `
                <li><strong>Optimización de Logística:</strong> Si usas vehículo personal, evalúa migrar temporalmente a transporte público combinado para detener la fuga acelerada en combustible.</li>
                <li><strong>Sustitución de Canasta:</strong> Reemplaza marcas líderes por productos locales de mercados primarios, mitigando los costes de intermediarios.</li>
                <li><strong>Congelación estricta de Pasivos:</strong> Evita refinanciar deudas vigentes o utilizar líneas de crédito corrientes para consumos de primera necesidad.</li>
            `;
        } 
        else {
            colorClaseDinamica = "dyn-rojo";
            semaforoClase = "v-rojo";
            semaforoTitulo = "Déficit y Vulnerabilidad Crítica";
            semaforoMensaje = "¡Emergencia Financiera! Estás gastando más de lo que percibes mensualmente. Riesgo inminente de insolvencia estructural.";
            explicacionSituacion = `Tu economía familiar sufre un <strong>déficit financiero agudo (Sobregasto)</strong>. Estás desembolsando de manera real más dinero del que ingresa a tus arcas. La brecha inflacionaria acumulada en alimentos y transporte ha superado por completo tu capacidad salarial.`;
            impactoFamiliar = `Para las familias en este estrato, el impacto es devastador y asimétrico. La presencia de miembros vulnerables (niños, adultos mayores o personas con discapacidad) agrava la crisis debido a la rigidez insustituible de sus costes médicos y alimentarios.`;
            recomendacionesMejora = `
                <li><strong>Plan de Austeridad Drástica:</strong> Clasifica de forma inmediata tus egresos. Elimina de raíz cualquier servicio de entretenimiento o suscripción no esencial.</li>
                <li><strong>Reestructuración Urgente de Deudas:</strong> Acude a tus entidades bancarias antes de caer en mora legal para solicitar planes de diferimiento o prórrogas.</li>
                <li><strong>Activación de Economías Complementarias:</strong> Es perentorio diversificar los flujos monetarios del hogar mediante subempleos o comercialización secundaria.</li>
            `;
        }

        const calcularDesviacionStr = (ahora, antes) => {
            if (antes === 0) return ahora > 0 ? '+100%' : '0%';
            const calculo = ((ahora - antes) / antes) * 100;
            return calculo > 0 ? `+${calculo.toFixed(0)}%` : `${calculo.toFixed(0)}%`;
        };

        const maxEjeVal = Math.max(model.busH, model.busN, model.gasH, model.gasN, model.foodH, model.foodN, serviciosTotales, model.house, model.debt, 10);
        const getBarWidth = (v) => Math.min(((v / maxEjeVal) * 100), 100).toFixed(1);

        // Renderizado del Reporte
        outArea.innerHTML = `
            <div class="report-card">
                <div class="semaforo-banner ${semaforoClase}">
                    <h3><i class="fas fa-triangle-exclamation"></i> EVALUACIÓN: ${semaforoTitulo}</h3>
                    <p>${semaforoMensaje}</p>
                </div>

                <div class="kpi-grid">
                    <div class="kpi-item">
                        <span>Gastos Actuales</span>
                        <h4>Bs. ${totalNowDoc.toFixed(0)}</h4>
                    </div>
                    <div class="kpi-item">
                        <span>Saldo Mensual</span>
                        <h4 style="color:${saldoDisponible < 0 ? 'var(--clr-rojo)': 'var(--clr-verde)'}">Bs. ${saldoDisponible.toFixed(0)}</h4>
                    </div>
                    <div class="kpi-item">
                        <span>Inflación del Hogar</span>
                        <h4 style="color:var(--clr-rojo)">+${inflacionHogar.toFixed(1)}%</h4>
                    </div>
                </div>

                <h3 class="card-title" style="color:var(--clr-blue); border-bottom:1px solid var(--border-dark); padding-bottom:6px;">
                    <i class="fas fa-chart-bar"></i> Gráficos de Costos (Barras de Actualidad Semafóricas)
                </h3>

                <div class="chart-container">
                    <div class="chart-header">
                        <span>Sustento: Canasta Alimentaria</span>
                        <span class="pct-badge">${calcularDesviacionStr(model.foodN, model.foodH)}</span>
                    </div>
                    <div class="bar-axis">
                        <div class="bar-row">
                            <span class="bar-label">Antes</span>
                            <div class="bar-track"><div class="bar-fill hist" style="width: ${getBarWidth(model.foodH)}%"></div></div>
                            <span class="bar-val">Bs. ${model.foodH}</span>
                        </div>
                        <div class="bar-row">
                            <span class="bar-label">Ahora</span>
                            <div class="bar-track"><div class="bar-fill ${colorClaseDinamica}" style="width: ${getBarWidth(model.foodN)}%"></div></div>
                            <span class="bar-val">Bs. ${model.foodN}</span>
                        </div>
                    </div>
                </div>

                ${(model.transType === 'ambos' || model.transType === 'publico') ? `
                <div class="chart-container">
                    <div class="chart-header">
                        <span>Movilidad: Transporte Público</span>
                        <span class="pct-badge">${calcularDesviacionStr(model.busN, model.busH)}</span>
                    </div>
                    <div class="bar-axis">
                        <div class="bar-row">
                            <span class="bar-label">Antes</span>
                            <div class="bar-track"><div class="bar-fill hist" style="width: ${getBarWidth(model.busH)}%"></div></div>
                            <span class="bar-val">Bs. ${model.busH}</span>
                        </div>
                        <div class="bar-row">
                            <span class="bar-label">Ahora</span>
                            <div class="bar-track"><div class="bar-fill ${colorClaseDinamica}" style="width: ${getBarWidth(model.busN)}%"></div></div>
                            <span class="bar-val">Bs. ${model.busN}</span>
                        </div>
                    </div>
                </div>
                ` : ''}

                ${(model.transType === 'ambos' || model.transType === 'personal') ? `
                <div class="chart-container">
                    <div class="chart-header">
                        <span>Combustible: Vehículo Personal</span>
                        <span class="pct-badge">${calcularDesviacionStr(model.gasN, model.gasH)}</span>
                    </div>
                    <div class="bar-axis">
                        <div class="bar-row">
                            <span class="bar-label">Antes</span>
                            <div class="bar-track"><div class="bar-fill hist" style="width: ${getBarWidth(model.gasH)}%"></div></div>
                            <span class="bar-val">Bs. ${model.gasH}</span>
                        </div>
                        <div class="bar-row">
                            <span class="bar-label">Ahora</span>
                            <div class="bar-track"><div class="bar-fill ${colorClaseDinamica}" style="width: ${getBarWidth(model.gasN)}%"></div></div>
                            <span class="bar-val">Bs. ${model.gasN}</span>
                        </div>
                    </div>
                </div>
                ` : ''}

                <div class="chart-container">
                    <div class="chart-header">
                        <span>Energía, Conectividad y Gas Desagregado</span>
                        <span class="pct-badge" style="background:rgba(168,85,247,0.15); color:var(--clr-purple);">Costo Fijo</span>
                    </div>
                    <div class="bar-axis">
                        <div class="bar-row">
                            <span class="bar-label">Suma</span>
                            <div class="bar-track"><div class="bar-fill" style="width: ${getBarWidth(serviciosTotales)}%; background-color: var(--clr-purple) !important;"></div></div>
                            <span class="bar-val">Bs. ${serviciosTotales}</span>
                        </div>
                    </div>
                    <p style="font-size:0.7rem; color:var(--text-muted); margin-top:6px; font-family: monospace;">
                        Luz: Bs. ${model.luz} | Agua: Bs. ${model.agua} | Internet: Bs. ${model.net} | Gas (${model.gasType.toUpperCase()}): Bs. ${model.gasCost}
                    </p>
                </div>

                ${(!esCargaInicial) ? `
                    <h3 class="report-section-title"><i class="fas fa-microscope"></i> Dictamen y Análisis de Vulnerabilidad</h3>
                    <div class="analysis-box">
                        <p><strong>¿Qué está sucediendo con tus gastos?</strong><br> ${explicacionSituacion}</p>
                        <p><strong>¿Cómo afecta a la estabilidad económica familiar?</strong><br> ${impactoFamiliar}</p>
                        <p><strong>Estrategias recomendadas de mitigación:</strong></p>
                        <ul class="strategy-list">
                            ${recomendacionesMejora}
                        </ul>
                    </div>

                    <div class="social-notice" style="font-size: 1.05rem; line-height: 1.6;">
                        <h3 style="font-size: 1.2rem; margin-bottom: 8px;"><i class="fas fa-hand-holding-hand"></i> Ponderación de Vulnerabilidad Estructural:</h3>
                        • Consolidación Laboral: <strong>${textoLaboralExplicativo}</strong><br>
                        • Régimen de Vivienda: <strong>${model.housingType.toUpperCase()} ${model.house > 0 ? `(Bs. ${model.house}/mes)` : ''}</strong><br>
                        • Densidad del Hogar: <strong>${model.members} personas</strong> (Adultos mayores: ${model.elderly} | Niños: ${model.children}).<br>
                        • Protección animal: Gasto absorbido para <strong>${model.pets} mascota(s)</strong>.<br>
                        • Discapacidad en el núcleo: <strong>${model.isDisability ? 'SÍ (Eleva la criticidad médica por dependencia económica)' : 'NO'}</strong>.
                    </div>

                    <div class="auditor-seal">
                        <span><i class="fas fa-signature"></i> Firma de Validación: <strong>ROJAS REBECA</strong></span>
                        <span>ID Doc: #RES-${Math.floor(1000 + Math.random() * 9000)}-2026</span>
                    </div>

                    <button type="button" class="btn-print" onclick="window.print()">
                        <i class="fas fa-print"></i> Exportar / Imprimir Reporte de Auditoría
                    </button>
                ` : ''}
            </div>
        `;
        esCargaInicial = false;
    });

    // Lanzar primer submit controlado
    validarDemografia();
    form.dispatchEvent(new Event('submit'));
});