import { Text } from "@radix-ui/themes";
import { FieldError } from "react-hook-form";

const ErrorMessage = ({ error }: { error: FieldError | undefined }) => {
  if (!error) return null;

  return (
    <Text
      color="red"
      as="div"
      role="alert"
      data-for={error.ref!.name}
      aria-label={"error" + error.ref!.name}
    >
      {error.message}
    </Text>
  );
};

export default ErrorMessage;
