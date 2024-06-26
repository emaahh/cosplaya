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

import { Upload } from "lucide-react";
import { LoaderIcon } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import chroma from "chroma-js";
import { Colorful } from "@uiw/react-color";

import { useMediaQuery } from "react-responsive";

import { useState, useEffect } from "react";

import InfiniteScroll from "react-infinite-scroll-component";

import PocketBase from "pocketbase";

const pb = new PocketBase("https://cosplaya.pockethost.io");

import Post from "@/components/Personali/postComponent";

export default function Home() {
  const router = useRouter();

  const { toast } = useToast();

  const [logged, setLogged] = useState(pb.authStore.isValid);
  const [colore, setColore] = useState("white");
  const [largeFoto, setLargeFoto] = useState(false);
  const [fullPost, setFullPost] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(2);

  const adjustColor =
    chroma(colore).luminance() < 0.025
      ? chroma(colore).brighten(4)
      : chroma(colore).darken();

  const getPost = async () => {
    try {
      const records = await pb.collection("posts").getList(1, 5, {
        sort: "-created",
        expand: "autore,like",
      });
      setFullPost(records.items);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchMoreData = async () => {
    try {
      const records = await pb.collection("posts").getList(index, 5, {
        sort: "-created",
        expand: "autore,like",
      });
      setFullPost((fullPost) => [...fullPost, ...records.items]);
      setIndex((prevIndex) => prevIndex + 1);
      records.items.length > 0 ? setHasMore(true) : setHasMore(false);
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
      <div className="container flex justify-center">
        <Button onClick={() => router.push("/post/create")}>
          Cosa c&apos;è di nuovo? Publica qualcosa.
        </Button>
      </div>
      <div className="flex justify-center sm:container">
        <div className="pt-2">
          <br />

          <div className="grid justify-center">
            {fullPost && (
              <InfiniteScroll
                pullDownToRefresh={false}
                style={{ overflow: "hidden!important" }}
                scrollableTarget="#body"
                dataLength={fullPost.length} //This is important field to render the next data
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <div className="container flex justify-center">
                    <LoaderIcon className="animate-spin" />
                  </div>
                }
                endMessage={
                  <div className="container flex justify-center">
                    <p className="opacity-3">
                      WOW, hai visto tutto per adesso!
                    </p>
                  </div>
                }
              >
                {fullPost?.map((item, i) => (
                  <Post
                    key={i}
                    id={item.id}
                    descrizione={item.descrizione}
                    autore={item.expand.autore}
                    like={item.like}
                    foto={item.fotos}
                    timestamp={item.created}
                  />
                ))}
              </InfiniteScroll>
            )}
          </div>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>

        {isDesktopOrLaptop && (
          <div className="max-w-[360px] p-2">
            <br />

            <Card className="w-fit overflow-hidden">
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
                  <p className=" text-xs sm:text-sm">
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
                  <p className=" text-xs sm:text-sm">
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
    </div>
  );
}
