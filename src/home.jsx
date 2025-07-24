import { useNavigate } from "react-router-dom"

export function Home()
{
    let navigate = useNavigate()
    return(
        <div className="d-flex justify-content-center align-items-center" style={{marginTop:'45vh'}}>
            <button className="btn btn-primary mx-3" onClick={()=>navigate('/user-login')}>User Login</button>
            <button className="btn btn-danger" onClick={()=>navigate('/admin-login')}>Admin Login</button>
        </div>
    )
}