'use strict';

// Elementos del formulario
const form = document.getElementById('form');
const totalNodos = document.getElementById('totalNodos');
const nodoRaiz = document.getElementById('nodoRaiz');
const nodosPadre = document.getElementById('nodoPadre');
const nodosHijo = document.getElementById('nodoHijo');
const nodoMeta = document.getElementById('nodoMeta');
const amplitud = document.getElementById('amplitud');
const nivel = document.getElementById('nivel');
const ramas = document.getElementById('ramas');

// Elementos del modal
const summaryModal = document.getElementById('summaryModal');
const summaryContent = document.getElementById('summaryContent');
const confirmTreeBtn = document.getElementById('confirmTree');
const closeModal = document.querySelector('.close');

// Bandera para validación
let flag = true;

// Evento submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtener valores de los inputs
    const inputs = {
        totalNodos: Number(totalNodos.value),
        nodoRaiz: Number(nodoRaiz.value),
        nodosPadre: Number(nodosPadre.value),
        nodosHijo: Number(nodosHijo.value),
        nodoMeta: Number(nodoMeta.value),
        amplitud: Number(amplitud.value),
        nivel: Number(nivel.value),
        ramas: Number(ramas.value)
    };
    
    // Validar inputs
    if (checkInputs(inputs)) {
        showSummary(inputs);
    }
});

// Cerrar modal al hacer clic en la X
closeModal.addEventListener('click', () => {
    summaryModal.style.display = 'none';
});

// Confirmar y generar árbol
confirmTreeBtn.addEventListener('click', () => {
    // Guardar valores en localStorage
    localStorage.setItem("totalNodos", totalNodos.value);
    localStorage.setItem("nodoRaiz", nodoRaiz.value);
    localStorage.setItem("nodoPadre", nodosPadre.value);
    localStorage.setItem("nodoHijo", nodosHijo.value);
    localStorage.setItem("nodoMeta", nodoMeta.value);
    localStorage.setItem("amplitud", amplitud.value);
    localStorage.setItem("nivel", nivel.value);
    localStorage.setItem("ramas", ramas.value);
    
    // Redirigir a la página de visualización
    window.location.href = "trees.html";
});

// Función principal de validación
function checkInputs(inputs) {
    flag = true;
    
    // Validaciones por niveles
    if (
        firstLevelValidation(inputs) &&
        secondLevelValidation(inputs) &&
        thirdLevelValidation(inputs) &&
        fourthLevelValidation(inputs)
    ) {
        return true;
    } else {
        return false;
    }
}

// Validación de valores positivos
function firstLevelValidation(inputs) {
    const validations = [
        { input: totalNodos, condition: inputs.totalNodos > 0, error: 'Debe ingresar un número positivo' },
        { input: nodoRaiz, condition: inputs.nodoRaiz > 0, error: 'Debe ingresar un número positivo' },
        { input: nodosPadre, condition: inputs.nodosPadre > 0, error: 'Debe ingresar un número positivo' },
        { input: nodosHijo, condition: inputs.nodosHijo > 0, error: 'Debe ingresar un número positivo' },
        { input: nodoMeta, condition: inputs.nodoMeta > 0, error: 'Debe ingresar un número positivo' },
        { input: amplitud, condition: inputs.amplitud > 0, error: 'Debe ingresar un número positivo' },
        { input: nivel, condition: inputs.nivel > 1, error: 'La profundidad debe ser mayor a 1' },
        { input: ramas, condition: inputs.ramas > 0, error: 'Debe ingresar un número positivo' }
    ];

    let allValid = true;
    validations.forEach(validation => {
        if (!validation.condition) {
            setErrorFor(validation.input, validation.error);
            allValid = false;
        } else {
            setSuccessFor(validation.input);
        }
    });

    return allValid;
}

// Validación de nodos padre vs nodos hijo
function secondLevelValidation(inputs) {
    if (inputs.nodosPadre >= inputs.nodosHijo) {
        setErrorFor(nodosPadre, 'Debe haber menos nodos padre que hijos');
        return false;
    }
    setSuccessFor(nodosPadre);
    return true;
}

// Validación de relaciones entre amplitud, nivel y nodos
function thirdLevelValidation(inputs) {
    // Cálculo de máximos y mínimos
    const maxNodosPadre = inputs.nodosHijo - inputs.amplitud + 1;
    const minNodosPadre = inputs.nivel - 1;
    const maxNodosHijo = inputs.amplitud * (inputs.nivel - 1);
    const minNodosHijo = inputs.amplitud + inputs.nivel - 2;

    // Validaciones
    const validations = [
        { 
            input: nodosHijo, 
            condition: inputs.nodosHijo >= minNodosHijo, 
            error: `Deben haber al menos ${minNodosHijo} nodos hijo` 
        },
        { 
            input: nodosHijo, 
            condition: inputs.nodosHijo <= maxNodosHijo, 
            error: `Se deben tener a lo más ${maxNodosHijo} nodos hijo` 
        },
        { 
            input: nodosPadre, 
            condition: inputs.nodosPadre >= minNodosPadre, 
            error: `Deben haber al menos ${minNodosPadre} nodos padre` 
        },
        { 
            input: nodosPadre, 
            condition: inputs.nodosPadre <= maxNodosPadre, 
            error: `Se deben tener a lo más ${maxNodosPadre} nodos padre` 
        }
    ];

    let allValid = true;
    validations.forEach(validation => {
        if (!validation.condition) {
            setErrorFor(validation.input, validation.error);
            allValid = false;
        } else {
            setSuccessFor(validation.input);
        }
    });

    return allValid;
}

// Validación del nodo meta
function fourthLevelValidation(inputs) {
    if (inputs.nodoMeta > inputs.totalNodos) {
        setErrorFor(nodoMeta, `El nodo meta no puede ser mayor que el total de nodos (${inputs.totalNodos})`);
        return false;
    }
    setSuccessFor(nodoMeta);
    return true;
}

// Mostrar error en input
function setErrorFor(input, message) {
    const inputBox = input.parentElement;
    const small = inputBox.querySelector('small');
    small.innerText = message;
    inputBox.className = 'input-box error';
    localStorage.removeItem(input.id);
    flag = false;
    return false;
}

// Mostrar éxito en input
function setSuccessFor(input) {
    const inputBox = input.parentElement;
    inputBox.className = 'input-box success';
    localStorage.setItem(input.id, input.value);
    return true;
}

// Mostrar resumen en modal
function showSummary(inputs) {
    summaryContent.innerHTML = `
        <h3>Resumen del Árbol</h3>
        <p><strong>Total de nodos:</strong> ${inputs.totalNodos}</p>
        <p><strong>Nodo raíz:</strong> ${inputs.nodoRaiz}</p>
        <p><strong>Nodos padre:</strong> ${inputs.nodosPadre}</p>
        <p><strong>Nodos hijo:</strong> ${inputs.nodosHijo}</p>
        <p><strong>Nodo meta:</strong> ${inputs.nodoMeta}</p>
        <p><strong>Amplitud:</strong> ${inputs.amplitud}</p>
        <p><strong>Profundidad:</strong> ${inputs.nivel}</p>
        <p><strong>Ramas:</strong> ${inputs.ramas}</p>
        <hr>
        <p>¿Desea generar el árbol con estos parámetros?</p>
    `;
    summaryModal.style.display = 'block';
}