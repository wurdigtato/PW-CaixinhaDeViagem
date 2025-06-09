import { useEffect, useState } from "react";
import Header from "../Components/Header";
import CardViagem from "../Components/CardViagem";
import { Link } from "react-router-dom";
import { FaArrowRightLong, FaSort } from "react-icons/fa6";
import { BiSortAlt2 } from "react-icons/bi";

function Home() {
    const [trips, setTrips] = useState([]);
    const [filtro, setFiltro] = useState("recente")


    useEffect(() => {
        async function carregaTrips() {
            try {
                const resposta = await fetch("http://localhost:3000/trips")
                if (!resposta.ok) throw new Error("Erro ao carregar Viagens")
                const dados = await resposta.json()
                setTrips(dados)
                console.log(dados)
            } catch (e) {
                console.error("Erro: ", e.message)
            }
        }
        carregaTrips()
    }, [])

    const ordenarViagens = (trips, filtro) => {
        const viagensOrdenadas = [...trips];

        viagensOrdenadas.sort((a, b) => {
            let valorA, valorB

            if (filtro === "local") {
                valorA = a.cidade
                valorB = b.cidade
                
            } else if (filtro === "data") {
                valorA = new Date(a.dataInicial)
                valorB = new Date(b.dataInicial)
            } else if (filtro === "avaliacao") {
                valorA = a.avaliacao
                valorB = b.avaliacao
                if (valorA < valorB) return 1
                if (valorA > valorB) return -1
                return 0;
            } else {
                valorA = new Date(a.dataCriacao)
                valorB = new Date(b.dataCriacao)
                if (valorA > valorB) return -1
                if (valorA < valorB) return 1
                return 0;
            }

            if (valorA < valorB) return -1
            if (valorA > valorB) return 1
            return 0;
        })
        return viagensOrdenadas
    }

    function defineFiltro(e) {
        const novoFiltro = e.target.value
        setFiltro(novoFiltro)
        setTrips(ordenarViagens(trips, novoFiltro))
    }

    const listaDeViagens = trips.map(trip => (
        <CardViagem key={trip.id} trip={trip} setTrip={setTrips} />
    )
    )

    return (
        <div>
            <Header />
            {/* Container */}
            <section className="flex flex-col items-center py-12 font-Inter">
                <h2 className="text-4xl text-slate-900 font-bold">Lista de Viagens</h2>
                <hr className="w-[50%] mt-6" />
                <div className="flex gap-2 justify-end mt-10 items-center w-[1400px]">
                    <label className="font-semibold text-xl flex items-center gap-1"><BiSortAlt2 className="text-magenta"/></label>
                    <select
                        name="filtro"
                        id="filtro"
                        value={filtro}
                        onChange={defineFiltro}
                        className="text-magenta outline-0 border border-magenta rounded-md py-1 px-3"
                    >
                        <option value="" selected>Ordenar por: </option>
                        <option value="adicao" >Mais Recente</option>
                        <option value="data">Data</option>
                        <option value="local">Cidades</option>
                        <option value="avaliacao">Avaliação</option>
                    </select>
                </div>
                <div className="grid grid-cols-3 justify-center items-center gap-24 mx-24 my-10 font-Inter w-[1400px]" >
                    {/* Cards */}

                    {listaDeViagens &&
                        (listaDeViagens)
                    }
                </div>
            </section>
        </div>
    )
}

export default Home;