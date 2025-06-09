import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import Header from "../Components/Header";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa6";
import Modal from "react-modal";
import { Link } from "react-router-dom";

function Pesquisar() {

    const [resultado, setResultado] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false)
    const [tripSelecionada, setTripSelecionada] = useState(null)
    const { register: registerForm1, handleSubmit: handleSubmit1, reset: reset1 } = useForm();
    const { register: registerForm2, handleSubmit: handleSubmit2, reset: reset2 } = useForm();


    async function pesquisaFilmes(data) {
        try {
            const resposta = await fetch("http://localhost:3000/trips")
            if (!resposta.ok) throw new Error("Erro ao consultar os filmes")
            const dados = await resposta.json()
            const pesquisa = data.pesquisa.toUpperCase()
            const dados2 = dados.filter(trip => (
                (trip.cidade && trip.cidade.toUpperCase().includes(pesquisa)) ||
                (trip.estado && trip.estado.toUpperCase().includes(pesquisa)) ||
                (trip.pais && trip.pais.toUpperCase().includes(pesquisa)) ||
                (trip.dataInicial && String(trip.dataInicial).toUpperCase().includes(pesquisa)) ||
                (trip.usuarios && trip.usuarios.toUpperCase().includes(pesquisa))
            ));
            if (dados2.length == 0) {
                // alert("Não há filmes com a palavra-chave no título ou gênero")
            } else {
                setResultado(dados2)
            }
        } catch (erro) {
            console.log("Erro: ", erro.message)
        }
    }


    const listaResultado = (
        <div className="w-[60%] flex flex-col items-start gap-2 py-2">
            {
                resultado.map(trip => (
                    <div key={trip.id} className="flex w-full justify-between bg-slate-100 hover:bg-gradient-to-l border border-slate-200 hover:border-slate-500 from-slate-300 to-magenta/70 p-2 rounded-md font-Inter">
                        <p className="flex-1/3 font-semibold"><Link to={`/viagens/${trip.id}`}>{trip.cidade}<span className="font-light"> - {trip.pais}</span></Link></p>

                        <p className="flex-1/3 font-light">{new Date(trip.dataInicial).toLocaleDateString("pt-BR")}</p>
                        <p className="flex-1/3">{trip.usuarios}</p>
                        <p className="flex-1/5 flex items-center gap-0.5"><FaStar className="text-[#ffba00]" />{trip.avaliacao}</p>

                        <div className="flex items-center gap-2">
                            <button className="text-slate-900 cursor-pointer" onClick={() => abrirEditor(trip)}><FaEdit /></button>
                            <button className="text-magenta cursor-pointer" onClick={() => deletarViagem(trip.id)}><FaTrash /></button>
                        </div>
                    </div>
                ))
            }

        </div>
    )

    async function deletarViagem(id) {
        try {
            const resposta = await fetch(`http://localhost:3000/trips/${id}`, {
                method: 'DELETE'
            })
            if (resposta.ok) {
                Swal.fire({
                    title: "Viagem Deletada",
                    text: "Viagem Deletada com Sucesso",
                    icon: "success"
                });
                setResultado(resultado.filter(trip => trip.id !== id));

            } else {
                throw new Error('Erro ao deletar viagem!');
            }
        } catch (e) {
            console.error('Erro:', e.message)
        }
    }

    function abrirEditor(trip) {
        openModal(trip)
    }


    const openModal = (trip) => {
        setTripSelecionada(trip)
        setIsOpen(true);
        reset2({
            cidade: trip.cidade,
            estado: trip.estado,
            pais: trip.pais,
            dataInicial: trip.dataInicial,
            dataFinal: trip.dataFinal,
            usuarios: trip.viajantes,
            avaliacao: trip.avaliacao,
            imagem: trip.imagem,
            gastos: trip.gastos,
        })
    }

    const closeModal = () => setIsOpen(false)

    async function editarViagem(data) {

        const dataAtual = new Date().toISOString()

        const dataInicial = new Date(data.dataInicial)
        console.log(dataInicial)
        const dataFinal = new Date(data.dataFinal)
        console.log(dataFinal)

        const tripAtualizada = {
            ...tripSelecionada,
            cidade: data.cidade,
            estado: data.estado,
            pais: data.pais,
            dataInicial: dataInicial,
            dataFinal: dataFinal,
            usuarios: data.viajantes,
            avaliacao: data.avaliacao,
            imagem: data.imagem,
            gastos: data.gastos,
            dataCriacao: dataAtual
        }

        try {
            const resposta = await fetch(`http://localhost:3000/trips/${tripSelecionada.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripAtualizada),
            });
            if (!resposta.ok) {
                throw new Error('Erro ao atualizar a viagem!')
            }

            setResultado(resultado.map(trip => trip.id === tripSelecionada.id ? tripAtualizada : trip))
            setTripSelecionada(tripAtualizada)
            closeModal();
            Swal.fire({
                title: "Viagem Atualizada",
                text: "Viagem atualizada com sucesso!",
                icon: "success"
            });
        } catch (e) {
            console.error("Erro:", e.message);
        }
    }

    const handleReset = () => {
        reset1(
            { pesquisa: '' }
        );
    }

    const modal = (<div className=" w-full flex justify-center items-center">
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className=" py-16 px-8 bg-gray-100 absolute top-[50%] left-[50%] -translate-[50%] rounded-2xl shadow-md shadow-black/50">
            {tripSelecionada && (
                <form className="flex h-full flex-col font-Inter gap-2" onSubmit={handleSubmit2(editarViagem)} onReset={handleReset}>
                    <h2 className="text-2xl mb-4 font-semibold text-magenta underline underline-offset-8">Editando Viajem para {tripSelecionada.cidade}</h2>
                    <div className="flex  justify-start gap-3">
                        <input
                            type="text"
                            defaultValue={tripSelecionada.cidade}
                            placeholder={`Cidade: ${tripSelecionada.cidade}`}
                            className="border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                            {...registerForm2('cidade')}
                            autoComplete="off"
                        />
                        <input
                            type="text"
                            defaultValue={tripSelecionada.estado}
                            placeholder={`Estado: ${tripSelecionada.estado}`}
                            className="border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                            {...registerForm2('estado')}
                            autoComplete="off"
                        />
                        <input
                            type="text"
                            defaultValue={tripSelecionada.pais}
                            placeholder={`País: ${tripSelecionada.pais}`}
                            className="border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                            {...registerForm2('pais')}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex justify-start gap-3">
                        <input
                            type="text"
                            defaultValue={new Date(tripSelecionada.dataInicial)}
                            placeholder={`Data Inicial: ${new Date(tripSelecionada.dataInicial).toLocaleDateString("pt-BR")}`}
                            className="border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                            {...registerForm2('dataInicial')}
                            autoComplete="off"
                        />
                        <input
                            type="text"
                            defaultValue={new Date(tripSelecionada.dataInicial)}
                            placeholder={`Data Final: ${new Date(tripSelecionada.dataInicial).toLocaleDateString("pt-BR")}`}
                            className="border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                            {...registerForm2('dataFinal')}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex justify-start gap-3">
                        <input
                            type="text"
                            defaultValue={tripSelecionada.usuarios}
                            placeholder={`Viajantes: ${tripSelecionada.usuarios}`}
                            className="border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                            {...registerForm2('usuarios')}
                            autoComplete="off"
                        />
                        <input
                            type="number"
                            defaultValue={tripSelecionada.avaliacao}
                            placeholder={`Avaliação: ${tripSelecionada.avaliacao}`}
                            className="border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                            {...registerForm2('avaliacao')}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex justify-start gap-3">
                        <input
                            type="text"
                            defaultValue={tripSelecionada.imagem}
                            placeholder="Imagem"
                            className="w-full border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                            {...registerForm2('imagem')}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex justify-start gap-3">
                        <input
                            type="text"
                            defaultValue={tripSelecionada.gastos}
                            placeholder={`Gastos: R$${tripSelecionada.gastos}`}
                            className="border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                            {...registerForm2('gastos')}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex justify-start mt-4 gap-3">
                        <button type="submit" className="p-3 bg-magenta/70 hover:bg-magenta text-bold text-white rounded-md cursor-pointer duration-200 ease-in">Enviar</button>
                        <button type="reset" onClick={closeModal} className="p-3 bg-gray-100 hover:bg-white  border border-magenta text-magenta rounded-md cursor-pointer duration-200 ease-in">Cancelar</button>
                    </div>

                </form>
            )
            }
        </Modal>
    </div>
    )


    return (
        <div>
            <Header />
            <div className="flex justify-center p-8 w-full">
                <form className="flex gap-4 w-full justify-center" onSubmit={handleSubmit1(pesquisaFilmes)}>
                    <input
                        type="text"
                        placeholder="Digite nome do local, usuário ou data"
                        className="w-[60%] border-b text-2xl  border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                        {...registerForm1("pesquisa")}
                        autoComplete="off"
                    />
                    <button type="submit" className="flex items-center gap-2 p-3 bg-magenta/70 hover:bg-magenta text-bold text-white rounded-md cursor-pointer duration-200 ease-in">
                        <FaSearch /> Pesquisar
                    </button>
                </form>
            </div>
            <div className="w-full bg-slate-200 flex flex-col items-center">

                {resultado.length > 0 && listaResultado}
                {modalIsOpen && modal}
            </div>
        </div>

    )
}

export default Pesquisar;