import { useState } from "react";
import { FaPerson, FaPersonBooth, FaUser, FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Header() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
    
    const [dropdownAberto, setDropdownAberto] = useState(false)
    function dropdownMenu(){
        setDropdownAberto(!dropdownAberto);
    }

    return (
        <header className="flex-col justify-between items-center">
            <div className="w-[100%] flex items-center gap-12 bg-slate-900 py-8 px-24">
                <img src="ge.svg" alt="" className="w-[150px]"/>
                <div className="flex flex-col gap-2">
                    <h1 className="font-Delius text-5xl text-magenta font-black">Caixinha de Viagens</h1>
                    <h2 className="font-inter  text-2xl text-right text-slate-200 font-extralight tracking-wider">Família Grinebidder</h2>
                </div>
            </div>
            <nav className="bg-magenta/80 px-24 flex justify-end">
                <ul className="flex font-inter text-lg items-center h-fit text-slate-950 font-semibold">
                    <li className="py-3 px-4 hover:bg-slate-900 hover:text-magenta">
                        <Link to="/home">Página inical</Link>
                    </li>
                    <li className="py-3 px-4 hover:bg-slate-900 hover:text-magenta">
                        <Link to="/cadastrov">Cadastrar Viagens</Link>
                    </li>
                    <li className="py-3 px-4 hover:bg-slate-900 hover:text-magenta">
                        <Link to="/cadastrou">Cadastrar Usuário</Link>
                    </li>
                    <li className="py-3 px-4 hover:bg-slate-900 hover:text-magenta">
                        <Link to="/pesquisar">Pesquisar</Link>
                    </li>
                    <li className="py-3 px-4 bg-slate-900 text-magenta ">
                        <button onClick={dropdownMenu} className="flex items-center gap-2 cursor-pointer">
                            {`${usuario.nome}`} <FaUser />
                        </button>
                    </li>
                </ul>
                {dropdownAberto && <div className=" absolute top-[284px] right-[96px]">
                    <ul className="bg-slate-900 px-8 py-4 flex flex-col gap-2">
                        <li className="text-magenta/60 font-semibold">Minha conta</li>
                        <li className=" text-magenta font-semibold hover:text-vermelho"><Link to="/" className="flex gap-1 items-center"><FaXmark/> Sair</Link></li>
                    </ul>
                </div>}
            </nav>
        </header>
    )
}

export default Header;