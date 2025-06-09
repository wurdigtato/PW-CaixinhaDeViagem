import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { FaDollarSign, FaUserGroup } from 'react-icons/fa6';
import { IoCalendar } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

function CardViagem({ trip }) {
    return (
        <div className="w-[400px] bg-slate-100 font-Inter rounded-2xl overflow-clip shadow-md shadow-slate-900/60 ">
            <div className='h-[300px] overflow-clip'><img src={trip.imagem} alt="" className='h-[300px] hover:scale-110 object-cover duration-300 ease-in' /></div>
            <div className='p-4 bg-slate-100'>
                <div className='flex flex-col  gap-1'>
                    <div className='flex items-center gap-2'>
                        <FaMapMarkerAlt className='text-magenta' />
                        <h2 className='text-xl font-bold text-slate-900'>{trip.cidade}</h2>
                    </div>
                    <div className='flex items-center gap-2'>
                        <IoCalendar className='text-magenta' />
                        <p className='text-sm text-slate-600 leading-0'>
                            {new Date(trip.dataInicial).toLocaleDateString('pt-BR')} até {new Date(trip.dataFinal).toLocaleDateString('pt-BR')}
                        </p>
                    </div>
                </div>
                <hr className='my-4 border-slate-300' />
                <div className="flex flex-col gap-4">
                    <div className='flex items-center gap-2'>
                        <FaUserGroup className='text-magenta' />
                        <h3 className='text-slate-900 font-semibold '>Quem foi?</h3>
                        <p>{trip.usuarios}</p>
                    </div>
                    <div className='flex items-center justify-between '>
                        <div className='flex items-center gap-2'>
                            <StarRatings
                                rating={Number(trip.avaliacao)}
                                starDimension="18px"
                                starSpacing="2px"
                                starRatedColor="orange"
                            />
                        </div>
                        <div className='flex items-center gap-2 bg-magenta px-3 rounded-full'>
                            <FaDollarSign className='text-slate-900 bg-slate-100 rounded-full p-0.5' />
                            <p className='text-slate-100 font-bold'>R${trip.gastos}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Link to={`/viagens/${trip.id}`} className='text-white font-semibold flex items-center justify-center gap-1 bg-slate-400 hover:bg-magenta p-1'>Ver mais</Link>
        </div>
    )
}

export default CardViagem;