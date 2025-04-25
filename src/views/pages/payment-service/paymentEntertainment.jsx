import ListPayment from "components/list-display/payment-list";
import CardPaymentEnter from "components/payment-card/card-enter";
const PaymentEntertainment = ({ listService, repoId }) => {
  return (
    <div>
      <ListPayment
        listServices={listService}
        CardComponent={CardPaymentEnter}
        link="entertainment"
        repoId={repoId}
      />
    </div>
  );
};

export default PaymentEntertainment;
