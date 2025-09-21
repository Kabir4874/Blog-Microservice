import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
const LoginPage = () => {
  return (
    <div className="w-[350px] m-auto mt-[200px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Login To The Readers Hub</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>
            Login With Google{" "}
            <Image
              src={"/google.webp"}
              width={24}
              height={24}
              alt="google icon"
            />
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant={"outline"}>Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
