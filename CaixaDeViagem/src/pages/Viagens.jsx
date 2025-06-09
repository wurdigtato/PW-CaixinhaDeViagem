import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import { useEffect, useState } from "react";
import { FaDollarSign, FaStar, FaTrash, FaUserGroup } from "react-icons/fa6";
import { useForm } from "react-hook-form";

function Viagens() {
    const { tripId } = useParams()
    const [trip, setTrip] = useState({})
    const [conceito, setConceito] = useState("")
    const { register, handleSubmit } = useForm()

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    async function comentarViagem(data) {
        const comentario = data.comentario
        const nome = usuario.nome
        const dataAtual = new Date()
        const dataComentario = dataAtual.toISOString()

        const tripAlterado = {
            ...trip,
            comentarios: [...trip.comentarios, comentario],
            nomes: [...trip.nomes, nome],
            dataComentario: [...trip.dataComentario, dataComentario]
        }

        try {
            const resposta = await fetch(`http://localhost:3000/trips/${tripId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tripAlterado)
            })
            if (!resposta.ok) throw new Error("Erro ao alterar a Viagem")
            alert("ok")
        } catch (e) {
            console.log(`Erro: ${e.message}`)
        }

        try {
            const resposta = await fetch(`http://localhost:3000/trips/${tripId}`)
            if (!resposta.ok) throw new Error("Erro ao buscar a Viagem")
            const dados = await resposta.json()
            setTrip(dados)
        } catch (e) {
            console.log("Erro: ", e.message)
        }
    }

    useEffect(() => {
        async function buscarViagem() {
            try {
                const resposta = await fetch(`http://localhost:3000/trips/${tripId}`)
                if (!resposta.ok) throw new Error("Erro ao buscar a Viagem")
                const dados = await resposta.json()
                setTrip(dados)
            } catch (e) {
                console.log("Erro: ", e.message)
            }
        }
        buscarViagem()
    },)


    useEffect(() => {
        const avaliacaoViagem = Number(trip.avaliacao)
        if (avaliacaoViagem >= 1 && avaliacaoViagem < 2) {
            setConceito("Muito Ruim")
        } else if (avaliacaoViagem >= 2 && avaliacaoViagem < 3) {
            setConceito("Ruim")
        } else if (avaliacaoViagem >= 3 && avaliacaoViagem < 4) {
            setConceito("OK")
        } else if (avaliacaoViagem >= 4 && avaliacaoViagem < 5) {
            setConceito('Bom')
        } else {
            setConceito('Muito Bom')
        }
    }, [trip.avaliacao])


    const listaComentarios = trip.comentarios ? trip.comentarios.map((comentario, index) => (
        <div key={index} className="font-Inter">
            <div className="flex justify-between">
                <h4 className="text-lg font-semibold text-magenta">{trip.nomes[index]}</h4>
                <p className="text-base text-slate-500">{new Date(trip.dataComentario[index]).toLocaleDateString('pt-BR')}</p>
            </div>
            <p className="">{comentario}</p>
            <hr className="border-slate-300 my-2" />
        </div>
    )) : null;

    return (
        <div>
            <Header />
            <section className="flex flex-col items-center justify-center font-Inter pb-12">
                <div>
                    <div className="py-6">
                        <div className="flex items-end">
                            <h2 className="text-5xl gap-2 font-bold text-magenta">{trip.cidade} </h2>
                            <h3 className="text-4xl gap-2 font-bold text-magenta">{(trip.estado !== "") ? ", " + trip.estado : ''}</h3>
                            <h3 className="text-4xl gap-2 font-bold text-magenta"> , {trip.pais}</h3>
                        </div>
                        <p className="text-xl text-slate-600">{new Date(trip.dataInicial).toLocaleDateString('pt-BR')} até {new Date(trip.dataFinal).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex flex-col gap-6">
                        <img src={trip.imagem} alt={trip.localidade} className="h-[500px] w-[800px] object-cover rounded-2xl shadow-md shadow-black/50" />
                        <div className="flex gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <FaUserGroup className="text-2xl text-magenta" />
                                <h3 className="text-2xl text-magenta font-bold">Quem foi?</h3>
                                <p className="text-2xl text-slate-700 font-medium">{trip.usuarios}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <FaStar className="text-2xl text-amber-500" />
                                    <h3 className="text-2xl text-slate-700 font-medium">{trip.avaliacao} - <span className="text-xl">{conceito}</span></h3>
                                </div>
                                <div className="flex items-center gap-2 ">
                                    <div className="bg-magenta rounded-full px-3 py-1 flex gap-2 items-center">
                                        <FaDollarSign className="text-slate-900 text-2xl bg-slate-100 p-1 rounded-full" />
                                        <h3 className="text-xl text-slate-100 font-medium">R${trip.gastos}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="w-[800px] my-4 border-slate-400 " />
                <div className="w-[800px] flex flex-col gap-2">
                    <h4 className="text-xl font-semibold">Comentários</h4>
                    <div>
                        {listaComentarios}
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(comentarViagem)} className="flex flex-col items-end gap-2">
                            <textarea
                                {...register("comentario")}
                                id="comentario"
                                placeholder="Escreva aqui seu comentário.."
                                className="w-full h-[100px] resize-none border border-magenta rounded-md p-2 outline-0"
                            >

                            </textarea>
                            <input type="submit" value="Enviar" className="py-3 px-12 bg-magenta/70 hover:bg-magenta text-bold text-white rounded-md cursor-pointer duration-200 ease-in" />
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Viagens;