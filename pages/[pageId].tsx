import axios from "axios";
import { useRouter } from "next/router";
import {useEffect,useState} from 'react'
import Image from "next/image";
import error from '@/resources/error.png'
import styles from '@/styles/mainPage.module.css'
const PageRedirection=()=>{
    const router=useRouter();
    const [page,setPage]=useState(false);
    const {pageId}:any=router.query;
        const fetch=async()=>{
            console.log(pageId)
            await axios.post('/api/getUrl',{
                shortenUrl:pageId
            })
            .then((res)=>{
                window.location.href =res.data.bigUrl;
            })
            .catch((err)=>{
                if(err.response.data==="Page not found"){
                    setPage(true);
                }
                console.log(err);
            })
        }
    useEffect(()=>{
        
        if(pageId!==undefined){fetch()}       
    },[router.query])
    return(
    <div>
        {page?<div className={styles.error_div}><Image src={error} alt="404"/></div>:<></>}
    </div>)
};
export default PageRedirection;