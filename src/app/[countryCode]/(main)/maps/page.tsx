import MapPin from "@modules/common/icons/map-pin";
import Map from "../../../../modules/maps/components/map";

function MyPage() {
  return (
    <div className="space-y-4 py-2">
      <MapPin className="w-full text-center items-center"/>
      <h1 className="font-bold w-full text-center ">Location of our Shop In Chilomoni, Blantyre </h1>
      <Map address="1600 Amphitheatre Parkway, Mountain View, CA" />
    </div>
  );
}
export default MyPage;