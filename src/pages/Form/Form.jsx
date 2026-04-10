import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTarefas, salvarTarefas } from "../../services/TarefasService";

const Form = () => {
    const [texto, setTexto] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const lista = getTarefas();
            const tarefa = lista.find(item => item.id === Number(id));
            if (tarefa) setTexto(tarefa.texto);
        }
    }, [id]);

    const alterar = (e) => {
        setTexto(e.target.value);
    }
    const salvar = () => {
        let lista = getTarefas();
        if (id) {
            lista = lista.map(item => item.id === Number(id) ? { ...item, texto } : item);
        }
        else {
            const todoList = {
                id: Date.now(),
                texto: texto,
                status: false
            }

            lista.push(todoList);
        }
        salvarTarefas(lista);
        navigate("/");
    }

    return (
        <div>
            <input type="text" value={texto} onChange={alterar} />
            <input type="button" onClick={salvar} value="Salvar" />
        </div>
    )
}
export default Form;