import { useAuthHook } from "../hook/useAuthHook";
import DeductAndCreditAction from "./Payment/SubscriptionPayment";

const Test = () => {
  const { data } = useAuthHook();
  return (
    <>
      <DeductAndCreditAction
        userId={`${data?._id}`}
        deductAmount={50}
        creditAmount={6}
        buttonText="Convert with 20% Bonus"
        newPlan="pro"
        onSuccess={(data) => {
          console.log("Transaction successful:", data);
        }}
      />
    </>
  );
};

export default Test;
