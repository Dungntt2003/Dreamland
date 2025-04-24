import ListPayment from "components/list-display/payment-list";
import CardPaymentEnter from "components/payment-card/card-enter";
const PaymentEntertainment = () => {
  return (
    <div>
      <ListPayment
        listServices={[]}
        CardComponent={CardPaymentEnter}
        link="entertainment"
      />
    </div>
  );
};

export default PaymentEntertainment;
