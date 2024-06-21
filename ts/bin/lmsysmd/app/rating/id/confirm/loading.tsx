import { Spinner } from "@nextui-org/react";

export default function ConfirmLoading() {
  return (
    <div className="flex flex-col justify-center items-center mx-auto min-h-dvh">
      <Spinner color="primary" size="lg" />
    </div>
  );
}
