import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import Swal from 'sweetalert2'

function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [usuarios, setUsuarios] = useState([]);
    const [isEncontrado, setIsEncontrado] = useState(false)

    useEffect(() => {
        async function buscaUsuarios() {
            try {
                const resposta = await fetch("http://localhost:3000/users")
                if (!resposta.ok) throw new Error("Erro ao buscar usuários")
                const dados = await resposta.json();
                setUsuarios(dados)
            } catch (e) {
                console.error('Erro:', e.message)
            }
        }
        buscaUsuarios();
    }, [])

    function verificaLogin(data) {
        const usuarioEncontrado = usuarios.find(usuario => {
            return usuario.email === data.email && usuario.senha === data.senha;
        })

        if (!usuarioEncontrado) {
            Swal.fire({
                title: "Erro",
                text: "E-mail ou Senha Inválidos! Tente novamente",
                icon: "error"
            });
            throw new Error("Usuário não encontrado")

        } else {
            localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
            setIsEncontrado(true)
        }
    }

    return (
        <div className="flex justify-center items-center w-full h-[100vh] bg-linear-to-bl from-cyan-800 to-magenta ">
            <img src="bgWorld.jpg" alt="" className="absolute w-full h-full object-center opacity-50 mix-blend-luminosity pointer-events-none" />
            <div className="flex flex-col items-center px-12 backdrop-blur-md py-12 rounded-lg">
                <img src="ge.svg" alt="Brasão da Família" className="w-[100px] " />
                <div className="py-8 flex flex-col gap-2">
                    <h1 className="font-Delius text-5xl text-slate-900 font-black">Caixinha de Viagens</h1>
                    <h2 className="font-inter text-2xl text-slate-200 font-extralight tracking-wider text-center">Família Grinebidder</h2>
                </div>
                <form onSubmit={handleSubmit(verificaLogin)} className="bg-slate-900/40 w-[80%] p-8 flex flex-col gap-8 justify-center items-center rounded-lg ">
                    <p className="relative">
                        <label htmlFor="email" className="font-Inter font-light text-lg text-slate-200 mr-2">E-mail:</label>
                        <input
                            {...register("email", { required: true })}
                            type="email"
                            id="email"
                            className="w-full py-1 px-2 outline-0 border-b-2 border-slate-300 text-slate-200 focus:border-magenta "
                            autoComplete="off" />
                        {errors.email?.type &&
                            <p className="absolute text-sm text-right w-full text-red-500">E-mail obrigatório</p>
                        }
                    </p>
                    <p className="relative">
                        <label htmlFor="senha" className="font-Inter font-light text-lg text-slate-200 mr-2">Senha:</label>
                        <input
                            {...register("senha", { required: true })}
                            type="password"
                            id="senha"
                            className="w-full py-1 px-2 outline-0 border-b-2 border-slate-300 text-slate-200 focus:border-magenta  "
                            autoComplete="off" />
                        {errors.senha?.type &&
                            <p className="absolute text-sm text-right w-full text-red-500">Senha obrigatório</p>
                        }
                    </p>
                    <input
                        type="submit"
                        value="Entrar"
                        className="bg-magenta/50 hover:bg-magenta font-inter mt-3 py-1 pb-2 px-9 text-2xl text-slate-200 rounded-sm cursor-pointer duration-300 ease-in leading-none" />
                </form>
            </div>
            {isEncontrado && <Navigate to="/home" />}
        </div>
    )
}

export default Login;