import ListPayment from "components/list-display/payment-list";
import CardPaymentEnter from "components/payment-card/card-enter";
const PaymentEntertainment = ({ listService, repoId, servicePayment }) => {
  // console.log("service payment ", servicePayment);
  return (
    <div>
      <ListPayment
        listServices={listService}
        CardComponent={CardPaymentEnter}
        link="entertainment"
        repoId={repoId}
        servicePayment={servicePayment}
      />
    </div>
  );
};

export default PaymentEntertainment;
