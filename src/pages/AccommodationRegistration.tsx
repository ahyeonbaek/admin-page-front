import { ChangeEvent, useEffect, useState,useRef } from "react";
import DaumPostcode, {Address} from "react-daum-postcode";
import styles from '../styles/AccomoRegist.module.css';


interface RegistType{
    accommodationName: string;
    accommodationImages: File[];
    contactNumber: string; 
    introduction: string;
    services: number[];
}

interface AddressType{
    roadAddress: string;
    zonecode: string;
    jibunAddress: string ;
    detailAddress: string ;
    x: string;
    y: string;
}

const services = [
    {id: 1, label: '발렛파킹'},
    {id: 2, label: '반려견동반'},
    {id: 3, label: '24시간 프론트 데스크'},
    {id: 4, label: '조식 제공'},
    {id: 5, label: '무선 인터넷'}
];



const AccommodattionRegistration = () => {
    const [isOpen, setIsOpen] = useState(false); 
    const [address, setAddress] = useState<AddressType>({
        roadAddress:'', 
        zonecode:'', 
        jibunAddress:'', 
        detailAddress:'',
        x:'',
        y:'',
    });
    const [isRegist, setIsRegist]  = useState<RegistType>({
        accommodationName:'', 
        accommodationImages:[],
        contactNumber: '', 
        introduction:'',
        services:[] //선택된 서비스
        });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClickFile = () => {
        fileInputRef?.current?.click();
    }

    //숙소이미지 선택 최대 3장 , 3장 이상선택되면 추가 막기
    const handleChangeImage = (e:ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(isRegist.accommodationImages.length === 3) {
            alert('이미지는 최대 3장까지 가능합니다.');
            return;
        }
        if(files) { 
            const filesArray = Array.from(files).slice(0, 3); //files객체를 배열로 만들고 3개까지만 담음
            setIsRegist(prev => ({
                ...prev, accommodationImages: [...prev.accommodationImages, ...filesArray]
            }));
        }
        
    }

    //선택 사진 삭제
    const handleDeleteImage = (index: number) => {
        setIsRegist(prev => ({
            ...prev,
            accommodationImages: prev.accommodationImages.filter((_, i) => i !== index)
        }));
        console.log(isRegist.accommodationImages);
    }

    //숙소 등록 정보
    const handleInputChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setIsRegist({...isRegist, [name]: value});
        setAddress({...address, [name]: value});
    }


    //체크박스 선택
    //이미 선택된 체크박스를 한번 더 클릭하면 배열에서 제거
    //선택되지 않은 체크박스면 배열에 추가 
    const handleChangeServices = (servicesId: number) => {
        setIsRegist(prev => {
            const selectedServices = prev.services.includes(servicesId) ?
            prev.services.filter(id => id !== servicesId) : [...prev.services, servicesId];
            return {...prev, services:selectedServices};
        });
    }

    //주소 선택
    const handleComplete = async(data:Address) => { 
        const coordinate = await fetchCoordinate(data.roadAddress);
        console.log('위도 경도 확인',coordinate);

        if(data) {
            setAddress(address => ({
                ...address, 
                roadAddress:data.roadAddress, 
                jibunAddress:data.jibunAddress, 
                zonecode:data.zonecode,
                ...coordinate
            })
            );
        }
        // setIsOpen(false);
    }

    useEffect(() => {
        console.log('위경도 추가 후 주소',address);
    },[address]);

    const fetchCoordinate = async(address: string) => {
        try{
            const apiKey = '70FE45AE-5BBB-3DB6-B189-0BD818A5B020';
            const encodedAddress = encodeURIComponent(address);

            const response = await fetch(`/vworld/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&address=${encodedAddress}&refine=true&simple=false&format=json&type=road&key=${apiKey}`);
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                const x = data.response.result.point.x;
                const y = data.response.result.point.y;
                console.log('위경도',x,y);
                return {x,y};
            }else {
                console.log('위경도 api요청실패');
                alert('위경도 좌표 불러오기 실패');
                return;
            }

        }catch(err) {
            console.log('위경도 불러오기 실패', err)
        }
        
    }
    

    const handleSubmit = async() => {
        const formData = new FormData();

        formData.append("accommodationName", isRegist.accommodationName);
        formData.append("roadAddress", address.roadAddress);
        formData.append("jibunAddress", address.jibunAddress);
        formData.append("zoneCode", address.zonecode);
        formData.append('x', address.x); 
        formData.append('y', address.y); 
        formData.append("detailAddress", address.detailAddress);
        formData.append('contactNumber', isRegist.contactNumber);
        formData.append('introduction', isRegist.introduction);

        if(!isRegist.accommodationName 
            || !address.roadAddress 
            || !address.jibunAddress 
            || !address.zonecode 
            || !address.detailAddress 
            || !isRegist.contactNumber 
            || !isRegist.introduction) {
                alert('숙소 정보를 모두 입력해주세요.');
                return;
            }

        if(isRegist.accommodationImages.length === 0) {
            alert('이미지는 최소 1개 이상 등록해야합니다.');
            return;
        }

        if(isRegist.accommodationImages) {
            isRegist.accommodationImages.forEach((file) => { //파일 하나씩 추가
                formData.append('images', file);
            });
        }

        if(isRegist.services) {
            isRegist.services.forEach((service) => {
                formData.append('service', String(service));
            })
        }

        try{
            const response = await fetch('/api/accomo/regist', {
                method: 'POST',
                body: formData
            })
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                alert('숙소 등록 완료');
            }
        }catch(err) {
            console.log('서버 통신 오류, 숙소등록 실패', err);
        }
    }


    return(
        <div className={styles.container}>
            <ul className={styles.ul}>
                <h2>숙소 등록페이지</h2>
                <li className={styles.list}>
                    <label className={styles.label}>숙소 이름</label>
                    <input className={styles.input} name="accommodationName" value={isRegist.accommodationName} onChange={handleInputChange}/>
                </li>
                <li className={styles.list}>
                    <button className={styles.button} onClick={() => handleClickFile()}> 숙소 사진 선택</button>
                    <p>숙소 사진은 최소 1장, 최대 3장 까지 업로드할 수 있습니다.</p>
                    <div className={styles.imageDiv}>
                    {isRegist.accommodationImages.map((file,index) => (
                        <div>
                            <div className={styles.imageDiv} key={index}>
                                <img className={styles.image} src={URL.createObjectURL(file)} alt={`{index}번째 사진 미리보기`} />
                                <button className={styles.closeButton} onClick={() => handleDeleteImage(index)}>X</button>
                            </div>
                        </div>
                    ))}
                    </div>
                    <input className={styles.input} type='file' ref={fileInputRef} name="Accommodationimages" onChange={handleChangeImage} style={{display:'none'}} multiple/>
                </li>
                <div className={styles.address}>
                    <li className={styles.list}>
                        <div>
                        <input className={styles.input} name="zonecode" value={address.zonecode} placeholder="우편번호" onChange={handleInputChange}/>
                        <button className={styles.button} onClick={()=> setIsOpen(true)}>주소 검색</button>
                        {isOpen && (
                            <DaumPostcode onComplete={handleComplete} autoClose/> 
                        )}
                        <button className={styles.button} onClick={() => setIsOpen(false)}>닫기</button>
                        </div>
                    </li>
                    <li className={styles.list}>
                        <input className={styles.input} name="roadAddress" value={address.roadAddress} placeholder="도로명 주소" onChange={handleInputChange} />
                    </li>
                    <li className={styles.list}>
                        <input className={styles.input} name="detailAddress" value={address.detailAddress} type='text' placeholder="상세주소" onChange={handleInputChange} />
                    </li>
                </div>
                <li className={styles.list}>
                    <label className={styles.label}>숙소 연락처</label> 
                    <input className={styles.input} name="contactNumber" value={isRegist.contactNumber} onChange={handleInputChange}/>
                </li>
                <li className={styles.list}>
                    <label className={styles.label}>숙소 소개</label>
                    <textarea className={styles.textarea} name="introduction" value={isRegist.introduction} onChange={handleInputChange}></textarea>
                </li>
                <li className={styles.list}>
                    <label className={styles.label}>숙소 서비스</label>
                    <div className={styles.serviceBox}>
                    {services.map(service => (
                        <div className={styles.service} key={service.id} >
                            <input className={styles.input} name="service" type="checkbox" id={`service-${service.id}`} 
                            checked={isRegist.services.includes(service.id)} //체크 표시
                            onChange={() => handleChangeServices(service.id)} />
                            <label style={{width:'100px'}} htmlFor={`service-${service.id}`}>{service.label}</label>
                        </div>
                    ))}
                    </div>
                </li>
            </ul>
            <button className={styles.registButton} onClick={handleSubmit}>숙소 등록하기</button>
        </div>
    )
}

export default AccommodattionRegistration;