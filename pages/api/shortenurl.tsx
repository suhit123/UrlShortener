import dbConnect from '../../utils/connectdb';
import UrlList from '../../models/UrlList';
import { NextApiRequest, NextApiResponse } from 'next';
dbConnect();
const urlRegex = /^(?:\w+:)?\/\/([^\s/.?#]+\.?)+(?:[/?#]\S*)?$/i;
export default async (req:NextApiRequest,res:NextApiResponse)=>{
    const{method}=req;
    switch(method){
        case 'POST':
            try{
                const bigUrl=req.body.bigUrl;
                const check=await UrlList.findOne({bigUrl:bigUrl})
                if(check!==null){
                    return res.status(200).json(check);
                }
                else{
                    if (!urlRegex.test(bigUrl)) {
                        return res.status(400).json({ message: 'Invalid URL format!' });
                    }
                    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let result = '';
                    const charactersLength = 8;
                    for ( let i = 0; i < charactersLength; i++ ) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    const data=await UrlList.create({
                        bigUrl:bigUrl,
                        shortenUrl:result
                    })
                    return res.status(201).json(data);
                }
            }
            catch(err){
                console.log(err)
                return res.status(501).json({message:"failure",data:"Something went wrong!"})
            }
        default:
            res.status(405).send("Method not valid");
            break;
    }
}