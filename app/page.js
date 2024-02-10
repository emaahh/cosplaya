"use client"
import { Button } from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"


import { Upload } from 'lucide-react';
import { LoaderIcon } from "lucide-react"


import Image from 'next/image'
import { useRouter } from 'next/navigation'

import chroma from "chroma-js"
import { Colorful } from '@uiw/react-color';


import { useState, useEffect } from 'react';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://cosplaya.pockethost.io');


export default function Home() {
    const router = useRouter()


    const { toast } = useToast()

    const [logged, setLogged] = useState(pb.authStore.isValid);
    const [colore, setColore] = useState('#000')

    const adjustColor = chroma(colore).luminance() < 0.025? chroma(colore).brighten(4) : chroma(colore).darken()

    const [avatar, setAvatar] = useState();
    useEffect(() => {
        if(!logged){
            router.push('/account/loginregister')
        }
        if (pb.authStore.model) {
            if(pb.authStore.model.avatar) {
                setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
            }else{
                setAvatar('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')
            }
        }
    }, []);
    
    

    return (
        <div style={{backgroundColor: chroma(colore).brighten(2.5)}}>
            <h1>HOME</h1>
            
            <h1>Loggato come: {pb.authStore.model.username}</h1>

            <p style={{color: adjustColor}}>Ciao</p>
            <br/>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold pt-5 title" style={{color: adjustColor}}>CosPlaya</h1>
            <br/>
            <Button adjustColor={adjustColor}>Ciao</Button>
            <br/>
            <Colorful disableAlpha color={colore} onChange={(color) => {setColore(color.hex)}}/>

            <div className="container">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold pt-5 ">Home</h1>
            </div>
                    

        </div>
    )
}
