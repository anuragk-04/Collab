import { useParams } from "react-router-dom";
import RoomNavbar from "../components/RoomNavbar";
export const RoomPage = () => {
const { roomId } = useParams()

  return (
    <div>
        <RoomNavbar />
    </div>
  )
}

