"use client"
import { Button } from "@/components/Personali/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

import { LoaderIcon, Upload } from "lucide-react"

import Image from 'next/image'
import { useRouter } from 'next/navigation'


import { useState, useEffect, useRef } from 'react';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://cosplaya.pockethost.io');


export default function AccountPage({ params }) {
    const router = useRouter()

    const inputAvatarRef = useRef(null);
    const handleUploadAvatarClick = () => {
        inputAvatarRef.current.click();
    };

    const { toast } = useToast()

    const [logged, setLogged] = useState(pb.authStore.isValid);
    const [accountFound, setAccountFound] = useState()
    const [isMine, setIsMine] = useState(false)
    const [avatarProfileNotMine, setAvatarProfileNotMine] = useState()

    const logout = () => {
        pb.authStore.clear()
        router.push('/account/loginregister')
    }

    const findAccount = async () => {
        const record = await pb.collection('users').getFirstListItem(`username="${params.idAccount}"`);
        if(record){
            setAccountFound(record)   
            if(record.avatar) {
                setAvatarProfileNotMine("https://cosplaya.pockethost.io/api/files/users/"+record.id+"/"+record.avatar)
            }else{
                setAvatarProfileNotMine('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')
            }
        }
        if(pb.authStore.model && pb.authStore.model.id == record.id){
            setIsMine(true);
        }
    }

    const [avatar, setAvatar] = useState();
    useEffect(() => {
        if(!logged){
            router.push('/account/loginregister')
        }
        findAccount()
        if (pb.authStore.model) {
            if(pb.authStore.model.avatar) {
                setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
            }else{
                setAvatar('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')
            }
        }
    }, []);

    const handleAvatarChange = async (e) => {
        if (e.target.files) {
            console.log("preso in carico")
            setAvatar(e.target.files[0]);
            try {
                const record = await pb.collection('users').update(pb.authStore.model.id, {avatar: e.target.files[0],});
                if(pb.authStore.model.avatar) {
                    setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
                }else{
                    setAvatar('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')
                }
            } catch (error) {
                toast({
                    title: "Errore nel caricamento dell'avatar",
                    description: "Riprova, se il problema persiste assicurati si tratti di un formato supportato e che non superi i 5MB o contattaci",
                    variant: "destructive"
                })
                if(pb.authStore.model.avatar) {
                    setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
                }else{
                    setAvatar('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')
                }
            }
        }
    }
    
    

    return (
        <div>
            

                    <div className="container">
                        {isMine? <h1 className="text-xl font-bold">Il tuo profilo</h1> : <h1 className="text-xl font-bold">Il profilo di {accountFound? accountFound.username : null}</h1>}
                       

                        <Card className="flex justify-center items-center flex-col">
                            <CardHeader className="items-center">

                                    {
                                        isMine?
                                        
                                            <>
                                                <Avatar className="w-20 h-20 flex justify-center items-center">
                                                    <AvatarImage src={avatar} className="object-cover aspect-auto max-w-none"/>
                                                    <AvatarFallback><LoaderIcon className="animate-spin"/></AvatarFallback>
                                                </Avatar>
                                                <Button className="border-dashed inline-flex items-center" variant="outline" adjustColor={'gray'} onClick={handleUploadAvatarClick}>
                                                    <input ref={inputAvatarRef} className="hidden" id="file-upload" type="file" onChange={handleAvatarChange}/>
                                                    <Upload className="p-1 bg-[transparent!important]"/> Cambia avatar
                                                </Button>
                                                
                                                <br/>
                                            </>
                                        :
                                        
                                            <Avatar className="w-20 h-20 flex items-center aspect-auto">
                                                <AvatarImage src={avatarProfileNotMine} className="w-auto h-auto aspect-auto"/>
                                                <AvatarFallback><LoaderIcon className="animate-spin"/></AvatarFallback>
                                            </Avatar>
                                    }
                                    

                                <CardTitle className="text-lg sm:text-2xl">{accountFound? accountFound.username : null}</CardTitle>
                                {isMine? <CardDescription>Qui potrai modificare il tuo profilo per adattarlo al tuo stile.</CardDescription> : null}

                            </CardHeader>
                            <CardContent>
                                <p>contenuti boh da aggiungere</p>
                            </CardContent>
                            {
                                isMine?
                                    <CardFooter>
                                        <Button onClick={logout} adjustColor={'red'}>Esci dal profilo</Button>
                                    </CardFooter>
                                :
                                    null
                            }
                            

                        </Card>
                    </div>
            
        </div>
    )
}
