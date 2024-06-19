"use server";

import {revalidatePath} from "next/cache";
import {auth, signIn, signOut} from "./auth";
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
  updateGuest,
} from "./data-service";
import {redirect} from "next/navigation";

async function userValidation() {
  const session = await auth();

  if (!session) throw new Error("You must be logged in");

  return session;
}

export async function updateProfile(formData) {
  const session = await userValidation();

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^\d{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = {nationality, countryFlag, nationalID};

  await updateGuest(session.user.guestId, updateData);
  revalidatePath("/account/profile");
}

export async function signInAction() {
  await signIn("google", {redirectTo: "/account"});
}

export async function signOutAction() {
  await signOut({redirectTo: "/"});
}

export async function createReservation(bookingData, formData) {
  // 1) Authentication
  const session = await userValidation();

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  await createBooking(newBooking);

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect(`/cabins/thankyou`);
}

export async function editReservation(formData) {
  const id = Number(formData.get("bookingId"));

  // 1) Authentication
  const session = await userValidation();

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsId = guestBookings.map((booking) => booking.id);
  if (!guestBookingsId.includes(id))
    throw new Error("You are not allowed to delete this booking");

  // 3) Building update Data
  const updateFields = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4) Update
  const {error} = await updateBooking(id, updateFields);

  // 5) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 6) Revalidate
  revalidatePath(`/account/reservations/edit/${id}`);

  // 6) Redirect
  redirect(`/account/reservations`);
}

export async function deleteReservation(bookingId) {
  const session = await userValidation();

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsId = guestBookings.map((booking) => booking.id);

  if (!guestBookingsId.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  await deleteBooking(bookingId);
  revalidatePath("/account/reservations");
}
