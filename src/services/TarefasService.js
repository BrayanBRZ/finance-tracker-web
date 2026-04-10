const KEY = "lista-tarefas";

export const getTarefas = () => {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

export const salvarTarefas = (lista) => {
    localStorage.setItem(KEY, JSON.stringify(lista));
}