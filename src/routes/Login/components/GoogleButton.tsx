import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleButton({ onSuccess, onError }: any) {
  const login = useGoogleLogin({
    onSuccess,
    onError,
  });
  return (
    <>
      <Button className="w-full" onClick={() => login()} disabled>
        <i className="pi pi-google mr-2"></i>
        Login
      </Button>
    </>
  );
}
