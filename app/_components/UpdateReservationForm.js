"use client";
import {editReservation} from "../_lib/actions";
import {useState} from "react";
import SubmitButton from "./SubmitButton";

function UpdateReservationForm({booking}) {
  const {
    numGuests,
    observations,
    cabins: {maxCapacity},
  } = booking;

  const [text, setText] = useState(observations);

  return (
    <form
      action={editReservation}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label htmlFor="numGuests">How many guests?</label>
        <select
          name="numGuests"
          id="numGuests"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultValue={numGuests}
          required
        >
          <option value="" key="">
            Select number of guests...
          </option>
          {Array.from({length: maxCapacity}, (_, i) => i + 1).map((x) => (
            <option value={x} key={x}>
              {x} {x === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="observations">
          Anything we should know about your stay?
        </label>
        <textarea
          value={text}
          onChange={(e) => setText((t) => (t = e.target.value))}
          name="observations"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <input type="hidden" name="bookingId" value={booking.id} />

      <SubmitButton>Update reservation</SubmitButton>
    </form>
  );
}

export default UpdateReservationForm;
