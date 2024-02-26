"use client";
import { Button } from "@/components/Personali/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { LoaderIcon, Upload } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";

import ReactHtmlParser, {
  convertNodeToElement,
  htmlparser2,
  processNodes,
} from "react-html-parser";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote"],
  ["link"],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // superscript/subscript

  [{ size: ["small", false, "large"] }], // custom dropdown

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

import PocketBase from "pocketbase";

const pb = new PocketBase("https://cosplaya.pockethost.io");

export default function AccountPage({ params }) {
  const router = useRouter();

  const inputAvatarRef = useRef(null);
  const handleUploadAvatarClick = () => {
    inputAvatarRef.current.click();
  };

  const { toast } = useToast();

  const [logged, setLogged] = useState(pb.authStore.isValid);
  const [accountFound, setAccountFound] = useState();
  const [isMine, setIsMine] = useState(false);
  const [avatarProfileNotMine, setAvatarProfileNotMine] = useState();
  const [valueBioEditor, setValueBioEditor] = useState("");

  const id = "my-unique-id";

  const logout = () => {
    pb.authStore.clear();
    router.push("/account/loginregister");
  };

  const findAccount = async () => {
    try {
      const record = await pb
        .collection("users")
        .getFirstListItem(`username="${params.idAccount}"`);
      if (record) {
        setAccountFound(record);
        if (record.avatar) {
          setAvatarProfileNotMine(
            "https://cosplaya.pockethost.io/api/files/users/" +
              record.id +
              "/" +
              record.avatar,
          );
        } else {
          setAvatarProfileNotMine(
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
          );
        }
      }
      if (pb.authStore.model && pb.authStore.model.id == record.id) {
        setIsMine(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [avatar, setAvatar] = useState();
  useEffect(() => {
    if (!logged) {
      router.push("/account/loginregister");
    }
    findAccount();

    if (pb.authStore.model) {
      if (pb.authStore.model.avatar) {
        setAvatar(
          `https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`,
        );
      } else {
        setAvatar(
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
        );
      }
    }
    setValueBioEditor(pb.authStore.model ? pb.authStore.model.bio : "");
  }, []);

  const handleAvatarChange = async (e) => {
    if (e.target.files) {
      console.log("preso in carico");
      setAvatar(e.target.files[0]);
      try {
        const record = await pb
          .collection("users")
          .update(pb.authStore.model.id, { avatar: e.target.files[0] });
        if (pb.authStore.model.avatar) {
          setAvatar(
            `https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`,
          );
        } else {
          setAvatar(
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
          );
        }
      } catch (error) {
        toast({
          title: "Errore nel caricamento dell'avatar",
          description:
            "Riprova, se il problema persiste assicurati si tratti di un formato supportato e che non superi i 5MB o contattaci",
          variant: "destructive",
        });
        if (pb.authStore.model.avatar) {
          setAvatar(
            `https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`,
          );
        } else {
          setAvatar(
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
          );
        }
      }
    }
  };

  return (
    <div>
      <div className="container">
        {isMine ? (
          <h1 className="text-xl font-bold">Il tuo profilo</h1>
        ) : (
          <h1 className="text-xl font-bold">
            Il profilo di {accountFound ? accountFound.username : null}
          </h1>
        )}

        <Card className="flex flex-col items-center justify-center">
          <CardHeader className="items-center">
            {isMine ? (
              <>
                <Avatar className="flex h-20 w-20 items-center justify-center">
                  <AvatarImage
                    src={avatar}
                    className="aspect-auto max-w-none object-cover"
                  />
                  <AvatarFallback>
                    <LoaderIcon className="animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  className="inline-flex items-center border-dashed"
                  variant="outline"
                  adjustColor={"gray"}
                  onClick={handleUploadAvatarClick}
                >
                  <input
                    ref={inputAvatarRef}
                    className="hidden"
                    id="file-upload"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <Upload className="bg-[transparent!important] p-1" /> Cambia
                  avatar
                </Button>

                <br />
              </>
            ) : (
              <Avatar className="flex aspect-auto h-20 w-20 items-center">
                <AvatarImage
                  src={avatarProfileNotMine}
                  className="aspect-auto h-auto w-auto"
                />
                <AvatarFallback>
                  <LoaderIcon className="animate-spin" />
                </AvatarFallback>
              </Avatar>
            )}

            <CardTitle className="text-lg sm:text-2xl">
              {accountFound ? accountFound.username : null}
            </CardTitle>
            {isMine ? (
              <CardDescription>
                Qui potrai modificare il tuo profilo per adattarlo al tuo stile.
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="max-w-xl lg:w-1/2">
            {isMine ? (
              <ReactQuill
                theme="snow"
                value={valueBioEditor}
                onChange={setValueBioEditor}
                modules={{ toolbar: toolbarOptions }}
                placeholder="Modifica qui la tua bio!"
              />
            ) : null}
            <CardDescription>
              {accountFound?.bio
                ? ReactHtmlParser(accountFound.bio)
                : "Nessuna bio..."}
            </CardDescription>
          </CardContent>
          {isMine ? (
            <CardFooter>
              <Button onClick={logout} adjustColor={"red"}>
                Esci dal profilo
              </Button>
            </CardFooter>
          ) : null}
        </Card>
      </div>

      <br />
      <br />

      <div className="container flex justify-center">
        <Button onClick={() => router.push("/")}>Torna alla home</Button>
      </div>
    </div>
  );
}
