import { useState } from "react";
import Header from "../Components/Header";
import { useForm } from "react-hook-form";
import { FaRegStar, FaSackDollar } from "react-icons/fa6";
import { IoIosPin } from "react-icons/io";
import { BsCalendarDate, BsPersonFill } from "react-icons/bs";
import { AiFillPicture } from "react-icons/ai";
import Swal from "sweetalert2";


function CadastroViagem() {
    const [dataInicioTipo, setDataInicioTipo] = useState("text")
    const [dataFinalTipo, setDataFinalTipo] = useState("text")

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    const dataInicio = watch('dataInicio')
    const today = new Date().toISOString().split('T')[0];

    async function adicionarUsuario(data) {
        const cidade = data.cidade
        const estado = data.estado 
        const pais = data.pais
        const dataInicial = data.dataInicio
        const dataFinal = data.dataFinal
        const usuarios = data.viajantes
        const avaliacao = data.avaliacao
        const imagem = data.imagem
        const gastos = data.gastos;
        const dataAtual = new Date()
        const dataCriacao = dataAtual.toISOString();
        const comentarios = [];
        const nomes = [];
        const dataComentario = [];

        try {
            const resposta = await fetch("http://localhost:3000/trips", {
                method: 'POST',
                headers: { 'Contenty-Type': 'application/json' },
                body: JSON.stringify({ cidade, estado, pais, dataCriacao, dataInicial, dataFinal, usuarios, avaliacao, imagem, gastos, comentarios, nomes, dataComentario })
            })
            if (!resposta.ok) throw new Error('Erro ao cadastrar viagem')
            const novaViagem = await resposta.json();
            console.log('Adicionado: ', novaViagem)
            Swal.fire({
                title: `Viagem cadastrada com Sucesso!`,
                text: `Sua viagem para ${data.cidade} foi cadastrada com sucesso. E você pode visualizar na página inicial.`,
                icon: "success"
            });
            handleReset();

        } catch (e) {
            console.error('Erro: ', e.message)
        }
    }

    const handleReset = () => {
        setDataInicioTipo("text")
        setDataFinalTipo("text")
        reset();
    }

    return (
        <div>
            <Header />
            <section className="flex flex-col items-center py-12 ">
                <h2 className="font-Inter text-4xl text-slate-900 font-bold">Cadastro de Viagens</h2>
                <hr className="w-[50%] mt-6" />
                <form autoComplete="off" onSubmit={handleSubmit(adicionarUsuario)} onReset={handleReset} className="flex flex-col gap-4 font-Inter bg-gray-100 my-8 p-8 rounded-2xl shadow-md shadow-black/50 text-slate-900">
                    <h3 className="text-2xl p-2 font-bold text-magenta bg-white rounded-md flex items-center justify-between">
                        Viagens {(errors.cidade?.type || errors.pais?.type === "required") && <span className="text-sm font-medium text-magentaamber-600">*Preencha todos os campos obrigatórios</span>}
                    </h3>
                    <div className="flex flex-col gap-3">
                        <div className=" flex justify-between gap-6">
                            <div className="flex gap-2 items-center">
                                <IoIosPin className="mr-1 text-2xl text-magenta" />
                                <label htmlFor="c" className="hidden">Cidade</label>
                                <input
                                    className={`w-[200px] border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta focus:border-slate-900 ${errors.cidade?.type === "required" ? "border-b-red-600 " : ""}`}
                                    type="text"
                                    id="c"
                                    placeholder="Cidade"
                                    autoComplete="off"
                                    {...register('cidade', { required: true })}
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <label htmlFor="state" className="hidden" >Estado</label>
                                <input
                                    className="w-[200px] border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900"
                                    type="text"
                                    id="state"
                                    placeholder="Estado"
                                    autoComplete="new-password"
                                    {...register('estado')}
                                />
                            </div>
                            <div className="flex gap-2 items-center">
                                <label htmlFor="country" className="hidden">País:</label>
                                <input
                                    className={`w-[200px] border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900 ${errors.pais?.type === "required" ? "border-b-red-600 " : ""}`}
                                    type="text"
                                    id="country"
                                    autoComplete="new-password"
                                    placeholder="País"
                                    {...register('pais', { required: true })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-8 justify-between">
                            <div className="flex gap-2 items-center w-[100%]">
                                <BsCalendarDate className="mr-2 text-2xl text-magenta" />
                                <label htmlFor="datestart" className="hidden">Data Início:</label>
                                <input
                                    className={`w-[100%] border-b border-slate-500 px-2 py-1 text-slate-900 outline-0 placeholder:text-gray-600 ${errors.dataInicio?.type === "required" ? "border-b-red-600 " : ""}`}
                                    type={dataInicioTipo}
                                    onFocus={() => setDataInicioTipo("date")}
                                    id="datestart"
                                    placeholder="Data Inicial"
                                    {...register('dataInicio', { required: true })}
                                />
                            </div>
                            <div className="flex gap-1 items-center w-[100%]">
                                <label htmlFor="dateend" className="hidden">Data Final:</label>
                                <input
                                    className={`w-[100%] border-b border-slate-500 px-2 py-1 text-slate-900 outline-0 placeholder:text-gray-600 ${errors.dataFinal?.type === "required" ? "border-b-red-600 " : ""}`}
                                    type={dataFinalTipo}
                                    onFocus={() => setDataFinalTipo("date")}
                                    id="dateend"
                                    placeholder="Data Final"
                                    min={dataInicio || undefined}
                                    max={today || undefined}
                                    {...register('dataFinal', { required: true })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <BsPersonFill className="text-2xl text-magenta" />
                        <label htmlFor="score" className="font-semibold text-slate-900 text-xl hidden">Quem foi:</label>
                        <input
                            className={`w-full border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900 ${errors.viajantes?.type === "required" ? "border-b-red-600 " : ""}`}
                            type="text"
                            id="score"
                            placeholder="Viajantes"
                            {...register("viajantes", { required: true })}
                        />
                    </div>
                    <div className="flex gap-3 items-center">
                        <FaRegStar className="text-2xl text-magenta" />
                        <label htmlFor="score" className="font-semibold text-slate-900 text-xl hidden">Avaliação:</label>
                        <input
                            className={`w-full border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900 ${errors.dataInicio?.type === "required" ? "border-b-red-600 " : ""}`}
                            type="number"
                            id="score"
                            max={5} min={1} step={0.5}
                            placeholder="Avaliação - De 1 a 5"
                            {...register("avaliacao", { required: true })}
                        />
                    </div>
                    <div className="flex gap-3 items-center">
                        <AiFillPicture className="text-2xl text-magenta" />
                        <label htmlFor="imagem" className="font-semibold text-slate-900 text-xl hidden">Imagem:</label>
                        <input
                            className={`w-full border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900 ${errors.imagem?.type === "required" ? "border-b-red-600 " : ""}`}
                            type="text"
                            id="imagem"
                            placeholder="Imagem"
                            autoComplete="off"
                            {...register("imagem", { required: true })}
                        />
                    </div>
                    <div className="flex gap-3 items-center">
                        <FaSackDollar className="text-2xl text-magenta" />
                        <label htmlFor="gastos" className="font-semibold text-slate-900 text-xl hidden">Gastos:</label>
                        <input
                            className={` w-full border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900 ${errors.gastos?.type === "required" ? "border-b-red-600 " : ""} `}
                            type="text"
                            id="gastos"
                            placeholder="Gastos"
                            autoComplete="off"
                            {...register("gastos", { required: true })}
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <input
                            type="submit"
                            value="Cadastrar"
                            className="p-3 bg-magenta/70 hover:bg-magenta text-bold text-white rounded-md cursor-pointer duration-200 ease-in"
                        />
                        <input
                            type="reset"
                            value="Limpar"
                            className="p-3 bg-gray-100 hover:bg-white  border border-magenta text-magenta rounded-md cursor-pointer duration-200 ease-in"
                        />
                    </div>
                </form>
            </section>
        </div>
    )
}

export default CadastroViagem;