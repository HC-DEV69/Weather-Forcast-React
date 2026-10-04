import { useDispatch, useSelector } from "react-redux";
import { selectUnit, setUnit } from "../redux/weatherSlice";

function UnitToggle() {
  const dispatch = useDispatch();
  const unit = useSelector(selectUnit);

  return (
    <div className="btn-group btn-group-sm" role="group" aria-label="Temperature unit">
      {["C", "F"].map((u) => (
        <button
          key={u}
          type="button"
          className={`btn ${u === unit ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => dispatch(setUnit(u))}
        >
          °{u}
        </button>
      ))}
    </div>
  );
}

export default UnitToggle;
