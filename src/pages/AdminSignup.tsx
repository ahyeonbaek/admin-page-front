import { ChangeEvent, useState } from "react";

interface adminInfo{
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    tradeName: string; //상호명
    adminAddress: string|number;
    emailAddress: string;
    phoneNumber: number;
    businessNumber: number; //사업자 등록번호
    reportNumber: string|number;
}

const AdminSignup = () => {
    const [admin, setAdmin] = useState<adminInfo>({
        email:'',
        password:'',
        passwordConfirm:'',
        name:'',
        tradeName:'',
        adminAddress:'',
        emailAddress:'',
        phoneNumber: 0,
        businessNumber: 0,
        reportNumber:''
    });

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setAdmin ({...admin, [name]: value});
    }

    const handleClick = async() => {
        const formData = new FormData();

        try{
            const response = await fetch('/', {
                method: 'POST',
                body: formData
            })
        }catch(err) {
            console.log
        }
    }

    return(
        <div>
            {/* map으로 바꿔보기 */}
            <ul>
                <li>
                    <input name="email" value={admin.email} onChange={handleChange}/>
                </li>
                <li>
                    <input name="password" value={admin.password} onChange={handleChange}/>
                </li>
                <li>
                    <input name="passwordConfirm" value={admin.passwordConfirm} onChange={handleChange}/>
                </li>
                <li>
                    <input name="name" value={admin.name} onChange={handleChange}/>
                </li>
                <li>
                    <input name="tradeName" value={admin.tradeName} onChange={handleChange}/>
                </li>
                <li>
                    <input name="adminAddress" value={admin.adminAddress} onChange={handleChange}/>
                </li>
                <li>
                    <input name="emailAddress" value={admin.emailAddress} onChange={handleChange}/>
                </li>
                <li>
                    <input name="phoneNumber" type="number" value={admin.phoneNumber} onChange={handleChange}/>
                </li>
                <li>
                    <input name="businessNumber" type="number" value={admin.businessNumber} onChange={handleChange}/> 
                </li> 
                <li>
                    <input name="reportNumber" value={admin.reportNumber} onChange={handleChange}/>
                </li>
            </ul>
            <button>관리자 회원가입</button>
        </div>
    )
}

export default AdminSignup;