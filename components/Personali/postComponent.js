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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  LoaderIcon,
  Heart,
  MessageCircleMore,
  Pin,
  Maximize2,
  HeartCrack,
} from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import chroma from "chroma-js";

import { useState, useEffect } from "react";

import PocketBase from "pocketbase";

const pb = new PocketBase("https://cosplaya.pockethost.io");

export default function Post({
  id,
  foto,
  descrizione,
  autore,
  timestamp,
  like,
}) {
  const router = useRouter();

  const { toast } = useToast();

  const [logged, setLogged] = useState(pb.authStore.isValid);
  const [colore, setColore] = useState("#000");
  const [largeFoto, setLargeFoto] = useState(false);
  const [myLike, setMyLike] = useState(false);
  const [numeroLike, setNumeroLike] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);

  const adjustColor =
    chroma(colore).luminance() < 0.025
      ? chroma(colore).brighten(4)
      : chroma(colore).darken();

  const giveLike = async () => {
    try {
      if (myLike) {
        setLoadingLike(true);
        const post = await pb.collection("posts").update(id, {
          "like-": pb.authStore.model.id,
        });
        setMyLike(!myLike);
        setNumeroLike(numeroLike - 1);
        setLoadingLike(false);
      } else {
        setLoadingLike(true);
        const post = await pb.collection("posts").update(id, {
          "like+": pb.authStore.model.id,
        });
        setMyLike(!myLike);
        setNumeroLike(numeroLike + 1);
        setLoadingLike(false);
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Impossibile mettere like.",
        description: "Riprova tra qualche secondo.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setNumeroLike(like.length);
    if (like.indexOf(pb.authStore.model.id) !== -1) {
      setMyLike(true);
    }
  }, [like]);

  return (
    <>
      <Dialog open={largeFoto} onOpenChange={setLargeFoto} className="rounded">
        <DialogContent className="rounded">
          <DialogHeader>
            <DialogTitle>Preview post</DialogTitle>
            <DialogDescription>
              <img
                className=" w-full self-center rounded  object-contain"
                src="https://i.pinimg.com/736x/99/4e/8c/994e8c6c41cb42597b63f0f2387e1794.jpg"
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="mb-5 max-w-screen-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between align-middle">
          <div className="inline-flex flex-row items-center">
            <Avatar className="z-0 mr-2 flex items-center justify-center">
              <AvatarImage
                src={
                  autore.avatar
                    ? "https://cosplaya.pockethost.io/api/files/users/" +
                      autore.id +
                      "/" +
                      autore.avatar
                    : "https://github.com/shadcn.png"
                }
                className="aspect-auto max-w-none object-cover"
              />
              <AvatarFallback>
                <LoaderIcon className="animate-spin" />
              </AvatarFallback>
            </Avatar>
            <CardDescription className="underline">
              <Link href={"/account/" + autore.username}>
                @{autore.username}
              </Link>
            </CardDescription>
          </div>

          <CardDescription className="italic opacity-50">
            {timestamp?.split(" ")[0].replaceAll("-", "/")}
          </CardDescription>
        </CardHeader>
        {foto.length > 0 && (
          <CardContent className="flex justify-center">
            <Carousel className="w-[95%] max-w-[550px] sm:w-[80%]">
              <CarouselContent>
                {foto?.map((item, i) => (
                  <CarouselItem key={i} className="flex rounded align-middle">
                    <img
                      className=" max-h-[500px] w-full max-w-[500px] self-center rounded  object-contain"
                      src={
                        "https://cosplaya.pockethost.io/api/files/posts/" +
                        id +
                        "/" +
                        item
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {foto?.length > 1 && (
                <>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </>
              )}

              <div className="absolute bottom-5 flex w-full items-center justify-center">
                <Button
                  adjustColor="rgb(100, 116, 139)"
                  className="h-10 w-10 border-spacing-1 rounded-full border-slate-500 p-3 opacity-50 sm:h-12 sm:w-12"
                  onClick={() => setLargeFoto(true)}
                >
                  <Maximize2 className="bg-[transparent!important]" />
                </Button>
              </div>
            </Carousel>
          </CardContent>
        )}

        <CardContent className="inline-flex flex-row align-middle">
          <p className="text-justify text-xs sm:text-sm">{descrizione}</p>
        </CardContent>
        <CardFooter className=" max-w-screen-sm">
          {myLike ? (
            <Heart
              color="#ff0000"
              fill="#ff0000"
              className="mr-1"
              onClick={() => giveLike()}
            />
          ) : (
            <Heart className="mr-1" onClick={() => giveLike()} />
          )}
          {loadingLike ? (
            <LoaderIcon className="mr-3 animate-spin" />
          ) : (
            <p className="mr-3 pr-1 italic opacity-50">{numeroLike}</p>
          )}

          <MessageCircleMore className="mr-3" />
          <Pin className="mr-3" />
        </CardFooter>
      </Card>
    </>
  );
}
