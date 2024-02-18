"use client";
import { Button } from "@/components/Personali/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import Post from "@/components/Personali/postComponent";

import {
  LoaderIcon,
  Heart,
  MessageCircleMore,
  Pin,
  Maximize2,
} from "lucide-react";

import { useMediaQuery } from "react-responsive";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import chroma from "chroma-js";
import { Colorful } from "@uiw/react-color";

import { useState, useEffect } from "react";

import PocketBase from "pocketbase";

const pb = new PocketBase("https://cosplaya.pockethost.io");

export default function Home() {
  const router = useRouter();

  const { toast } = useToast();

  const [logged, setLogged] = useState(pb.authStore.isValid);
  const [colore, setColore] = useState("#fff");
  const [largeFoto, setLargeFoto] = useState(false);
  const [fullPost, setFullPost] = useState();

  const adjustColor =
    chroma(colore).luminance() < 0.025
      ? chroma(colore).brighten(4)
      : chroma(colore).darken();

  const getPost = async () => {
    try {
      const records = await pb.collection("posts").getFullList({
        sort: "-created",
        expand: "autore",
      });
      setFullPost(records);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!logged) {
      router.push("/account/loginregister");
    }
    getPost();
  }, []);

  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <div style={{ backgroundColor: chroma(colore).brighten(2.5) }}>
      <h1>test</h1>

      <h1>
        Loggato come: {pb.authStore.model ? pb.authStore.model.username : null}
      </h1>

      <p style={{ color: adjustColor }}>Ciao</p>
      <br />
      <h1
        className="title pt-5 text-3xl font-bold sm:text-4xl md:text-5xl"
        style={{ color: adjustColor }}
      >
        CosPlaya
      </h1>
      <br />
      <Button adjustColor={adjustColor}>Ciao</Button>
      <br />
      <Colorful
        disableAlpha
        color={colore}
        onChange={(color) => {
          setColore(color.hex);
        }}
      />

      <div className="container">
        <Card className="mt-[60px] w-full overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between align-middle">
            <h4 className="font-bold ">Aggiungi Post</h4>
          </CardHeader>
          <CardContent className="">
            <Textarea placeholder="Type your message here." />
          </CardContent>
        </Card>
      </div>

      <div className="container flex justify-center">
        <div className="p-2">
          <h1 className="pt-5 text-2xl font-bold sm:text-3xl md:text-4xl ">
            Ultimi post
          </h1>
          <br />

          <div className="grid justify-center">
            {fullPost?.map((item, i) => (
              <Post
                key={i}
                id={item.id}
                descrizione={item.descrizione}
                autore={item.expand.autore}
                foto={item.fotos}
                timestamp={item.created}
              />
            ))}
          </div>
        </div>
        {isDesktopOrLaptop && (
          <div className="max-w-[360px] p-2">
            <br />

            <Card className="mt-[60px] w-fit overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between align-middle">
                <h4 className="font-bold ">Attività</h4>
              </CardHeader>
              <CardContent className="m-1 grid justify-center">
                <div className="bg-slate mb-5 flex content-start rounded bg-slate-200 p-5">
                  <Avatar className="z-0 mr-2 flex items-center justify-center">
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      className="aspect-auto max-w-none object-cover"
                    />
                    <AvatarFallback>
                      <LoaderIcon className="animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                  <p>
                    <span className="text-sky-600 underline">
                      @liltoxicpain
                    </span>{" "}
                    ha appena seguito{" "}
                    <span className="text-sky-600 underline">@Bralix.cos</span>
                  </p>
                </div>
                <div className="bg-slate mb-5 flex content-start rounded bg-slate-200 p-5">
                  <Avatar className="z-0 mr-2 flex items-center justify-center">
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      className="aspect-auto max-w-none object-cover"
                    />
                    <AvatarFallback>
                      <LoaderIcon className="animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                  <p>
                    <span className="text-sky-600 underline">@emaahh</span> ha
                    appena messo mi piace ad un post di{" "}
                    <span className="text-sky-600 underline">@Giovixx</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <br />
      <br />
    </div>
  );
}
