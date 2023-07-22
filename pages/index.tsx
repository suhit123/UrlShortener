import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import styles from '@/styles/mainPage.module.css'
import shortenerImage from '@/resources/urlshortner.png'
import { useState } from 'react'
import axios from 'axios'
import {CopyToClipboard} from 'react-copy-to-clipboard';
export default function Home() {
  const [bigurl,setBigurl]=useState('');
  const [message,setMessage]:any=useState();
  const [success,setSuccess]=useState(false);
  const [loader,setLoader]=useState(false);
  const[copy,setCopy]=useState(false);
  const[url,setUrl]=useState('')
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
        <CopyToClipboard text={url} >
          {copy?<button>Copied ✅</button>:<button onClick={()=>setCopy(true)}>Copy</button>}
        </CopyToClipboard>
      </div>:<></>}
          </div>
        </div>
      </main>
    </>
  )
}
