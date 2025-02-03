import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  // taking input from the user as a founder or investor and respond accordingly. 

  // for founder
  
  const handleRoleSelection=async(role)=>{
    if(!role) return;

    await user.update({
      unsafeMetadata: { role },
    })
    .then(()=>{
      navigate(role === "Founder" ? "/post-startup" : "/profile");
     })
     .catch((err)=> {
      console.error("Error updating role:",err);
     });
  };

  // for investor 
  useEffect(() => {
    if(user?.unsafeMetadata?.role){
      navigate(
        user?.unsafeMetadata?.role === "Investor" ? "/profile" : "/startups"
      );
    }

  }, [user])

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    //creating two buttons founfer and investor for both of them to login and acess the website accordingly.
    <div className="flex flex-col items-center justify-center mt-40">
      <h1 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a..
      </h1>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button variant="blue" className="h-32 text-3xl "
        onClick={() =>handleRoleSelection("Founder")}>
          Founder
         </Button>
         <Button variant="destructive" className=" h-32 text-3xl"
        onClick={() =>handleRoleSelection("Investor")}>
         
         Investor
         </Button>
      </div>
    </div>
  );
};

export default Onboarding;
