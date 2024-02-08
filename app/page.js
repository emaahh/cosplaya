"use client"
import { Button } from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"


import { Upload } from 'lucide-react';
import { LoaderIcon } from "lucide-react"


import LogSignPage from "../components/Personali/logsignPage"

import Image from 'next/image'

import { useState, useEffect } from 'react';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://cosplaya.pockethost.io');


export default function Home() {

    const { toast } = useToast()

    const [logged, setLogged] = useState(pb.authStore.isValid);

    const updateLoggedStatus = (status) => {
        setLogged(status);
        if(status && pb.authStore.model){
            setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
        }
    };


    const logout = () => {
        pb.authStore.clear()
        setLogged(pb.authStore.isValid)
    }

    const [avatar, setAvatar] = useState();
    useEffect(() => {
        if (pb.authStore.model) {
            setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
        }
    }, []);
    const handleAvatarChange = async (e) => {
        if (e.target.files) {
            console.log("preso in carico")
            setAvatar(e.target.files[0]);
            try {
                const record = await pb.collection('users').update(pb.authStore.model.id, {avatar: e.target.files[0],});
                setAvatar("https://cosplaya.pockethost.io/api/files/users/"+pb.authStore.model.id+"/"+pb.authStore.model.avatar)
            } catch (error) {
                toast({
                    title: "Errore nel caricamento dell'avatar",
                    description: "Riprova, se il problema persiste assicurati si tratti di un formato supportato e che non superi i 5MB o contattaci",
                    variant: "destructive"
                })
                setAvatar("https://cosplaya.pockethost.io/api/files/users/"+pb.authStore.model.id+"/"+pb.authStore.model.avatar)
            }
        }
    }
    

    return (
        <div>
            
            {
                logged?
                    <div className="container">
                        <h1 className="text-xl font-bold">Il tuo profilo</h1>

                        <Card className="flex justify-center items-center flex-col">
                            <CardHeader className="items-center">

                                <Avatar className="w-20 h-20 flex items-center aspect-auto">
                                    <AvatarImage src={avatar} className="w-auto h-auto aspect-auto"/>
                                    <AvatarFallback><LoaderIcon className="animate-spin"/></AvatarFallback>
                                </Avatar>
                                
                                    <Button className="border-dashed" variant="outline">
                                        <input className="hidden" id="file-upload" type="file" onChange={handleAvatarChange}/>
                                        <label htmlFor="file-upload" className="inline-flex items-center"><Upload className="p-1"/> Cambia avatar</label>
                                    </Button>
                                    
                                    <br/>

                                <CardTitle className="text-lg sm:text-2xl">Ciao {pb.authStore.model.username}!</CardTitle>
                                <CardDescription>Qui potrai modificare il tuo profilo per adattarlo al tuo stile.</CardDescription>

                            </CardHeader>
                            <CardContent>
                                <p>fase: test(ver.0.0.1) made by <a className="underline" target="_blank" href="https://instagram.com/_emaahh_">emaahh</a></p>
                            </CardContent>

                            <CardFooter>
                                <Button onClick={logout} variant="destructive">Esci dal profilo</Button>
                            </CardFooter>

                        </Card>
                    </div>
                :
                    <LogSignPage updateLoggedStatus={updateLoggedStatus}/>
            }

        </div>
    )
}
