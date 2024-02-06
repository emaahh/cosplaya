"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://cosplaya.pockethost.io');

export default function Home() {

    const [logged, setLogged] = useState(pb.authStore.isValid)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            "username": formData.username,
            "email": formData.email,
            "emailVisibility": true,
            "password": formData.password,
            "passwordConfirm": formData.password,
            "name": formData.username
        };
        const record = await pb.collection('users').create(data);
        const authData = await pb.collection('users').authWithPassword(formData.email, formData.password);
        setLogged(pb.authStore.isValid)
    };

    const handleSubmitLog = async (e) => {
        e.preventDefault();
        const authData = await pb.collection('users').authWithPassword(formData.email, formData.password);
        setLogged(pb.authStore.isValid)
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-14">
            <div>
                <h1 className='font-sans font-extrabold text-2xl'>Benvenuto in CosPlaya!</h1>
            </div>

            {
                logged?

                <div>
                    <h1>Loggato come {pb.authStore.model.username}</h1>
                    <button type="submit" className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700" onClick={()=>{pb.authStore.clear(), setLogged(pb.authStore.isValid)}}>Esci</button>
                </div>

                :
                
                <div>
                    {/*registrazione*/}
                    <div className=" mx-auto m-5 bg-white p-8 rounded-[15px] shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">Registrazione</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="text-gray-700 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            />
                            </div>
                            <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="text-gray-700 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            />
                            </div>
                            <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="text-gray-700 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                            Registrati
                            </button>
                        </form>
                    </div>
                    {/*login*/}
                    <div className=" mx-auto m-5 bg-white p-8 rounded-[15px] shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Log</h2>
                    <form onSubmit={handleSubmitLog}>
                        <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-gray-700 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="text-gray-700 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                        Loggati
                        </button>
                    </form>
                    </div>

                </div>
                
            }

        </main>
    )
}
