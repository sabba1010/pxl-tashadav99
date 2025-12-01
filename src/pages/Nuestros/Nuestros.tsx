import NueCard1 from "../../components/Nuestros-component/NueCard1";
import NueHero from "../../components/Nuestros-component/NueHero";
import NueSub from "../../components/Nuestros-component/NueSub";
import NueTimeline from "../../components/Nuestros-component/NueTimeline";

const Nuestros = () => {
  return (
    <div>
      <NueHero />
      <div className="bg-green-700 md:p-20 px-5 md:mx-20 mx-5 rounded-xl">
        <NueSub />
        <div className="border-b-2 border-orange-400 mb-10 md:mb-20"></div>
        <NueCard1 />
      </div>
      <NueTimeline />
    </div>
  );
};

export default Nuestros;
