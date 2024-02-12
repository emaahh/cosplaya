'use client'
import { useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/Personali/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

import { LoaderIcon } from "lucide-react"

import { useRouter } from 'next/navigation'


import Fade from '@mui/material/Fade';

import Link from "next/link"

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://cosplaya.pockethost.io');



export default function LogSignPage() {
    const router = useRouter()

    const { toast } = useToast()

    const [pageLogin, setPageLogin] = useState(true)
    const [pageRegister, setPageRegister] = useState(false)

    const [loading, setLoading] = useState(false)

    const [logged, setLogged] = useState(pb.authStore.isValid)
    const [formData, setFormData] = useState({username: '', email: '', password: ''});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    useEffect(()=>{
        if(logged){
            router.push('/')
        }
    },[])
    

    const cambiaForm = (formScelto) => {
        if(formScelto == 0){
            setPageLogin(false)
            const myTimeout = setTimeout(()=>{setPageRegister(true)}, 200);
        }else{
            setPageRegister(false)
            const myTimeout = setTimeout(()=>{setPageLogin(true)}, 200);
        }
        setFormData({username: '', email: '', password: ''})
    }

    const tastoLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const authData = await pb.collection('users').authWithPassword(formData.email, formData.password);
            setLogged(pb.authStore.isValid)
            router.push('/')
        }catch(err) {
            toast({
                title: "Errore nel dati di login",
                description: "Prova a rivedere l'e-mail o la password",
                variant: "destructive"
            })
            setLoading(false)
        }
    };

    const tastoRegistrazione = async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = {
            "username": formData.username,
            "email": formData.email,
            "emailVisibility": true,
            "password": formData.password,
            "passwordConfirm": formData.password,
            "name": formData.username
        };
        try {
            const record = await pb.collection('users').create(data);        
            const authData = await pb.collection('users').authWithPassword(formData.email, formData.password);
            setLogged(pb.authStore.isValid)
            setLoading(false)
            router.push('/')
        }catch (err) {
            toast({
                title: "Errore nel dati di registrazione",
                description: "Usarname già esistente e/o password più corta di 8 caratteri",
                variant: "destructive"
            })
            setLoading(false)
        }
        
    };
    

    return (
        <div className="">


            <Fade in={pageLogin} unmountOnExit>

                <div className="mx-auto max-w-sm space-y-6 flex flex-col translate-y-1/4 justify-center">
                    <div className="space-y-2 text-center">
                        <h1 className="text-lg sm:text-3xl font-bold">Login</h1>
                    </div>
                    <div className="space-y-4">
                        <form onSubmit={tastoLogin}>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" placeholder="m@esempio.com" required type="email" value={formData.email} onChange={handleChange}/>
                            </div>
                            <br/>
                            <div className="space-y-2">
                                <div className="flex content-between justify-between items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link className="inline-block text-sm underline opacity-25" href="#">Password dimenticata? (non disponibile)</Link>
                                </div>
                                <Input id="password" name="password" required type="password" value={formData.password} onChange={handleChange}/>
                            </div>
                            <br/>
                            <div className="space-y-2">
                                <Button className="w-full" type="submit">{loading? <LoaderIcon className="animate-spin"/> : <>Login</>}</Button>
                            </div>
                            <Separator className="my-4"/>
                            <div className="space-y-2">
                                <Button className="w-full" type="submit" onClick={()=>cambiaForm(0)}>Non hai un account?</Button>
                            </div>

                        </form>
                    </div>
                </div>

            </Fade>

            <Fade in={pageRegister} unmountOnExit>

                <div className="mx-auto max-w-sm space-y-6 flex flex-col translate-y-1/4 justify-center">
                    <div className="space-y-2 text-center">
                        <h1 className="text-lg sm:text-3xl font-bold">Unisciti a noi!</h1>
                    </div>
                    <div className="space-y-4">
                        <form onSubmit={tastoRegistrazione}>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="username" name="username" required type="text" value={formData.username} onChange={handleChange} />
                            </div>
                            <br/>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="m@esempio.com" name="email" required type="email" value={formData.email} onChange={handleChange}/>
                            </div>
                            <br/>
                            <div className="space-y-2">
                                <div className="flex content-between items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" required type="password" name="password" value={formData.password} onChange={handleChange}/>
                            </div>
                            <br/>
                            <div className="space-y-2">
                                <Button className="w-full" type="submit">{loading? <LoaderIcon className="animate-spin"/> : <>Registrati</>}</Button>
                            </div>
                            <Separator className="my-4"/>
                            <div className="space-y-2">
                                <Button className="w-full" type="submit" onClick={()=>cambiaForm(1)}>Hai già un account?</Button>
                            </div>

                        </form>
                    </div>
                </div>

            </Fade>

            
        </div>
    )
}

