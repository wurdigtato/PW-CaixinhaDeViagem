// import { useState } from "react";
import Header from "../Components/Header";
import { useForm } from "react-hook-form";
import { BsEnvelopeAtFill, BsPersonFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { PiLockKeyFill } from "react-icons/pi";

function CadastroUsuario() {

    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();


    async function adicionarUsuario(data) {
        const nome = data.nome;
        const email = data.email;
        let senha = '';
        if (data.senha === data.senhaConfirma) {
             senha = data.senha
        } else {
            setError("senhaConfirma",{
                type:"custom",
                message:"* Insira senhas iguais"
            })
        }


        try {
            const resposta = await fetch("http://localhost:3000/users", {
                method: 'POST',
                headers: { 'Contenty-Type': 'application/json' },
                body: JSON.stringify({nome, email, senha})
            })
            if (!resposta.ok) throw new Error('Erro ao cadastrar viagem')
            const novaViagem = await resposta.json();
            console.log('Adicionado: ', novaViagem)
            Swal.fire({
                title: `Usuário cadastrado com Sucesso!`,
                text: `Sua viagem para ${data.cidade} foi cadastrada com sucesso. E você pode visualizar na página inicial.`,
                icon: "success"
            });
            handleReset();

        } catch (e) {
            console.error('Erro: ', e.message)
        }
    }

    const handleReset = () => {

        reset();
    }

    return (
        <div>
            <Header />
            <section className="flex flex-col items-center py-12 ">
                <h2 className="font-Inter text-4xl text-slate-900 font-bold">Cadastro de Usuário</h2>
                <hr className="w-[50%] mt-6" />
                <form autoComplete="off" onSubmit={handleSubmit(adicionarUsuario)} onReset={handleReset} className="flex flex-col gap-4 font-Inter bg-gray-100 my-8 p-8 rounded-2xl shadow-md shadow-black/50 text-slate-900">


                    <h3 className="text-2xl py-2 px-8 font-bold text-magenta bg-white rounded-md flex items-center justify-between">Preencha com os Dados do Usuário </h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center">
                            <BsPersonFill className="text-2xl text-magenta" />
                            <label htmlFor="city" className="hidden">Nome</label>
                            <input
                                className={`w-[100%] border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta focus:border-slate-900 ${errors.nome?.type === "required" ? "border-b-red-600 " : ""}`}
                                type="text"
                                id="name"
                                placeholder="Nome"
                                autoComplete="new-password"
                                {...register('nome', { required: true })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center w-[100%]">
                            <BsEnvelopeAtFill className=" text-2xl text-magenta" />
                            <label htmlFor="datestart" className="hidden">E-mail</label>
                            <input
                                className={`w-[100%] border-b border-slate-500 px-2 py-1 text-magenta outline-0 placeholder:text-gray-600 ${errors.email?.type === "required" ? "border-b-red-600 " : ""}`}
                                type="email"
                                id="email"
                                placeholder="E-mail"
                                {...register('email', { required: true })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <PiLockKeyFill className="text-2xl text-magenta" />
                        <label htmlFor="password" className="font-semibold text-slate-900 text-xl hidden">Senha:</label>
                        <input
                            className={`w-full border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900 ${errors.senha?.type === "required" ? "border-b-red-600 " : ""}`}
                            type="password"
                            id="password"
                            placeholder="Senha"
                            {...register("senha", { required: true })}
                        />
                    </div>
                    <div className="flex gap-3 items-center">
                        <PiLockKeyFill className="text-2xl text-magenta" />
                        <label htmlFor="password" className="font-semibold text-slate-900 text-xl hidden">Confirme a Senha:</label>
                        <input
                            className={`w-full border-b border-slate-500 px-2 py-1 placeholder:text-gray-600 outline-0 text-magenta  focus:border-slate-900 ${errors.senhaConfirma?.type === "required" ? "border-b-red-600 " : ""}`}
                            type="password"
                            id="passwordConfirm"
                            placeholder="Confirme a Senha"
                            {...register("senhaConfirma", { required: true })}
                        />
                    </div>
                    <div className="h-4 text-magenta">
                        {(errors.nome?.type || errors.email?.type || errors.senha?.type || errors.senhaConfirma?.type === "required") && <span className="text-sm font-medium">* Preencha todos os campos obrigatórios</span>}
                        {errors.senhaConfirma?.type === "custom" && (
                            <p className="text-sm font-medium">{errors.senhaConfirma.message}</p>
                        )}
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

export default CadastroUsuario;