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
                const shortenUrl=req.body.shortenUrl;
                const check=await UrlList.findOne({shortenUrl:shortenUrl})
                if(check!==null){
                    return res.status(200).json(check);
                }
                else{
                    return res.status(404).send("Page not found");
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