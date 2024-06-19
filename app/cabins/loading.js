import Spinner from "../_components/Spinner";

export default function loading() {
  return (
    <div className="flex flex-col items-center justify-cente">
      <Spinner />
      <p className="text-xl text-primary-200">Loading cabins</p>
    </div>
  );
}
