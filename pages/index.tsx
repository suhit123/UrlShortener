import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import styles from '@/styles/mainPage.module.css'
import shortenerImage from '@/resources/urlshortner.png'
import { useState } from 'react'
import axios from 'axios'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import QRCode from "qrcode";
export default function Home() {
  const [bigurl,setBigurl]=useState<string>('');
  const [message,setMessage]:any=useState();
  const [success,setSuccess]=useState<boolean>(false);
  const [loader,setLoader]=useState<boolean>(false);
  const[copy,setCopy]=useState<boolean>(false);
  const[qrcheck,setQrcheck]=useState<boolean>(true);
  const[url,setUrl]=useState<string>('')
  const[qrimage,setQrimage]=useState<string>('')
  const generate=(url:any)=>{
    QRCode.toDataURL(`${url}`).then(setQrimage)
    console.log(qrimage)
  }
  const handleChange=(e:any)=>{
    setBigurl(e.target.value);
  }
  const submit=async(e:any)=>{
    e.preventDefault();
    console.log(bigurl);
    setLoader(true);
    await axios.post('/api/shortenurl',{
      bigUrl:bigurl
    })
    .then((res)=>{
      console.log(res.data);
      let urlstring=res.data.shortenUrl;
      urlstring=urlstring.trim();
      const url=process.env.VERCEL_URL+"/"+urlstring;
      setUrl(url);
      setSuccess(true);
      setMessage(false);
      setCopy(false);
      generate(url);
    })
    .catch((err)=>{
      if(err.response.data.message==="Invalid URL format!"){
        setSuccess(false)
        setMessage("Invalid URL format!")
      }
    })
    .finally(()=>{
      setLoader(false);
    })
  }
  return (
    <>
      <Head>
        <title>Short URL Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <div className={styles.mainPage_entire}>
          <Image src={shortenerImage} alt="background image"/>
          <div className={styles.mainPage_entire_data}>
            <h1>URL SHORTENER</h1>
            <div className={styles.enterBigUrl}>
            <input type='text' name={"bigurl"} value={bigurl} onChange={handleChange} placeholder='https://urlshortener.com/hbydveuqgy/ejfhbwu/'/>
            <button onClick={submit}>{loader?<>loading ...</>:<>Shorten Url</>}</button>
            </div>
            <div className={styles.message}><p>{message}</p> </div>{success?<div className={styles.success_url}>
        <p>{url}</p>
        {qrcheck?<></>:<div className={styles.entire_blur} 
        onClick={()=>setQrcheck(!qrcheck)}
        ></div>}
        <CopyToClipboard text={url} >
          {copy?<button>Copied ✅</button>:<button onClick={()=>setCopy(true)}>Copy</button>}
        </CopyToClipboard>
        <div>{qrcheck ? (
            <Image
              onClick={() => setQrcheck(!qrcheck)}
              className={styles.qr_min}
              src={qrimage}
              alt="qrcode"
              style={{ width: "30px", height: "30px",position:'relative'}} // Set the desired size with inline styles
              width={100}
              height={100}
            />
          ) : (
            <Image
              onClick={() => setQrcheck(!qrcheck)}
              className={styles.qr_max}
              src={qrimage}
              alt="qrcode"
              style={{ width: "300px", height: "300px",position:'fixed',top:'50%',left:"50%",transform:'transalte(-50%,-50%)'}} // Set the desired size with inline styles
              width={500}
              height={500}
            />
          )}
          </div>
      </div>:<></>}
          </div>'  
        </div>
      </main>
    </>
  )
}
