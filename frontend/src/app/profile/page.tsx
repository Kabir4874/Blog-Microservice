"use client";
import Loading from "@/components/loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppData, user_service } from "@/context/AppContext";
import axios from "axios";
import Cookies from "js-cookie";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import toast from "react-hot-toast";

type ExtractState<S> = S extends Dispatch<SetStateAction<infer T>> ? T : never;

interface UpdatePicResponse<TUser> {
  message: string;
  token: string;
  user: TUser;
}

const ProfilePage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, setUser, logoutUser } = useAppData();

  type AppUser = ExtractState<typeof setUser>;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      instagram: user?.instagram || "",
      facebook: user?.facebook || "",
      linkedin: user?.linkedin || "",
      bio: user?.bio || "",
    });
  }, [user]);

  if (!user) return redirect("/login");

  const clickHandler = () => {
    inputRef.current?.click();
  };

  const changeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const { data } = await axios.put<UpdatePicResponse<AppUser>>(
        `${user_service}/api/v1/user/update/pic`,
        formData,
        { headers }
      );

      toast.success(data.message);

      Cookies.set("token", data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });

      setUser(data.user);
    } catch (error) {
      console.error("Image update failed:", error);
      toast.error("Image update failed");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.put(
        `${user_service}/api/v1/user/update`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message);
      setLoading(false);
      Cookies.set("token", data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });

      setUser(data.user);
      setOpen(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile update failed");
    }
  };

  const logoutHandler = () => {
    logoutUser();
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {loading ? (
        <Loading />
      ) : (
        <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar
              className="w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer"
              onClick={clickHandler}
            >
              <AvatarImage src={user?.image} alt="profile pic" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={inputRef}
                onChange={changeHandler}
              />
            </Avatar>
            <div className="w-full space-y-2 text-center">
              <label className="font-medium">Name</label>
              <p>{user?.name}</p>
            </div>
            {user?.bio && (
              <div className="w-full space-y-2 text-center">
                <label className="font-medium">Bio</label>
                <p>{user.bio}</p>
              </div>
            )}
            <div className="flex gap-4 mt-3">
              {user?.instagram && (
                <a
                  href={user.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="text-pink-500 text-2xl" />
                </a>
              )}
              {user?.facebook && (
                <a
                  href={user.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="text-blue-500 text-2xl" />
                </a>
              )}
              {user?.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="text-blue-500 text-2xl" />
                </a>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center">
              <Button onClick={logoutHandler}>Logout</Button>
              <Button onClick={() => router.push("/blog/new")}>Add Blog</Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant={"outline"}>Edit</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <Input
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Instagram</Label>
                      <Input
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagram: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Facebook</Label>
                      <Input
                        value={formData.facebook}
                        onChange={(e) =>
                          setFormData({ ...formData, facebook: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Linkedin</Label>
                      <Input
                        value={formData.linkedin}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedin: e.target.value })
                        }
                      />
                    </div>
                    <Button onClick={handleFormSubmit} className="w-full mt-4">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
